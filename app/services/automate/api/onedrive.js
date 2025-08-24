const { v4: uuidv4 } = require("uuid");
const Imap = require("imap");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { connectDB } = require("../../../controllers/utils");
const axios = require("axios");
const { catchedAsync } = require("../../../utils/err");


const REDIRECT_URI_MICROSOFT_ONEDRIVE_DEV =
  "http://localhost:3006/api/automate/oneDriveRedirect";
const REDIRECT_URI_MICROSOFT_ONEDRIVE_PROD =
  "https://facturagpt.com/api/automate/oneDriveRedirect";
  
const oneDriveAuthController = async (req, res) => {
  const { id, from } = req.query;
  const userId = id.split("_").pop();


  const origin =
    from === "dev"
      ? REDIRECT_URI_MICROSOFT_ONEDRIVE_DEV
      : REDIRECT_URI_MICROSOFT_ONEDRIVE_PROD;

  const redirectBack =
    from === "dev" ? "http://localhost:3005" : "https://facturagpt.com";

  const state = encodeURIComponent(
    JSON.stringify({
      userId,
      origin,
      from: redirectBack,
    })
  );

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID_MICROSOFT}&response_type=code&redirect_uri=${origin}&scope=https://graph.microsoft.com/Files.Read https://graph.microsoft.com/Files.Read.All https://graph.microsoft.com/User.Read offline_access&prompt=select_account&state=${state}`;
  res.redirect(authUrl);
};

const oneDriveRedirectController = async (req, res) => {
  const code = req.query.code;
  const stateRaw = req.query.state;

  if (!code) {
    return res.status(400).send("Código de autorización no encontrado");
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
        scope:
          "https://graph.microsoft.com/Files.Read https://graph.microsoft.com/Files.Read.All https://graph.microsoft.com/User.Read offline_access",
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
        type: "OneDrive",
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
      return res.redirect(from);
    } else {
      await dbAuth.insert({
        userId: userId,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn,
        account: userResponse.data,
        type: "OneDrive",
      });
    }

    res.redirect(from);
  } catch (error) {
    console.error(
      "Error al obtener el token:",
      error.response?.data || error.message
    );
    res.status(500).send("Error al obtener el token");
  }
};

const oneDriveIsAuthenticatedController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();

  const dbDocs = await connectDB(`db_${id}_auth`);
  const result = await dbDocs.find({
    selector: { userId: id, type: "OneDrive" },
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

const oneDriveFiles = async (req, res) => {
  const { automationId } = req.body;
  const user = req.user;
  const id = user._id.split("_").pop();
  const deviceId = user._id.split("@")[0];
  const dbAutomations = await connectDB(`db_automations`);
  const dbDocs = await connectDB(`db_${id}_docs`);
  const automate = await dbAutomations.find({
    selector: { id: automationId },
  });

  const {
    gmailBody,
    gmailSubject,
    gmailTo,
    selectedEmailCustomNotify,
    outlookBody,
    outlookSubject,
    outlookTo,
    phoneListNotificate,
    whatsAppMessage,
    selectedNumberCustomNotify,
  } = automate.docs[0];
  try {
    let attachments;
    try {
      attachments = await getOneDriveFiles(automate.docs[0]);
      if (outlookBody && outlookSubject && outlookTo) {
        await sendEmailWithOutlook({
          userId: id,
          automate,
          emailHtml: outlookBody,
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
          senderEmail: selectedEmailCustomNotify?.email,
          appPassword: selectedEmailCustomNotify?.appPassword,
          recipientEmails: gmailTo,
          subject: gmailSubject,
          htmlContent: gmailBody,
        });
      }
    } catch (error) {
      console.error("Error al obtener archivos de OneDrive:", error);
      return res.status(500).send("Error al obtener archivos de OneDrive");
    }
    const filteredWasImported = attachments.map(async (attachment) => {
      const doc = await dbDocs.find({
        selector: { attachmentId: attachment.id },
      });
      return {
        ...attachment,
        wasImported: doc.docs.length > 0,
      };
    });
    const arrayWasImported = await Promise.all(filteredWasImported);
    res.status(200).send({ data: arrayWasImported, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};

const oneDriveLogOutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect(
      req.session.from === "http://localhost:3005"
        ? REDIRECT_URI_MICROSOFT_ONEDRIVE_DEV
        : REDIRECT_URI_MICROSOFT_ONEDRIVE_PROD
    );
  });
};


const getTokenOnedrive = async (automate) => {
  const id = automate.userId.split("_").pop();
  const dbAuth = await connectDB(`db_${id}_auth`);

  const dataFromAuth = await dbAuth.find({
    selector: {
      userId: automate.selectedEmailConnection.userId,
      type: "OneDrive",
      _id: automate.selectedEmailConnection.id,
    },
  });

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
        scope:
          "https://graph.microsoft.com/Files.Read https://graph.microsoft.com/Files.Read.All https://graph.microsoft.com/User.Read offline_access",
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

async function getOneDriveFiles(automate) {
  const accessToken = await getTokenOnedrive(automate);
  const options = {
    ruta: automate.filesArrayEmails
      ? automate.filesArrayEmails
      : [],
    nombre: automate.filesArrayKeyWords
      ? automate.filesArrayKeyWords
      : [],
      exactNameMatch:automate.filesExactMatch,
    tipos: automate.selectedFileTypes
      ? automate.selectedFileTypes
      : [],
    startDate:
      (automate.filterByPeriod && automate.startDate) || "",
    endDate:
      (automate.filterByPeriod && automate.endDate) || "",
      date:automate.date
  };

  try {
    const {
      ruta = [],
      nombre = [],
      tipos = [],
      startDate = "",
      endDate = "",
      exactNameMatch,
      date
    } = options;

    const noRuta = ruta.length === 0;
    const noNombre = nombre.length === 0;
    const noTipos = tipos.length === 0;
    const noFechas = !startDate || !endDate;

    let todosArchivos = [];

    const obtenerArchivosDesdeRuta = async (rutaActual) => {
      let url = "https://graph.microsoft.com/v1.0/me/drive/root";
      if (rutaActual) {
        url += `:/${encodeURIComponent(rutaActual)}`;
      }

      if (rutaActual) {
        url += ":/children";
      } else {
        url += "/children";
      }

      const graphResponse = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return graphResponse.data.value || [];
    };
    const obtenerTodosLosArchivos = async (carpetaId = "root") => {
      const archivos = [];
    
      const url = `https://graph.microsoft.com/v1.0/me/drive/items/${carpetaId}/children`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    
      for (const item of response.data.value) {
        if (item.folder) {
          const archivosDentro = await obtenerTodosLosArchivos(item.id);
          archivos.push(...archivosDentro);
        } else {
          archivos.push(item);
        }
      }
    
      return archivos;
    };
    
    if (!noRuta) {
      for (const rutaActual of ruta) {
        let archivos = await obtenerArchivosDesdeRuta(rutaActual);

        if (!noNombre) {
          archivos = archivos.filter((item) =>
            nombre.some((n) => {
              const itemName = item.name.toLowerCase();
              const searchName = n.toLowerCase();
        
              return exactNameMatch
                ? itemName === searchName // Coincidencia exacta
                : itemName.startsWith(searchName); // Coincidencia parcial
            })
          );
        }
        
        if (!noTipos) {
          archivos = archivos.filter((item) => {
            return (
              item.file &&
              tipos.includes(item.file.mimeType.split("/").pop().toUpperCase())
            );
          });
        }
        if (!noFechas) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          archivos = archivos.filter((item) => {
            const modifiedDate = new Date(item.lastModifiedDateTime);
            return modifiedDate >= start && modifiedDate <= end;
          });
        }else {
          const match = date.match(/^(\d+)Days?$/i); 
          if (match) {
            const days = parseInt(match[1], 10);
            const now = new Date();
            const cutoffDate = new Date();
            cutoffDate.setDate(now.getDate() - days);
        
            archivos = archivos.filter((item) => {
              const modifiedDate = new Date(item.lastModifiedDateTime);
              return modifiedDate >= cutoffDate;
            });
          }
        }

        
        todosArchivos.push(...archivos);
      }
    } else {
      let archivos = await obtenerTodosLosArchivos(); 
    
      if (!noNombre) {
        archivos = archivos.filter((item) =>
          nombre.some((n) => {
            const itemName = item.name.toLowerCase();
            const searchName = n.toLowerCase();
      
            return exactNameMatch
              ? itemName === searchName 
              : itemName.startsWith(searchName); 
          })
        );
      }
      
    
      if (!noTipos) {
        archivos = archivos.filter(
          (item) =>
            item.file &&
            (tipos.includes(item.name.split(".").pop().toLowerCase()) ||
             tipos.includes(item.name.split(".").pop().toUpperCase()))
        );
      }
    
      if (!noFechas) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        archivos = archivos.filter((item) => {
          const modifiedDate = new Date(item.lastModifiedDateTime);
          return modifiedDate >= start && modifiedDate <= end;
        });
      }else {
        const match = date.match(/^(\d+)Days?$/i); 
        if (match) {
          const days = parseInt(match[1], 10);
          const now = new Date();
          const cutoffDate = new Date();
          cutoffDate.setDate(now.getDate() - days);
      
          archivos = archivos.filter((item) => {
            const modifiedDate = new Date(item.lastModifiedDateTime);
            return modifiedDate >= cutoffDate;
          });
        }
      }
    
      todosArchivos = archivos;
    }
    

    return todosArchivos;
  } catch (error) {
    console.error("Error Graph:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  oneDriveAuthController: catchedAsync(oneDriveAuthController),
  oneDriveRedirectController: catchedAsync(oneDriveRedirectController),
  oneDriveIsAuthenticatedController: catchedAsync(
    oneDriveIsAuthenticatedController
  ),
  oneDriveLogOutController: catchedAsync(oneDriveLogOutController),
  oneDriveFiles: catchedAsync(oneDriveFiles),
    getOneDriveFiles,
  getTokenOnedrive,
};
