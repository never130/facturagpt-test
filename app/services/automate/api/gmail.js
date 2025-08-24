const { simpleParser } = require("mailparser");
const Imap = require("imap");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const { connectDB } = require("../../../controllers/utils");
const { catchedAsync } = require("../../../utils/err");



const CLIENT_ID =
  "605147855779-6ti5rm48vagp43n7tg28gf1g72dcadft.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3006/api/gmail/gmailRedirect";
const REDIRECT_URI_PROD = "https://facturagpt.com/api/gmail/gmailRedirect";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI_PROD
);


const gmailLogin = async (req, res) => {
  const { id } = req.query;
  const userId = id.split("_").pop();

  const dbAuth = await connectDB(`db_${userId}_auth`);
  const insertResult = await dbAuth.insert({ userId, type: "Gmail" });
  const authId = insertResult.id;

  const state = encodeURIComponent(
    JSON.stringify({
      userId,
      authId,
    })
  );

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/gmail.readonly',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state,
  });

  res.redirect(url);
};


const gmailRedirectController = async (req, res) => {
  const { code, error, state } = req.query;

  if (error) {
    console.error("Error en callback de Google:", error);
    return res
      .status(401)
      .send(`Error durante la autenticación de Google: ${error}`);
  }

  if (!code) {
    return res.status(400).send("No se recibió código de autorización.");
  }

  let parsedState;
  try {
    parsedState = JSON.parse(decodeURIComponent(state));
  } catch (e) {
    return res.status(400).send("Estado inválido");
  }

  const { userId, authId } = parsedState;

  if (!userId || !authId) {
    return res.status(400).send("Datos incompletos en el state");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    const userEmail = data.email;
    const userName = data.name;
    const userPicture = data.picture;

    const dbAuth = await connectDB(`db_${userId}_auth`);

    const result = await dbAuth.find({
      selector: {
        userId,
        type: "Gmail",
        _id: authId,
      },
    });

    if (result.docs.length > 0) {
      const doc = result.docs[0];
      doc.accessToken = tokens;
      doc.email = userEmail;
      doc.name = userName;
      doc.picture = userPicture;
      await dbAuth.insert(doc);
    } else {
      await dbAuth.insert({
        _id: authId,
        userId,
        accessToken: tokens,
        email: userEmail,
        name: userName,
        picture: userPicture,
        type: "Gmail",
      });
    }

    res.redirect("https://facturagpt.com/admin/workflow");
  } catch (err) {
    console.error(
      "Error al obtener tokens o información del usuario:",
      err.response ? err.response.data : err.message
    );
    res
      .status(500)
      .send("Error interno al procesar la autenticación de Google.");
  }
};

const searchGmail = async (automation, user) => {
  const id = user._id.split("_").pop();
  const dbAuth = await connectDB(`db_${id}_auth`);
  const result = await dbAuth.find({
    selector: {
      userId: id,
      type: "Gmail", 
      _id: automation.selectedEmailConnection._id,
    },
  });

  const doc = result.docs[0];
  const tokens = doc.accessToken;

  if (!tokens) {
    throw new Error("No autenticado con Google");
  }

  oauth2Client.setCredentials(tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const {
    filesArrayEmails = [],
    allRemitentes = false,
    subjectExactMatch = false,
    date = false,
    filterByPeriod = false,
    startDate = false,
    endDate = false,
    filesExactMatch = false,
    filesArrayKeyWords = [],
    bodyArrayKeyWords = [],
  } = automation;

  let query = "";


  query += "has:attachment ";

  const defaultTypes = ["xml", "json", "pdf", "png", "jpg", "html"];
  const typesToSearch =
    automation.allowAllFileTypes || !automation.selectedFileTypes.length
      ? defaultTypes
      : automation.selectedFileTypes;

  if (typesToSearch.length) {
    const fileQuery = typesToSearch
      .map((ext) => `filename:${ext}`)
      .join(" OR ");
    query += `(${fileQuery}) `;
  }


  if (!allRemitentes && filesArrayEmails.length) {
    const fromQuery = filesArrayEmails
      .map((email) => `from:${email}`)
      .join(" OR ");
    query += `(${fromQuery}) `;
  }

  if (filesArrayKeyWords.length) {
    const subjectQuery = filesArrayKeyWords
      .map((word) => `subject:${word}`)
      .join(" OR ");
    query += `(${subjectQuery}) `;
  }

  const now = new Date();

  if (filterByPeriod && startDate && endDate) {
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    query += `after:${startTimestamp} before:${endTimestamp} `;
  } else if (date) {
    const days = parseInt(date.replace("Day", "").replace("Days", ""));
    if (!isNaN(days)) {
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - days);
      const pastTimestamp = Math.floor(pastDate.getTime() / 1000);
      query += `after:${pastTimestamp} `;
    }
  }


  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: query.trim(),
      maxResults: 10,
    });

    const messages = response.data.messages || [];

    const fullMessages = await Promise.all(
      messages.map(async (msg) => {
        const full = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
        });

        const payload = full.data.payload;
        const headers = payload.headers;

        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";

        const attachments = [];
        const parts = payload.parts || [];

        const defaultTypes = ["xml", "json", "pdf", "png", "jpg", "jpeg", "html"];
        const allowedTypes =
          automation.allowAllFileTypes ||
            !(automation.selectedFileTypes && automation.selectedFileTypes.length)
            ? defaultTypes
            : automation.selectedFileTypes.map((t) => t.toLowerCase());


        const extractAttachments = (parts) => {
          for (const part of parts) {
            if (part.filename && part.body?.attachmentId) {
              const fileExt = part.filename.split('.').pop().toLowerCase();
              if (allowedTypes.includes(fileExt)) {
                attachments.push({
                  filename: part.filename,
                  mimeType: part.mimeType,
                  attachmentId: part.body.attachmentId,
                  size: part.body.size,
                });
              }
            }
            if (part.parts) {
              extractAttachments(part.parts); 
            }
          }
        };

        extractAttachments(parts);
        const getBodyText = (payload) => {
          const getText = (parts) => {
            for (const part of parts) {
              if (part.mimeType === "text/plain" && part.body?.data) {
                return Buffer.from(part.body.data, "base64").toString("utf-8");
              }
              if (part.mimeType === "text/html" && part.body?.data) {
                return Buffer.from(part.body.data, "base64").toString("utf-8");
              }
              if (part.parts) {
                const nested = getText(part.parts);
                if (nested) return nested;
              }
            }
            return "";
          };

          return getText(payload.parts || []) || "";
        };

        const bodyText = getBodyText(payload);

        if (attachments.length === 0) return null;

        return {
          emailId: msg.id,
          subject,
          from,
          date,
          attachments,
          body: bodyText,
        };
      })
    );

    let filteredMessages = fullMessages.filter(Boolean);

    if (filesArrayKeyWords.length) {
      filteredMessages = filteredMessages.filter((msg) => {
        const subject = (msg.subject || "").toLowerCase();

        if (filesExactMatch) {
          return filesArrayKeyWords.some(
            (kw) => subject === kw.toLowerCase()
          );
        } else {
          return filesArrayKeyWords.some(
            (kw) => subject.includes(kw.toLowerCase())
          );
        }
      });
    }

    if (bodyArrayKeyWords.length) {
      filteredMessages = filteredMessages.filter((msg) => {
        const body = (msg.body || "").toLowerCase();

        if (automation.bodyCoincidenceExact) {
          return bodyArrayKeyWords.some(
            (kw) => body === kw.toLowerCase()
          );
        } else {
          return bodyArrayKeyWords.some(
            (kw) => body.includes(kw.toLowerCase())
          );
        }
      });
    }


    return filteredMessages;

  } catch (error) {
    console.error("Error al buscar correos en Gmail:2", error);
    throw new Error("Error al buscar correos en Gmail");
  }
};

const allowedExtensions = ["jpg", "png", "webp", "pdf", "xml", "html", "json"];

const connectToImap = (config) => {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);

    imap.once("ready", () => resolve(imap));
    imap.once("error", (err) => {
      console.error("IMAP Connection Error ==>:", err);
      reject(err);
    });

    imap.connect();
  });
};

const openInbox = (imap) => {
  return new Promise((resolve, reject) => {
    imap.openBox("INBOX", true, (err, box) => {
      if (err) {
        console.error("Error opening INBOX:", err);
        reject(err);
      } else {
        resolve(box);
      }
    });
  });
};


const getImapConfig = (email, password) => {
  const domain = email.split("@")[1];

  let host, port;

  if (domain === "gmail.com") {
    host = "imap.gmail.com";
    port = 993;
  } else if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com"
  ) {
    host = "imap-mail.outlook.com";
    port = 993;
  } else {
    host = "imap.gmail.com";
    port = 993;
  }

  return {
    user: email,
    password: password,
    host: host,
    port: port,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
    authTimeout: 30000,
  };
};

const formatToIMAPDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


const searchEmails = (imap, searchStrings) => {
  return new Promise((resolve, reject) => {
    const searchQuery = ["ALL"];

    const {
      filesArrayEmails = [],
      filesArrayKeyWords = [],
      bodyArrayKeyWords = [],
      date,
      filterByPeriod,
      startDate,
      endDate
    } = searchStrings;

    if (!searchStrings.allRemitentes && filesArrayEmails.length > 0) {
      if (filesArrayEmails.length === 1) {
        searchQuery.push(["FROM", filesArrayEmails[0]]);
      } else {
        let emailQuery = ["OR", ["FROM", filesArrayEmails[0]], ["FROM", filesArrayEmails[1]]];
        for (let i = 2; i < filesArrayEmails.length; i++) {
          emailQuery = ["OR", emailQuery, ["FROM", filesArrayEmails[i]]];
        }
        searchQuery.push(emailQuery);
      }
    }

    if (filesArrayKeyWords.length > 0) {
      const subjectOperator = searchStrings.subjectExactMatch ? "HEADER" : "SUBJECT";

      if (filesArrayKeyWords.length === 1) {
        if (subjectOperator === "HEADER") {
          searchQuery.push(["HEADER", "SUBJECT", filesArrayKeyWords[0]]);
        } else {
          searchQuery.push(["SUBJECT", filesArrayKeyWords[0]]);
        }

      } else {
        let subjectQuery;
        if (subjectOperator === "HEADER") {
          subjectQuery = ["OR", ["HEADER", "SUBJECT", filesArrayKeyWords[0]], ["HEADER", "SUBJECT", filesArrayKeyWords[1]]];
          for (let i = 2; i < filesArrayKeyWords.length; i++) {
            subjectQuery = ["OR", subjectQuery, ["HEADER", "SUBJECT", filesArrayKeyWords[i]]];
          }
        } else {
          subjectQuery = ["OR", ["SUBJECT", filesArrayKeyWords[0]], ["SUBJECT", filesArrayKeyWords[1]]];
          for (let i = 2; i < filesArrayKeyWords.length; i++) {
            subjectQuery = ["OR", subjectQuery, ["SUBJECT", filesArrayKeyWords[i]]];
          }
        }
        searchQuery.push(subjectQuery);

      }
    }


    if (bodyArrayKeyWords.length > 0) {
      let bodyQuery;
      if (bodyArrayKeyWords.length === 1) {
        bodyQuery = ["TEXT", bodyArrayKeyWords[0]];
      } else {
        bodyQuery = ["OR", ["TEXT", bodyArrayKeyWords[0]], ["TEXT", bodyArrayKeyWords[1]]];
        for (let i = 2; i < bodyArrayKeyWords.length; i++) {
          bodyQuery = ["OR", bodyQuery, ["TEXT", bodyArrayKeyWords[i]]];
        }
      }
      searchQuery.push(bodyQuery);
    }


    if (filterByPeriod) {
      if (startDate && endDate) {
        const sinceDate = formatToIMAPDate(startDate);
        const beforeDate = formatToIMAPDate(new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000)); 
        searchQuery.push(["SINCE", sinceDate]);
        searchQuery.push(["BEFORE", beforeDate]);
      }
    } else {
      if (date) {
        const match = date.match(/(\d+)\s*d[ií]as?/i);
        if (match) {
          const daysAgo = parseInt(match[1]);
          const targetDate = new Date();
          targetDate.setDate(targetDate.getDate() - daysAgo);
          const sinceDate = formatToIMAPDate(targetDate);
          searchQuery.push(["SINCE", sinceDate]);
        }
      }
    }
    imap.search(searchQuery, (err, results) => {
      if (err) {
        console.error("Error searching emails:", err);
        reject(err);
        return;
      }

      if (!results || results.length === 0) {
        resolve([]);
        return;
      }

      const MAX_EMAILS = 20;
      const limitedResults = results.slice(0, MAX_EMAILS);

      const fetch = imap.fetch(limitedResults, { bodies: "", struct: true });

      const emails = [];
      const fetchPromises = [];

      fetch.on("message", (msg, seqno) => {
        const email = {
          seqno,
          attrs: null,
          attachments: [],
          subject: "",
        };

        const parserPromise = new Promise((resolveMessage, rejectMessage) => {
          let rawMessage = "";

          msg.on("body", (stream) => {
            stream.on("data", (chunk) => {
              rawMessage += chunk.toString("utf8");
            });

            stream.once("end", async () => {
              try {
                const parsed = await simpleParser(rawMessage);

                email.ref = parsed.messageId;
                email.fromEmail = parsed.from.value || "";
                email.toEmail = parsed.to.value?.map(v => v.address) || [];
                email.subject = parsed.subject || "";
                email.emailId = parsed.messageId;
                email.body = parsed.text || "";
                email.url = `https://mail.google.com/mail/u/0/#search/rfc822msgid%3A${encodeURIComponent(parsed.messageId)}`;

                email.attachments = parsed.attachments.map((att) => ({
                  mimeType: att.contentType,
                  filename: att.filename,
                  buffer: att.content,
                  size: att.size,
                  emailId: parsed.messageId,
                }));

                if (
                  Array.isArray(searchStrings.selectedFileTypes) &&
                  searchStrings.selectedFileTypes.length > 0
                ) {
                  const types = searchStrings.selectedFileTypes.map(type => type.toLowerCase());
                  const matches = email.attachments.some(att =>
                    types.some(type =>
                      att.filename?.toLowerCase().endsWith(`.${type}`)
                    )
                  );

                  if (!matches) return resolveMessage(); 
                }

                emails.push(email);
                resolveMessage();
              } catch (error) {
                console.error("Error parsing email:", error);
                rejectMessage(error);
              }
            });
          });

          msg.on("attributes", (attrs) => {
            email.attrs = attrs;
          });
        });

        fetchPromises.push(parserPromise);
      });

      fetch.once("error", (err) => {
        console.error("Error fetching emails:", err);
        reject(err);
      });

      fetch.once("end", () => {
        Promise.all(fetchPromises)
          .then(() => resolve(emails))
          .catch(reject);
      });
    });
  });
};








const gmailFilter = async ({
  email,
  password,
  query,
  userId,
  logs,
  tokenGPT
}) => {
  try {

    const imapConfig = getImapConfig(email, password);
    const imap = await connectToImap(imapConfig);
    await openInbox(imap);

    const emails = await searchEmails(imap, query, userId);

    const filteredEmails = [];
    const processedAttachments = [];

    for (const email of emails) {
      if (email.attachments && email.attachments.length > 0) {
        filteredEmails.push(email);

        for (const attachment of email.attachments) {
          let processedData = await getGPTData({
            attach: attachment,
            token: tokenGPT
          });
          let newProcessedData = await calculateTaxesAndDiscounts(processedData.productList);

          processedData.partialAmount = convertToNumber(processedData.partialAmount);
          processedData.productList = newProcessedData;

          processedData.taxesFromPartialAmount = processedData.partialAmount * 0.21;

          processedData = replaceNotFoundWithEmptyString(processedData);
          processedData.clientCif = extractCIF(processedData.clientCif);
          processedData.clientNif = extractNIF(processedData.clientNif);

          processedAttachments.push({
            email: {
              subject: email.subject,
              fromEmail: email.fromEmail,
              toEmail: email.toEmail,
              date: email.attrs.date,
              subject: attachment.subject,
            },
            attachment: {
              filename: attachment.filename,
              mimeType: attachment.mimeType,
              size: attachment.size,
              emailId: attachment.emailId,
            },
            processedData,
            xmlContent: obj,
          });
        }
      }
    }

    imap.end();


    let dataByEmails = processEmailsDetailedData(processedAttachments);




    let totalTokensConsumed = 0
    let totalTokensPrice = 0

    processedAttachments.forEach((attach) => {
      totalTokensConsumed += attach?.processedData?.totalTokens || 0
      totalTokensPrice += attach?.processedData?.totalPrice || 0
    });


    return {
      filteredEmails,
      processedAttachments,
    };
  } catch (err) {
    console.error("Error fetching emails:", err);
    return {
      message: "Failed to fetch emails",
      error: err.message
    };
  }
}




const addConnectionByGmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const imapConfig = {
      user: email,
      password: password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    };

    const imapConnectionPromise = new Promise((resolve, reject) => {
      const imap = new Imap(imapConfig);

      imap.once('ready', () => {
        imap.end();
        resolve(true);
      });

      imap.once('error', (err) => {
        console.error('Error en la conexión IMAP:', err);
        reject(err);
      });

      imap.once('end', () => {
        console.warn('Conexión IMAP terminada');
      });

      imap.connect();
    });

    const nodemailerPromise = new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: email,
          pass: password
        }
      });

      transporter.verify((error, success) => {
        if (error) {
          console.error('Error en la verificación de Nodemailer:', error);
          reject(error);
        } else {
          resolve(true);
        }
      });
    });

    await Promise.all([imapConnectionPromise, nodemailerPromise]);

    return res.status(200).json({
      success: true,
      message: 'Conexión a Gmail establecida con éxito',
      data: { email }
    });

  } catch (error) {
    console.error('Error al conectar con Gmail:', error);
    return res.status(400).json({
      success: false,
      message: 'Error al establecer conexión con Gmail',
      error: error.message
    });
  }
};

const sendEmailWithGmail = async ({
  senderEmail,
  appPassword,
  recipientEmails,
  subject,
  htmlContent,
  file
}) => {
  try {
    if (
      !senderEmail ||
      !appPassword ||
      !recipientEmails ||
      recipientEmails.length === 0 ||
      !subject ||
      !htmlContent
    ) {
      throw new Error("Faltan datos obligatorios");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    let attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname || "archivo-adjunto.pdf",
        content: file.buffer,
        contentType: file.mimetype,
      });
    }

    const mailOptions = {
      from: senderEmail,
      to: recipientEmails.join(", "),
      subject,
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      message: "Correo enviado con éxito",
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new Error("Error al enviar el correo: " + error.message);
  }
};


const tryConnectionAutomateController = async (req, res) => {
  try {
    const { id: automationId } = req.body;

    const user = req.user;
    const id = user._id.split("_").pop();

    const dbAutomations = await connectDB(`db_automations`);

    const automation = await dbAutomations.find({
      selector: { _id: automationId },
    });

    if (!automation.docs.length) {
      return res.status(404).send({
        success: false,
        message: "Automation not found",
      });
    }

    const automationBody = automation.docs[0];
    let search = [];
    if (automationBody.type === "Gmail") {
      const getEmails = await searchGmail(automationBody, user);
      const filterByAttachment = getEmails.filter(
        (item) => item.attachments.length > 0
      );
      const checkIfWasInported = filterByAttachment.map(async (mail) => {
        const dbDocs = await connectDB(`db_${id}_docs`);
        const doc = await dbDocs.find({
          selector: { emailId: mail.emailId },
        });
        return {
          ...mail,
          wasImported: doc.docs.length > 0,
        };
      });

      search = await Promise.all(checkIfWasInported);

    }

    return res.status(200).send({
      success: true,
      message: "Connection successful",
      data: search,
    });
  } catch (err) {
    console.error("err", err);
    return res.status(500).send({
      success: false,
      message: "Error on tryConnectionAutomateController",
    });
  }
};
module.exports = {
  gmailFilter,
  connectToImap,
  openInbox,
  getImapConfig,
  searchEmails,
  addConnectionByGmail,
  sendEmailWithGmail,
  tryConnectionAutomateController: catchedAsync(tryConnectionAutomateController),

  gmailLogin: catchedAsync(gmailLogin),
  gmailRedirectController: catchedAsync(gmailRedirectController),
  searchGmail,
}