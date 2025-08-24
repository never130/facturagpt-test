const { connectDB } = require("../../../controllers/utils");
const axios = require("axios");
const { catchedAsync } = require("../../../utils/err");

const CLIENT_ID_MICROSOFT = "e0e4034a-b833-47f3-bf09-ad710802c396";
const CLIENT_SECRET_MICROSOFT = "HeP8Q~5ssMzYkynnefzwdn7Ak-vAVLRRVOh0JcYg";

const getFiltersFromAutomationOutlook = async (selectedEmailConnection) => {
  let date = [];
  if (selectedEmailConnection.startDate && selectedEmailConnection.endDate) {
    date = [selectedEmailConnection.startDate, selectedEmailConnection.endDate];
  }

  return {
    remitentes:
      (selectedEmailConnection.filesArrayEmails &&
        selectedEmailConnection.filesArrayEmails) ||
      [],
    asunto:
      (selectedEmailConnection.filesArrayKeyWords &&
        selectedEmailConnection.filesArrayKeyWords) ||
      [],
    body:
      (selectedEmailConnection.bodyArrayKeyWords &&
        selectedEmailConnection.bodyArrayKeyWords) ||
      [],
    tiposArchivo:
      (selectedEmailConnection.selectedFileTypes &&
        selectedEmailConnection.selectedFileTypes) ||
      [],
    fecha: date,
  };
};

const accessTokenOutlook = async (
  userId,
  selectedEmailConnection,
  sendEmail
) => {
  const dbAuth = await connectDB(`db_${userId}_auth`);


  let dataFromAuth;
  if (sendEmail) {
    dataFromAuth = await dbAuth.find({
      selector: {
        userId: selectedEmailConnection.selectedOutlookCustomNotify.userId,
        type: selectedEmailConnection.selectedOutlookCustomNotify.type,
        _id: selectedEmailConnection.selectedOutlookCustomNotify.id,
      },
    });
  } else {
    dataFromAuth = await dbAuth.find({
      selector: {
        userId: selectedEmailConnection.selectedEmailConnection.userId,
        type: selectedEmailConnection.selectedEmailConnection.type,
        _id: selectedEmailConnection.selectedEmailConnection.id,
      },
    });
  }


  let accessToken = dataFromAuth.docs[0].accessToken;
  let refreshToken = dataFromAuth.docs[0].refreshToken;
  let expiresIn = dataFromAuth.docs[0].expiresIn;


  if (Date.now() > expiresIn - 5 * 60 * 1000) {
    const tokenResponse = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id: CLIENT_ID_MICROSOFT,
        client_secret: CLIENT_SECRET_MICROSOFT,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        scope: "Mail.Read Mail.Send User.Read offline_access",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    accessToken = tokenResponse.data.access_token;

    const docToUpdate = await dbAuth.get(dataFromAuth.docs[0]._id);

    docToUpdate.accessToken = tokenResponse.data.access_token;
    docToUpdate.refreshToken = tokenResponse.data.refresh_token;
    docToUpdate.expiresIn = tokenResponse.data.expires_in * 1000 + Date.now();

    await dbAuth.insert(docToUpdate);
  }


  return accessToken;
};

const buildDynamicFilter = (filters) => {
  const queryParts = [];
  const defaultFileTypes = ["PDF", "PNG", "JPG", "JPEG", "HTML", "XML", "JSON", "WEBP",];

  if (filters.remitentes?.length) {
    const remitenteQuery = filters.remitentes
      .map((email) => `from/emailAddress/address eq '${email}'`)
      .join(" or ");
    queryParts.push(`(${remitenteQuery})`);
  }

  if (filters.asunto?.length) {
    const asuntoQuery = filters.asunto
      .map((text) => `contains(subject, '${text}')`)
      .join(" or ");
    queryParts.push(`(${asuntoQuery})`);
  }

  if (filters.fecha?.length === 2) {
    const [inicio, fin] = filters.fecha;
    queryParts.push(
      `(receivedDateTime ge ${inicio}T00:00:00Z and receivedDateTime le ${fin}T23:59:59Z)`
    );
  }

  queryParts.push(`hasAttachments eq true`);

  if (queryParts.length === 1) {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(today.getFullYear() - 4);
    queryParts.push(`createdDateTime ge ${pastDate.toISOString()}`);
  }

  return {
    query: queryParts.join(" and "),
    fileTypes: filters.tiposArchivo?.length ? filters.tiposArchivo : defaultFileTypes
  };
};

const filterAttachments = (attachments, fileTypes) => {
  return attachments.filter(attachment => {
    if (attachment.contentType) {
      const extension = attachment.contentType.split("/").pop().toUpperCase();
      return fileTypes.includes(extension);
    }
    return false;
  });
};

async function getEmailsFromOutlook(automate) {
  const userId = automate.selectedEmailConnection.userId;
  const id = userId.split("_").pop();
  const accessToken = await accessTokenOutlook(id, automate);
  const filtros = await getFiltersFromAutomationOutlook(automate);


  try {
    const { query, fileTypes } = buildDynamicFilter(filtros);
    let url = `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=${encodeURIComponent(query)}&$expand=attachments($select=name,contentType)&$select=subject,sender,createdDateTime&$top=50`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });


    if (response.status !== 200) {
      throw new Error(response.data.error?.message || "Error en la petición");
    }

    let mensajesFiltrados = response.data.value;

    mensajesFiltrados = mensajesFiltrados.map(email => ({
      ...email,
      attachments: filterAttachments(email.attachments, fileTypes)
    }));

    if (filtros.body?.length) {
      mensajesFiltrados = mensajesFiltrados.filter((email) => {
        return filtros.body.some((text) =>
          email.body?.content.toLowerCase().includes(text.toLowerCase())
        );
      });
    }

    return mensajesFiltrados;
  } catch (error) {
    console.error("Error al obtener correos:", error.message);
    return [];
  }
}

async function sendEmailWithOutlook({
  userId,
  automate,
  emailHtml,
  emailTo,
  emailSubject = "Notificacion personalizada",
}) {
  try {

    const accessToken = await accessTokenOutlook(userId, automate, true);

    const toRecipients = emailTo.map((email) => ({
      emailAddress: {
        address: email,
      },
    }));

    const emailData = {
      message: {
        subject: emailSubject,
        body: {
          contentType: "HTML",
          content: emailHtml,
        },
        toRecipients: toRecipients,
      },
      saveToSentItems: true,
    };

    const sendResponse = await axios.post(
      "https://graph.microsoft.com/v1.0/me/sendMail ",
      emailData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error(
      "Error al enviar el correo:",
      error.response?.data || error.message
    );
  }
}

const filterOutlook = async (automate) => {
  const emails = await getEmailsFromOutlook(automate);

  const attachments = [];

  for (const email of emails) {
    for (const attachment of email.attachments) {
      attachments.push({
        ...attachment,
        messageId: email.id
      });
    }
  }


  return attachments;
};



const REDIRECT_URI_MICROSOFT_DEV =
  "http://localhost:3006/api/automate/outlookRedirect";

const REDIRECT_URI_MICROSOFT_PROD = "https://facturagpt.com/api/automate/outlookRedirect";

const outlookAuthController = async (req, res) => {
  const { id, from } = req.query;
  const userId = id.split("_").pop();

  const origin =
    from === "dev" ? REDIRECT_URI_MICROSOFT_DEV : REDIRECT_URI_MICROSOFT_PROD;

  const state = encodeURIComponent(JSON.stringify({ userId, origin, from }));

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID_MICROSOFT}&response_type=code&redirect_uri=${origin}&scope=https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read offline_access&prompt=select_account&state=${state}`;

  res.redirect(authUrl);
};

const outlookRedirectController = async (req, res) => {
  const code = req.query.code;
  const stateRaw = req.query.state;
  if (!code || !stateRaw) {
    return res.redirect("https://facturagpt.com/admin/error?error=outlook");
  }
  let state;
  try {
    state = JSON.parse(decodeURIComponent(stateRaw));
  } catch (e) {
    return res.status(400).send("Estado inválido");
  }

  const { userId, origin, from } = state;

  try {
    const dbAuth = await connectDB(`db_${userId}_auth`);

    const tokenResponse = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id: CLIENT_ID_MICROSOFT,
        client_secret: CLIENT_SECRET_MICROSOFT,
        redirect_uri: origin,
        grant_type: "authorization_code",
        code: code,
        scope: "Mail.Read Mail.Send User.Read offline_access",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;
    const expiresIn = tokenResponse.data.expires_in * 1000 + Date.now();

    const userResponse = await axios.get(
      "https://graph.microsoft.com/v1.0/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const resultDbAuth = await dbAuth.find({
      selector: {
        userId: userId,
        type: "Outlook",
        account: { mail: userResponse.data.mail },
      },
    });

    if (resultDbAuth.docs.length > 0) {
      const doc = resultDbAuth.docs[0];
      doc.accessToken = accessToken;
      doc.refreshToken = refreshToken;
      doc.expiresIn = expiresIn;
      doc.account = userResponse.data;
      await dbAuth.insert(doc);
      return res.redirect('https://facturagpt.com/admin/accounts');
    } else {
      await dbAuth.insert({
        userId: userId,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
        account: userResponse.data,
        type: "Outlook",
      });
    }

    res.redirect('https://facturagpt.com/admin/accounts');
  } catch (error) {
    console.error(
      "Error al obtener el token:",
      error.response?.data || error.message
    );
    res.status(500).send("Error al obtener el token");
  }
};

const outlookIsAuthenticatedController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();

  const dbDocs = await connectDB(`db_${id}_auth`);
  const result = await dbDocs.find({
    selector: { userId: id, type: "Outlook" },
  });

  if (result.docs.length > 0) {
    res.status(200).send({
      success: true,
      data: result.docs,
      isAuthenticated: true,
    });
  } else {
    res.json({ success: false, isAuthenticated: false });
  }
};

const outlookEmails = async (req, res) => {
  const { automationId } = req.body;
  const user = req.user;
  const id = user._id.split("_").pop();
  try {
    const dbAutomations = await connectDB(`db_automations`);
    const automate = await dbAutomations.find({
      selector: { id: automationId },
    });



    const emails = await getEmailsFromOutlook(automate.docs[0]);
    const dbDocs = await connectDB(`db_${id}_docs`);
    const promises = emails.flatMap((email) =>
      email.attachments.map(async (attachment) => {
        const doc = await dbDocs.find({
          selector: { attachmentId: attachment.id },
        });

        return {
          ...attachment,
          emailId: email.id,
          createdDateTime: email.createdDateTime,
          emailSubject: email?.subject,
          emailSender: email?.sender,
          wasImported: doc.docs.length > 0,
        };
      })
    );

    const arrayWasImported = await Promise.all(promises);


    try {
      const outlookTo = automate.docs[0].outlookTo;
      const outlookSubject = automate.docs[0].outlookSubject;
      const outlookHtml = automate.docs[0].outlookHtml;
      const selectedEmailCustomNotify =
        automate.docs[0].selectedEmailCustomNotify;
      const gmailBody = automate.docs[0].gmailBody;
      const gmailSubject = automate.docs[0].gmailSubject;
      const gmailTo = automate.docs[0].gmailTo;


      if (outlookTo && outlookSubject && outlookHtml) {
        await sendEmailWithOutlook({
          userId: id,
          automate,
          emailHtml: outlookHtml,
          emailTo: outlookTo,
          emailSubject: outlookSubject,
        });
      }
      if (
        selectedEmailCustomNotify?.email &&
        selectedEmailCustomNotify?.appPassword &&
        gmailBody &&
        gmailSubject &&
        gmailTo
      ) {
        await sendEmailWithGmail({
          senderEmail: selectedEmailCustomNotify.email,
          appPassword: selectedEmailCustomNotify.appPassword,
          recipientEmails: gmailTo,
          subject: gmailSubject,
          htmlContent: gmailBody,
        });
      }
    } catch (error) {
      console.error("Error al enviar email:", error);
    }

    res.status(200).send({ data: arrayWasImported, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const outlookLogOutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("https://facturagpt.com");
  });
};


module.exports = {
  getEmailsFromOutlook,
  accessTokenOutlook,
  getFiltersFromAutomationOutlook,
  sendEmailWithOutlook,
  filterOutlook,

  outlookAuthController: catchedAsync(outlookAuthController),
  outlookRedirectController: catchedAsync(outlookRedirectController),
  outlookIsAuthenticatedController: catchedAsync(outlookIsAuthenticatedController),
  outlookLogOutController: catchedAsync(outlookLogOutController),
  outlookEmails: catchedAsync(outlookEmails),
};
