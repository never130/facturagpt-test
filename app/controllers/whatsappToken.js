const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const { catchedAsync } = require("../utils/err");
const { connectDB } = require("./utils"); 
const path = require("path");
const fs = require("fs").promises;


const createWhatsappTokenController = async (req, res) => {
  const { userId, deviceId } = req.body;
  const user = req.user;
  const id = user._id.split("_").pop();
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

  if (!userId || !deviceId) {
    return res
      .status(400)
      .json({ error: "Se requiere ID de usuario y ID de dispositivo." });
  }

  const docId = `whatsapp_${userId}_${deviceId}`;

  try {
    const dbAuth = await connectDB(`db_${selectedWorkspace}_auth`);

    let deviceDoc = null;

    try {
      deviceDoc = await dbAuth.get(docId);

      if (
        deviceDoc.status === "authenticated" ||
        deviceDoc.status === "ready"
      ) {
        return res.status(200).json({
          message: "Dispositivo ya autenticado y listo",
          authenticated: true,
        });
      }
      if (
        deviceDoc.qrCode &&
        deviceDoc.qrExpiry &&
        deviceDoc.qrExpiry > Date.now()
      ) {
        return res.json({
          qr: deviceDoc.qrCode,
          authenticated: false,
        });
      }
    } catch (err) {
      if (err.statusCode === 404) {
        deviceDoc = {
          _id: docId,
          type: "WhatsApp",
          userId: id,
          deviceId,
          status: "initializing", 
          registeredPhoneNumber: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          qrCode: null,
          qrExpiry: null,
        };
      } else {
        console.error(`Error al buscar documento ${docId}:`, err);
        throw err; 
      }
    }

    const sessionFolderName = `${userId}_${deviceId}`.replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    ); 
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionFolderName,
        dataPath: path.resolve(__dirname, "../whatsapp_sessions"), 
      }),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });



    client.on("qr", async (qr) => {
      try {
        const qrDataUrl = await qrcode.toDataURL(qr);

        
        let currentDoc;
        try {
          currentDoc = await dbAuth.get(docId);
        } catch (getErr) {
          if (getErr.statusCode === 404) {
            console.warn(
              `Documento ${docId} no encontrado al actualizar QR. Usando datos base.`
            );
            
            currentDoc = {
              _id: docId,
              type: "WhatsApp",
              userId,
              deviceId,
              createdAt: deviceDoc?.createdAt || new Date().toISOString(), 
            };
            
          } else {
            throw getErr; 
          }
        }

        
        currentDoc.qrCode = qrDataUrl;
        currentDoc.qrExpiry = Date.now() + 600000; 
        currentDoc.status = "pending_qr"; 
        currentDoc.updatedAt = new Date().toISOString();

        
        const updateResult = await dbAuth.insert(currentDoc);
       
        
        deviceDoc = { ...currentDoc, _rev: updateResult.rev }; 
      } catch (error) {
        if (error.statusCode === 409) {
          console.error(
            `CONFLICTO (409) al actualizar QR para ${docId}. Reintentar podría ser necesario. Error: ${error.message}`
          );
        } else {
          console.error(
            `Error grave al manejar evento QR y actualizar BD para ${docId}:`,
            error
          );
        }
        
      }
    });

    client.on("authenticated", async () => {
      try {
        
        let currentDoc = await dbAuth.get(docId); 

        
        currentDoc.status = "authenticated";
        currentDoc.qrCode = null; 
        currentDoc.qrExpiry = null;
        currentDoc.updatedAt = new Date().toISOString();
        currentDoc.lastAuthenticated = new Date().toISOString();

        
        const updateResult = await dbAuth.insert(currentDoc);

        deviceDoc = { ...currentDoc, _rev: updateResult.rev };
      } catch (error) {
        if (error.statusCode === 404) {
          console.error(
            `Error CRÍTICO: Documento ${docId} no encontrado al intentar marcar como AUTHENTICATED.`
          );
        } else if (error.statusCode === 409) {
          console.error(
            `CONFLICTO (409) al actualizar estado AUTHENTICATED para ${docId}. Reintentar podría ser necesario. Error: ${error.message}`
          );
        } else {
          console.error(
            `Error grave al manejar evento AUTHENTICATED y actualizar BD para ${docId}:`,
            error
          );
        }
      }
    });

    client.on("ready", async () => {
      let currentPhoneNumber = null;
      try {
        
        if (client.info && client.info.wid) {
          currentPhoneNumber = client.info.wid.user; 

        }
        
        let currentDoc = await dbAuth.get(docId);

        
        currentDoc.status = "ready";
        currentDoc.updatedAt = new Date().toISOString();
        
        currentDoc.qrCode = null;
        currentDoc.qrExpiry = null;
        currentDoc.registeredPhoneNumber = currentPhoneNumber;

        
        const updateResult = await dbAuth.insert(currentDoc);
        deviceDoc = { ...currentDoc, _rev: updateResult.rev };
      } catch (error) {
        if (error.statusCode === 404) {
          console.error(
            `Error CRÍTICO: Documento ${docId} no encontrado al intentar marcar como READY.`
          );
        } else if (error.statusCode === 409) {
          console.error(
            `CONFLICTO (409) al actualizar estado READY para ${docId}. Reintentar podría ser necesario. Error: ${error.message}`
          );
        } else {
          console.error(
            `Error grave al manejar evento READY y actualizar BD para ${docId}:`,
            error
          );
        }
      }
    });

    client.on("disconnected", async (reason) => {

      try {
        
        let currentDoc = await dbAuth.get(docId);

        
        if (
          currentDoc.status !== "disconnected" ||
          currentDoc.disconnectedReason !== reason
        ) {
          currentDoc.status = "disconnected";
          currentDoc.disconnectedReason = reason;
          currentDoc.updatedAt = new Date().toISOString();
          currentDoc.qrCode = null; 
          currentDoc.qrExpiry = null;

          
          const updateResult = await dbAuth.insert(currentDoc);
  
          deviceDoc = { ...currentDoc, _rev: updateResult.rev }; 
        } else {
         
        }

        
      } catch (error) {
        if (error.statusCode === 404) {
          console.error(
            `Error: Documento ${docId} no encontrado al intentar marcar como DISCONNECTED.`
          );
        } else if (error.statusCode === 409) {
          console.error(
            `CONFLICTO (409) al actualizar estado DISCONNECTED para ${docId}. Error: ${error.message}`
          );
        } else {
          console.error(
            `Error grave al manejar evento DISCONNECTED y actualizar BD para ${docId}:`,
            error
          );
        }
      }

    });


    if (deviceDoc && deviceDoc.status === "initializing" && !deviceDoc._rev) {
      try {
        const insertResult = await dbAuth.insert(deviceDoc);
        deviceDoc._rev = insertResult.rev; 
      } catch (initialInsertErr) {
        console.error(
          `Error CRÍTICO al insertar documento inicial ${docId}:`,
          initialInsertErr
        );
        await client.destroy().catch(() => {}); 
        return res
          .status(500)
          .json({ error: "Error interno al registrar el dispositivo." });
      }
    }

    
    await client.initialize();

    
    let attempts = 0;
    const maxAttempts = 15; 
    while (
      deviceDoc &&
      !deviceDoc.qrCode &&
      deviceDoc.status !== "authenticated" &&
      deviceDoc.status !== "ready" &&
      attempts < maxAttempts
    ) {
     
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
      
      try {
        const refreshedDoc = await dbAuth.get(docId);
        deviceDoc = refreshedDoc; 
      } catch (refreshErr) {
        if (refreshErr.statusCode !== 404) {
          console.error(
            `Error al refrescar estado de ${docId} durante espera:`,
            refreshErr
          );
        }
        
      }
    }

    if (
      attempts >= maxAttempts &&
      !deviceDoc.qrCode &&
      deviceDoc.status !== "authenticated" &&
      deviceDoc.status !== "ready"
    ) {
      console.warn(`Timeout esperando QR o autenticación para ${docId}`);
      
    }

    
    const finalStatus = deviceDoc?.status;
    const isAuthenticated =
      finalStatus === "authenticated" || finalStatus === "ready";


    res.json({
      qr: !isAuthenticated ? deviceDoc?.qrCode : null, 
      authenticated: isAuthenticated,
      status: finalStatus, 
    });
  } catch (error) {
    console.error(
      `Error general en createWhatsappTokenController para ${userId}/${deviceId}:`,
      error
    );
   
    return res
      .status(500)
      .json({ error: `Error al iniciar la sesión: ${error.message}` });
  }
};


const getUserDevicesController = async (req, res) => {
  const { userId } = req.params;
  const user = req.user;
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  const id = userId.split("_").pop();


  if (!id) {
    return res
      .status(400)
      .json({ error: "Se requiere ID de usuario.", success: false });
  }

  try {
    const dbAuth = await connectDB(`db_${selectedWorkspace}_auth`);

    const result = await dbAuth.find({
      selector: {
        userId: id,
        type: "WhatsApp",
      },
    });

    const devicesList = result.docs.map((device) => ({
      deviceId: device.deviceId,
      status: device.status,
      lastUpdated: device.updatedAt,
      authenticated:
        device.status === "authenticated" || device.status === "ready",
      lastAuthenticated: device.lastAuthenticated, 
      disconnectedReason: device.disconnectedReason, 
      id: device._id,
      type: device.type,
      userId: device.userId,
    }));

    res.json({ id, devices: devicesList, success: true });
  } catch (error) {
    console.error(`Error al obtener dispositivos para ${id}:`, error);
    if (error.statusCode === 404) {
      return res.json({ id, devices: [] }); 
    }
    return res.status(500).json({ error: "Error al obtener dispositivos." });
  }
};


const disconnectDeviceController = async (req, res) => {
  const { userId, deviceId } = req.params;
  const user = req.user;
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  if (!userId || !deviceId) {
    return res
      .status(400)
      .json({ error: "Se requieren ID de usuario y dispositivo." });
  }

  const docId = `whatsapp_${userId}_${deviceId}`;
  const sessionFolderName = `${userId}_${deviceId}`.replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  ); 

  try {
    const dbAuth = await connectDB(`db_${selectedWorkspace}_auth`);

    let currentDoc;
    try {
      currentDoc = await dbAuth.get(docId);
    } catch (getErr) {
      if (getErr.statusCode === 404) {
        return res.status(404).json({ error: "Dispositivo no encontrado." });
      }
      throw getErr; 
    }


    if (currentDoc.status !== "disconnected") {
      currentDoc.status = "disconnected";
      currentDoc.updatedAt = new Date().toISOString();
      currentDoc.disconnectedReason = "manual_disconnect";
      currentDoc.qrCode = null; 
      currentDoc.qrExpiry = null;


      await dbAuth.insert(currentDoc);

    } else {
     
    }


    try {
      const sessionPath = path.resolve(
        __dirname,
        `../whatsapp_sessions/session-${sessionFolderName}`
      );
      await fs.rm(sessionPath, { recursive: true, force: true });
    } catch (rmErr) {
      if (rmErr.code !== "ENOENT") {

        console.warn(
          `No se pudo eliminar la carpeta de sesión para ${sessionFolderName}: ${rmErr.message}`
        );
      }
    }

    res.json({
      success: true,
      message:
        "Dispositivo desconectado correctamente y sesión local eliminada.",
    });
  } catch (error) {
    console.error(`Error al desconectar dispositivo ${docId}:`, error);
    if (error.statusCode === 409) {
      return res.status(409).json({
        error:
          "Conflicto al actualizar el estado del dispositivo, intente nuevamente.",
      });
    }
    return res.status(500).json({ error: "Error al desconectar dispositivo." });
  }
};


const sendWhatsappMessageController = async (req, res) => {
  const { userId, deviceId, phoneNumber, message } = req.body;
  const user = req.user;
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  if (!userId || !deviceId || !phoneNumber || !message) {
    return res.status(400).json({
      error:
        "Se requieren ID de usuario, ID de dispositivo, número de teléfono y mensaje.",
    });
  }

  const docId = `whatsapp_${userId}_${deviceId}`;
  const sessionFolderName = `${userId}_${deviceId}`.replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  ); 

  let client = null; 

  try {
    const dbAuth = await connectDB(`db_${selectedWorkspace}_auth`);

    let deviceDoc;
    try {
      deviceDoc = await dbAuth.get(docId);
    } catch (getErr) {
      if (getErr.statusCode === 404) {
        return res.status(404).json({ error: "Dispositivo no registrado." });
      }
      throw getErr;
    }

    if (deviceDoc.status !== "authenticated" && deviceDoc.status !== "ready") {
      return res.status(400).json({
        error: `El dispositivo no está listo (estado: ${deviceDoc.status}). Requiere autenticación.`,
      });
    }

    client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionFolderName,
        dataPath: path.resolve(__dirname, "../whatsapp_sessions"),
      }),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    let ready = false;
    client.once("ready", () => {
      ready = true;
    });

    client.once("disconnected", (reason) => {
      console.error(
        `Cliente ${docId} desconectado INESPERADAMENTE antes de enviar mensaje. Razón: ${reason}`
      );
    });

    await client.initialize(); 

    let waitReadyAttempts = 0;
    while (!ready && waitReadyAttempts < 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      waitReadyAttempts++;
    }

    if (!ready) {
      console.error(
        `Cliente ${docId} no llegó a estado 'ready' a tiempo para enviar.`
      );
      await client.destroy().catch(() => {});
      return res.status(503).json({
        error: "El cliente de WhatsApp no pudo prepararse para enviar.",
      });
    }

    
    const formattedNumber = phoneNumber.includes("@")
      ? phoneNumber
      : `${phoneNumber.replace(/\D/g, "")}@c.us`;

    
    const result = await client.sendMessage(formattedNumber, message);

    
    await client.destroy();
    client = null; 

    res.json({
      success: true,
      messageId: result.id.id,
      ack: result.ack, 
      timestamp: result.timestamp,
    });
  } catch (error) {
    console.error(
      `Error al enviar mensaje desde ${docId} a ${phoneNumber}:`,
      error
    );
    
    if (client && typeof client.destroy === "function") {
      await client
        .destroy()
        .catch((e) =>
          console.error(
            `Error al destruir cliente en catch de envío: ${e.message}`
          )
        );
    }
    
    let errorMessage = "Error al enviar mensaje.";
    if (error.message && error.message.includes("Evaluation failed")) {
      errorMessage =
        "Error interno del navegador al enviar mensaje (Evaluation failed).";
    } else if (error.message && error.message.includes("Session closed")) {
      errorMessage = "La sesión de WhatsApp se cerró inesperadamente.";
    }
    return res
      .status(500)
      .json({ error: errorMessage, details: error.message });
  }
};

const formatChatId = (identifier) => {
  
  if (!identifier) return null;
  if (identifier.includes("@")) {
    return identifier;
  } else {
    const cleanedNumber = identifier.replace(/\D/g, "");
    if (cleanedNumber.length > 5) {
      
      return `${cleanedNumber}@c.us`;
    } else {
      return null;
    }
  }
};

const getChatDetailsController = async (req, res) => {
  const { automationId } = req.body;
  const user = req.user;
  const userId = user._id.split("@")[0];
  const idUserAuth = user._id.split("_").pop();
  let client = null; 
  let allChats = []; 
  let docId;
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAutomate = await connectDB("db_automations");
    const automation = await dbAutomate.get(automationId);
    const deviceId = automation.selectedEmailConnection.email;
    const identifiersArray = automation.filesArrayEmails || [];
    const allRemitentes = automation.allRemitentes || false
    const bodyArrayKeyWords = automation.bodyArrayKeyWords || [];
const bodyCoincidenceExact = automation.bodyCoincidenceExact || false;

    const messageLimit = 10; 

    if (!deviceId) {
      return res.status(400).json({
        error: "ID de dispositivo requerido.",
      });
    }
    if ((!identifiersArray || identifiersArray.length === 0) && !allRemitentes) {
      return res.status(400).json({
        error: "No se proporcionaron identificadores de chat (y no se habilitó allRemitentes).",
      });
    }
    

    docId = automation.selectedEmailConnection.id;
    const sessionFolderName = `${userId}_${deviceId}`.replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );



    const dbAuth = await connectDB(`db_${selectedWorkspace}_auth`);
    let deviceDoc;
    try {
      deviceDoc = await dbAuth.get(docId);
      if (
        deviceDoc.status !== "authenticated" &&
        deviceDoc.status !== "ready"
      ) {
        return res.status(400).json({
          error: `El dispositivo no está listo (estado: ${deviceDoc.status}). Requiere autenticación.`,
          status: deviceDoc.status,
        });
      }
   
    } catch (getErr) {
      if (getErr.statusCode === 404) {
        return res.status(404).json({ error: "Dispositivo no registrado." });
      }
      console.error(`Error al obtener documento ${docId} de CouchDB:`, getErr);
      throw getErr;
    }


    client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionFolderName,
        dataPath: path.resolve(__dirname, "../whatsapp_sessions"),
      }),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });
    let isReady = false;
    let initializationError = null;


    const readyPromise = new Promise((resolve, reject) => {
      client.once("ready", () => {
        isReady = true;
        resolve();
      });
      client.once("disconnected", (reason) => {
        console.error(
          `Cliente ${docId} desconectado inesperadamente. Razón: ${reason}`
        );
        isReady = false;
        initializationError = new Error(`Sesión desconectada: ${reason}`);
        reject(initializationError);
      });
      client.once("auth_failure", (msg) => {
        console.error(`Fallo de autenticación para ${docId}: ${msg}`);
        initializationError = new Error(`Fallo de autenticación: ${msg}`);
        reject(initializationError);
      });
    });

    try {
      await client.initialize();
      await Promise.race([
        readyPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout esperando 'ready'")), 15000)
        ), 
      ]);
    } catch (initErr) {
      console.error(
        `Error durante initialize() o esperando 'ready' para ${initErr}:`,
        initErr
      );
      initializationError = initErr;

      return res.status(503).json({
        error: `No se pudo preparar la sesión de WhatsApp: ${initErr.message}`,
      });
    }

    if (!isReady) {
      console.error(
        `Cliente ${docId} no está listo después de la inicialización (estado inesperado).`
      );
      return res.status(503).json({
        error: "El cliente de WhatsApp no pudo prepararse (estado inesperado).",
      });
    }


    try {
      allChats = await client.getChats();
    } catch (getChatsErr) {
      console.error(
        `Error crítico al obtener la lista completa de chats: ${getChatsErr.message}`
      );

      throw new Error(
        `No se pudo obtener la lista de chats: ${getChatsErr.message}`
      );
    }
    const filterByBody = (messages) => {
      if (!bodyArrayKeyWords || bodyArrayKeyWords.length === 0) return messages;
    
      return messages.filter((msg) => {
        if (!msg.body) return false;
    
        return bodyArrayKeyWords.some((keyword) => {
          if (bodyCoincidenceExact) {
            return msg.body.trim().toLowerCase() === keyword.trim().toLowerCase();
          } else {
            return msg.body.toLowerCase().includes(keyword.toLowerCase());
          }
        });
      });
    };
    
    const filterMessagesByDate = (messages, { filterByPeriod, startDate, endDate, date }) => {
      const today = new Date();
      let fromDate;
      let toDate = today;
    
      if (filterByPeriod && startDate && endDate) {
        fromDate = new Date(startDate);
        toDate = new Date(endDate);
      } else if (date) {
        const match = date.match(/^(\d+)Days$/);
        if (match) {
          const days = parseInt(match[1], 10);
          fromDate = new Date();
          fromDate.setDate(today.getDate() - days);
        }
      }
    
      if (!fromDate || !toDate) return messages; 
    
      return messages.filter(msg => {
        const msgDate = new Date(msg.timestamp * 1000);
        return msgDate >= fromDate && msgDate <= toDate;
      });
    };
    

    const results = [];
    const allMessages = [];
    if (allRemitentes || !identifiersArray || identifiersArray.length === 0) {
      const chats = await client.getChats();
      
      const sortedChats = chats.sort((a, b) => b.timestamp - a.timestamp);
      
      for (const chat of sortedChats) {
        const messages = await chat.fetchMessages({ limit: 20 }); 
      
        const receivedMessages = messages.filter((msg) => !msg.fromMe);
      
        allMessages.push(...receivedMessages);
      
        if (allMessages.length >= 100) break;
      }
      
      const last50Messages = allMessages
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 50);
      
      const allowedExtensions = [".xml", ".json", ".pdf", ".png", ".jpg", ".jpeg", ".html"];
      const messagesWithAttachments = last50Messages.filter((msg) => {
        const filename = msg._data?.filename || msg._data?.fileName || msg.filename || "";
        return (
          (msg.type === "document" || msg.type === "image") &&
          allowedExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
        );
      });
      
const dateFilteredMessages = filterMessagesByDate(messagesWithAttachments, {
  filterByPeriod: automation.filterByPeriod,
  startDate: automation.startDate,
  endDate: automation.endDate,
  date: automation.date,
});

const filteredMessages = filterByBody(dateFilteredMessages);


      const simplifiedMessages = filteredMessages.map((msg) => ({
        _data: {
          mimetype: msg._data?.mimetype || null,
          filename: msg._data?.filename || null,
        },
        id: msg.id?.id,
        from: msg.from,
        to: msg.to,
        type: msg.type,
        body: msg.body,
        timestamp: new Date(msg.timestamp * 1000).toISOString(),
        chatId: msg.chatId,
        fromMe: msg.fromMe,
        senderName: msg._data?.notifyName || msg._data?.sender?.name || null,
      }));
        results.push({
          status: "success",
          messages: simplifiedMessages,
        });
    }else{
        for (const identifier of identifiersArray) {
          const chatIdentifier = identifier?.trim(); 
          if (!chatIdentifier) {
            results.push({
              identifier: identifier,
              status: "skipped",
              error: "Identificador vacío.",
            });
            continue; 
          }
    
          let foundChat = null;
          let searchMethod = "";
          let processingError = null;
          let chatData = null;
          let messages = [];
    
          try {
    
            const targetChatId = formatChatId(chatIdentifier);
            if (targetChatId) {
              searchMethod = "ID";
        
              try {
                
                foundChat = await client.getChatById(targetChatId);
          
              } catch (idErr) {
                console.warn(
                  `Advertencia al buscar chat por ID ${targetChatId}: ${idErr.message}. Se intentará buscar por nombre si es aplicable.`
                );
                
              }
            }
    
    
            if (!foundChat && !targetChatId) {
              
              searchMethod = "Nombre";
      
              const searchTermLower = chatIdentifier.toLowerCase();
    
              for (const chat of allChats) {
                
                const chatNameLower = chat.name?.toLowerCase();
                let contactNameLower = null;
                let contactPushnameLower = null;
                let contactShortNameLower = null;
                let contact = null; 
    
                if (!chat.isGroup) {
                  try {
                    contact = await chat.getContact(); 
                    contactNameLower = contact?.name?.toLowerCase();
                    contactPushnameLower = contact?.pushname?.toLowerCase();
                    contactShortNameLower = contact?.shortName?.toLowerCase();
                  } catch (contactErr) {
                    console.warn(
                      `No se pudo obtener contacto para el chat ${chat.id._serialized} durante la búsqueda por nombre: ${contactErr.message}`
                    );
                    
                  }
                }
    
                
                if (
                  (chatNameLower && chatNameLower === searchTermLower) ||
                  (contactNameLower && contactNameLower === searchTermLower) ||
                  (contactPushnameLower &&
                    contactPushnameLower === searchTermLower) ||
                  (contactShortNameLower &&
                    contactShortNameLower === searchTermLower)
                ) {
            
                  foundChat = chat; 
                  break;
                }
              }
            
            } else if (!foundChat && targetChatId) {
              console.error(`Chat con ID ${targetChatId} no encontrado.`);
              
            }
            
            if (foundChat) {
            
              
              const contact = !foundChat.isGroup
                ? await foundChat.getContact()
                : null; 
              chatData = {
                id: foundChat.id._serialized,
                name:
                  contact?.name ||
                  contact?.pushname ||
                  foundChat.name ||
                  foundChat.id._serialized.split("@")[0],
                isGroup: foundChat.isGroup,
                
                isReadOnly: foundChat.isReadOnly,
                unreadCount: foundChat.unreadCount,
                timestamp: foundChat.timestamp,
                archived: foundChat.archived,
                contactInfo: contact
                  ? {
                      number: contact.number,
                      pushname: contact.pushname,
                      shortName: contact.shortName,
                      name: contact.name,
                      isMyContact: contact.isMyContact,
                      
                    }
                  : null,
              };
    
              const fetchedMessages = await foundChat.fetchMessages({ limit: 50 });
    
              const allowAllFiles = automation.allowAllFileTypes
              const selectedFiles = automation.selectedFileTypes
              const allowedExtensions = allowAllFiles
      ? [".xml", ".json", ".pdf", ".png", ".jpg", ".jpeg", ".html"]
      : selectedFiles.map((type) => `.${type.toLowerCase()}`);
    
              
              const messagesWithAttachments = fetchedMessages.filter((msg) => {
                const filename =
                  msg._data?.filename || msg._data?.fileName || msg.filename || "";
              
                return (
                  (msg.type === "document" || msg.type === "image") &&
                  allowedExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
                );
              });
              
const dateFilteredMessages = filterMessagesByDate(
  messagesWithAttachments.filter((msg) => !msg.fromMe),
  {
    filterByPeriod: automation.filterByPeriod,
    startDate: automation.startDate,
    endDate: automation.endDate,
    date: automation.date,
  }
);

const filteredByBody = filterByBody(dateFilteredMessages);

              
              const last10Attachments = filteredByBody.slice(-10);
              
      const simplifiedMessages = last10Attachments.map((msg) => ({
        
        _data: {
          mimetype: msg._data?.mimetype || null,
          filename: msg._data?.filename || null,
        },
        
        id: msg.id?.id,
        from: msg.from,
        to: msg.to,
        type: msg.type,
        body: msg.body,
        timestamp: new Date(msg.timestamp * 1000).toISOString(),
        chatId: msg.chatId,
        fromMe: msg.fromMe,
        senderName: msg._data?.notifyName || msg._data?.sender?.name || null,
    
      }));
      
      results.push({
        identifier: chatIdentifier,
        status: "success",
        searchMethod: searchMethod,
        chat: chatData,
        messages: simplifiedMessages,
      });
      
            } else {
      
              results.push({
                identifier: chatIdentifier,
                status: "not_found",
                error: `Chat no encontrado con el identificador '${chatIdentifier}'.`,
              });
            }
          } catch (loopError) {
            console.error(
              `Error procesando el identificador "${chatIdentifier}":`,
              loopError
            );
            processingError = loopError.message;
            results.push({
              identifier: chatIdentifier,
              status: "error",
              error: `Error al procesar: ${processingError}`,
            });
          }
        } 
    }



   
    res.status(200).send({
      success: true,
      results: results, 
    });
  } catch (error) {
    console.error(
      `Error general en getChatDetailsController para ${userId}/${automationId}:`,
      error
    );
    if (!res.headersSent) {
      res.status(error.statusCode || 500).json({
        success: false,
        error: `Error interno del servidor: ${error.message}`,
        results: [], 
      });
    }
  } finally {
    if (client && typeof client.destroy === "function") {
     
      await client
        .destroy()
        .catch((e) =>
          console.error(`Error al destruir cliente en finally: ${e.message}`)
        );
     
      client = null;
    }
  }
};

module.exports = {
  createWhatsappTokenController: catchedAsync(createWhatsappTokenController),
  getUserDevicesController: catchedAsync(getUserDevicesController),
  disconnectDeviceController: catchedAsync(disconnectDeviceController),
  sendWhatsappMessageController: catchedAsync(sendWhatsappMessageController),
  getChatDetailsController: catchedAsync(getChatDetailsController), 
};
