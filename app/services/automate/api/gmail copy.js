const { simpleParser } = require("mailparser");
const Imap = require("imap");
const nodemailer = require("nodemailer");

const { connectDB } = require("../../../controllers/utils");



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


const searchGmail = async (automation) => {
  const imapConfig = getImapConfig(automation.selectedEmailConnection.email, automation.selectedEmailConnection.appPassword)
  const imap = await connectToImap(imapConfig)
  await openInbox(imap)
  const searchStrings = {
    filesArrayEmails: Array.isArray(automation.filesArrayEmails) ? automation.filesArrayEmails : [],
    allRemitentes: automation.allRemitentes || false,
    subjectExactMatch: automation.filesExactMatch || false,
    date: automation.date || false,
    filterByPeriod: automation.filterByPeriod || false,
    startDate: automation.startDate || false,
    endDate: automation.endDate || false,
    filesArrayKeyWords: Array.isArray(automation.filesArrayKeyWords) ? automation.filesArrayKeyWords : [],
    selectedFileTypes: Array.isArray(automation.selectedFileTypes) ? automation.selectedFileTypes : [],
    bodyArrayKeyWords: Array.isArray(automation.bodyArrayKeyWords) ? automation.bodyArrayKeyWords : [],
  };

  const emails = await searchEmails(imap, searchStrings)
  return emails


}





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



module.exports = {
  searchGmail,

  gmailFilter,
  connectToImap,
  openInbox,
  getImapConfig,
  searchEmails,
  addConnectionByGmail,
  sendEmailWithGmail,
}