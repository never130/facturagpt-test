const { catchedAsync } = require("../utils/err");
const { connectDB } = require("./utils");
const { v4: uuidv4 } = require("uuid");
const Imap = require("imap");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const axios = require("axios");


const {
  filterGpt, 
  filterImageGpt, 
  automateGPT,
  imageToHtmlGPT 
} = require("../services/automate/gpt");

const {
  sendEmailWithGmail,
} = require("../services/automate/api/gmail");

const getAttachmentFromtEmail = () => {}
const getOneDriveFileData = () => {}

const uploadToScalewayS3FromBuffer = require("../services/upFileToS3");

const {
  getEmailsFromOutlook,
  sendEmailWithOutlook,
} = require("../services/automate/api/outlook");

const {
  getOneDriveFiles,
} = require("../services/automate/api/onedrive");


const { saveNotificationData, saveAttachmentData } = require("../services/automate/utils");
const { searchGmail } = require("./gmail");


const importDataController = async (req, res) => {
  try {
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const { data } = req.body;

    const resp1 = await saveNotificationData({ selectedWorkspace: selectedWorkspace, data })
    const resp2 = await saveAttachmentData({ selectedWorkspace: selectedWorkspace, data })

    return res.status(200).send({
      success: true,
      message: "Data imported successfully",
      resp1,
      resp2,
    })

  } catch (error) {
    console.error("Error in importDataController:", error);
    return res.status(500).send({
      success: false,
      message: "Error importing data",
    })
  }
}

const addAuthController = async (req, res) => {
  try {
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
console.log(`creando db_${selectedWorkspace}_auth`)
    const dbAuth = await connectDB(`db_${selectedWorkspace}_auth`);

    const auth = req.body;

    if (!auth?.type) {
      return res.status(400).send("Type is required");
    }

    if (auth?.type === "Telematel") {
      const existingAuth = await dbAuth.find({
        selector: {
          email: auth.email,
          type: auth.type,
        },
      });

      if (existingAuth.docs.length > 0) {
        return res.status(400).send("Auth with this email already exists");
      }

      await dbAuth.insert(auth);

      const automations = await dbAuth.find({
        selector: {
          type: auth.type,
        },
      });

      return res.status(200).send({
        data: automations.docs,
        success: true,
        message: "Connection successful",
        type: "Telematel",
      });
    }


    const imapConfig = {
      user: auth.email,
      password: auth.appPassword,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    };


    const imapConnectionPromise = new Promise((resolve, reject) => {
      const imap = new Imap(imapConfig);

      imap.once("ready", () => {
        imap.end();
        resolve(true);
      });

      imap.once("error", (err) => {
        console.error("Error en la conexión IMAP:", err);

        const customError = new Error(
          `Error de autenticación IMAP: ${err.message}`
        );
        customError.originalError = err;
        reject(customError);
      });

      imap.once("end", () => {
        console.warn("Conexión IMAP terminada");
      });

      imap.connect();
    });


    const nodemailerPromise = new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: auth.email,
          pass: auth.appPassword,
        },
      });

      transporter.verify((error, success) => {
        if (error) {
          console.error("Error en la verificación de Nodemailer:", error);
          reject(error);
        } else {
          resolve(true);
        }
      });
    });

    await Promise.all([imapConnectionPromise, nodemailerPromise]);


    const existingAuth = await dbAuth.find({
      selector: {
        email: auth.email,
        type: auth.type,
      },
    });

    if (existingAuth.docs.length > 0) {
      return res.status(400).send("Auth with this email already exists");
    }

    await dbAuth.insert(auth);

    const auths = await dbAuth.find({
      selector: {
        type: auth.type,
      },
    });

    return res.status(200).send(auths.docs);
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on addAuthController");
  }
};

const getAuthController = async (req, res) => {
  try {
    const user = req.user;
    const { type } = req.params;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAutomations = await connectDB(`db_${selectedWorkspace}_auth`);

    const automations = await dbAutomations.find({
      selector: {
        type: type,
      },
    });

    if (type === "Telematel") {
      return res.status(200).send({
        data: automations.docs,
        type: "Telematel",
        success: true,
        message: "Connection successful",
      });
    }

    return res.status(200).send(automations.docs);
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on getAuthController");
  }
};

const deleteAuthController = async (req, res) => {
  try {
    const { authId } = req.params;
    console.log('authId',authId)
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbAutomations = await connectDB(`db_${selectedWorkspace}_auth`);
console.log(`db_${selectedWorkspace}_auth`)

    const auth = await dbAutomations.get(authId).catch(() => null);

    if (!auth) {
      return res.status(404).json({ error: "Auth no encontrado" });
    }



    await dbAutomations.destroy(authId, auth._rev);

    return res.status(200).json({ message: "Auth eliminado exitosamente" });
  } catch (err) {
    console.error("Error en deleteAuthController:", err);
    return res.status(500).json({ error: "Error al eliminar el auth" });
  }
};

const createAutomationController = async (req, res) => {
  try {
    const { userId, email, automationData } = req.body;


    const dbAutomations = await connectDB("db_automations");
    const dbAccounts = await connectDB("db_accounts");

    const automationId = uuidv4();
    const automationDoc = {
      _id: automationId,
      id: automationId,
      userId,
      email,
      ...automationData,
      createdAt: new Date().toISOString(),
    };

    await dbAutomations.insert(automationDoc);

    const userDoc = await dbAccounts.get(userId);
    if (!userDoc.automations) {
      userDoc.automations = [];
    }
    userDoc.automations.push(automationId);

    await dbAccounts.insert(userDoc);

    const automations = await dbAutomations.find({
      selector: { userId },
    });


    return res.status(200).send(automations.docs);

  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on createAutomationController");
  }
};

const getAllUserAutomationsController = async (req, res) => {
  try {
    const { userId } = req.params;



    try {
      const dbAutomations = await connectDB("db_automations");

      const automations = await dbAutomations.find({
        selector: { userId },
      });

      const data = automations.docs.length > 0 ? automations.docs : [];
      return res.status(200).send(data);
    } catch (error) {
      throw new Error("Failed to fetch automations");
    }
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on getAllUserAutomationsController");
  }
};

const getAllUserAutomationsControllerWithFilter = async (req, res) => {
  try {
    const { user, userId } = req;
    const { limit = 99999, skip, search } = req.query;
    const { sortAlpha, statusFilter } = req.body;



    const dbAutomations = await connectDB("db_automations");


    let selector = { userId };


    if (search) {
      selector.type = {
        $regex: `(?i)${search}`,
      };
    }

    if (statusFilter && statusFilter !== "Todos") {
      selector.status = statusFilter;
    }
    const clients = await dbAutomations.find({
      selector,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    const total = await dbAutomations.find({
      selector: { userId },
      fields: ["_id"],
      limit: 10000,
    });

    let automations = clients.docs;

    if (sortAlpha) {
      automations.sort((a, b) => {
        const aName = a.contactName?.toLowerCase() || "";
        const bName = b.contactName?.toLowerCase() || "";
        return sortAlpha === "A-Z"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
    }

    const cleanedAutomations = automations.map(({ image, ...rest }) => rest);

    return res.status(200).send({
      success: true,
      automations: cleanedAutomations,
      total: total.docs.length,
      limit: parseInt(limit),
      skip: parseInt(skip),
      pages: Math.ceil(total.docs.length / limit),
    });
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on getAllContactsController");
  }
};

const updateAutomationController = async (req, res) => {
  try {
    const { automationId } = req.params;
    const { userId, ...toUpdate } = req.body;



    try {
      const dbAutomations = await connectDB("db_automations");

      const automationDoc = await dbAutomations.get(automationId);

      const updatedDoc = {
        ...automationDoc,
        ...toUpdate,
        updatedAt: new Date().toISOString(),
      };

      await dbAutomations.insert(updatedDoc);

      const automations = await dbAutomations.find({
        selector: { userId },
      });



      return res.status(200).send(automations.docs);
    } catch (error) {
      console.error("Error updating automation:", error);
      throw new Error("Failed to update automation");
    }
  } catch (err) {
    console.error("err", err);
    return res.status(500).send("Error on updateAutomationController");
  }
};

const deleteAutomationController = async (req, res) => {
  try {
    const { automationId } = req.params;
    const { userId } = req.body;

    try {
      const dbAutomations = await connectDB("db_automations");
      const dbAccounts = await connectDB("db_accounts");

      const automationDoc = await dbAutomations.get(automationId);

      await dbAutomations.destroy(automationDoc._id, automationDoc._rev);

      let userDoc = await dbAccounts.get(automationDoc.userId);
      userDoc.automations = userDoc.automations.filter(
        (id) => id !== automationId
      );

      await dbAccounts.insert(userDoc);

      const automations = await dbAutomations.find({
        selector: { userId },
      });



      return res.status(200).send(automations.docs);
    } catch (error) {
      console.error("Error deleting automation:", error);
      throw new Error("Failed to delete automation");
    }
  } catch (err) {
    console.error("Error on deleteAutomationController:", err);
    return res.status(500).send("Error on deleteAutomationController");
  }
};

const getAutomatesByIdsController = async (req, res) => {
  try {
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const { ids } = req.body;

    const dbAutomations = await connectDB(`db_automations`);

    const automations = await dbAutomations.find({
      selector: { 
        _id: { $in: ids } 
      },
    });


    return res.status(200).send({
      success: true,
      automations: automations.docs,
    });
  } catch (err) {
    console.error("Error in getAllUserAutomationsController", err);
    return res.status(500).send("Error retrieving automations");
  }
};

const getAllUserAutomationsByInputSeachController = async (req, res) => {
  try {
    const { userId, inputValue } = req.body;

    const dbAutomations = await connectDB("db_automations");


    let query = {
      selector: { userId },
    };

    const automations = await dbAutomations.find(query);
    let data = automations.docs || [];


    if (inputValue) {
      const searchTerm = inputValue.toLowerCase();
      data = data.filter((doc) =>
        Object.values(doc).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm)
        )
      );
    }

    return res.status(200).send(data);
  } catch (err) {
    console.error("Error in getAllUserAutomationsController", err);
    return res.status(500).send("Error retrieving automations");
  }
};

const filterGptController = async (req, res) => {
  const { prompt, token } = req.body;

  const reponseGPT = await filterGpt(prompt, token);

  return res.status(200).send(reponseGPT);
};


const filterImageGptController = async (req, res) => {
  try {

    const file = req.file;
    const user = req.user;

    const attachmentData = await filetImageGPT({
      attach: file,
      token: user.tokenGPT,
    });


    return res.status(200).send(attachmentData.data[0]);

  } catch (error) {
    console.error("error", error);
    return res.status(200).json({ message: "error uploading file" });
  }
}



const importConnectionAttachmentController = async (req, res) => {
  try {
    const { attachmentId, automationId, emailId, name } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbDocs = await connectDB(`db_${selectedWorkspace}_docs`);
    const dbAutomations = await connectDB("db_automations");
    const dbAuth = await connectDB(`db_${selectedWorkspace}_auth`);

    const automation = await dbAutomations.find({
      selector: { id: automationId },
    });


    const automationBody = automation.docs[0];
    let dataFromAuth;
    let attachmentData;
    if (automationBody.type === "Outlook") {
      dataFromAuth = await dbAuth.find({
        selector: {
          userId: automationBody.selectedEmailConnection.userId,
          type: "Outlook",
          _id: automationBody.selectedEmailConnection.id,
        },
      });
      attachmentData = await getAttachmentFromEmail(
        emailId,
        attachmentId,
        dataFromAuth.docs[0].accessToken
      );
    } else if (automationBody.type === "One Drive") {
      dataFromAuth = await dbAuth.find({
        selector: {
          userId: automationBody.selectedEmailConnection.userId,
          type: "OneDrive",
          _id: automationBody.selectedEmailConnection.id,
        },
      });
      attachmentData = await getOneDriveFileData(
        attachmentId,
        dataFromAuth.docs[0].accessToken
      );
    }

    const buffer = attachmentData.buffer;
    const originalName = attachmentData.originalName;
    const mimeType = attachmentData.mimeType;

    const uploadToS3 = await uploadToScalewayS3FromBuffer(
      buffer,
      originalName,
      mimeType,
      selectedWorkspace,
      automationBody.folderLocation
    );

    const importedAttachment = {
      attachmentId,
      emailId,
      selectedWorkspace,
      renameFile: automationBody.renameFile + "." + name.split(".")[1],
      folderLocation: uploadToS3.Key,
      dataFromS3: uploadToS3,
      automationId,
      date: new Date(),
      nameFile: name,
    };

    const data = await dbDocs.insert(importedAttachment);

    return res.status(200).send({
      success: true,
      message: "Attachment imported successfully",
      data,
      uploadToS3,
    });
  } catch (err) {
    console.error("err", err);
    return res.status(500).send({
      success: false,
      message: "Error on importConnectionAttachmentController",
    });
  }
};



const promptAutomateController = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    


    const response = await automateGPT({
      prompt,
      token: user.tokenGPT,
    })


    return res.status(200).send({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("error", error);
    return res
      .status(500)
      .send({ message: "Error al obtener el token", success: false });
  }
}


const imageToHtmlController = async (req, res) => {
  try {
    const { base64 } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    // return false
    const response = await imageToHtmlGPT({
      base64,
      token: user.tokenGPT,
    })

    return res.status(200).send({
      success: true,
      data: response
    });
  } catch (error) {
    console.error("error", error);
    return res
      .status(500)
      .send({ message: "Error al obtener el token", success: false });
  }
}




const getSelectedAutomationsController = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(200).json({
        success: false,
        error: 'Se requiere un arreglo no vacío de IDs',
        isAuthenticated: false,
        data:[]
      });
    }

    const dbAutomations = await connectDB(`db_automations`);
    
    const result = await dbAutomations.find({
      selector: { _id: { $in: ids } }
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron automatizaciones con los IDs proporcionados',
        isAuthenticated: true
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Automatizaciones obtenidas exitosamente',
      data: result.docs,
      isAuthenticated: true
    });

  } catch (error) {
    console.error('Error al obtener automatizaciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
      isAuthenticated: false
    });
  }
};




module.exports = {
  importDataController: catchedAsync(importDataController),
  
  addAuthController: catchedAsync(addAuthController),
  getAuthController: catchedAsync(getAuthController),
  deleteAuthController: catchedAsync(deleteAuthController),

  importConnectionAttachmentController: catchedAsync( importConnectionAttachmentController ),
  deleteAutomationController: catchedAsync(deleteAutomationController),
  createAutomationController: catchedAsync(createAutomationController),
  getAllUserAutomationsController: catchedAsync( getAllUserAutomationsController ),
  getAllUserAutomationsControllerWithFilter: catchedAsync( getAllUserAutomationsControllerWithFilter ),


  updateAutomationController: catchedAsync(updateAutomationController),
  deleteAutomationController: catchedAsync(deleteAutomationController),
  getAutomatesByIdsController: catchedAsync(getAutomatesByIdsController),
  getAllUserAutomationsByInputSeachController: catchedAsync( getAllUserAutomationsByInputSeachController ),
  filterGptController: catchedAsync(filterGptController),
  filterImageGptController: catchedAsync(filterImageGptController),

  getSelectedAutomationsController: catchedAsync(getSelectedAutomationsController),

  promptAutomateController: catchedAsync(promptAutomateController),
  imageToHtmlController: catchedAsync(imageToHtmlController),
};
