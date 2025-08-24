const { google } = require("googleapis");
const { catchedAsync } = require("../../../utils/err");
const { connectDB } = require("../utils");


const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI_PROD
);

const driveAuthController = async (req, res) => {
  const { id, from } = req.query;

  const userId = id.split("_").pop();
  const dbAuth = await connectDB(`db_${userId}_auth`);
  const insertResult = await dbAuth.insert({ userId, type: "Google Drive" });
  const authId = insertResult.id;

  const state = encodeURIComponent(
    JSON.stringify({
      userId,
      authId,
    })
  );
  const authUrl = await oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/cloud-platform.read-only",
    ],
    prompt: "consent",
    state, 
  });
  res.redirect(authUrl);
};

const driveRedirectController = async (req, res) => {
  const { code, error, state } = req.query;
  if (error) {
    console.error("Error en callback de Google:", error);
    return res
      .status(401)
      .send(`Error durante la autenticación de Google: ${error}`);
  }

  if (!code) {
    console.error("No se recibió código en el callback de Google.");
    return res.status(400).send("No se recibió código de autorización.");
  }

  let parsedState;
  try {
    parsedState = JSON.parse(decodeURIComponent(state)); // 👈 Recuperamos userId y authId
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
        type: "Google Drive",
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
        type: "Google Drive",
      });
    }

    res.redirect("https://facturagpt.com/admin");

  } catch (err) {
    console.error(
      "Error al obtener tokens o información del usuario:",
      err.response ? err.response.data : err.message
    );
    if (err.stack) {
      console.error(err.stack);
    }
    res
      .status(500)
      .send("Error interno al procesar la autenticación de Google.");
  }
};

const getFolderIdByName = async (folderPath, id, connectionId) => {
  const dbAuth = await connectDB(`db_${id}_auth`);
  const result = await dbAuth.find({
    selector: {
      userId: id,
      type: "Google Drive",
      _id: connectionId,
    },
  });

  const doc = result.docs[0];
  const tokens = doc.accessToken;
  oauth2Client.setCredentials(tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const parts = folderPath.split("/").filter(Boolean); 
  let parentId = null; 

  for (const part of parts) {
    const qParts = [
      `mimeType = 'application/vnd.google-apps.folder'`,
      `name = '${part.replace(/'/g, "\\'")}'`,
    ];
    if (parentId) {
      qParts.push(`'${parentId}' in parents`);
    }

    const res = await drive.files.list({
      q: qParts.join(" and "),
      fields: "files(id, name)",
      spaces: "drive",
    });

    const folder = res.data.files[0];
    if (!folder) {
      return null; 
    }

    parentId = folder.id; 
  }

  return parentId; 
};


const driveFiles = async (req, res) => {
  const { automationId } = req.body;
  const user = req.user;
  const id = user._id.split("_").pop();
  
  const dbAutomations = await connectDB("db_automations");
  const automation = await dbAutomations.find({
    selector: { id: automationId },
  });

  let response;

  const dbAuth = await connectDB(`db_${id}_auth`);
  const result = await dbAuth.find({
    selector: {
      userId: id,
      type: "Google Drive",
      _id: automation.docs[0].selectedEmailConnection.id,
    },
  });

  const doc = result.docs[0];
  const tokens = doc.accessToken;
  if (!tokens) {
    return res.status(401).send("No autenticado");
  }

  oauth2Client.setCredentials(tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  
  const selectedFileTypes = automation.docs[0].selectedFileTypes;

  try {
    const mimeTypeFilters = selectedFileTypes?.length
      ? selectedFileTypes.map((item) => {
          const type = item.toLowerCase();
          if (type === "pdf" || type === "json") return `mimeType = "application/${type}"`;
          if (["png", "jpeg", "jpg"].includes(type)) return `mimeType = "image/${type}"`;
          if (["xml", "html"].includes(type)) return `mimeType = "text/${type}"`;
          return `mimeType = "application/${type}"`;
        }).join(" or ")
      : `mimeType = "application/pdf" or mimeType = "image/png" or mimeType = "image/jpeg" or mimeType = "text/xml" or mimeType = "application/json" or mimeType = "text/html"`;

      const connectionId = automation.docs[0].selectedEmailConnection.id;
      const folderNames = automation.docs[0].filesArrayEmails || [];
      
      const validFolderIds = await Promise.all(
        folderNames.map((name) => getFolderIdByName(name, id, connectionId))
      );
      
      
      const folderFilters = validFolderIds.length
      ? validFolderIds.map(id => `'${id}' in parents`).join(" or ")
      : "";
    
    const qParts = [];
    if (mimeTypeFilters) qParts.push(`(${mimeTypeFilters})`);
    if (folderFilters) qParts.push(`(${folderFilters})`);
    const fileNameKeywords = automation.docs[0].filesArrayKeyWords || [];
    const exactMatch = automation.docs[0].filesExactMatch;
    
    const knownExtensions = selectedFileTypes?.length
      ? selectedFileTypes.map(type => {
          const ext = type.toLowerCase();
          if (ext === "pdf" || ext === "json") return `.${ext}`;
          if (["png", "jpeg", "jpg"].includes(ext)) return `.${ext}`;
          if (["xml", "html"].includes(ext)) return `.${ext}`;
          return `.${ext}`;
        })
      : [".pdf", ".png", ".jpeg", ".jpg", ".xml", ".json", ".html"];
    
    let nameFilters = "";
    
    if (fileNameKeywords.length) {
      if (exactMatch) {
        const nameMatches = [];
    
        for (const keyword of fileNameKeywords) {
          const escaped = keyword.replace(/'/g, "\\'");
          for (const ext of knownExtensions) {
            nameMatches.push(`name = '${escaped}${ext}'`);
          }
        }
    
        nameFilters = nameMatches.join(" or ");
      } else {
        nameFilters = fileNameKeywords
          .map(keyword => `name contains '${keyword.replace(/'/g, "\\'")}'`)
          .join(" or ");
      }
    }
    
      if (nameFilters) qParts.push(`(${nameFilters})`);


      const filterByPeriod = automation.docs[0].filterByPeriod;
let createdTimeFilter = "";

if (!filterByPeriod) {
  const daysStr = automation.docs[0].date;
  const days = parseInt(daysStr?.replace("Day", "").replace("Days", ""));
  if (!isNaN(days)) {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - days);

    const isoDate = pastDate.toISOString();

    createdTimeFilter = `createdTime >= '${isoDate}'`;
  }
} else {
  const startDate = automation.docs[0].startDate;
  const endDate = automation.docs[0].endDate;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    end.setHours(23, 59, 59, 999);

    const isoStart = start.toISOString();
    const isoEnd = end.toISOString();

    createdTimeFilter = `createdTime >= '${isoStart}' and createdTime <= '${isoEnd}'`;
  }
}

if (createdTimeFilter) {
  qParts.push(`(${createdTimeFilter})`);
}


    const finalQuery = qParts.join(" and ");

    response = await drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(mimeType, name, id, createdTime)",
      q: finalQuery,
      orderBy: "createdTime desc",
    });

    const files = response.data.files || [];
    const setNecesaryProps = files.map((file) => ({
      emailId: file.id,
      attachments: [{ filename: file.name, mimeType: file.mimeType }],
      attrs: { date: file.createdTime },
    }));

    const checkIfWasInported = setNecesaryProps.map(async (mail) => {
      const dbDocs = await connectDB(`db_${id}_docs`);
      const doc = await dbDocs.find({ selector: { emailId: mail.emailId } });
      return { ...mail, wasImported: doc.docs.length > 0 };
    });

    const search = await Promise.all(checkIfWasInported);

    res.status(200).send({
      success: true,
      data: search,
      message: "Archivos obtenidos correctamente",
    });
  } catch (error) {
    console.error(
      "Error al obtener archivos de Drive:",
      error.response ? error : error
    );
    if (error.response && [401, 403].includes(error.response.status)) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado. Por favor, vuelve a iniciar sesión.",
      });
    }
    res.status(500).send("Error al obtener archivos de Google Drive.");
  }
};




const driveIsAuthenticatedController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();

  const dbAuth = await connectDB(`db_${id}_auth`);
  const result = await dbAuth.find({
    selector: { userId: id, type: "Google Drive" },
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

const driveLogOutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("https://facturagpt.com/");
  });
};


module.exports ={
    driveAuthController: catchedAsync(driveAuthController),
    driveRedirectController: catchedAsync(driveRedirectController),
    driveIsAuthenticatedController: catchedAsync(driveIsAuthenticatedController),
    driveLogOutController: catchedAsync(driveLogOutController),
    driveFiles: catchedAsync(driveFiles),
}