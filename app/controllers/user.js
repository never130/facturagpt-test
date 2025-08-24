const path = require("path");
const fs = require("fs");

const webpush = require("web-push");

const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "SCW8EPCVF1YTQXK0AC7P",
  secretAccessKey: "cd4ea464-15e8-4baf-848d-8db28cd880cf",
  endpoint: "https://s3.fr-par.scw.cloud",
  s3ForcePathStyle: true,
});


const nodemailer = require("nodemailer");
const nano = require("nano")("http://admin:1234@127.0.0.1:5984");

const { sendOtpEmail, sendWelcomeEmail } = require("../services/email");
const { v4: uuidv4 } = require("uuid");

const { connectDB } = require("./utils");
const jwt = require("jsonwebtoken");


const { sendRecoveryCode } = require("../services/email");


const { catchedAsync } = require("../utils/err");
const { sendEmail, getTemplate } = require("../services/email");
const { log } = require("console");




const newsletter = async ({
  name,
  email,
  message,
  work,
  phone,
  keepInformed,
  language = "es",
}) => {
  let mailToAythenContent, mailFromAythenContent;

  mailToAythenContent = `
  <div style="font-family: Arial, sans-serif; color: #1F184B; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto;">
    <h1 style="text-align: center; font-size: 24px;">
      <img src="cid:logo" style="max-width: 65%; height: auto;" />
    </h1>
    <p style="font-size: 16px; line-height: 1.5; color:#1F184B;">Hola, ${name}</p>
    <p style="font-size: 16px; line-height: 1.5; color:#1F184B;">Has recibido un nuevo mensaje de contacto.\n\nNombre: ${name}\nCorreo: ${email}\n\nMensaje:${message}\n\nTrabaja en:${work}\n\nTelefono:${phone}\n\nMantener Informando:${keepInformed}</p>
  </div>`;
  if (language === "es") {
    mailFromAythenContent = `
    <div style="font-family: Arial, sans-serif; color: #1F184B; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto;">
      <h1 style="text-align: center; font-size: 24px;">
        <img src="cid:logo" style="max-width: 65%; height: auto;" />
      </h1>
      <p style="font-size: 16px; line-height: 1.5; color:#1F184B;">Hola, ${name}</p>
      <p style="font-size: 16px; line-height: 1.5; color:#1F184B;">Gracias por querer estar en contacto con el equipo de FacturaGPT!</p>
    </div>`;
  } else {
    mailFromAythenContent = `
    <div style="font-family: Arial, sans-serif; color: #1F184B; background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: 0 auto;">
      <h1 style="text-align: center; font-size: 24px;">
        <img src="cid:logo" style="max-width: 65%; height: auto;" />
      </h1>
      <p style="font-size: 16px; line-height: 1.5; color:#1F184B;">Hello, ${name}</p>
      <p style="font-size: 16px; line-height: 1.5; color:#1F184B;">Thank you for wanting to be in contact with the FacturaGPT team!</p>
    </div>`;
  }

  const mailToAythen = {
    from: email,
    to: "info@facturagpt.com",
    subject: `Nuevo Mensaje de ${name}`,
    html: mailToAythenContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
        cid: "logo",
      },
    ],
  };

  const mailFromAythen = {
    from: "info@facturagpt.com",
    to: email,
    subject:
      language === "es"
        ? `Confirmación de recepción de mensaje de ${name}`
        : `Message receipt confirmation from ${name}`,
    html: mailFromAythenContent,
    attachments: [
      {
        filename: "GreenLogo.png",
        path: path.join(__dirname, "assets/GreenLogo.png"),
        cid: "logo",
      },
    ],
  };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "info@facturagpt.com",
      pass: "hosn ljvo ekvh qfdc",
    },
  });
  try {
    const infoToAythen = await transporter.sendMail(mailToAythen);

    const infoFromAythen = await transporter.sendMail(mailFromAythen);

    return {
      success: true,
      message:
        language === "es"
          ? "Correos enviados correctamente"
          : "Emails sent correctly",
    };
  } catch (error) {
    console.error("Error sending mail:", error);
    throw new Error(
      language === "es" ? "Error al enviar el correo" : "Error sending mail"
    );
  }
};




const getDB = async (req, res) => {
  try {
    const { type } = req.params;

    if (type == "delete-all") {
      return false
      const _dbs = ['db_accounts', 'db_automations', 'db_auths', 'db_workspaces', 'db_agents', 'db_otp']
      const _dbs_finished = ['_auth']
      const _dbs_included = ['_automations', '_auths', '_workspaces']
      const dbs = await nano.db.list();

      console.log('dbs', dbs)
      const filteredDbs = dbs.filter((db) => {
        const startsWithMatch = _dbs.some((prefix) => db.startsWith(prefix));
        const endsWithMatch = _dbs_finished.some((suffix) => db.endsWith(suffix));
        const includesMatch = _dbs_included.some((fragment) => db.includes(fragment));
        const hasAnyMatch = startsWithMatch || endsWithMatch || includesMatch;
        return !hasAnyMatch;
      });

      console.log('filteredDbs', filteredDbs)

      
      for (const db of filteredDbs) {
        try {
          await nano.db.destroy(db);
        } catch (error) {
          console.error(`Error deleting database ${db}:`, error);
        }
      }

      
      return res.status(200).send("All databases deleted");
    } else if (type == "resume") {
      const dbs = await nano.db.list();
      return res.status(200).send({
        total: dbs.length,
        message: `Total databases: ${dbs.length}`,
      });
    } else if (type) {
      const dbs = await nano.db.list();
      const filteredDbs = dbs.filter((db) => db.startsWith(`db_${type}`));

      const dbsWithLinks = filteredDbs.map((db) => ({
        name: db,
        link: `http://127.0.0.1:5984/_utils/#database/${db}/_all_docs`,
      }));

      return res.status(200).send({
        databases: dbsWithLinks,
        total: filteredDbs.length,
        message: `Found ${filteredDbs.length} databases with prefix db_${type}`,
      });
    } else {
      return res.status(200).send({
        status: 200,
        message: "¿Necesitas ayuda? Aquí tienes una guía de uso:",
        endpoints: {
          "/": "Muestra esta guía de ayuda",
          "/resume": "Muestra el número total de bases de datos",
          "/delete-all": "⚠️ CUIDADO: Elimina todas las bases de datos",
          "/{tipo}":
            "Muestra todas las bases de datos que empiezan con db_{tipo}",
        },
        ejemplos: {
          "GET /resume": "Ver total de bases de datos",
          "GET /accounts":
            "Ver todas las bases de datos que empiezan con db_accounts",
          "GET /notifications":
            "Ver todas las bases de datos que empiezan con db_notifications",
        },
        nota: "⚠️ Ten mucho cuidado con delete-all, esta acción no se puede deshacer",
      });
    }
  } catch (err) {
    return res.status(400).send("Not found");
  }
};



const downloadBackup = async (req, res) => {
  try {
    const dbAccounts = await connectDB("db_accounts");

    const acc = {}

    const accounts = await dbAccounts.find({
      selector: {},
      limit: 999999
    });

    for (const account of accounts.docs) {
      const id = account._id.split('_').pop();
      const selectedWorkspace = account?.selectedWorkspace || 'defaultworkspace'

      acc[id] = account


      const dbAutomations = await connectDB(`db_automations`);
      const dbAuths = await connectDB(`db_${selectedWorkspace }_auth`);


      const automations = await dbAutomations.find({
        selector: {
          userId: account._id
        },
        limit: 999999
      });

      const auths = await dbAuths.find({
        selector: {},
        limit: 999999
      });

      acc[id].automations = automations.docs;
      acc[id].auths = auths.docs;
      delete acc[id].profileImage;
    }

    const dateStr = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');

    const jsonData = JSON.stringify(acc, null, 2);
    const filePath = path.join(__dirname, `../../backup/${dateStr}.json`);
    const fileUrl = `http://localhost:${process.env.PORT || 3000}/backups/backup-${dateStr}.json`;

    fs.writeFileSync(filePath, jsonData);

    return res.status(200).send({
      success: true,
      message: 'Backup created successfully',
      fileUrl,
    })



  } catch (err) {
    console.error("Error downloading DB:", err);
    return res.status(500).send("Error downloading DB");
  }
}



const uploadBackup = async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No se ha proporcionado ningún archivo"
      });
    }

    let backupData;
    try {
      backupData = JSON.parse(file);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "El archivo no es un JSON válido"
      });
    }

    const stats = {
      totalUsers: Object.keys(backupData).length,
      totalAutomations: 0,
      totalAuths: 0,
      usersWithAutomations: 0,
      usersWithAuths: 0
    };

    for (const userId in backupData) {
      const userData = backupData[userId];

      if (userData.automations && Array.isArray(userData.automations)) {
        stats.totalAutomations += userData.automations.length;
        if (userData.automations.length > 0) {
          stats.usersWithAutomations++;
        }
      }

      if (userData.auths && Array.isArray(userData.auths)) {
        stats.totalAuths += userData.auths.length;
        if (userData.auths.length > 0) {
          stats.usersWithAuths++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Archivo procesado correctamente",
      stats,
      backupData
    });

  } catch (err) {
    console.error("Error uploading backup:", err);
    return res.status(500).json({
      success: false,
      message: "Error procesando el archivo de backup"
    });
  }
};


const processBackupImport = async (req, res) => {
  try {
    const { backupData } = req.body;

    if (!backupData) {
      return res.status(400).json({
        success: false,
        message: "No se han proporcionado datos para importar"
      });
    }

    const results = {
      usersProcessed: 0,
      usersCreated: 0,
      usersSkipped: 0,
      automationsProcessed: 0,
      automationsCreated: 0,
      automationsSkipped: 0,
      authsProcessed: 0,
      authsCreated: 0,
      authsSkipped: 0,
      errors: []
    };

    const dbAccounts = await connectDB("db_accounts");

    for (const userId in backupData) {
      const userData = backupData[userId];

      try {
        const existingAccount = await dbAccounts.find({
          selector: { email: userData.email },
          limit: 1
        });

        if (existingAccount.docs.length === 0) {

          const newAccount = {
            ...userData,
            bucketCreated: false,
            secondFactorAuth: false
          };

          delete newAccount._rev;

          const resp = await dbAccounts.insert(newAccount);
          results.usersCreated++;
        } else {
          results.usersSkipped++;
        }

        results.usersProcessed++;

        if (userData.automations && Array.isArray(userData.automations)) {
          const dbAutomations = await connectDB(`db_automations`);

          for (const automation of userData.automations) {
            try {
              const existingAutomation = await dbAutomations.find({
                selector: { _id: automation._id },
                limit: 1
              });

              if (existingAutomation.docs.length === 0) {

                await dbAutomations.insert(automation);
                results.automationsCreated++;
              } else {
                results.automationsSkipped++;
              }
              results.automationsProcessed++;
            } catch (error) {
              results.errors.push(`Error procesando automatización ${automation._id}: ${error.message}`);
            }
          }
        }

        if (userData.auths && Array.isArray(userData.auths)) {
          const dbAuths = await connectDB(`db_${userId}_auth`);

          for (const auth of userData.auths) {
            try {
              const existingAuth = await dbAuths.find({
                selector: { _id: auth._id },
                limit: 1
              });

              if (existingAuth.docs.length === 0) {
                await dbAuths.insert(auth);
                results.authsCreated++;
              } else {
                results.authsSkipped++;
              }
              results.authsProcessed++;
            } catch (error) {
              results.errors.push(`Error procesando autenticación ${auth._id}: ${error.message}`);
            }
          }
        }

      } catch (error) {
        results.errors.push(`Error procesando usuario ${userId}: ${error.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Importación completada",
      results
    });

  } catch (err) {
    console.error("Error processing backup import:", err);
    return res.status(500).json({
      success: false,
      message: "Error durante la importación"
    });
  }
};



const createAccountController = async (req, res) => {
  try {
    const clientData = req.body;
    try {
      const dbAccounts = await connectDB("db_accounts");
      const dbWorkspaces = await connectDB("db_workspaces");

      // Verificar si la cuenta ya existe
      const account = await dbAccounts.find({
        selector: {
          email: clientData.email,
        },
      });

      if (account.docs.length > 0) {
        return { success: false, message: "Account already exists." };
      }
      sendWelcomeEmail(clientData.nombre, clientData.email, clientData.language)

      const accountId = uuidv4();

      const docId = `account_${clientData.email}_${accountId}`;

      let role = clientData.role || "user";

      if (clientData.email === "info@aythen.com") {
        role = "superadmin";
      }

      const hashedPassword = Buffer.from(
        clientData?.password || "123456"
      ).toString("base64");

      // Crear workspace inicial
      const workspaceId = uuidv4();
      const workspaceDoc = {
        _id: workspaceId,
        createdBy: docId,
        title:`workspace de ${clientData.nombre}`,
        type:'default',
        members: [
          {
            _id: docId,
            role: { type: "owner" },
            email: clientData.email,
            name: clientData.nombre,
            profileImage: clientData.profileImage || null,
            memberSince: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };

      await dbWorkspaces.insert(workspaceDoc);

      // Crear la cuenta con el workspace seleccionado
      const newAccount = {
        _id: docId,
        id: docId,
        nombre: clientData.nombre,
        email: clientData.email,
        password: hashedPassword,
        PIN: clientData.PIN,
        referralCode: clientData.referralCode,
        role,
        bucketCreated: false,
        secondFactorAuth: false,
        selectedWorkspace: workspaceId,
        workspacesMember: [workspaceId],
        workspacesOwner: [workspaceId],
      };

      await dbAccounts.insert(newAccount);

      return res.status(200).send({
        success: true,
        message: "Cuenta creada exitosamente.",
        account: { ...newAccount },
      });
    } catch (error) {
      console.error("Error al crear la cuenta:", error);
      return res.status(500).send({
        success: false,
        message: "Error al crear la cuenta.",
      });
    }
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error en createAccountController");
  }
};



const updateAccountController = async (req, res) => {
  try {
    const { data } = req.body;
    const db = await connectDB("db_accounts");
    let updatedDoc;

    if (data?.id) {
      try {
        const existingDoc = await db.get(data.id);
        updatedDoc = {
          ...existingDoc,
          ...data,
          _rev: existingDoc._rev,
        };
      } catch (error) {
        console.error(`No user found with ID: ${data.id}`);
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
    } else {
      const existingDocByEmail = await db.find({
        selector: { email: data?.email },
        limit: 1,
      });

      if (existingDocByEmail.docs.length > 0) {
        const existingDoc = existingDocByEmail.docs[0];

        updatedDoc = {
          ...existingDoc,
          ...data,
          _rev: existingDoc._rev,
        };
      } else {
        const accountId = uuidv4();
        const docId = `account_${data.email}_${accountId}`;

        updatedDoc = {
          ...data,
          _id: docId,
          id: docId,
          role: data.email === "info@aythen.com" ? "superadmin" : "user",
          bucketCreated: false,
        };
      }
    }

    const resp = await db.insert(updatedDoc);

    const { _id, _rev, ...sanitizedDoc } = updatedDoc;
    return res.status(200).send(sanitizedDoc);
  } catch (error) {
    console.error("Error updating/creating account:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update/create account" });
  }
};
const selectedWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.body;

    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const db = await connectDB("db_accounts");

    const userId = user._id;
    let existingDoc;

    try {
      existingDoc = await db.get(userId);
    } catch (error) {
      console.error(`No user found with ID: ${userId}`);
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const updatedDoc = {
      ...existingDoc,
      selectedWorkspace: workspaceId,
      _rev: existingDoc._rev,
    };

    await db.insert(updatedDoc);

    const { _id, _rev, ...sanitizedDoc } = updatedDoc;

    return res.status(200).send(sanitizedDoc);
  } catch (error) {
    console.error("Error updating selected workspace:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update selected workspace" });
  }
};

const updateTokensController = async (req, res) => {
  try {
    const { data, id } = req.body;

    const db = await connectDB(`db_${id}_auth`);
    let updatedDoc;

    if (data?.id) {
      try {
        const existingDoc = await db.get(data.id);
        updatedDoc = {
          ...existingDoc,
          ...data,
          _rev: existingDoc._rev,
        };
      } catch (error) {
        console.error(`No user found with ID: ${data.id}`);
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
    } else {
      const accountId = uuidv4();

      updatedDoc = {
        ...data,
        _id: accountId,
        id: accountId,
        bucketCreated: false,

      }
    }

    const resp = await db.insert(updatedDoc);

    const { _id, _rev, ...sanitizedDoc } = updatedDoc;
    return res.status(200).send(sanitizedDoc);
  } catch (error) {
    console.error("Error updating/creating token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update/create token" });
  }
};

const getTokensById = async (id) => {
  const db = await connectDB(`db_${id}_auth`);
  const result = await db.find({
    selector: {},
    limit: 999999,
  });
  return result.docs[0];
}

const getTokensController = async (req, res) => {
  try {
    const { id } = req.body;
    const tokenData = await getTokensById(id);
    return res.status(200).send(tokenData);
  } catch (error) {
    console.error("Error getToken/getToken:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to getToken" });
  }
};

const setFinishTutorialTrueController = async (req, res) => {
  try {
    const user = req.user

    const id = user?.id

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const db = await connectDB("db_accounts");

    const existingDoc = await db.get(id);

    let updatedDoc

    if (existingDoc.finishTutorial === true) {
      updatedDoc = {
        ...existingDoc,
        finishTutorial: false,
        _rev: existingDoc._rev,
      };

    } else {

      updatedDoc = {
        ...existingDoc,
        finishTutorial: true,
        _rev: existingDoc._rev,
      };
    }


    await db.insert(updatedDoc);

    const { _id, _rev, ...sanitizedDoc } = updatedDoc;
    return res.status(200).send(sanitizedDoc);

  } catch (error) {
    console.error("Error updating finishTutorial:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update finishTutorial field.",
    });
  }
};
const setSecondFactorAuthController = async (req, res) => {
  try {
    const { id, secondFactorAuth } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const db = await connectDB("db_accounts");

    const existingDoc = await db.get(id);

    const updatedDoc = {
      ...existingDoc,
      secondFactorAuth,
      _rev: existingDoc._rev,
    };

    await db.insert(updatedDoc);

    const { _id, _rev, ...sanitizedDoc } = updatedDoc;
    return res.status(200).send(sanitizedDoc);

  } catch (error) {
    console.error("Error updating second factor auth:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update second factor auth field.",
    });
  }
};
const logicalDeletedAccount = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const db = await connectDB("db_accounts");

    const existingDoc = await db.get(id);

    const updatedDoc = {
      ...existingDoc,
      logicalDeletedAccount: !existingDoc?.logicalDeletedAccount,
      _rev: existingDoc._rev,
    };

    await db.insert(updatedDoc);

    const { _id, _rev, ...sanitizedDoc } = updatedDoc;
    return res.status(200).json(sanitizedDoc);

  } catch (error) {
    console.error("Error updating logicalDeletedAccount field:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update logicalDeletedAccount field.",
    });
  }
};


const deleteAccountController = async (req, res) => {
  try {
    const { id } = req.body;

    try {

      const parts = id.split("_");
      const idLimpio = parts[parts.length - 1];


      const db = await connectDB("db_accounts");
      const doc = await db.find({ selector: { id: id } });


      await db.destroy(doc.docs[0]._id, doc.docs[0]._rev);


      const dbs = await nano.db.list();
      const filteredDbs = dbs.filter((dbName) => dbName.startsWith(`db_${idLimpio}`));


      for (const dbName of filteredDbs) {
        try {
          await nano.db.destroy(dbName);
        } catch (err) {
          console.error(`Error al eliminar la base de datos ${dbName}:`, err);
        }
      }

      return res.status(200).send({
        id,
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      if (error.statusCode === 404) {
        console.error(`Account with ID ${account.id} not found.`);
        return { success: false, message: "Account not found." };
      }
      console.error("Error deleting account:", error);
      throw new Error("Failed to delete account");
    }
  } catch (err) {
    console.error("Error in deleteAccountController:", err);
    return res.status(500).send("Error deleting user");
  }
};

const updateAccountPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    try {
      const db = await connectDB("db_accounts");

      const queryResponse = await db.find({
        selector: { email },
      });

      if (queryResponse.docs.length === 0) {
        return { success: false, message: "User not found." };
      }

      const userDoc = queryResponse.docs[0];
      const hashedPassword = Buffer.from(newPassword).toString("base64");

      const updatedDoc = {
        ...userDoc,
        password: hashedPassword,
        _rev: userDoc._rev,
      };

      await db.insert(updatedDoc);

      return res.status(200).send({
        success: true,
        message: "Password updated successfully.",
      });
    } catch (error) {
      if (error.statusCode === 404) {
        console.error(`User with email ${email} not found.`);
        return { success: false, message: "User not found." };
      }
      console.error("Error updating password:", error);
      throw new Error("Failed to update password");
    }
  } catch (err) {
    console.error("Error in updateAccountPasswordController:", err);
    return res.status(500).send("Error updating user password");
  }
};

const loginToManagerController = async (req, res) => {
  try {
    const { email, password, accessToken } = req.body;
    let db = await connectDB("db_accounts");
    try {
      let account;

      if (accessToken) {
        const tokenQuery = await db.find({
          selector: { token: accessToken },
        });

        if (tokenQuery.docs.length === 0) {
          return res.status(401).send("Invalid access token.");
        }
        account = tokenQuery.docs[0];
      } else {

        const validEmailsPath = path.join(__dirname, '../config/valid_emails.txt');
        const validEmails = fs.readFileSync(validEmailsPath, 'utf-8')
          .split('\n')
          .map(email => email.trim())
          .filter(email => email); // Remove empty lines


        if (!validEmails.includes(email)) {
          return res.status(403).json({
            success: false,
            message: "Email no autorizado. Por favor, contacte al administrador para obtener acceso."
          });
        }

        const queryResponse = await db.find({
          selector: { email },
        });


        if (queryResponse.docs.length === 0) {
          return res.status(402).send("Invalid email or password.");
        }

        account = queryResponse.docs[0];
        const hashedPassword = Buffer.from(password).toString("base64");

        if (
          account.password !== hashedPassword
        ) {
          return res.status(402).send("Invalid email or password.");
        }

        const token = jwt.sign(
          {
            userId: account._id,
            email: account.email,
            role: account.role,
          },
          "your-secret-key",
          { expiresIn: "24h" }
        );

        const updatedDoc = {
          ...account,
          token: token,
          _rev: account._rev,
        };

        await db.insert(updatedDoc);

        account = updatedDoc;
      }

      const { _id, _rev, ...rest } = account;
      if (!account.bucketCreated) {
        try {

          const currentDoc = await db.get(account._id);
          const updateResponse = await db.insert({
            _id: account._id,
            _rev: currentDoc._rev,
            ...currentDoc,
            bucketCreated: true,
          });
        } catch (error) {
          console.error("Error creating bucket:", error);
        }
      }
      return res.status(200).send(rest);
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send("Error during login process");
    }
  } catch (err) {
    console.error("Error in loginToManagerController:", err);
    return res.status(500).send("Error during login process");
  }
};
const validateSecondFactorAuthController = async (req, res) => {
  try {
    const { email, password, accessToken } = req.body;
    const db = await connectDB("db_accounts");

    let account;

    if (accessToken) {
      const tokenQuery = await db.find({
        selector: { token: accessToken },
      });

      if (tokenQuery.docs.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid access token." });
      }

      account = tokenQuery.docs[0];

    } else {

      const validEmailsPath = path.join(__dirname, '../config/valid_emails.txt');
      const validEmails = fs.readFileSync(validEmailsPath, 'utf-8')
        .split('\n')
        .map(email => email.trim())
        .filter(email => email);

      if (!validEmails.includes(email)) {
        return res.status(403).json({
          success: false,
          message: "Email no autorizado. Por favor, contacte al administrador.",
        });
      }

      const queryResponse = await db.find({ selector: { email } });

      if (queryResponse.docs.length === 0) {
        return res.status(402).json({ success: false, message: "Invalid email or password." });
      }

      account = queryResponse.docs[0];

      const hashedPassword = Buffer.from(password).toString("base64");

      if (account.password !== hashedPassword) {
        return res.status(402).json({ success: false, message: "Invalid email or password." });
      }
    }

    return res.status(200).json({
      success: true,
      secondFactorAuth: account?.secondFactorAuth ?? false,
      logicalDeletedAccount: account?.logicalDeletedAccount ?? false,
      id: account?.id ?? false,
    });

  } catch (err) {
    console.error("Error in validateSecondFactorAuthController:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};




const getAllAccountsController = async (req, res) => {
  try {
    const { user } = req;
    const id = user._id.split("_").pop();

    const { limit, skip, search } = req.query;
    const {
      sortAlpha,
      sortStatusLastInvoice,
      sortTokenPaid,
      lastSelectedOption
    } = req.body;


    try {
      const dbAccounts = await connectDB("db_accounts");

      let selector = {};

      if (search) {
        selector = {
          $or: [
            {
              email: {
                $regex: `(?i)${search}`,
              },
            },
            {
              PIN: {
                $regex: `(?i)${search}`,
              },
            },
          ],
        };
      }
      if (
        sortStatusLastInvoice !== undefined &&
        sortStatusLastInvoice !== null &&
        sortStatusLastInvoice !== "all"
      ) {
        selector.statusLastInvoice = sortStatusLastInvoice;
      }


      const [accountsResponse, totalResponse] = await Promise.all([
        dbAccounts.find({
          selector,
          limit: parseInt(limit),
          skip: parseInt(skip),
        }),
        dbAccounts.find({
          selector: {},
          fields: ["_id", "tokenMonth"],
          limit: 10000,
        }),
      ]);

      const allAccounts = accountsResponse.docs;
      const totalDocs = totalResponse.docs;

      const filteredAccounts = [];    
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

      for (const account of allAccounts) {
        try {
          const id = account._id.split("_").pop();
          const dbContacts = await connectDB(`db_${selectedWorkspace}_contacts`);
          const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);
          const dbDocs = await connectDB(`db_${selectedWorkspace}_docs`);

          const [contactsResponse, assetsResponse, docsResponse] =
            await Promise.all([
              dbContacts.find({ selector: {} }),
              dbAssets.find({ selector: {} }),
              dbDocs.find({ selector: {} }),
            ]);

          const { profileImage, ...restAccount } = account;

          filteredAccounts.push({
            ...restAccount,
            contacts: contactsResponse.docs,
            assets: assetsResponse.docs,
            docs: docsResponse.docs,
          });

        } catch (innerError) {
          console.error(`Error loading data for account ${id}:`, innerError);
          filteredAccounts.push({
            ...account,
            contacts: [],
            assets: [],
            docs: [],
          });
        }
      }


      if (lastSelectedOption === "Orden Alfabético" && sortAlpha) {
        filteredAccounts.sort((a, b) => {
          const fieldA = a.email?.toLowerCase() || "";
          const fieldB = b.email?.toLowerCase() || "";
          return sortAlpha === "A-Z"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        });
      }

      if (lastSelectedOption === "tokenPaid" && sortTokenPaid) {
        filteredAccounts.sort((a, b) => {
          const tokenA = a.tokenTotal || 0;
          const tokenB = b.tokenTotal || 0;

          if (sortTokenPaid === "Mayor a menor") {
            return tokenB - tokenA;
          } else {
            return tokenA - tokenB;
          }
        });
      }

      const totalTokenValue = totalDocs.reduce(
        (acc, doc) => acc + (doc.tokenMonth || 0),
        0
      );
      return res.status(200).send({
        success: true,
        accounts: filteredAccounts,
        total: totalDocs.length,
        value: totalTokenValue,

        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(totalDocs.length / limit),
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).send("Failed to fetch users");
    }
  } catch (err) {
    console.error("Error in getAllAccountsController:", err);
    return res.status(500).send("Error fetching accounts");
  }
};


const getProfileImageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Falta el parámetro 'id'" });
    }

    const dbAccounts = await connectDB("db_accounts");

    const response = await dbAccounts.find({
      selector: { _id: id },
      limit: 1,
      fields: ["_id", "profileImage"],
    });

    const account = response.docs[0];

    if (!account) {
      return res.status(404).json({ success: false, message: "Cuenta no encontrada" });
    }

    return res.status(200).json({
      success: true,
      profileImage: account.profileImage || null,
    });

  } catch (error) {
    console.error("Error al obtener el profileImage:", error);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
};


const generateAndSendOtpController = async (req, res) => {
  try {
    const { nombre, email, language } = req.body;

    try {
      const existingDb = await connectDB("db_otp");
      const existingOtpResponse = await existingDb.find({
        selector: {
          email: email,
          expirationTime: { $gt: Date.now() }
        },
        limit: 1
      });

      if (existingOtpResponse.docs.length > 0) {
        return res.status(500).send({
          success: false,
          message: "An active OTP already exists for this email. Please wait before requesting a new one."
        });
      }



      const db = await connectDB("db_otp");
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      const expirationTime = Date.now() + 5 * 60 * 1000;
      const otpId = uuidv4();
      const docId = `otp_${email}_${otpId}`;

      const otpDocument = {
        _id: docId,
        email,
        otp,
        expirationTime,
        createdAt: new Date().toISOString(),
      };

      await db.insert(otpDocument);
      await sendOtpEmail(nombre, email, otp, language);
      return res.status(200).send({
        success: true,
        message: "OTP generado y enviado exitosamente.",
        otp,
      });
    } catch (error) {
      console.error("Error generando o enviando OTP:", error);
      throw new Error("No se pudo generar o enviar el OTP.");
    }
  } catch (err) {
    console.error("Error in generateAndSendOtpController:", err);
    return res.status(500).send("Error generating OTP");
  }
};

const generateAndSend2FaController = async (req, res) => {
  try {
    const { nombre, email, language, code } = req.body;


    try {
      await sendOtpEmail(nombre, email, code, language, type = "send2FA");
      return res.status(200).send({
        success: true,
        message: "Codigo generado y enviado exitosamente.",
        code,
      });
    } catch (error) {
      console.error("Error generando o enviando 2Fa codigo:", error);
      throw new Error("No se pudo generar o enviar el 2fa.");
    }
  } catch (err) {
    console.error("Error in generateAndSend2FaController:", err);
    return res.status(500).send("Error generating 2Fa");
  }
};
const testEmails = async (req, res) => {
  try {
    const { nombre, email, language, type } = req.body;


    try {
      await sendOtpEmail(nombre, email, null, "Español", type);

      return res.status(200).send({
        success: true,
        message: "prueba exitosa",

      });
    } catch (error) {
      console.error("error probando correo", error);
      throw new Error("No se pudo generar o enviar el 2fa.");
    }
  } catch (err) {
    console.error("Error in generateAndSend2FaController:", err);
    return res.status(500).send("Error generating 2Fa");
  }
}
const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    try {
      const db = await connectDB("db_otp");
      const queryResponse = await db.find({
        selector: {
        },
      });

      if (queryResponse.docs.length === 0) {
        return res
          .status(200)
          .send({ success: false, message: "Invalid or expired OTP." });
      }

      const otpDoc = queryResponse.docs[0];
      const now = new Date();
      const expiresAt = new Date(otpDoc.expirationTime);

      if (now > expiresAt) {
        return res
          .status(200)
          .send({ success: false, message: "OTP has expired." });
      }

      await db.destroy(otpDoc._id, otpDoc._rev);


      return res
        .status(200)
        .send({ success: true, message: "OTP verified successfully." });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(401).send(response);
    }


  } catch (err) {
    console.error("Error in verifyOTPController:", err);
    return res.status(500).send("Error verifying OTP");
  }
};

const sendNewsletter = async (req, res) => {
  try {
    const { name, email, message, work, phone, keepInformed, language } =
      req.body;
    const response = await newsletter({
      name,
      email,
      message,
      work,
      phone,
      keepInformed,
      language,
    });

    if (response.success) {
      return res.status(200).send(response);
    }
    return res.status(401).send(response);
  } catch (err) {
    console.error("Error in verifyOTPController:", err);
    return res.status(500).send("Error verifying OTP");
  }
};

const getFile = async (req, res) => {
  try {
    const { name } = req.params;

    const filePath = path.join(__dirname, "../../src/assets/email", name);

    const contentType = name.toLowerCase().endsWith(".svg")
      ? "image/svg+xml"
      : name.toLowerCase().endsWith(".png")
        ? "image/png"
        : "application/octet-stream";

    let fileContent;
    if (contentType === "image/svg+xml") {
      fileContent = await fs.promises.readFile(filePath, "utf8");
    } else {
      fileContent = await fs.promises.readFile(filePath);
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    return res.status(200).send(fileContent);
  } catch (err) {
    console.error("Error in sendFile:", err);
    return res.status(500).send("Error in sendFile");
  }
};
const getEmail = async (req, res) => {
  try {
    const { html } = await getTemplate("promo-email");

    return res.status(200).send(html);
  } catch (err) {
    console.error("Error in getEmail:", err);
    return res.status(500).send("Error in getEmail");
  }
};

const senderEmail = async (req, res) => {
  try {
    const { user } = req;
    const { email, template = "form-action", data = {} } = req.body;

    const resp = await sendEmail(email, template, data);

    return res.status(200).send("200");
  } catch (error) {
    console.error("Error:", error);
  }
};


const addNotificationController = async (req, res) => {
  try {
    const { user } = req;
    const id = user._id.split("_").pop();

    const notification = req.body;

    //  const user  = req.user
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);

    await dbNotifications.createIndex({
      index: {
        fields: ["createdAt"],
      },
    });

    const notificationId = uuidv4();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = currentDate.toLocaleString("en-US", { month: "short" });
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    const dataNotification = notification.data || [];


    const category = notification.category || [];



    const type = notification.type || "other";

    const options = notification.options || [];

    const title = notification.title || "Document Title";

    const icon = notification.icon || "https://aythen.com/logo.png";

    const value = notification.value || 0;

    const data = {
      id: notificationId,
      title: title,
      date: `${day} ${month} ${year}`,
      time: `${hours}:${minutes} ${period}`,
      month: `${currentMonth}-${currentYear}`,
      icon: icon,
      notifications: dataNotification,
      options: options,
      category: category,
      type: type,
      value: value,
      currency: "EUR",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbNotifications.insert(data);

    return res.status(200).send({
      success: true,
      message: "Notification added successfully",
      notification: notification,
    });
  } catch (err) {
    console.error("Error in addNotificationController:", err);
    return res.status(500).send("Error adding notification");
  }
};
const getAllNotificationsController = async (req, res) => {
  try {
    const { user } = req;
    const { limit = 99999, skip = 0, search } = req.query;
    const { sortDate, sortAlpha, statusFilter, sortType } = req.body;

    let notificationResult;
    let totalNotificationsFiltered;
    let filtered;

    const mergeArraysById = (arr1, arr2) => {
      const map = new Map();
      for (const item of arr1) map.set(item._id, item);
      for (const item of arr2) map.set(item._id, item);
      return Array.from(map.values());
    };

    const extractedId = user._id.split("_").pop();
    //  const user  = req.user
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);

    let selector = {};

    if (sortDate) {
      const now = new Date();
      let limitDate = new Date();
      switch (sortDate) {
        case "1month": limitDate.setMonth(now.getMonth() - 1); break;
        case "3month": limitDate.setMonth(now.getMonth() - 3); break;
        case "6month": limitDate.setMonth(now.getMonth() - 6); break;
        case "1year": limitDate.setFullYear(now.getFullYear() - 1); break;
        default: limitDate = null;
      }

      if (limitDate) {
        selector.$or = [
          { createdAt: { $gt: limitDate.toISOString() } },
          { updatedAt: { $gt: limitDate.toISOString() } },
        ];
      }
    }

    if (search) {
      selector.title = { $regex: `(?i)${search}` };
    }

    if (statusFilter && statusFilter !== "Todos") {
      selector.status = statusFilter;
    }

    if (sortType && sortType !== "Todos") {
      selector.type = sortType;
    }

    if (search) {
      const allNotifications = await dbNotifications.find({ selector: {} });
      filtered = allNotifications.docs.filter(doc =>
        doc.notifications?.some(n =>
          n.text.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (search || sortDate || sortType) {
      const total = await dbNotifications.find({ selector });
      const notificationfiltered = await dbNotifications.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

      if (search) {
        totalNotificationsFiltered = mergeArraysById(total.docs, filtered);
        notificationResult = mergeArraysById(notificationfiltered.docs, filtered);
      } else {
        totalNotificationsFiltered = total.docs;
        notificationResult = notificationfiltered.docs;
      }
    } else {
      const response = await dbNotifications.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

      notificationResult = response.docs;
    }

    let notifications = notificationResult;

    if (sortAlpha) {
      notifications.sort((a, b) => {
        const aTitle = a.title?.toLowerCase() || "";
        const bTitle = b.title?.toLowerCase() || "";
        return sortAlpha === "A-Z"
          ? aTitle.localeCompare(bTitle)
          : bTitle.localeCompare(aTitle);
      });
    }

    const total = await dbNotifications.find({
      selector: {},
      fields: ["_id"],
      limit: 9999999,
    });

    let localSkip = parseInt(skip);
    let localTotal;
    let totalForPagination;

    if (!search && !sortDate && !sortType) {
      const total = await dbNotifications.find({
        selector: {},
        fields: ["_id"],
        limit: 9999999,
      });
      localTotal = total?.docs?.length || 0;
      totalForPagination = total?.docs?.length || 0;
    } else {
      const totalFiltered = await dbNotifications.find({
        selector,
        fields: ["_id"],
        limit: 9999999,
      });

      if (search) {
        const mergedFiltered = mergeArraysById(totalFiltered.docs, filtered);
        localTotal = mergedFiltered.length;
        totalForPagination = mergedFiltered.length;
      } else {
        localTotal = totalFiltered?.docs?.length || 0;
        totalForPagination = totalFiltered?.docs?.length || 0;
      }

      localSkip = 1;
    }

    const unseenQuery = await dbNotifications.find({
      selector: {},
      limit: 999999,
    });

    const unseenCount = unseenQuery.docs.reduce((acc, doc) => {
      return !doc.seen ? acc + 1 : acc;
    }, 0);

    return res.status(200).send({
      success: true,
      notification: notifications,
      total: localTotal,
      limit: parseInt(limit),
      skip: parseInt(skip),
      pages: Math.ceil(total.docs.length / limit),
      unseenCount
    });
  } catch (err) {
    console.error("Error in getAllNotificationsController:", err);
    return res.status(500).send("Error getting notifications");
  }
};


const deleteNotificationController = async (req, res) => {
  try {
    const { type } = req.body;
    const user = req.user;
    const id = user._id.split("_").pop();
//  const user  = req.user
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);

    if (type === 'pay') {
      return res.status(200).send({
        success: true,
        message: "No hay notificaciones para eliminar",
        deleted: [],
      });
    }

    const selector = type === "all"
      ? { type: { $ne: "pay" } }
      : { type: type };

    const result = await dbNotifications.find({ selector, limit: 9999999, });

    if (!result.docs.length) {
      return res.status(200).send({
        success: true,
        message: "No hay notificaciones para eliminar",
        deleted: [],
      });
    }

    const notificationsToDelete = result.docs.map((doc) => ({
      _id: doc._id,
      _rev: doc._rev,
      _deleted: true,
    }));

    const response = await dbNotifications.bulk({ docs: notificationsToDelete });

    return res.status(200).send({
      success: true,
      message:
        type === "all"
          ? "Todas las notificaciones han sido eliminadas"
          : `Notificaciones de tipo '${type}' eliminadas`,
      deleted: response,
    });
  } catch (err) {
    console.error("Error in deleteNotificationController:", err);
    return res.status(500).send("Error eliminando notificaciones");
  }
};

const getTruncatedTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);

  const minutes = now.getMinutes();

  const truncatedMinutes = Math.floor(minutes / 15) * 15;
  now.setMinutes(truncatedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);

  const hours = now.getHours().toString().padStart(2, "0");
  const mins = truncatedMinutes.toString().padStart(2, "0");

  return `${hours}:${mins}`;
};

const getPreviousMonths = (currentMonth) => {
  const [month, year] = currentMonth.split("-").map(Number);
  const months = [];

  for (let i = 1; i <= month - 1; i++) {
    let prevMonth = month - i;
    if (prevMonth > 0) {
      months.push(`${prevMonth}-${year}`);
    }
  }

  return months;
};




async function getTotalS3Usage(bucket, prefix) {
  let totalSize = 0;
  let continuationToken = null;

  do {
    const params = {
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    };

    const response = await s3.listObjectsV2(params).promise();

    if (response.Contents) {
      totalSize += response.Contents.reduce((sum, obj) => sum + obj.Size, 0);
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : null;
  } while (continuationToken);

  return totalSize;
}

const getResumeAccount = async (req, res) => {
  try {
    const user = req.user;
    const id = user._id.split("_").pop();
    const { userId } = req.params
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);
    const operationDate = getTruncatedTime();

    const notificationResume = await dbNotifications.find({
      selector: {
        type: "resume",
        date: operationDate,
      },
    });

    let resume = {};
    let s3_usage_gb
    if (true) {

      const bucket = "factura-gpt";
      const prefix = `${userId}/`;
      const totalBytes = await getTotalS3Usage(bucket, prefix);


      const totalGigabytes = totalBytes / (1024 ** 3);
      s3_usage_gb = parseFloat(totalGigabytes.toFixed(2));

      const currentDate = new Date();
      const currentMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      let previousMonths = getPreviousMonths(currentMonth);

      const dbMonth = await dbNotifications.find({
        selector: {
          type: "resume",
          month: currentMonth,
        },
        limit: 1,
      });

      if (dbMonth.docs && dbMonth.docs.length > 0) {
        previousMonths = dbMonth.docs[0].previous_month;

      } else {
        previousMonths = Object.fromEntries(
          previousMonths.map((key) => [
            key,
            {
              value: 200,
            },
          ])
        );
      }

      resume = {
        type: "resume",
        date: operationDate,
        month: currentMonth,
        income: 0,
        expense: 0,
        other_management_losses: 0,
        company_social_security: 0,
        compensations: 0,
        wages_and_salaries: 0,
        other_services: 0,
        utilities: 0,
        advertising_and_pr: 0,
        banking_services: 0,
        product_sales: 0,
        service_income: 0,
        bank_interest: 0,
        s3_usage_gb: s3_usage_gb,
        previous_month: previousMonths,
      };

      const notifications = await dbNotifications.find({
        selector: {
          type: {
            $nin: ["resume", "pay", "other"],
          },
          createdAt: { $exists: true },
          value: { $exists: true },
        },
        sort: [{ createdAt: "desc" }],
        limit: 1000,
        use_index: "date-index",
      });


      notifications.docs.map((doc, index) => {
        if (doc.type && typeof resume[doc.type]) {
          resume[doc.type] += doc.value;
        }
      });


      await dbNotifications.insert(resume);
    } else {
      resume = notificationResume.docs[0];
    }

    return res.status(200).send({
      success: true,
      message: "Resume account fetched successfully",
      resume: resume,
    });
  } catch (err) {
    console.error("Error in getResumeAccount:", err);
    return res.status(500).send("Error getting resume account");
  }
};

const deleteResumeAccount = async (req, res) => {
  try {
    const user = req.user;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);

    const result = await dbNotifications.find({
      selector: {
      },
    });

    let deletedCount = 0;
    if (result.docs.length > 0) {
      for (const doc of result.docs) {
        try {
          await dbNotifications.destroy(doc._id, doc._rev);
        } catch (error) {
          console.error(`Error eliminando documento ${doc._id}:`, error);
        }
      }
    }
  } catch (err) {
    console.error("Error in deleteResumeAccount:", err);
  }
};

const uploadFileController = async (req, res) => {
  try {
    const { user } = req;
    const id = user._id.split("_").pop();

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const { location, nameDoc, contactId, type, infoBill, currentPath } = req.body;

    const docId = uuidv4();

    const file = req.file;
    const path = `${selectedWorkspace}/`;
    const bucketName = "factura-gpt";
    const newPath = location == '/Inicio/' ? path : location
    const params = {
      Bucket: bucketName,

      Key: `${newPath}FILE-${docId}_${nameDoc && nameDoc !== 'undefined' ? nameDoc : file?.originalname}`,
      Body: file?.buffer ? file?.buffer : 'temporalBody',
      ContentType: file?.mimetype ? file?.mimetype : 'temporalContenType',

    };


    const response = await s3.upload(params).promise();

    const ETag = response.ETag;

    if (!ETag) {
      return res
        .status(400)
        .json({ message: "ETag es requerido en la cabecera" });
    }

    const cleanETag = ETag.replace(/^"|"$/g, "");

    const modifiedFilename = `${cleanETag}-${req.file?.originalname || ''}`;

    const db = await connectDB(`db_${selectedWorkspace}_docs`);
    let parsedInfoBill = {};
    if (infoBill && infoBill !== "undefined") {
      try {
        parsedInfoBill = (infoBill && typeof infoBill === "string")
          ? JSON.parse(infoBill)
          : infoBill;
      } catch (error) {
        console.error("Error al parsear infoBill:", error);
      }
    }

    const createdAt = new Date();

    const doc = {
      _id: docId,
      type: "pdf",
      stateStripe: type,
      documentTitle: nameDoc && nameDoc !== 'undefined' ? nameDoc : modifiedFilename,
      content_type: req?.file?.mimetype,
      ETag: cleanETag,
      bgColor:"#FFB6C1",
      createdAt,
      path: currentPath,

      ...(contactId && { contactId })
    };

    Object.entries(parsedInfoBill || {}).forEach(([key, value]) => {
      if (!(key in doc)) {
        doc[key] = value;
      }
    });

    const docResponse = await db.insert(doc);
    const revision = docResponse.rev;

    const attachmentName = modifiedFilename;
    const attachmentBuffer = req?.file?.buffer;
    const attachmentType = req?.file?.mimetype;




    if (req?.file) {
      await db.attachment.insert(
        docResponse.id,
        modifiedFilename,
        req?.file?.buffer,
        req?.file?.mimetype,
        { rev: revision }
      );
    }

    res.status(200).json({
      message: "Archivo subido con éxito",
      filename: modifiedFilename,
      response: docResponse,
    });
  } catch (err) {
    console.error("Error al subir el archivo:", err);
    res
      .status(500)
      .json({ message: "Error al subir el archivo", error: err.message });
  }
};

const updateFileController = async (req, res) => {
  try {
    const { user } = req;
    const id = user._id.split("_").pop();

    const { stateStripe, eTag, destinationKey } = req.body;

    const decodedDestinationKey = destinationKey ? decodeURIComponent(destinationKey) : destinationKey;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);

    const doc = await db.find({
      selector: {
        ETag: eTag,
        type: "pdf",
      },
    });

    const fileDoc = doc.docs[0];


    if (!fileDoc) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    if (stateStripe) fileDoc.stateStripe = stateStripe;
    if (decodedDestinationKey) fileDoc.path = decodedDestinationKey;

    const result = await db.insert(fileDoc);

    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Error al subir el archivo:", err);
    res
      .status(500)
      .json({ message: "Error al subir el archivo", error: err.message });
  }
};


const getPdfAsBase64Controller = async (req, res) => {
  try {
    const { user } = req;
    const id = user._id.split("_").pop();
    const { pdfId } = req.params;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);

    let doc;
    try {
      doc = await db.get(pdfId, { attachments: true });
    } catch (err) {
      if (err.statusCode === 404) {
        return res.status(404).json({
          message: "El documento no existe en la base de datos",
          error: err.reason || "Documento no encontrado"
        });
      }

      throw err;
    }


    if (!doc._attachments || Object.keys(doc._attachments).length === 0) {
      return res.status(404).json({ message: "El documento no tiene adjuntos" });
    }

    const attachmentName = Object.keys(doc._attachments)[0];
    const attachment = doc._attachments[attachmentName];

    if (!attachment || !attachment.data) {
      return res.status(404).json({ message: "Adjunto no encontrado" });
    }

    const base64 = `data:${attachment.content_type};base64,${attachment.data}`;

    return res.status(200).json({
      filename: attachmentName,
      pdfBase64: base64,
    });

  } catch (err) {
    console.error("Error inesperado al obtener el PDF:", err);
    return res.status(500).json({
      message: "Error interno al obtener el archivo",
      error: err.message || "Error desconocido"
    });
  }
};

const getUniqueFileWithPDFBase64Controller = async (req, res) => {
  try {
    const { etag } = req.params;
    const { user } = req;

    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);


    const doc = await db.find({
      selector: {
        ETag: etag,
        type: "pdf",
      },
    });

    if (doc.docs.length === 0) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    const docId = doc.docs[0]._id;

    const fullDoc = await db.get(docId, { attachments: true });


    const fileDoc = doc.docs[0];


    if (!fullDoc._attachments || Object.keys(fullDoc._attachments).length === 0) {
      return res.status(404).json({ message: "El documento no tiene adjuntos" });
    }

    const attachmentName = Object.keys(fullDoc._attachments)[0];
    const attachment = fullDoc._attachments[attachmentName];



    if (!attachment || !attachment.data) {
      return res.status(404).json({ message: "Adjunto no encontrado" });
    }

    const base64 = `data:${attachment.content_type};base64,${attachment.data}`;


    return res.status(200).json({
      filename: attachmentName,
      pdfBase64: base64,
    });

  } catch (err) {
    console.error("Error inesperado al obtener el PDF:", err);
    return res.status(500).json({
      message: "Error interno al obtener el archivo",
      error: err.message || "Error desconocido"
    });
  }

};



const getUniqueFileController = async (req, res) => {
  try {
    const { etag } = req.params;
    const { user } = req;

    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);


    const doc = await db.find({
      selector: {
        ETag: etag,
        type: "pdf",
      },
    });

    if (doc.docs.length === 0) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    const fileDoc = doc.docs[0];


    const attachment = await db.attachment.get(fileDoc._id, fileDoc.filename || fileDoc.documentTitle);

    if (!attachment) {
      return res.status(404).json({ message: "Adjunto no encontrado" });
    }


    res.setHeader("Content-Type", fileDoc.content_type);
    res.send(attachment);
  } catch (err) {
    console.error("Error al obtener archivo:", err);
    res.status(500).json({ message: "Error al obtener el archivo" });
  }
};

const getFileMetadataController = async (req, res) => {
  try {
    const { etag } = req.params;
    const { user } = req;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);

    const doc = await db.find({
      selector: {
        ETag: etag,
        type: "pdf",
      },
    });

    if (doc.docs.length === 0) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    const fileDoc = doc.docs[0];

    res.json(fileDoc);
  } catch (err) {
    console.error("Error al obtener metadatos:", err);
    res.status(500).json({ message: "Error al obtener metadatos" });
  }
};

const deleteFileController = async (req, res) => {
  try {
    const { key } = req.params;
    const { user } = req;
    const id = user._id.split("_").pop();

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);


    const doc = await db.find({
      selector: {
        _id: key,
        type: "pdf",
      },
    });

    if (doc.docs.length === 0) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }

    const fileDoc = doc.docs[0];



    const latestDoc = await db.get(fileDoc._id);


    if (latestDoc._attachments && latestDoc._attachments[fileDoc.filename]) {
      await db.attachment.destroy(fileDoc._id, fileDoc.filename, {
        rev: latestDoc._rev,
      });


      const updatedDoc = await db.get(fileDoc._id);


      const deleteResponse = await db.destroy(fileDoc._id, updatedDoc._rev);
      if (!deleteResponse.ok) {
        return res
          .status(500)
          .json({ message: "Error al eliminar el archivo" });
      }
    } else {

      const deleteResponse = await db.destroy(fileDoc._id, latestDoc._rev);
      if (!deleteResponse.ok) {
        return res
          .status(500)
          .json({ message: "Error al eliminar el archivo" });
      }
    }

    res.status(200).json({ message: "Archivo eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar archivo:", err);
    res.status(500).json({ message: "Error al eliminar el archivo" });
  }
};

const weighFolderController = async (req, res) => {
  try {
    const { currentPath } = req.params;
    const { user } = req;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);


    const docsToDelete = await db.find({
      selector: {
        path: {
          $regex: `^${currentPath}.*`
        },
        type: "pdf",
      },
    });


    if (docsToDelete.docs.length === 0) {
      return res.status(404).json({ message: "No se encontraron archivos para eliminar en esta ruta." });
    }

    let totalSize = 0;

    for (const fileDoc of docsToDelete.docs) {
      if (fileDoc._attachments && fileDoc.documentTitle && fileDoc._attachments[fileDoc.documentTitle]) {
        totalSize += fileDoc._attachments[fileDoc.documentTitle].length;
      }
    }
    res.status(200).json({ message: "Peso de la carpeta calculado correctamente", totalSize: totalSize });
  } catch (err) {
    console.error("Error al calcular el peso de la carpeta:", err);
    res.status(500).json({ message: "Error al calcular el peso de la carpeta" });
  }
};

const moveManyFileLocallyController = async (req, res) => {
  try {
    const { initialPath, destinationPath } = req.body;
    const { user } = req;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const db = await connectDB(`db_${selectedWorkspace}_docs`);

    console.log('Backend: Valor de initialPath recibido:', initialPath);
    console.log('Backend: Valor de destinationPath recibido:', destinationPath);

    // Buscar todos los documentos cuyo path comienza con initialPath
    const docsToMove = await db.find({
      selector: {
        path: {
          $regex: `^${initialPath}.*`
        },
        type: "pdf",
      },
    });

    console.log('Backend: Documentos encontrados para mover:', docsToMove.docs.length);

    if (docsToMove.docs.length === 0) {
      return res.status(404).json({ message: "No se encontraron archivos para mover en esta ruta." });
    }

    const bulkUpdateDocs = [];

    for (const fileDoc of docsToMove.docs) {
      const originalPath = fileDoc.path;
      
      // Extraer el nombre de la carpeta que se está moviendo de initialPath
      const folderName = initialPath.split('/').filter(Boolean).pop();
      console.log('esto es folderName',folderName)
      // Construir la nueva ruta
      let newPath;
      console.log('esto es originalPath.startsWith(initialPath)',originalPath.startsWith(initialPath))
      if (originalPath.startsWith(initialPath)) {
       
        // Obtener la parte de la ruta que va después de initialPath
        const remainingPath = originalPath.substring(initialPath.length);
        console.log('esto es remainingPath',remainingPath)
        // Concatenar la destinationPath, el nombre de la carpeta movida y la parte restante
        newPath = destinationPath + folderName + '/' + remainingPath;
        console.log('esto es newPath',newPath)
      } else {
        // Esto no debería ocurrir si la consulta $regex funciona correctamente, 
        // pero es una salvaguarda. Si ocurre, la ruta no se modifica.
        console.warn(`Original path does not start with initialPath: ${originalPath} vs ${initialPath}`);
        newPath = originalPath;
        console.log('esto es newPath en else ',newPath)
      }

      bulkUpdateDocs.push({
        ...fileDoc,
        _id: fileDoc._id,
        _rev: fileDoc._rev,
        path: newPath,
      });
    }

    // Realizar la actualización masiva
    await db.bulk({ docs: bulkUpdateDocs });

    res.status(200).json({ message: "Archivos movidos correctamente" });
  } catch (err) {
    console.error("Error al mover archivos:", err);
    res.status(500).json({ message: "Error al mover los archivos", error: err.message });
  }
};

const deleteManyFilePDFController = async (req, res) => {
  try {
    const { currentPath } = req.params;
    const { user } = req;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    
    const db = await connectDB(`db_${selectedWorkspace}_docs`);


    const deleteFileDocument = async (db, fileDoc) => {
      const latestDoc = await db.get(fileDoc._id);

      if (latestDoc._attachments && latestDoc._attachments[fileDoc.filename]) {
        await db.attachment.destroy(fileDoc._id, fileDoc.filename, {
          rev: latestDoc._rev,
        });
        const updatedDoc = await db.get(fileDoc._id);
        const deleteResponse = await db.destroy(fileDoc._id, updatedDoc._rev);
        if (!deleteResponse.ok) {
          throw new Error("Error al eliminar el archivo adjunto y el documento.");
        }
      } else {
        const deleteResponse = await db.destroy(fileDoc._id, latestDoc._rev);
        if (!deleteResponse.ok) {
          throw new Error("Error al eliminar el documento.");
        }
      }
    };

    const docsToDelete = await db.find({
      selector: {
        path: {
          $regex: `^${currentPath}.*`
        },
        type: "pdf",
      },
    });

    if (docsToDelete.docs.length === 0) {
      return res.status(404).json({ message: "No se encontraron archivos para eliminar en esta ruta." });
    }

    for (const fileDoc of docsToDelete.docs) {
      await deleteFileDocument(db, fileDoc);
    }

    res.status(200).json({ message: "Archivos eliminados correctamente" });
  } catch (err) {
    console.error("Error al eliminar archivos:", err);
    res.status(500).json({ message: "Error al eliminar los archivos" });
  }
};

const sendEmailUser = async (req, res) => {
  try {
    const { senderEmail, appPassword, recipientEmail, subject, htmlContent } =
      req.body;
    const file = req.file;
    if (
      !senderEmail ||
      !appPassword ||
      !recipientEmail ||
      !subject ||
      !htmlContent
    ) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
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
        filename: file.originalname || "adjunto.pdf",
        content: file.buffer,
        contentType: file.mimetype,
      });
    }

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject,
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Correo enviado con éxito",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error enviando correo:", error);
    return res.status(500).json({ error: "Error al enviar el correo" });
  }
};

const createVariable = async (req, res) => {
  try {
    const { variableData } = req.body;

    const user = req.user;

    // console.log('variableData', variableData.variables.length)
    // console.log('variableData', variableData?.assetVariablesDefault?.length)
    // console.log('user', user)


    if (!variableData?.title || !variableData?.category) {
      return res.status(400).json({ error: "El título y el tipo son obligatorios." });
    }
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbVariables = await connectDB(`db_${selectedWorkspace}_variables`);

    // console.log('entra en el createVariable')
    // console.log('variableData', variableData)


    const existing = await dbVariables.find({
      selector: {
        title: variableData.title,
        category: variableData.category,
        ...(variableData.email && { email: variableData.email }),
        userId: user._id,
      },
      limit: 1,
    });

    // console.log('existing', existing)
    let result;

    if (existing.docs.length > 0) {

      const existingDoc = existing.docs[0];

      const updatedVariable = {
        ...existingDoc,
        ...variableData,
      };

      result = await dbVariables.insert(updatedVariable);

      return res.status(200).json({ message: "Variable actualizada exitosamente", data: result });
    } else {

      const newVariable = {
        _id: uuidv4(),
        ...variableData,
        userId: user._id,
      };
      result = await dbVariables.insert(newVariable);

      return res.status(201).json({ message: "Variable creada exitosamente", data: result });
    }

  } catch (error) {
    console.error("Error en createVariable:");
    return res.status(500).json({ error: "Error al crear o actualizar la variable" });
  }
};

const getVariablesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { search = '' } = req.body;
    const user = req.user;

    if (!type) {
      return res.status(400).json({ error: "El tipo es obligatorio." });
    }

    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbVariables = await connectDB(`db_${selectedWorkspace}_variables`);

    const selector = { category: type };

    if (search && typeof search === 'string' && search.trim() !== "" && search !== 'undefined') {
      const searchTerm = search.trim().toLowerCase();

      selector["$or"] = [
        { title: { $regex: searchTerm } },
        { description: { $regex: searchTerm } },
        { type: { $regex: searchTerm } }
      ];
    }

    const response = await dbVariables.find({
      selector
    });

    return res.status(200).json({
      message: "Variables obtenidas exitosamente",
      data: response.docs,
    });
  } catch (error) {
    console.error("Error en getVariablesByType:", error);
    return res.status(500).json({ error: "Error al obtener variables" });
  }
};

const updateVariableSelected = async (req, res) => {
  try {
    const { variableId } = req.params;
    const { selected } = req.body;
    const user = req.user;

    if (typeof selected !== "boolean") {
      return res
        .status(400)
        .json({ error: "El campo 'selected' debe ser un booleano." });
    }

    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbVariables = await connectDB(`db_${selectedWorkspace}_variables`);


    const existingVariable = await dbVariables.get(variableId);
    if (!existingVariable) {
      return res.status(404).json({ error: "Variable no encontrada." });
    }


    existingVariable.selected = selected;


    const response = await dbVariables.insert(existingVariable);

    return res
      .status(200)
      .json({ message: "Variable actualizada exitosamente", data: response });
  } catch (error) {
    console.error("Error en updateVariableSelected:", error);
    return res.status(500).json({ error: "Error al actualizar la variable" });
  }
};

const deleteVariable = async (req, res) => {
  try {
    const { variableId } = req.params;
    const user = req.user;

    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbVariables = await connectDB(`db_${selectedWorkspace}_variables`);


    const existingVariable = await dbVariables.get(variableId);
    if (!existingVariable) {
      return res.status(404).json({ error: "Variable no encontrada." });
    }


    await dbVariables.destroy(variableId, existingVariable._rev);

    return res
      .status(200)
      .json({ message: "Variable eliminada exitosamente." });
  } catch (error) {
    console.error("Error en deleteVariable:", error);
    return res.status(500).json({ error: "Error al eliminar la variable." });
  }
};

const createRandomUser = async (req, res) => {
  try {
    const dbAccounts = await connectDB("db_accounts");

    const { count: _count } = req.body;

    const TOTAL_USERS = 10;
    const count = _count * 10;

    const distributions = {
      high: { percentage: 0.2, multiplier: 1.5 },
      medium: { percentage: 0.5, multiplier: 1.0 },
      low: { percentage: 0.3, multiplier: 0.5 },
    };


    const baseAverage = count / TOTAL_USERS;


    let users = Array.from({ length: TOTAL_USERS }, (_, index) => {

      let franja;
      if (index < TOTAL_USERS * distributions.high.percentage) franja = "high";
      else if (
        index <
        TOTAL_USERS *
        (distributions.high.percentage + distributions.medium.percentage)
      )
        franja = "medium";
      else franja = "low";


      const variation = 0.8 + Math.random() * 0.4;
      const value = Math.round(
        baseAverage * distributions[franja].multiplier * variation
      );

      const id = uuidv4();
      const email = `user${index + 1}@example.com`;
      const docId = `account_${email}_${id}`;

      const hashedPassword = Buffer.from("1234").toString("base64");

      return {
        _id: docId,
        email: email,
        nombre: `User ${index + 1}`,
        password: hashedPassword,
        role: "random",
        tokenTotal: value,
        tokenMonth: value,

      };
    });


    const currentSum = users.reduce((sum, user) => sum + user.tokenTotal, 0);
    const adjustment = count - currentSum;
    const adjustmentPerUser = Math.round(adjustment / users.length);
    users = users.map((user) => ({
      ...user,
      tokenTotal: user.tokenTotal + adjustmentPerUser,
      tokenMonth: Math.round((user.tokenTotal + adjustmentPerUser) * 0.1),
    }));

    const results = await Promise.all(
      users.map((user) => dbAccounts.insert(user))
    );

    res.json({
      success: true,
      message: `Created ${TOTAL_USERS} users with total tokens: ${count}`,
      distribution: users.map((u) => ({ id: u._id, tokens: u.tokenTotal })),
      totalSum: users.reduce((sum, user) => sum + user.tokenTotal, 0),
    });
  } catch (err) {
    console.error("Error creating random users:", err);
    res.status(500).json({
      success: false,
      message: "Error creating random users",
      error: err.message,
    });
  }
};

const deleteRandomUser = async (req, res) => {
  try {
    const dbAccounts = await connectDB("db_accounts");

    const accounts = await dbAccounts.find({
      selector: {
        role: "random",
      },
      limit: 100000,
    });

    const contactsToDelete = accounts.docs.map((acc) => {
      return { _id: acc._id, _rev: acc._rev, _deleted: true };
    });

    const response = await dbAccounts.bulk({ docs: contactsToDelete });
    return res
      .status(200)
      .json({ message: "Cuentas eliminadass correctamente", data: response });
  } catch (err) {
    console.error("Error getting user document:", err);
    return res.status(404).send("User document not found");
  }
};

const deleteBillingDetailController = async (req, res) => {
  try {
    const { email, billingDetailId } = req.params;
    const db = await connectDB("db_accounts");


    const accountResult = await db.find({
      selector: {
        email: email,
      },
    });

    if (accountResult.docs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cuenta no encontrada",
      });
    }

    const account = accountResult.docs[0];


    if (!account.billingDetails || !Array.isArray(account.billingDetails)) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron detalles de facturación",
      });
    }


    const updatedBillingDetails = account.billingDetails.filter(
      (detail) => detail._id !== billingDetailId
    );


    if (updatedBillingDetails.length === account.billingDetails.length) {
      return res.status(404).json({
        success: false,
        message: "Detalle de facturación no encontrado",
      });
    }


    const updatedAccount = {
      ...account,
      billingDetails: updatedBillingDetails,
      _rev: account._rev,
    };

    await db.insert(updatedAccount);

    return res.status(200).json({
      success: true,
      message: "Detalle de facturación eliminado correctamente",
      billingDetails: updatedBillingDetails,
    });
  } catch (error) {
    console.error("Error en deleteBillingDetailController:", error);
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el detalle de facturación",
    });
  }
};



const generateAndSendRecoveryCodeController = async (req, res) => {

  const { email, language = "Español", name } = req.body;


  const db = await connectDB(`db_emailmanager_recovery_codes`);

  try {
    const recoveryCode = String(Math.floor(100000 + Math.random() * 900000));

    const expirationTime = Date.now() + 5 * 60 * 1000;
    const recoveryCodeId = uuidv4();
    const docId = `recovery_${email}_${recoveryCodeId}`;

    const recoveryCodeDocument = {
      _id: docId,
      email,
      recoveryCode,
      expirationTime,
      createdAt: new Date().toISOString(),
    };

    await db.insert(recoveryCodeDocument);

    await sendRecoveryCode(email, recoveryCode, language, name);

    res.json({
      success: true,
      message: "Recovery code generated and sent successfully.",
    });

  } catch (error) {
    console.error("Error generating or sending recovery code:", error);
    res.status(500).json({
      success: false,
      message: "Could not generate or send the recovery code.",
    });
  }

};


const verifyRecoveryCodeController = async (req, res) => {
  const { email, recoveryCode } = req.body;



  const db = await connectDB(`db_emailmanager_recovery_codes`);

  try {
    const selector = {
      selector: {
        email,
        recoveryCode
      },
    };

    const result = await db.find(selector);
    if (!result.docs.length) {
      return res.status(404).json({
        success: false,
        message: "Código de recuperación no encontrado.",
      });
    }

    const codeDoc = result.docs[0];

    if (Date.now() > codeDoc.expirationTime) {

      return res.status(410).json({
        success: false,
        message: "El código de recuperación ha expirado.",
      });
    }

    return res.json({
      success: true,
      message: "Código de recuperación válido.",
    });

  } catch (error) {
    console.error("Error verificando el código de recuperación:", error);
    return res.status(500).json({
      success: false,
      message: "Error al verificar el código de recuperación.",
    });
  }
};





const seenNotification = async (req, res) => {
  try {
    const { user } = req;
    const { idNotification } = req.body;

    if (!idNotification) {
      return res.status(400).json({ success: false, message: "ID requerido" });
    }

    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);

    const notification = await dbNotifications.get(idNotification);
    if (!notification || !notification._id) {
      return res.status(404).json({ success: false, message: "No encontrada" });
    }

    notification.seen = true;

    const result = await dbNotifications.insert(notification);

    res.status(200).json({
      success: true,
      notification: {
        ...notification,
        _rev: result.rev,
      },
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message, code: "256" });
  }
};




const upgradeNote = async (req, res) => {
  try {
    const { lan, category, ...data } = req.body;

    const user = req.user;
    const token = user.tokenGPT;
    const id = user._id.split("_").pop();

    const db = await connectDB(`db_upgrade_notes`);

    const languages = [
      "español",
      "english",
      "português",
      "italiano",
      "français",
      "deutsch",
      "日本語",
      "普通话",
    ]


    let dataToInsert = {
      ...data,
      ...(category && { ref: category.ref }),
      owner: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    let categoryToInsert = {
      ...category,
      owner: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }


    let categoryOriginal = {};
    let dataOriginal = "";

    for (const language of languages) {

      if (language === lan) {
        dataOriginal = data.data;
        categoryOriginal = category;
      }

      dataToInsert.lan = language;
      dataToInsert.type = "data";
      dataToInsert.data = lanData;

      await db.insert(dataToInsert);

      const categoryToInsert = await db.find({
        selector: {
          ref: category.ref,
          type: "category",
          lan: language,
        },
      });

      if (categoryToInsert.docs.length === 0) {
        const jsonLanCategory = JSON.parse(lanCategory);
        await db.insert({
          ref: category.ref,
          type: "category",
          lan: language,
          name: jsonLanCategory.name,
          description: jsonLanCategory.description,
        });
      }

    }


    dataToInsert.lan = lan;
    dataToInsert.data = dataOriginal;

    categoryToInsert.lan = lan;
    categoryToInsert.name = categoryOriginal.name;
    categoryToInsert.description = categoryOriginal.description;

    return res.status(200).json({
      success: true,
      message: "Note added successfully",
      category: categoryToInsert,
      data: dataToInsert,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      code: "256"
    });
  }
}


const getUpgradeNotes = async (req, res) => {
  try {
    const db = await connectDB(`db_upgrade_notes`);

    const { lan, category, search } = req.query;

    let selector = {
      lan: lan,
      type: {
        $ne: "category"
      },
    }
    if (category) {
      selector.$or = [{ ref: category }, { _id: category }];
    }

    if (search) {
      selector.$or = [
        { title: { $regex: `(?i)${search}` } },
        { data: { $regex: `(?i)${search}` } },
        { ref: { $regex: `(?i)${search}` } }
      ];
    }

    const responseData = await db.find({
      selector: selector,
      limit: 100000,
    });


    const responseCategory = await db.find({
      selector: {
        lan: lan,
        type: "category",
      },
      limit: 100000,
    });


    return res.status(200).json({
      success: true,
      notes: responseData.docs,
      categories: responseCategory.docs,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      code: "256"
    });
  }
}


const deleteUpgradeNote = async (req, res) => {
  try {
    const { id, lan = null } = req.body;

    const db = await connectDB(`db_upgrade_notes`);

    if (id === 'all') {
      const list = await db.find({
        selector: {
        },
        limit: 100000,
      });

      for (const doc of list.docs) {
        await db.destroy(doc._id, doc._rev);
      }

      return res.status(200).json({
        success: true,
        data: 'all',
        message: "All notes deleted successfully",
      });
    } else {

      const doc = await db.find({
        selector: {
          $or: [
            { ref: id },
            { _id: id }
          ],
          type: { $ne: "category" }
        },
      })
      if (!doc.docs.length) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      const response = await db.destroy(doc.docs[0]._id, doc.docs[0]._rev);

      return res.status(200).json({
        success: true,
        message: "Note deleted successfully",
        data: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      code: "256"
    });
  }
}

const deleteCategoryNote = async (req, res) => {
  try {
    const { id, lan } = req.body;

    const db = await connectDB(`db_upgrade_notes`);

    const result = await db.find({
      selector: {
        $or: [
          { ref: id },
          { _id: id }
        ],
        lan: lan,
        type: "category",
      },
    })

    if (result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    } else {
      const response = await db.destroy(result.docs[0]._id, result.docs[0]._rev);

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: response,
      });
    }


  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      code: "256"
    });
  }
}


const getAllInvoices = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Usuario no autenticado correctamente" });
    }

    const id = req.user._id.split("_").pop();
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_invoice`);

    const response = await db.find({
      selector: {},
    });

    const invoices = response.docs.filter(doc => !doc._deleted);

    return res.status(200).json({ invoices });

  } catch (error) {
    console.error('Error al obtener invoices:', error.message, error.stack);
    return res.status(500).json({
      error: 'Error al obtener invoices',
      details: error.message || error
    });
  }
};

const getAllInvoicesById = async (req, res) => {
  try {
    const { id } = req.params;
    const idFormated = id.split("_").pop();
    if (!idFormated) {
      return res.status(400).json({ error: "ID de usuario no proporcionado en los parámetros" });
    }

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    
    const db = await connectDB(`db_${selectedWorkspace}_invoice`);

    const response = await db.find({
      selector: {},
    });

    const invoices = response.docs.filter(doc => !doc._deleted);

    return res.status(200).json({ invoices });

  } catch (error) {
    console.error('Error al obtener invoices por ID:', error.message, error.stack);
    return res.status(500).json({
      error: 'Error al obtener invoices',
      details: error.message || error
    });
  }
};


const getInvoicePdf = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const idFormated = req.user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_invoice`;
    const db = await connectDB(dbName);

    let invoice;
    try {
      invoice = await db.get(invoiceId, { attachments: true });
    } catch (err) {
      if (err.statusCode === 404) {
        return res.status(404).json({
          message: "La factura no existe en la base de datos",
          error: err.reason || "Factura no encontrada"
        });
      }

      throw err;
    }

    if (!invoice._attachments || !invoice._attachments["invoice.pdf"]) {
      return res.status(404).json({ message: "El PDF no está adjunto a esta factura." });
    }

    const attachment = invoice._attachments["invoice.pdf"];

    if (!attachment.data) {
      return res.status(404).json({ message: "Adjunto no encontrado o sin datos." });
    }

    const base64 = `data:${attachment.content_type};base64,${attachment.data}`;

    return res.status(200).json({
      filename: "invoice.pdf",
      pdfBase64: base64,
    });

  } catch (err) {
    console.error("Error al obtener la factura:", err);
    return res.status(500).json({
      message: "Error interno al obtener el archivo",
      error: err.message || "Error desconocido"
    });
  }
};


const createTableController = async (req, res) => {

  console.log('entra en el controlador de createTableController')
  try {
    console.log("req.body", req.body);
    const { headers, name, type, color, selectedTags, userEmail, activateAlerts, accessPermitType, selectedColumnOption, tags } = req.body;
    const idFormated = req.user._id.split("_").pop();
    if (!Array.isArray(headers) || headers.length === 0) {
      return res.status(400).json({ error: 'El cuerpo debe ser un arreglo de objetos con label y key' });
    }

    // console.log('headers', headers)

    const isValid = headers.every(item =>
      typeof item === 'object' &&
      typeof item.key === 'string'
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Cada elemento debe tener un label y un key como strings' });
    }

    // console.log("req.user", req.user);
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
    // console.log("selectedWorkspace", selectedWorkspace);


    const db = await connectDB(`db_${selectedWorkspace}_table`);
    // const db = await connectDB(`db_${idFormated}_table`);


    const newTable = {
      _id: uuidv4(),
      createdAt: new Date().toISOString(),
      name,
      headers: headers,
      type: type || 'contacts',
      color,
      selectedTags,
      userEmail,
      activateAlerts,
      accessPermitType,
      selectedColumnOption,
      tags

    };

    // console.log("newTable", newTable);

    await db.insert(newTable);

    const dbVariables = await connectDB(`db_${selectedWorkspace}_variables`);

    const variables = await dbVariables.find({
      selector: {
        category: "tableView",
        title: "tableView",
      },
    });

    // console.log("variables", variables);


    const assetVariables = variables?.docs[0]?.assetVariablesDefault || [];
    // const contactVariables = variables.docs[0].contactVariables;

    const newHeaders = assetVariables.filter(variable => variable.hasOwnProperty("hidden") && variable.hidden == false).map(variable => {
      return {
        key: variable.name,
        label: variable.name,
        type: "",
        title: variable.name,
        selected: false,
      }
    });

    console.log("newHeaders", newHeaders);

    const dbTables = `db_${selectedWorkspace}_table_${newTable._id}`;
    

    const dbTable = await connectDB(dbTables);

    await dbTable.insert({
      _id: uuidv4(),
      createdAt: new Date().toISOString(),
      name: newTable.name,
      headers: [...newHeaders, ...newTable.headers],
      type: newTable.type,
      color: newTable.color,
      selectedTags: newTable.selectedTags,
      userEmail: newTable.userEmail,
      activateAlerts: newTable.activateAlerts,
      accessPermitType: newTable.accessPermitType,
      selectedColumnOption: newTable.selectedColumnOption,
      tags: newTable.tags,
      main:true,
      variables: type == "asset" ? assetVariables : assetVariables,
      tableId: newTable._id
    });

    return res.status(201).json({ message: 'Tabla creada con éxito', tableId: newTable._id });
  } catch (error) {
    console.error('Error creando tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const reorderedTableController = async (req, res) => {
  try {
    const { table } = req.body;
    const idFormated = req.user._id.split("_").pop();
    if (!Array.isArray(table) || table.length === 0) {
      return res.status(400).json({ error: 'El cuerpo debe ser un arreglo de objetos' });
    }
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table`);

    const ids = table.map(item => item._id);
    const existingDocsResponse = await db.fetch({ keys: ids });

    const reorderedDocs = ids.map((id, index) => {
      const doc = existingDocsResponse.rows.find(row => row.id === id)?.doc;
      if (!doc) return null;
      return {
        ...doc,
        order: index
      };
    }).filter(Boolean);

    await db.bulk({ docs: reorderedDocs });


    return res.status(201).json({ message: 'Tabla reordenada con exito' });

  } catch (error) {
    console.error('Error creando tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateTableNameController = async (req, res) => {
  try {
    const { user } = req
    const { tableId, newName } = req.body;
    const idFormated = req.user._id.split("_").pop();

    if (!tableId || typeof newName !== 'string' || newName.trim() === "") {
      return res.status(400).json({ error: 'Se requiere un tableId y un nuevo nombre válido' });
    }
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'


    const db = await connectDB(`db_${selectedWorkspace}_table`);

    const existingDoc = await db.get(tableId);

    if (!existingDoc) {
      return res.status(404).json({ error: 'Tabla no encontrada' });
    }

    existingDoc.name = newName.trim();

    await db.insert(existingDoc);

    return res.status(200).json({ message: 'Nombre de la tabla actualizado con éxito' });
  } catch (error) {
    console.error('Error actualizando nombre de tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteRowTableController = async (req, res) => {
  try {
    const { tableId, rowId } = req.body;
    const idFormated = req.user._id.split("_").pop();

    if (!tableId || !rowId) {
      return res.status(400).json({ error: 'Se requiere un tableId y un rowId válido' });
    }


    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table_${tableId}`);


    const doc = await db.get(rowId);


    if (!doc) {
      return res.status(404).json({ error: 'Tabla no encontrada' });
    }

    await db.destroy(doc._id, doc._rev);

    return res.status(200).json({ message: 'Nombre de la tabla actualizado con éxito' });
  } catch (error) {
    console.error('Error actualizando nombre de tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const getTablesController = async (req, res) => {
  try {
    const { search } = req.query || {};
    const idFormated = req.user._id.split("_").pop();

    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table`);

    let selector = {};  
    if (search) {
      selector.name = { $regex: `(?i)${search}` };
    }
    const result = await db.find({
      selector: selector
    });

    return res.status(200).json({
      tables: result.docs,
      search: search
    });
  } catch (error) {
    console.error('Error obteniendo tablas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getTableByIdController = async (req, res) => {
  try {
    const { tableId } = req.params;
    const idFormated = req.user._id.split("_").pop();

    if (!tableId) {
      return res.status(400).json({ error: "Se requiere el ID de la tabla" });
    }
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table`);

    let table;
    try {
      table = await db.get(tableId);
    } catch (err) {
      if (err.statusCode === 404) {
        return res.status(404).json({ error: "Tabla no encontrada" });
      }
      throw err;
    }

    return res.status(200).json({ table });
  } catch (error) {
    console.error("Error obteniendo tabla:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


const createTableDataController = async (req, res) => {
  console.log('entra en el controlador de createTableDataController')
  try {
    const { tableId, headers, data, type } = req.body;
    const idFormated = req.user._id.split('_').pop();

    if (
      // !Array.isArray(headers) || headers.length === 0 ||
      !tableId) {
      return res.status(400).json({ error: 'Faltan datos requeridos: tableId o headers' });
    }

    let newData

    if(Array.isArray(headers) && headers.length > 0){

    const emptyData = headers.reduce((acc, header) => {
      if (header.key) {
        acc[header.key] = '';
      }
      return acc;
    }, {});


    newData = {
      _id: uuidv4(),
      tableId,
      createdAt: new Date().toISOString(),
      ...emptyData,
      ...data,
      type: type || 'blank'
    };
  } else {
    newData = {
      _id: uuidv4(),
      tableId,
      createdAt: new Date().toISOString(),
      ...data,
      type: type || 'blank'
    };
  }

    const selectedWorkspace = req?.user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_table_${tableId}`;


    const db = await connectDB(dbName);

    await db.insert(newData);

    return res.status(201).json({ message: 'Fila creada exitosamente', data: newData });

  } catch (error) {
    console.error('Error al crear fila vacía de tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateTableDataController = async (req, res) => {
  try {
    const { tableId, data } = req.body;
    const idFormated = req.user._id.split('_').pop();
    // console.log('data', data)
    console.log('tableId', tableId)
    if (!tableId) {
      return res.status(400).json({ error: 'Faltan datos requeridos: tableId' });
    }

    const selectedWorkspace = req?.user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_table_${tableId}`;



    const db = await connectDB(dbName);

    const doc = await db.get(data._id);


    // Preservar el _rev del documento original y combinar con los nuevos datos
    const { _rev, ...dataWithoutRev } = data; // Remover _rev de data si existe
    const updatedDoc = { ...doc, ...dataWithoutRev };
    

    console.log('updatedDoc', updatedDoc.type) 
    await db.insert(updatedDoc);

    return res.status(201).json({ message: 'Fila actualizada exitosamente', data: updatedDoc });

  } catch (error) {
    console.error('Error al actualizar fila de tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const getTableData = async (req, res) => {
  console.log('entra en el controlador de getTableData')
  try {
    const { tableId } = req.params;
    const idFormated = req.user._id.split("_").pop();

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table_${tableId}`);
    const result = await db.find({
      selector: {},
    });

    return res.status(200).json({ rows: result.docs });
  } catch (err) {
    console.error("Error al obtener datos de la tabla:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getTableDataById = async (req, res) => {
  console.log('entra en el controlador de getTableDataById')
  try {
    const { tableId, rowId } = req.params;
    const idFormated = req.user._id.split("_").pop();
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table_${tableId}`);
    const result = await db.find({
      selector: { _id: rowId },
    });

    return res.status(200).json({ rows: result.docs });
  } catch (err) {
    console.error("Error al obtener datos de la tabla:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};



const getTableDataFiltered = async (req, res) => {
  console.log('entra en el controlador de getTableDataFiltered')
  try {
    const { limit, skip, search } = req.query;
    const { sortAlpha, statusFilter, sortDate, dateOrder, tableId, sortQuantity } = req.body;
    const idFormated = req.user._id.split("_").pop();

    console.log('tableId', tableId)

    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table_${tableId}`);

    // const TableDb = await connectDB(`db_${selectedWorkspace}_table`);
    // const table = await TableDb.get(tableId);



    let selector = {};

    // selector.accessPermitType = table.accessPermitType;

    let limitDate = null;
    if (sortDate) {
      limitDate = new Date();
      const now = new Date();
      switch (sortDate) {
        case "1month": limitDate.setMonth(now.getMonth() - 1); break;
        case "3month": limitDate.setMonth(now.getMonth() - 3); break;
        case "6month": limitDate.setMonth(now.getMonth() - 6); break;
        case "1year": limitDate.setFullYear(now.getFullYear() - 1); break;
        default: limitDate = null;
      }
    }

    const orConditions = [];

    if (limitDate) {
      orConditions.push(
        { createdAt: { "$gt": limitDate.toISOString() } },
        { updatedAt: { "$gt": limitDate.toISOString() } }
      );
    }

    if (search) {
      orConditions.push(
        { name: { $regex: `(?i)${search}` } },
        { description: { $regex: `(?i)${search}` } },
        { contactName: { $regex: `(?i)${search}` } },
        { documentTitle: { $regex: `(?i)${search}` } }
      );
    }

    if (orConditions.length > 0) {
      selector["$and"] = [
        {
          "$or": orConditions.filter(cond => "createdAt" in cond || "updatedAt" in cond)
        },
        {
          "$or": orConditions.filter(cond => "name" in cond || "description" in cond || "contactName" in cond || "documentTitle" in cond)
        }
      ];
    }

    if (statusFilter && statusFilter !== "Todos") {
      selector.status = statusFilter;
    }

    let assets
    let totalAssets
    if (search || sortDate) {
      totalAssets = await db.find({
        selector,
        limit: 999999,
      });

      assets = await db.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

    }
    else if (selector.status) {
      totalAssets = await db.find({
        selector,
        limit: 999999,
      });

      assets = await db.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
    }
    else {
      assets = await db.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
    }



    let filteredAssets = assets?.docs;

    if (sortAlpha) {

      filteredAssets.sort((a, b) => {
        const fieldA = a.name?.toLowerCase() || "";
        const fieldB = b.name?.toLowerCase() || "";

        if (sortAlpha === "A-Z") {
          return fieldA.localeCompare(fieldB);
        } else if (sortAlpha === "Z-A") {
          return fieldB.localeCompare(fieldA);
        }
        return 0;
      });

      filteredAssets.sort((a, b) => {
        const fieldA = a.contactName?.toLowerCase() || "";
        const fieldB = b.contactName?.toLowerCase() || "";

        if (sortAlpha === "A-Z") {
          return fieldA.localeCompare(fieldB);
        } else if (sortAlpha === "Z-A") {
          return fieldB.localeCompare(fieldA);
        }
        return 0;
      });

      filteredAssets.sort((a, b) => {
        const fieldA = a.documentTitle?.toLowerCase() || "";
        const fieldB = b.documentTitle?.toLowerCase() || "";

        if (sortAlpha === "A-Z") {
          return fieldA.localeCompare(fieldB);
        } else if (sortAlpha === "Z-A") {
          return fieldB.localeCompare(fieldA);
        }
        return 0;
      });
    }

    if (dateOrder) {
      filteredAssets.sort((a, b) => {
        const fieldA = a.createdAt?.toLowerCase() || "";
        const fieldB = b.createdAt?.toLowerCase() || "";

        if (dateOrder === "falling") {
          return fieldA.localeCompare(fieldB);
        } else if (dateOrder === "ascendant") {
          return fieldB.localeCompare(fieldA);
        }
        return 0;
      });
    }

    if (sortQuantity) {
      filteredAssets.sort((a, b) => {
        const valueA = a.quantity || 0;
        const valueB = b.quantity || 0;

        if (sortQuantity === "Menor a Mayor") {
          return valueA - valueB;
        } else if (sortQuantity === "Mayor a Menos") {
          return valueB - valueA;
        }
        return 0;
      });
    }


    const total = await db.find({
      selector: {},
      fields: ['_id'],
      limit: 999999
    });


    let localSkip = parseInt(skip)
    let localTotal = total.docs.length

    const hasSearchFilter = Boolean(search)
    const hasDateFilter = Boolean(sortDate)
    const hasStatusFilter = typeof statusFilter !== 'undefined' && statusFilter !== null && statusFilter !== 'Todos'

    if (hasSearchFilter || hasDateFilter) {
      localSkip = 1
      localTotal = totalAssets?.docs?.length || 0
    } else if (hasStatusFilter) {
      localSkip = 1
      localTotal = totalAssets?.docs?.length || 0
    }


    return res.status(200).send({
      success: true,
      row: filteredAssets,
      total: localTotal,
      limit: parseInt(limit),
      skip: parseInt(localSkip),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error on getAllAssets");
  }

};

const createTableWithInitialDataController = async (req, res) => {
  console.log('entra en el controlador de createTableWithInitialDataController')
  try {
    const { headers, name, type, initialData } = req.body;
    const idFormated = req.user._id.split("_").pop();

    if (!Array.isArray(headers) || headers.length === 0) {
      return res.status(400).json({ error: 'El cuerpo debe ser un arreglo de objetos con label y key' });
    }

    const isValidHeader = headers.every(
      (item) =>
        typeof item === 'object' &&
        typeof item.label === 'string' &&
        typeof item.key === 'string'
    );

    if (!isValidHeader) {
      return res.status(400).json({ error: 'Cada elemento debe tener un label y un key como strings' });
    }

    if (initialData && !Array.isArray(initialData)) {
      return res.status(400).json({ error: 'initialData debe ser un arreglo de objetos' });
    }


    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const tableDbName = `db_${selectedWorkspace}_table`;
    const tableDb = await connectDB(tableDbName);

    const newTable = {
      _id: uuidv4(),
      createdAt: new Date().toISOString(),
      name,
      headers,
      type: type || 'contacts',
    };

    await tableDb.insert(newTable);


    const dataDbName = `db_${selectedWorkspace}_table_${newTable._id}`;

    const dataDb = await connectDB(dataDbName);

    if (!initialData || initialData.length === 0) {
      return res.status(201).json({
        message: 'Tabla creada exitosamente, sin datos iniciales',
        tableId: newTable._id,
      });
    }

    const inserts = initialData.map(async (dataItem) => {
      const emptyData = headers.reduce((acc, header) => {
        if (header.key) {
          acc[header.key] = '';
        }
        return acc;
      }, {});

      const rowData = {
        _id: uuidv4(),
        tableId: newTable._id,
        createdAt: new Date().toISOString(),
        ...emptyData,
        ...dataItem,
        type: dataItem.type || 'blank',
      };

      await dataDb.insert(rowData);
      return rowData;
    });

    const insertedRows = await Promise.all(inserts);

    return res.status(201).json({
      message: 'Tabla y datos iniciales creados exitosamente',
      tableId: newTable._id,
      insertedRows,
    });

  } catch (error) {
    console.error('Error creando tabla con datos iniciales:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const updateTableTypeController = async (req, res) => {
  try {
    const { user } = req
    const { tableId, type, newHeaders, color, accessPermitType, tags, selectedTags, name, category } = req.body;
    const idFormated = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_table`);

    const table = await db.get(tableId);
    if (type) table.type = type;

    if (Array.isArray(newHeaders)) {
      if (newHeaders.length > 0) table.headers = newHeaders;
    }

    if (color) table.color = color;

    if (accessPermitType) table.accessPermitType = accessPermitType

    if (tags) table.tags = tags;
    if (selectedTags) table.selectedTags = selectedTags;

    if (name) table.name = name;
    if (category) table.category = category;

    const result = await db.insert(table);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Error updating table type:", error);
    return res.status(500).json({ success: false, message: "Error actualizando tipo de tabla." });
  }
};

const getTablesWithCountsController = async (req, res) => {
  try {
    const idFormated = req.user._id.split("_").pop();
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const dbTables = await connectDB(`db_${selectedWorkspace}_table`);

    const allTables = await dbTables.list({ include_docs: true });

    const results = await Promise.all(
      allTables.rows.map(async (row) => {
        const table = row.doc;

        let rowCount = 0;
        try {
          const dbTableData = await connectDB(`db_${selectedWorkspace}_table_${table._id}`);

          const info = await dbTableData.info();
          rowCount = info.doc_count;
        } catch (err) {
          console.warn(`No se pudo acceder a la base de datos de la tabla ${table._id}:`, err.message);
        }

        return {
          _id: table._id,
          name: table.name,
          type: table.type,
          color: table.color,
          rowCount: rowCount,
          order: table.order
        };
      })
    );

    return res.status(200).json({ success: true, tables: results });
  } catch (error) {
    console.error("Error al obtener las tablas con cantidad de filas:", error);
    return res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};


const refreshTableInfoController = async (req, res) => {
  try {
    const { tableId } = req.body;
    const idFormated = req.user._id.split("_").pop();

    if (!tableId) {
      return res.status(400).json({ error: "Se requiere el ID de la tabla" });
    }
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const dbTables = await connectDB(`db_${selectedWorkspace}_table`);

    const tableDoc = await dbTables.get(tableId);


    const dbTableData = await connectDB(`db_${selectedWorkspace}_table_${tableId}`);

    const info = await dbTableData.info();

    return res.status(200).json({
      success: true,
      table: {
        _id: tableDoc._id,
        name: tableDoc.name,
        type: tableDoc.type,
        rowCount: info.doc_count,
      },
    });
  } catch (error) {
    console.error("Error actualizando la tabla:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};


const deleteTableController = async (req, res) => {
  try {
    const { tableId } = req.body;
    const idFormated = req.user._id.split("_").pop();
    
    console.log('tableId', tableId)

    if (!tableId) {
      return res.status(400).json({ error: "Se requiere el ID de la tabla" });
    }


    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
    const db = await connectDB(`db_${selectedWorkspace}_table`);

    console.log('db', db)

    const tableDoc = await db.get(tableId);

    console.log('tableDoc', tableDoc)

    if (!tableDoc) {
      return res.status(404).json({ error: "Tabla no encontrada" });
    }

    await db.destroy(tableDoc._id, tableDoc._rev);

    const dbNameToDelete = `db_${selectedWorkspace}_table_${tableId}`;

    console.log('dbNameToDelete', dbNameToDelete)

    try {
      await nano.db.destroy(dbNameToDelete);
    } catch (err) {
      console.warn(`⚠️ No se pudo eliminar la base '${dbNameToDelete}':`, err.message);
      const tableDataDb = await connectDB(dbNameToDelete);
      const docs = await tableDataDb.list({ include_docs: true });
      const bulkDelete = docs.rows.map(row => ({
        _id: row.doc._id,
        _rev: row.doc._rev,
        _deleted: true
      }));

      if (bulkDelete.length > 0) {
        await tableDataDb.bulk({ docs: bulkDelete });
      }
    }

    return res.status(200).json({
      success: true,
      tableId: tableId,
      message: "Tabla eliminada correctamente"
    });
  } catch (error) {
    console.error("❌ Error al eliminar la tabla:", error.message);
    return res.status(500).json({ success: false, error: "Error al eliminar la tabla" });
  }
};

const deleteAllTablesAndTableDataController = async (req, res) => {
  const user = req.user;

  try {
    const id = user._id.split("_").pop();

    const deleteAllDocs = async (db) => {
      const { rows } = await db.list({ include_docs: true });
      if (!rows.length) return;

      await Promise.all(
        rows.map(({ doc }) => db.destroy(doc._id, doc._rev))
      );
    };

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbTable = await connectDB(`db_${selectedWorkspace}_table`);

    const { rows: tableRows } = await dbTable.list({ include_docs: true });

    if (tableRows.length > 0) {
      for (const { doc } of tableRows) {
        const tableId = doc._id;
        const dbTableData = await connectDB(`db_${selectedWorkspace}_table_${tableId}`);
        await deleteAllDocs(dbTableData);

      }
    }

    await deleteAllDocs(dbTable);

    res.status(200).json({
      success: true,
      message: "Todas las tablas y sus datos fueron eliminados correctamente.",
    });
  } catch (error) {
    console.error("Error en deleteAllTablesAndTableDataController:", error);
    res.status(500).json({
      success: false,
      message: "Error eliminando las tablas y sus datos.",
    });
  }
};

const exportTableController = async (req, res) => {
  const user = req.user;
  const { id } = req.body; // tableId

  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Se requiere el ID de la tabla" });
    }

    const selectedWorkspace = req?.user?.selectedWorkspace || 'defaultworkspace';

    const userId = user._id.split("_").pop();
    // Obtener metadatos de la tabla (nombre, etc.)
    const dbTables = await connectDB(`db_${selectedWorkspace}_table`);
    let tableMeta = null;
    try {
      tableMeta = await dbTables.get(id);
    } catch (e) {
      // Si no existe el doc de metadatos, seguimos sin nombre
    }

    // Conectar a la base de datos de datos/filas de la tabla
    const dbTableData = await connectDB(`db_${selectedWorkspace}_table_${id}`);

    // Total de documentos
    const info = await dbTableData.info();
    const totalCount = info.doc_count || 0;

    // Exportar con límite de 10.000
    const LIMIT = 10000;
    const result = await dbTableData.find({ selector: {}, limit: LIMIT });
    const docs = Array.isArray(result?.docs) ? result.docs : [];

    console.log('34mjjjn')
    // Preparar columnas a partir de headers definidos en la tabla
    const headerKeys = Array.isArray(tableMeta?.headers)
      ? tableMeta.headers.map(h => h?.key).filter(Boolean)
      : [];

    // Mapear filas solo con las columnas requeridas y sin campos internos
    const rowsForSheet = docs.map((doc) => {
      const row = {};
      if (headerKeys.length > 0) {
        headerKeys.forEach((key) => {
          row[key] = doc[key] ?? '';
        });
      } else {
        Object.entries(doc).forEach(([k, v]) => {
          if (!k.startsWith('_') && !['headers','type','selectedTags','accessPermitType','selectedColumnOption','tags','main','variables','tableId','createdAt','name'].includes(k)) {
            row[k] = v;
          }
        });
      }
      return row;
    });

    // Crear XLSX en base64
    const XLSX = require('xlsx');
    console.log('1234')
    const worksheet = XLSX.utils.json_to_sheet(rowsForSheet, { header: headerKeys.length > 0 ? headerKeys : undefined });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    
    const exportedCount = rowsForSheet.length;
    const hasAll = exportedCount >= totalCount;
    console.log('1111')
    
    const safeName = (tableMeta?.name || `tabla_${id}`)
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .replace(/\s+/g, '_');
    const fileName = `${safeName}.xlsx`;
    console.log('5555', fileName)

    return res.status(200).json({
      success: true,
      format: 'xlsx-base64',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      fileName,
      base64,
      exportedCount,
      totalCount,
      hasAll,
      limit: LIMIT,
    });
  } catch (error) {
    console.error("Error en exportTableController:", error);
    return res.status(500).json({
      success: false,
      message: "Error exportando la tabla.",
    });
  }
};

const getAccountLastPaymentController = async (req, res) => {
  try {
    const id = req.user._id.split("_").pop();
    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Falta el ID de la cuenta",
      });
    }

    const dbAccounts = await connectDB("db_accounts");

    const account = await dbAccounts.get(req.user._id);

    if (!account) {
      return res.status(404).send({
        success: false,
        message: "Cuenta no encontrada",
      });
    }

    return res.status(200).send({
      success: true,
      lastPayment: account.lastPayment || null,
    });

  } catch (error) {
    console.error("Error al obtener lastPayment:", error);
    return res.status(500).send({
      success: false,
      message: "Error al obtener el último pago",
    });
  }
};

const reorderParametersTable = (table, parametersTable) => {
  if (!table || !parametersTable) {
    return [];
  }

  const parametersMap = new Map();
  parametersTable.forEach(param => {
    parametersMap.set(param.name, param);
  });

  const reorderedTable = [];
  table.forEach(item => {
    if (parametersMap.has(item.label)) {
      reorderedTable.push(parametersMap.get(item.label));
    }
  });

  return reorderedTable;
};


const updateVariableTableDataController = async (req, res) => {
  console.log('entra en el updateVariableTableDataController')
  console.log('req.body', req.body)
  try {
    const { tableId, mainId, data } = req.body;
    const idFormated = req.user._id.split('_').pop();


    if (!tableId) {
      return res.status(400).json({ error: 'Faltan datos requeridos: tableId' });
    }

    const selectedWorkspace = req?.user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_table_${tableId}`;

    const db = await connectDB(dbName);
    const doc = await db.get(mainId);
    
    // // Preservar el _rev del documento original y combinar con los nuevos datos
    // const { _rev, ...dataWithoutRev } = data; // Remover _rev de data si existe
    // const updatedDoc = { ...doc, ...dataWithoutRev };
    
    // await db.insert(updatedDoc);
    // console.log('data', data)
    // console.log('doc', doc)

    if(data.hasOwnProperty("addParameter")){
      doc.variables.forEach(variable => {
        if(variable.id === data.addParameter.id){
          variable.hidden = false
        }      
      })

      // Reconstruir headers visibles
      let newHeaders = doc.variables.filter(variable => (variable.hasOwnProperty("hidden") && variable.hidden === false) || variable.id === data.addParameter.id)
      newHeaders = newHeaders.map(variable => ({
        key: variable.name,
        label: variable.name,
        selected: false,
        title: variable.name,
        type: "",
      }))
      doc.headers = newHeaders

      // Reordenar bloque por category manteniendo posición
      try {
        const targetVar = doc.variables.find(v => v && v.id === data.addParameter.id);
        const categoryCode = targetVar && targetVar.category;
        if (categoryCode) {
          let startIndex = doc.variables.findIndex(v => v && v.category === categoryCode);
          if (startIndex !== -1) {
            let endIndex = startIndex;
            while (
              endIndex + 1 < doc.variables.length &&
              doc.variables[endIndex + 1] &&
              doc.variables[endIndex + 1].category === categoryCode
            ) {
              endIndex++;
            }

            const group = doc.variables.slice(startIndex, endIndex + 1);
            const rankHidden = (v) => {
              if (Object.prototype.hasOwnProperty.call(v, 'hidden')) {
                return v.hidden === false ? 0 : 1;
              }
              return 2;
            };
            group.sort((a, b) => rankHidden(a) - rankHidden(b));

            doc.variables = [
              ...doc.variables.slice(0, startIndex),
              ...group,
              ...doc.variables.slice(endIndex + 1)
            ];
          }
        }
      } catch (err) {
        console.error('Error reordenando grupo por categoría (addParameter):', err);
      }

    }
    else if(data.hasOwnProperty("editParameter")){
      let newHeaders = [...doc.headers]
      const variableToEdit = doc.variables.find(variable => variable.id === data.editParameter.id)
      console.log('variableToEdit', variableToEdit)
      if(variableToEdit?.hasOwnProperty("category") && variableToEdit?.hidden === false){

       newHeaders = doc.headers.map(header =>{

        if(header.key == variableToEdit.name){
          return {
            ...header,
            label: data.editParameter.name,
            key: data.editParameter.name,
            title: data.editParameter.name,
          }
          }
          return header
        })
      }
      console.log('doc.variables', doc.variables)
      const newVariables = doc.variables.map(variable => {
        if(variable.id === data.editParameter.id){
          if(data.editParameter.hasOwnProperty("parameter")){
           return {...variable, ...data.editParameter.parameter}
          }else{
            return {...variable, name: data.editParameter.name}
          }
        }
        return variable
      })

      doc.variables = newVariables


      console.log('doc.variables', doc.variables)

      if(data.editParameter.hasOwnProperty("parameter")){
        console.log('entra en el if de parameter')
        console.log('data.editParameter.parameter', data.editParameter.parameter)
        console.log('data.editParameter.parameter.rowId', data.editParameter.parameter.rowId)
        console.log('data.editParameter.parameter.name', data.editParameter.parameter.name)
        const doc = await db.get(data.editParameter.parameter.rowId);
        doc[data.editParameter.parameter.name] = data.editParameter.parameter[data.editParameter.parameter.type]
        await db.insert(doc);
      }

      doc.headers = newHeaders
    }
    else if(data.hasOwnProperty("reorderParameters")){
      const proposed = Array.isArray(data.reorderParameters.newParameters) ? data.reorderParameters.newParameters : [];

      // Preparar estructuras auxiliares
      const codeToChildren = new Map();
      for (const item of proposed) {
        if (item && item.category) {
          const arr = codeToChildren.get(item.category) || [];
          arr.push(item);
          codeToChildren.set(item.category, arr);
        }
      }

      const rankHidden = (v) => {
        if (Object.prototype.hasOwnProperty.call(v, 'hidden')) {
          return v.hidden === false ? 0 : 1; // false primero, true después
        }
        return 2; // sin propiedad hidden al final
      };

      // Re-componer lista respetando:
      // - orden de aparición del padre (objeto con 'code') en 'proposed'
      // - hijos (category == code) ordenados por hidden
      // - orfanos (sin code ni category) en su lugar de primera aparición
      const recomposed = [];
      const visitedCodes = new Set();
      const visitedIds = new Set();

      const idToItem = new Map();
      for (const item of proposed) if (item && item.id) idToItem.set(item.id, item);

      for (const item of proposed) {
        if (!item) continue;
        if (Object.prototype.hasOwnProperty.call(item, 'code')) {
          const code = item.code;
          if (!visitedCodes.has(code)) {
            recomposed.push(item);
            visitedIds.add(item.id);
            visitedCodes.add(code);

            const children = (codeToChildren.get(code) || []).slice().sort((a, b) => rankHidden(a) - rankHidden(b));
            for (const child of children) {
              if (child && !visitedIds.has(child.id)) {
                recomposed.push(child);
                visitedIds.add(child.id);
              }
            }
          }
        } else if (!Object.prototype.hasOwnProperty.call(item, 'category')) {
          // Orfano
          if (!visitedIds.has(item.id)) {
            recomposed.push(item);
            visitedIds.add(item.id);
          }
        } else {
          // Es hijo, se añadirá cuando aparezca su padre. Si el padre no aparece, lo tratamos después.
        }
      }

      // Si quedan hijos sin padre visitado, agruparlos por category al final según prioridad
      for (const [code, children] of codeToChildren.entries()) {
        const anyChildNotVisited = children.some(ch => ch && !visitedIds.has(ch.id));
        if (anyChildNotVisited) {
          const sorted = children.slice().sort((a, b) => rankHidden(a) - rankHidden(b));
          for (const ch of sorted) {
            if (ch && !visitedIds.has(ch.id)) {
              recomposed.push(ch);
              visitedIds.add(ch.id);
            }
          }
        }
      }

      doc.variables = recomposed;

      // Reconstruir headers conforme al nuevo orden de variables
      const headerByKey = new Map(doc.headers.map(h => [h.key, h]));
      const newHeaders = [];
      for (const variable of doc.variables) {
        const h = headerByKey.get(variable.name);
        if (h) newHeaders.push(h);
      }
      doc.headers = newHeaders;
    }

    else if(data.hasOwnProperty("hidden")){
      doc.variables.forEach(variable => {
        if(variable.id === data.parameter.id){
          variable.hidden = data.hidden
        }      
      })
      // console.log('data.hidden', data.hidden)
      if(data.hidden){
        // console.log('doc.headers', doc.headers)
        const newHeaders = doc.headers.filter(header => header.key !== data.parameter.name)
        doc.headers = newHeaders
        // console.log('newHeaders dentro del if', newHeaders)
      } else {
        let newHeaders = doc.variables.filter(variable => (variable.hasOwnProperty("hidden") && variable.hidden === false) || variable.id === data.parameter.id)
          // console.log('newHeaders', newHeaders)
        newHeaders = newHeaders.map(variable => 
         {
            return {key: variable.name,
              label: variable.name,
              selected: false,
              title: variable.name,
              type: "",
            }

         })

        // const newHeaders = [ {label: data.parameter.name, key: data.parameter.name, type:"", title: data.parameter.name, selected: false}, ...newHeader]
        doc.headers = newHeaders
        // console.log('newHeaders dentro del else', newHeaders)
      }

      // Reordenar bloque con misma categoría manteniendo su posición original
      try {
        const targetVar = doc.variables.find(v => v && v.id === data.parameter.id);
        const categoryCode = targetVar && targetVar.category;
        if (categoryCode) {
          let startIndex = doc.variables.findIndex(v => v && v.category === categoryCode);
          if (startIndex !== -1) {
            let endIndex = startIndex;
            while (
              endIndex + 1 < doc.variables.length &&
              doc.variables[endIndex + 1] &&
              doc.variables[endIndex + 1].category === categoryCode
            ) {
              endIndex++;
            }

            const group = doc.variables.slice(startIndex, endIndex + 1);
            const rankHidden = (v) => {
              if (Object.prototype.hasOwnProperty.call(v, 'hidden')) {
                return v.hidden === false ? 0 : 1; // false primero, true después
              }
              return 2; // sin propiedad hidden al final
            };
            group.sort((a, b) => rankHidden(a) - rankHidden(b));

            doc.variables = [
              ...doc.variables.slice(0, startIndex),
              ...group,
              ...doc.variables.slice(endIndex + 1)
            ];
          }
        }
      } catch (err) {
        console.error('Error reordenando grupo por categoría (hidden):', err);
      }
    }

    // console.log('doc terminado', doc)

    await db.insert(doc);

    return res.status(201).json({ message: 'Fila actualizada exitosamente', data: doc });

  } catch (error) {
    console.error('Error al actualizar fila de tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createVariableTableDataController = async (req, res) => {
  try {

    console.log('entra en el createVariableTableDataController')
    // console.log('req.body', req.body)
    const { tableId, mainId, parameter } = req.body;
    const idFormated = req.user._id.split('_').pop();

    console.log('tableId', tableId)
    console.log('mainId', mainId)
    console.log('parameter', parameter)
    if (!tableId) {
      return res.status(400).json({ error: 'Faltan datos requeridos: tableId' });
    }

    const selectedWorkspace = req?.user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_table_${tableId}`;

    //buscar en dbName el documento con la propiedad main
    const db = await connectDB(dbName);
    const doc = await db.get(mainId);


    if(parameter.hasOwnProperty("code")){
      console.log('entra en el if de code')
      doc.variables.unshift(parameter);
        }else if (doc?.variables?.length > 0) {
          const newParameter = {
            ...parameter,
            category: doc?.variables[0]?.code
          }
          if(newParameter.hasOwnProperty("hidden")){
            delete newParameter.hidden
          }
         const newVariables = [doc?.variables[0], newParameter, ...doc?.variables.slice(1)]





         
        doc.variables = newVariables

        // Reordenar bloque con misma categoría manteniendo su posición original
        try {
          const categoryCode = newParameter.category;
          if (categoryCode) {
            let startIndex = doc.variables.findIndex(v => v && v.category === categoryCode);
            if (startIndex !== -1) {
              let endIndex = startIndex;
              while (
                endIndex + 1 < doc.variables.length &&
                doc.variables[endIndex + 1] &&
                doc.variables[endIndex + 1].category === categoryCode
              ) {
                endIndex++;
              }

              const group = doc.variables.slice(startIndex, endIndex + 1);
              const rankHidden = (v) => {
                if (Object.prototype.hasOwnProperty.call(v, 'hidden')) {
                  return v.hidden === false ? 0 : 1; // false primero, true después
                }
                return 2; // sin propiedad hidden al final
              };
              group.sort((a, b) => rankHidden(a) - rankHidden(b));

              doc.variables = [
                ...doc.variables.slice(0, startIndex),
                ...group,
                ...doc.variables.slice(endIndex + 1)
              ];
            }
          }
        } catch (err) {
          console.error('Error reordenando grupo por categoría:', err);
        }
        }


    await db.insert(doc);

    return res.status(201).json({ message: 'Fila actualizada exitosamente', data: doc });

  } catch (error) {
    console.error('Error al actualizar fila de tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
const saveSearchHistory = async (req, res) => {
  try {
    const { tableId, mainId, data } = req.body;
    console.log("SOY REQ",req);
    
    const userId = req.user._id.split('_').pop();
    const selectedWorkspace = req.user.selectedWorkspace || 'defaultworkspace';

    const dbName = `db_${selectedWorkspace}_search_history`;
    const db = await connectDB(dbName);

    // Documento a guardar
    const historyDoc = {
      userId,
      tableId,
      mainId,
      searchData: data, // lo que el usuario buscó (puede ser un texto, filtros, etc.)
      timestamp: new Date().toISOString(),
      type: 'search_history', // útil para vistas o consultas
    };

    // Guardar en CouchDB
    const response = await db.insert(historyDoc);
    console.log("datos guardados exitosamente");
    
    return res.status(201).json({
      message: 'Búsqueda guardada en historial exitosamente',
      data: { ...historyDoc, _id: response.id, _rev: response.rev },
    });

  } catch (error) {
    console.error('Error al guardar historial de búsqueda:', error);

    // Diferenciar errores de CouchDB
    if (error.name === 'not_found') {
      return res.status(404).json({ error: 'Base de datos de historial no encontrada' });
    }

    if (error.name === 'unauthorized' || error.name === 'forbidden') {
      return res.status(403).json({ error: 'No tienes permiso para guardar historial' });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
};
const SearchHistoryInput = async (req, res) => {
  try {
    const userId = req.user._id.split('_').pop();
    const selectedWorkspace = req.user.selectedWorkspace || 'defaultworkspace';

    const dbName = `db_${selectedWorkspace}_search_history`;
    const db = await connectDB(dbName);
   // Crear índice si no existe (puedes hacer esto en inicialización también)
    await db.createIndex({
      index: { fields: ['userId', 'type', 'timestamp'] },
      name: 'search-history-timestamp-index',
      type: 'json'
    });
  const query = {
      selector: {
        userId,
        type: 'search_history'
        // Asegúrate de que todos los docs tengan timestamp
      },
      sort: [{ timestamp: 'desc' }],
      limit: 5
    };


    const result = await db.find(query);
    console.log("SOY LA RESPUESTA2", result);
    

    return res.status(200).json(
      result.docs.map(doc => ({
        id: doc._id,
        data: doc.searchData, // o doc.data, según cómo lo guardaste
        timestamp: doc.timestamp
      }))
    );
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return res.status(500).json({
      error: 'Error al cargar el historial de búsquedas',
      details: error.message
    });
  }
};
const deleteVariableTableDataController = async (req, res) => {
  console.log('entra en la funcion deleteVariableTableDataController')
  try {
    const { tableId, mainId, data } = req.body;
    const idFormated = req.user._id.split('_').pop();

    if (!tableId) {
      return res.status(400).json({ error: 'Faltan datos requeridos: tableId' });
    }

    const selectedWorkspace = req?.user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_table_${tableId}`;

    const db = await connectDB(dbName);
    const doc = await db.get(mainId);

    const deletedVariable = doc.variables.find(variable => variable.id === data.id)
    // console.log('deletedVariable', deletedVariable)
    // console.log('doc.variables', doc.variables)
    // console.log('data', data)
    if(deletedVariable.hasOwnProperty("code")){

      // eliminar categoria y sus variables
      const variablesToDelete = doc.variables.filter(variable =>  variable.category === deletedVariable.code)
      doc.variables = doc.variables.filter(variable => variable.id !== data.id && variable.category !== deletedVariable.code)

      //eliminar las varaibles que estaban en variables de headers
      doc.headers = doc.headers.filter(header => !variablesToDelete.some(variable => variable.name === header.key))




      //eliminar categoria y reasignar las variables a la categoria padre
      // doc.variables = doc.variables.filter(variable => variable.id !== data.id)
      // const newFatherCategory = doc.variables.find(variable => variable.code)
      // const variablesToChange = doc.variables.filter(variable => variable.category === deletedVariable.code)
      // variablesToChange.forEach(variable => {
      //   variable.category = newFatherCategory.code
      // })
      // doc.variables = doc.variables.filter(variable => variable.category !== deletedVariable.code)
      // doc.variables = [doc.variables[0], ...variablesToChange, ...doc.variables.slice(1)]
      // console.log('doc.variables', doc.variables)
    }else{
      doc.variables = doc.variables.filter(variable => variable.id !== data.id)
      doc.headers = doc.headers.filter(header => header.key !== deletedVariable.name)
    }
    await db.insert(doc);
    

    return res.status(201).json({ message: 'Fila actualizada exitosamente', });

  } catch (error) {
    console.error('Error al actualizar fila de tabla:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {


  getDB: catchedAsync(getDB),
  downloadBackup: catchedAsync(downloadBackup),
  uploadBackup: catchedAsync(uploadBackup),
  processBackupImport: catchedAsync(processBackupImport),


  getFile: catchedAsync(getFile),
  getEmail: catchedAsync(getEmail),
  sendEmail: catchedAsync(senderEmail),
  sendEmailUser: catchedAsync(sendEmailUser),
  sendNewsletter: catchedAsync(sendNewsletter),

  createRandomUser: catchedAsync(createRandomUser),
  deleteRandomUser: catchedAsync(deleteRandomUser),

  generateAndSendOtpController: catchedAsync(generateAndSendOtpController),
  generateAndSend2FaController: catchedAsync(generateAndSend2FaController),
  testEmails: catchedAsync(testEmails),
  verifyOTPController: catchedAsync(verifyOTPController),

  createAccountController: catchedAsync(createAccountController),
  updateAccountController: catchedAsync(updateAccountController),
  updateTokensController: catchedAsync(updateTokensController),
  getTokensController: catchedAsync(getTokensController),
  setFinishTutorialTrueController: catchedAsync(setFinishTutorialTrueController),
  getAllAccountsController: catchedAsync(getAllAccountsController),
  getProfileImageById: catchedAsync(getProfileImageById),
  deleteAccountController: catchedAsync(deleteAccountController),
  updateAccountPasswordController: catchedAsync(updateAccountPasswordController),
  updateSecondFactorAuth: catchedAsync(setSecondFactorAuthController),
  logicalDeletedAccount: catchedAsync(logicalDeletedAccount),

  addNotificationController: catchedAsync(addNotificationController),
  getAllNotificationsController: catchedAsync(getAllNotificationsController),
  deleteNotificationController: catchedAsync(deleteNotificationController),

  getResumeAccount: catchedAsync(getResumeAccount),
  deleteResumeAccount: catchedAsync(deleteResumeAccount),

  loginToManagerController: catchedAsync(loginToManagerController),
  validateSecondFactorAuthController: catchedAsync(validateSecondFactorAuthController),


  uploadFileController: catchedAsync(uploadFileController),
  updateFileController: catchedAsync(updateFileController),
  getPdfAsBase64Controller: catchedAsync(getPdfAsBase64Controller),
  getUniqueFileWithPDFBase64Controller: catchedAsync(getUniqueFileWithPDFBase64Controller),
  getUniqueFileController: catchedAsync(getUniqueFileController),
  getFileMetadataController: catchedAsync(getFileMetadataController),
  deleteFileController: catchedAsync(deleteFileController),
  weighFolderController: catchedAsync(weighFolderController),
  deleteManyFilePDFController: catchedAsync(deleteManyFilePDFController),
  moveManyFileLocallyController: catchedAsync(moveManyFileLocallyController),
  createVariable: catchedAsync(createVariable),
  getVariablesByType: catchedAsync(getVariablesByType),
  updateVariableSelected: catchedAsync(updateVariableSelected),
  deleteVariable: catchedAsync(deleteVariable),

  deleteBillingDetailController: catchedAsync(deleteBillingDetailController),

  generateAndSendRecoveryCodeController: catchedAsync(generateAndSendRecoveryCodeController),
  verifyRecoveryCodeController: catchedAsync(verifyRecoveryCodeController),
  seenNotification: catchedAsync(seenNotification),

  upgradeNote: catchedAsync(upgradeNote),
  getUpgradeNotes: catchedAsync(getUpgradeNotes),
  deleteUpgradeNote: catchedAsync(deleteUpgradeNote),
  deleteCategoryNote: catchedAsync(deleteCategoryNote),
  getAllInvoices: catchedAsync(getAllInvoices),
  getAllInvoicesById: catchedAsync(getAllInvoicesById),
  getInvoicePdf: catchedAsync(getInvoicePdf),
  createTableController: catchedAsync(createTableController),
  reorderedTableController: catchedAsync(reorderedTableController),
  updateTableNameController: catchedAsync(updateTableNameController),
  deleteRowTableController: catchedAsync(deleteRowTableController),
  getTablesController: catchedAsync(getTablesController),
  createTableDataController: catchedAsync(createTableDataController),
  updateTableDataController: catchedAsync(updateTableDataController),
  getTableData: catchedAsync(getTableData),
  getTableDataById: catchedAsync(getTableDataById),
  getTableDataFiltered: catchedAsync(getTableDataFiltered),
  updateTableTypeController: catchedAsync(updateTableTypeController),
  getTablesWithCountsController: catchedAsync(getTablesWithCountsController),
  refreshTableInfoController: catchedAsync(refreshTableInfoController),
  deleteTableController: catchedAsync(deleteTableController),
  deleteAllTablesAndTableDataController: catchedAsync(deleteAllTablesAndTableDataController),
  exportTableController: catchedAsync(exportTableController),
  getTableByIdController: catchedAsync(getTableByIdController),
  getAccountLastPaymentController: catchedAsync(getAccountLastPaymentController),
  createTableWithInitialDataController: catchedAsync(createTableWithInitialDataController),
  getTokensById, 
  selectedWorkspace: catchedAsync(selectedWorkspace),
  reorderParametersTable, // Exportar la nueva función
  updateVariableTableDataController: catchedAsync(updateVariableTableDataController),
  createVariableTableDataController: catchedAsync(createVariableTableDataController),
  deleteVariableTableDataController: catchedAsync(deleteVariableTableDataController),
  saveSearchHistory: catchedAsync(saveSearchHistory),
  SearchHistoryInput: catchedAsync(SearchHistoryInput),
};
