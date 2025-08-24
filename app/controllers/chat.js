const { connectDB, validateToken} = require("../services/automate/utils");
const { meetGPT } = require("../services/gpt-meet");
const { v4: uuidv4 } = require("uuid");
const { getGPTData } = require("../services/automate/gpt");
const { getGPTDataTelematel } = require("../services/automate/pdf");
const { filterGoogleSheet } = require("../services/automate/api/googlesheet")

const { meetScraping } = require("../services/meet/scraping");
const { meetGraph } = require("../services/meet/graph");

const { saveNotificationData, saveAttachmentData } = require("../services/automate/utils");

const { sendTextData } = require("../services/processChat.js");


const getChatListController = async (req, res) => {
  const user = req.user;
  const search = req.query.search || "";
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

  try {
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const selector = {
      _id: { $gt: null },
    };

    if (search) {
      selector.name = {
        $regex: `(?i)${search}`,
      };
    }

    const result = await db.find({
      selector: selector,
      fields: [
        "_id",
        "name",
        "createdAt",
        "agent",
        "pinned",
        "typeChat",
        "fileName",
        "fileType",
      ],
    });

    // El problema es que estás usando Math.ceil sobre la diferencia de tiempo, lo que hace que cualquier diferencia mayor a 0 segundos cuente como 1 día.
    // Además, la comparación debería ser por fecha local, no por diferencia absoluta de milisegundos.
    // Aquí va una solución que compara solo la parte de la fecha (año, mes, día) en la zona horaria local.

    let chats = result.docs.map((row) => {
      const chat = row;
      const createdAt = new Date(chat.createdAt);
      const now = new Date();

      // Obtener solo la parte de año, mes y día en local
      const createdAtLocal = new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        createdAt.getDate()
      );
      const nowLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      // Calcular la diferencia en días enteros
      const diffTime = nowLocal - createdAtLocal;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: chat._id,
        name: chat.name,
        older: diffDays,
        createdAt: chat.createdAt,
        agent: chat.agent,
        pinned: chat.pinned,
        typeChat: chat.typeChat,
      };
    });

    return res.json({ success: true, chats });
  } catch (error) {
    console.error("Error en getChatListController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener la lista de chats",
    });
  }
};

const getChatMessagesController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  try {
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
        messages:[]
      });
    }

    const chat = result.docs[0];
    return res.json({
      success: true,
      messages: chat.messages || [],
      chatName: chat.name,
      autoClear: chat.autoClear,
      searchInWeb: chat.searchInWeb
    });
  } catch (error) {
    console.error("Error en getChatMessagesController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener los mensajes del chat",
    });
  }
};

const getChatAgentsController = async (req, res) => {
  const user = req.user;
  const { agentName, type = "agentConfiguration" } = req.params;
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        typeChat: type,
        agent: agentName,
      },
    });

    const chat = result.docs[0];

    return res.json({
      success: true,
      messages: chat?.messages || [],
      chatName: chat?.name || '',
    });
  } catch (error) {
    console.error("Error en getChatMessagesController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener los mensajes del chat",
    });
  }
};

const deleteChatController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];

    await db.destroy(chat._id, chat._rev);

    return res.json({
      success: true,
      message: "Chat eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteChatController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al eliminar el chat",
    });
  }
};

const emptyChatController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];

    
  chat.messages = [];

  const updateResult = await db.insert(chat);

  return res.json({
    success: true,
    message: "Chat vaciado exitosamente",
  });
  } catch (error) {
    console.error("Error en deleteChatController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al eliminar el chat",
    });
  }
};

const restartLastMessageController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  const id = user._id.split("_").pop();

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
      limit: 1,
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];


    chat.autoClear = !chat.autoClear;
    await db.insert(chat);


    return res.json({
      success: true,
      message: "Último mensaje eliminado",
      lastMessage: null,
    });

  } catch (error) {
    console.error("Error en popLastMessageController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al procesar el chat",
    });
  }
};
const searchInWebController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;

  const id = user._id.split("_").pop();

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
      limit: 1,
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];

    chat.searchInWeb = !chat.searchInWeb;
    await db.insert(chat);


    return res.json({
      success: true,
      message: "Último mensaje eliminado",
      lastMessage: null,
    });

  } catch (error) {
    console.error("Error en popLastMessageController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al procesar el chat",
    });
  }
};


const validateTokenGPT = async (req, res) => {
  const user = req?.user;

  if (!res?.send) {
    return true;
  }

  if (!user) {
    return res.send({
      success: false,
      error: "Token GPT no encontrado",
    });
  }

  const response = await validateToken(user.tokenGPT);
  return res.send({
    success: response,
    message: "Token GPT validado correctamente",
  });
};

const sendMessageController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  const { agentId, chatId } = req.params;

  const {
    type,
    timestamp,
    isAutomate,
    isRAG,
    isHelper,
    automate,
    text,
    record,
    file: filed,
    replyId,
    threadId,
    docId,
    appId,
    scrapId,
    typeChat
  } = JSON.parse(req.body);

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

  const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);

  let agent = await dbAgent.find({
    selector: {
      _id: agentId,
    },
  });

  if (agent.docs.length === 0 && !typeChat) {
    return res.status(404).json({
      success: false,
      error: "Agent no encontrado",
    });
  }

  agent = agent.docs[0];

  if(type !== 'fn'){
    await sendTextData({
      res,
      text: text,
      type: type || 'me',
      conf: {
        userId: id,
        agentId: agent?._id || agentId,
        selectedWorkspace,
        typeChat,
        chatId: chatId,
        ...(threadId && { threadId: threadId }),
        ...(isRAG && { isRAG: isRAG }),
        ...(replyId && { replyId: replyId }),
        ...(record && { record: record }),
      }
    })
  }


  if (isAutomate) {
    await sendTextData({
      res,
      text: {
        type: 'loaded',
      },
      type: 'automate',
    })

    let time = new Date().getTime();
    let processedData = null;
    if(false){
      processedData = await getGPTData({
        attach: {
          buffer: Buffer.from(filed.content, 'base64'),
          mimetype: filed.type,
          name: filed.name,
        },
        token: user.tokenGPT
      });

    }else{
      processedData = await getGPTDataTelematel({
        attach: {
          buffer: Buffer.from(filed.content, 'base64'),
          mimetype: filed.type,
          name: filed.name,
        },
        token: user.tokenGPT
      });
    }



 
    if (processedData.error) {
      await sendTextData({
        res,
        text: {
          type: 'data-error',
        },
        type: 'automate'
      })
      return false
    }

    
    let { productList, ...rest } = processedData;

    const dbContacts = await connectDB(`db_${selectedWorkspace}_contacts`);
    const dbActives = await connectDB(`db_${selectedWorkspace}_actives`);
    const dbDocs = await connectDB(`db_${selectedWorkspace}_docs`);

    const repeatData = {
      contacts: [],
      actives: [],
      docs: [],
    }

    const docsResult = await dbDocs.find({
      selector: {
        ...(processedData.docId && { docId: processedData.docId }),
      },
    });

    if(docsResult.docs.length > 0){ 
      repeatData.docs.push(docsResult.docs[0])
    }
    
    const contactResult = await dbContacts.find({
      selector: {
        ...(processedData.conactName && { conactName: processedData.conactName }),
        ...(processedData.companyEmail && { companyEmail: processedData.companyEmail }),
        ...(processedData.companyPhoneNumber && { companyPhoneNumber: processedData.companyPhoneNumber[0] }),
        ...(processedData.contactCif && { contactCif: processedData.contactCif }),
      },
    });

    if(contactResult.docs.length > 0){
      repeatData.contacts.push(contactResult.docs[0])
    }

    for(const product of productList){
      const activeResult = await dbActives.find({
        selector: {
          ...(product.name && { name: product.name }),
          ...(product.code && { code: product.code }),
        },
      });

      if(activeResult.docs.length > 0){
        repeatData.actives.push(activeResult.docs[0])
      }
    }

    automate[0].data.time = 200 
    automate[1].data.time = 500 

    automate[2].data.parameters = Object.keys(processedData).length
    automate[2].data.type = 'vars'
    automate[2].data.time = 500 + (new Date().getTime() - time) 
    
    automate[3].data.documents = 1
    automate[3].data.contacts = 1
    automate[3].data.actives = processedData?.productList?.length || 0
    automate[3].data.time = automate[2].data.time + 300
    
    automate[3].data.processedData = processedData
    automate[3].data.repeatData = repeatData
    
    automate[4].data.percent = 100
    automate[4].data.time = automate[3].data.time + 150



    await sendTextData({
      res,
      text: {
        type: 'data-processed',
        data: automate
      },
      type: 'automate'
    })


 
    await sendTextData({
      res,
      text: automate,
      type: 'automate',
      conf: {
        userId: id,
        selectedWorkspace,
        agentId: agent._id || agentId,
        chatId: chatId,
      }
    })


    

    await saveNotificationData({
      userId: id
    })

    await sendTextData({
      res,
      text: {
        type: 'data-finished',
      },
      type: 'automate'
    })

    return false

  } else if (false) {
    const tokenGPT = user.tokenGPT;

    try {
      const dbContacts = await connectDB(`db_${selectedWorkspace}_contacts`);
      const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);
      const dbDocs = await connectDB(`db_${selectedWorkspace}_docs`);


      const contactId = ""
      const contactResult = await dbContacts.find({
        selector: {
          _id: contactId
        },
      });

      const contact = contactResult.docs[0];
      if (!contact) {
        throw new Error('Contacto no encontrado');
      }

      const assetResult = await dbAssets.find({
        selector: {
          docId: docId
        },
      });

      const asset = assetResult.docs[0];
      if (!asset) {
        throw new Error('Asset no encontrado');
      }

      const docResult = await dbAssets.find({
        selector: {
          docId: docId
        },
      });
      const doc = docResult.docs[0];
      if (!doc) {
        throw new Error('Asset no encontrado');
      }

    } catch (error) {
      console.error('Error:', error.message);
    }
  }


  const result_meet = await meetGPT({
    res,
    prompt: text,
    token: user.tokenGPT,
    id: id,
    agentId: agent?._id || agentId,
    agent: agent,
    chatId: chatId,
    timestamp: timestamp,
    threadId: threadId,
    docId: docId,
    appId: appId,
    scrapId: scrapId,
    replyId: replyId,
    isRAG: isRAG,
    isHelper: isHelper,
    typeChat
  });

};


const updateChatsAgentsController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  const { automationId, userId, agents } = req.body;


  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);

    const selectedAgents = await dbAgent.find({
      selector: {
        _id: { $in: agents },
      },
    });

    const agentsWithAutomation = await dbAgent.find({
      selector: {
        automations: { $elemMatch: { $eq: automationId } }
      }
    });

    const updatePromises = selectedAgents.docs.map(async (agent) => {
      const automations = agent.automations || [];
      if (!automations.includes(automationId)) {
        automations.push(automationId);
      }

      return dbAgent.insert({
        ...agent,
        automations
      });
    });

    const cleanupPromises = agentsWithAutomation.docs
      .filter(agent => !agents.includes(agent._id))
      .map(async (agent) => {
        const automations = (agent.automations || []).filter(id => id !== automationId);
        return dbAgent.insert({
          ...agent,
          automations
        });
      });

    await Promise.all([...updatePromises, ...cleanupPromises]);

    res.status(200).json({
      success: true,
      message: "Agentes actualizados exitosamente",
      agents: selectedAgents.docs
    });
  } catch (error) {
    console.error("Error en updateChatsAgentsController:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar los agentes"
    });
  }
};
const createAgentController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  const { agent } = req.body;

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);
    const dbPlubicAgent = await connectDB(`db_agents`);

    const newAgent = {
      _id: uuidv4(),
      createdBy: user._id.split("_").pop(),
      ...agent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: agent?.type === 'public' ? true : false,
    };

    const result = await dbAgent.insert({...newAgent,isGlobalCopy: agent.type === 'public' ? true : false,idOriginalAgent:newAgent._id});

    let resultPublic = null;

    if (agent.type === 'public' || agent.type === 'key') {
      resultPublic = await dbPlubicAgent.insert({ ...newAgent, isGlobal: true });

      if (agent.image && agent.image.startsWith("data:image")) {
        const matches = agent.image.match(/^data:(.+);base64,(.+)$/);

        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");

          try {
            await dbAgent.attachment.insert(
              result.id,
              "profile.jpg",
              buffer,
              contentType,
              { rev: result.rev }
            );

            await dbPlubicAgent.attachment.insert(
              resultPublic.id,
              "profile.jpg",
              buffer,
              contentType,
              { rev: resultPublic.rev }
            );

          } catch (err) {
            console.error("Error al guardar la imagen como adjunto:", err);
          }
        }
      }
    } else {
      if (agent.image && agent.image.startsWith("data:image")) {
        const matches = agent.image.match(/^data:(.+);base64,(.+)$/);

        if (matches && matches.length === 3) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");

          try {
            await dbAgent.attachment.insert(
              result.id,
              "profile.jpg",
              buffer,
              contentType,
              { rev: result.rev }
            );
          } catch (err) {
            console.error("Error al guardar la imagen como adjunto:", err);
          }
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Agente creado exitosamente",
      agent: newAgent,
    });
  } catch (error) {
    console.error("Error en createAgentController:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear el agente",
    });
  }
};
const getAgentsController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();

  const { limit = 999999, skip, search, sortDate,dateOrder,orderByType,sortAlpha } = req.query;

 
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);
    
    // Crear índices si no existen
    await dbAgent.createIndex({
      index: { fields: ['name'] }
    });
    await dbAgent.createIndex({
      index: { fields: ['type'] }
    });
    await dbAgent.createIndex({
      index: { fields: ['updatedAt'] }
    });

    let selector = {};

    if (search && search !== "undefined") {
      selector.name = {
        $regex: `(?i)${search}`,
      };
    }

    if (orderByType && orderByType !== "all" && orderByType !== "undefined" ) {
      selector.type = orderByType;
    }


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

    let sort = [];

    if (sortAlpha  && sortAlpha !== "undefined") {
      if (sortAlpha === "A-Z") {
        sort.push({ name: "asc" });
      } else if (sortAlpha === "Z-A") {
        sort.push({ name: "desc" });
      }
    } else if (dateOrder) {
      sort.push({ updatedAt: dateOrder === "ascendant" ? "asc" : "desc" });
    }

    const result = await dbAgent.find({ selector, sort, limit: parseInt(limit), skip: parseInt(skip) || 0 });

    const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);

    // console.log('esto es result', result)

    const agentsWithMetadata = await Promise.all(
      result.docs.map(async (agent) => {
        const cloned = { ...agent };
        delete cloned.image;

        const chatResult = await dbChat.find({
          selector: {
            agent: agent._id,
            $or: [
              { typeChat: { $ne: "agentConfiguration" } },
              { typeChat: { $exists: false } }
            ]
          }
        });
        
        let latestTimestamp = null;
        let totalChats = chatResult.docs.length;

        for (const chat of chatResult.docs) {
          if (Array.isArray(chat.messages)) {
            const timestamps = chat.messages
              .filter((msg) => msg.timestamp)
              .map((msg) => new Date(msg.timestamp));

            const maxTimestamp = timestamps.length
              ? new Date(Math.max(...timestamps))
              : null;

            if (maxTimestamp && (!latestTimestamp || maxTimestamp > latestTimestamp)) {
              latestTimestamp = maxTimestamp;
            }
          }
        }

        cloned.lastMessageTimestamp = latestTimestamp || null;
        cloned.totalChats = totalChats;

        return cloned;
      })
    );

    res.status(200).json({
      success: true,
      message: "Agentes encontrados",
      agents: agentsWithMetadata,
    });
  } catch (error) {
    console.error("Error en getAgentsController:", error);

    res.status(500).json({
      success: false,
      error: "Error al obtener los agentes",
    });
  }
};


const getAgentsByIdsController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();

  const { ids } = req.body;

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);

    const result = await dbAgent.find({
      selector: {
        _id: { $in: ids },
      }, 
    });

    res.status(200).json({
      success: true,
      message: "Agentes encontrados",
      agents: result.docs,
    });
  } catch (error) {
    console.error("Error en getAgentsController:", error);

    res.status(500).json({
      success: false,
      error: "Error al obtener los agentes",
    });
  }
};


const getPublicAgentsController = async (req, res) => {
  const { searchTerm } = req.body; 
  const user = req.user;
  const id = user._id.split("_").pop();
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB("db_agents");
    const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);

    let result;

    // Si searchTerm no existe o está vacío, traer todos los agentes
    if (!searchTerm || searchTerm.trim() === "") {
      result = await dbAgent.find({
        selector: {},
      });
    } else {
      result = await dbAgent.find({
        selector: {
          name: {
            $regex: `(?i)${searchTerm}`,
          },
        },
      });
    }
    // console.log('result',result)
    const agentsWithChatCount = await Promise.all(
      result.docs.map(async (agent) => {
        const cloned = { ...agent };
        delete cloned.image;

        const chatResult = await dbChat.find({
          selector: {
            agent: agent._id,
            $or: [
              { typeChat: { $ne: "agentConfiguration" } },
              { typeChat: { $exists: false } }
            ]
          }
        });

        cloned.totalChats = chatResult.docs.length;

        return cloned;
      })
    );

    res.status(200).json({
      success: true,
      message: "Agentes encontrados",
      agents: agentsWithChatCount,
    });
  } catch (error) {
    console.error("Error en getAgentsController:", error);

    res.status(500).json({
      success: false,
      error: "Error al obtener los agentes",
    });
  }
};



const getAgentByIdController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  const { agentId } = req.params; 

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);

    const result = await dbAgent.find({
      selector: { _id: agentId }, 
    });

    if (result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el agente con el ID proporcionado",
      });
    }

    const agent = { ...result.docs[0] };
    delete agent.image;

    res.status(200).json({
      success: true,
      message: "Agente encontrado",
      agent: agent, 
    });
  } catch (error) {
    console.error("Error en getAgentByIdController:", error);

    res.status(500).json({
      success: false,
      error: "Error al obtener el agente",
    });
  }
};

const updateAgentPinnedController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  const { agentId } = req.params; 
  const { pinned } = req.body; 

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);

    const agent = await dbAgent.get(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agente no encontrado",
      });
    }

    const updatedAgent = {
      ...agent,
      pinned, 
    };

    const response = await dbAgent.insert(updatedAgent);

    res.status(200).json({
      success: true,
      message: "Agente actualizado correctamente",
      agent: { ...updatedAgent, _rev: response.rev }, 
    });
  } catch (error) {
    console.error("Error en updateAgentPinnedController:", error);

    res.status(500).json({
      success: false,
      error: "Error al actualizar el agente",
    });
  }
};

const updateAgentController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();

  const { agentId } = req.params; 
  const { agent: updatedFields } = req.body;
  const {
    name,
    description,
    selectedLanguage,
    instructions,
    aiModel,
    tone,
    type,
    answer,
    scheduledResponses,
    image,
    Capabilities,
    connectedApps,
    workspaces
  } = req.body.agent;

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {   
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);
    const dbPlubicAgent = await connectDB(`db_agents`);

    const existingAgent = await dbAgent.get(agentId);
    if (!existingAgent) {
      return res.status(404).json({
        success: false,
        message: "Agente no encontrado",
      });
    }
    const previousAgentName = existingAgent.name;
    const updatedAgent = {
      ...existingAgent,
      ...updatedFields, 
      updatedAt: new Date().toISOString(),
    };


    const result = await dbAgent.insert(updatedAgent);
    const resultPublic = await dbPlubicAgent.insert(updatedAgent);
    if (updatedFields.image && updatedFields.image.startsWith("data:image")) {
      const matches = updatedFields.image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const contentType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");

        try {
          await dbAgent.attachment.insert(
            result.id,
            "profile.jpg",
            buffer,
            contentType,
            { rev: result.rev }
          );
          await dbPlubicAgent.attachment.insert(
            result.id,
            "profile.jpg",
            buffer,
            contentType,
            { rev: result.rev }
          );
        } catch (err) {
          console.error("Error al guardar la imagen como adjunto:", err);
        }
      }
    }





    const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);

    const chatDocs = await dbChat.find({
      selector: {
        agent: previousAgentName
      }
    });

    const updatedChats = chatDocs.docs.map(chat => ({
      ...chat,
      agent: updatedAgent.name,
      updatedAt: new Date().toISOString()
    }));

    if (updatedChats.length > 0) {
      await dbChat.bulk({ docs: updatedChats });
    }


    res.status(200).json({
      success: true,
      message: "Agente actualizado exitosamente",
      agent: updatedAgent,
    });
  } catch (error) {
    console.error("Error en updateAgentController:", error);

    res.status(500).json({
      success: false,
      error: "Error al actualizar el agente",
    });
  }
};

const updateChatPinnedController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params; 
  const { pinned } = req.body; 
  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const id = user._id.split("_").pop();
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];

    const updatedChat = {
      ...chat,
      pinned, 
    };

    await db.insert(updatedChat);

    res.status(200).json({
      success: true,
      message: "Chat actualizado correctamente",
      chat: updatedChat,
    });
  } catch (error) {
    console.error("Error en updateChatPinnedController:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el chat",
    });
  }
};

const updateMessagePinLikeController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;
  const { timestamp, field } = req.body; 

  if (!['pinned', 'liked'].includes(field)) {
    return res.status(400).json({
      success: false,
      error: "El campo especificado debe ser 'pinned' o 'liked'"
    });
  }

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const id = user._id.split("_").pop();
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];

    const messageIndex = chat.messages.findIndex(msg => msg.timestamp === timestamp);

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Mensaje no encontrado",
      });
    }

    chat.messages[messageIndex][field] = !chat.messages[messageIndex][field];

    await db.insert(chat);

    res.status(200).json({
      success: true,
      message: `Estado de ${field} del mensaje actualizado correctamente`,
      chat: chat,
    });
  } catch (error) {
    console.error("Error en updateMessagePinLikeController:", error);
    res.status(500).json({
      success: false,
      error: `Error al actualizar el estado de ${field} del mensaje`,
    });
  }
};

const updateChatNameController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params; 
  const { name } = req.body; 

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const id = user._id.split("_").pop();
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];

    const updatedChat = {
      ...chat,
      name, 
    };


    await db.insert(updatedChat);

    res.status(200).json({
      success: true,
      message: "Nombre del chat actualizado correctamente",
      chat: updatedChat,
    });
  } catch (error) {
    console.error("Error en updateChatNameController:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el nombre del chat",
    });
  }
};
const deleteAgentController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  const { agentId } = req.params;
  const { agentName } = req.body;


  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);
    const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);


    const agent = await dbAgent.get(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agente no encontrado",
      });
    }


    await dbAgent.destroy(agent._id, agent._rev);


    const { docs } = await dbChat.find({
      selector: { agent: agentName }
    });

    if (docs.length > 0) {
      await Promise.all(
        docs.map(({ _id, _rev }) => dbChat.destroy(_id, _rev))
      );
    }

    res.status(200).json({
      success: true,
      message: `Agente y ${docs.length} chats relacionados eliminados exitosamente`,
    });
  } catch (error) {
    console.error("Error en deleteAgentController:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar el agente o sus chats",
    });
  }
};


const deleteChatAgentController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  const { name } = req.params;


  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {

    const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);


    const queryResult = await dbChat.find({
      selector: {
        agent: name,
        typeChat: "agentConfiguration",
      },
      limit: 1,
    });


    const chat = queryResult.docs[0];
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat no encontrado con el nombre proporcionado",
      });
    }

    chat.messages = [];


    const response = await dbChat.insert(chat);

    res.status(200).json({
      success: true,
      message: "Mensajes del chat eliminados exitosamente",
      data: response,
    });
  } catch (error) {
    console.error("Error en clearChatMessagesController:", error);

    res.status(500).json({
      success: false,
      error: "Error al limpiar los mensajes del chat",
    });
  }
};

const deleteMessageController = async (req, res) => {
  const user = req.user;
  const { chatId } = req.params;
  const { timestamp } = req.body;

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const id = user._id.split("_").pop();
    const dbName = `db_${selectedWorkspace}_chat`;
    const db = await connectDB(dbName);

    const result = await db.find({
      selector: {
        _id: chatId,
      },
    });

    if (!result.docs || result.docs.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Chat no encontrado",
      });
    }

    const chat = result.docs[0];


    const messageIndex = chat.messages.findIndex(msg => msg.timestamp === timestamp);

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Mensaje no encontrado",
      });
    }


    chat.messages.splice(messageIndex, 1);


    await db.insert(chat);

    res.status(200).json({
      success: true,
      message: "Mensaje eliminado correctamente",
      chat: chat,
    });
  } catch (error) {
    console.error("Error en deleteMessageController:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar el mensaje",
    });
  }
};
const deleteAllChatsAgentsController = async (req, res) => {
  const user = req.user;
  const { type } = req.params;


  if (!["all", "chats", "agents"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid type parameter. Use 'all', 'chats', or 'agents'.",
    });
  }

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

    if (type === "all" || type === "chats") {
      const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);
      await deleteAllDocs(dbChat);
    }

    if (type === "all" || type === "agents") {
      const dbAgents = await connectDB(`db_${selectedWorkspace}_agents`);
      await deleteAllDocs(dbAgents);
    }

    res.status(200).json({
      success: true,
      message: `Datos eliminados correctamente (${type})`,
    });
  } catch (error) {
    console.error("Error en deleteAllChatsAgentsController:", error);
    res.status(500).json({
      success: false,
      message: "Error eliminando datos del usuario",
    });
  }
};


const getAgentImagesController = async (req, res) => {
  const user = req.user;
  const id = user._id.split("_").pop();
  let { agentIds } = req.body;


  if (!Array.isArray(agentIds)) {
    agentIds = [agentIds];
  }

  const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
  try {
    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);


    const result = await dbAgent.find({
      selector: {
        _id: { $in: agentIds },
      },
      fields: ["_id", "image"], 
    });
    res.status(200).json({
      success: true,
      message: "Imágenes de agentes obtenidas",
      images: result.docs,
    });
  } catch (error) {
    console.error("Error en getAgentImagesController:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener las imágenes de los agentes",
    });
  }
};


const duplicateAgent = async (req, res) => {
  try {
    const { agent } = req.body;
    const user = req.user; 
    const id = user._id.split("_").pop();
    if (!agent || typeof agent !== "object") {
      return res.status(400).json({ error: "Agente no válido" });
    }
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbName = `db_${selectedWorkspace}_agents`;
    const db = await connectDB(dbName);

    const newAgent = {
      ...agent,
      isGlobal: false,
      idOriginalAgent: agent._id,
      _id: uuidv4(),
      createdAt: new Date().toISOString(),
      type: "private",                      
      isGlobalCopy: true,
      createdBy: user._id, 
      pinned:true,
      duplicated:true
    };

    delete newAgent._rev; 
    delete newAgent._attachments; 
    delete newAgent._deleted; 

    await db.insert(newAgent);

    return res.status(201).json({ message: "Agente duplicado exitosamente", agent: newAgent });
  } catch (error) {
    console.error("Error duplicando agente:", error);
    return res.status(500).json({ error: "Error al duplicar agente" });
  }
};


const getAllAgentsWithCreatorController = async (req, res) => {
  try {
    const { search } = req.body;
    const user = req.user;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAgents = await connectDB(`db_${selectedWorkspace}_agents`);
    const dbAccounts = await connectDB("db_accounts");

    const agentsResponse = await dbAgents.find({
      selector: {
        isPublic: true,
      },
    });

    const agents = agentsResponse.docs;

    const creatorIds = [...new Set(agents.map((agent) => agent.createdBy).filter(Boolean))];

    let creatorsMap = {};

    if (creatorIds.length > 0) {
      const accountsResponse = await dbAccounts.find({
        selector: {
          _id: {
            $in: creatorIds,
          },
        },
      });

      const accountDocs = accountsResponse.docs;

      creatorsMap = accountDocs.reduce((map, account) => {
        map[account._id] = {
          _id: account._id,
          nombre: account.nombre || "",
          email: account.email || "",
          companyName: account.companyName || "",
        };
        return map;
      }, {});
    }

    let agentsWithCreators = agents.map((agent) => {
      const creator = agent.createdBy ? creatorsMap[agent.createdBy] : null;

      return {
        ...agent,
        creator: creator || {
          _id: null,
          nombre: "Desconocido",
          email: "",
          companyName: "",
        },
      };
    });

    if (search && typeof search === "string" && search.trim() !== "") {
      const searchTerm = search.trim().toLowerCase();

      agentsWithCreators = agentsWithCreators.filter((agent) => {
        const matchAgentName = agent.name?.toLowerCase().includes(searchTerm);
        const matchCreatorName = agent.creator?.nombre?.toLowerCase().includes(searchTerm);

        return matchAgentName || matchCreatorName;
      });
    }

    return res.status(200).send({
      success: true,
      agents: agentsWithCreators,
    });
  } catch (error) {
    console.error("Error al obtener agentes con creadores:", error);
    return res.status(500).send({
      success: false,
      message: "Error al obtener los agentes",
    });
  }
};

// const scrapingController = async (req, res) => {
//   try {
//     const { url, action } = JSON.parse(req.body);
//     const user = req.user;
//     const id = user._id.split("_").pop();
//     const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'


//     res.writeHead(200, {
//       'Content-Type': 'text/plain',
//       'Transfer-Encoding': 'chunked',
//       'Cache-Control': 'no-cache',
//       'Connection': 'keep-alive'
//     });

//     const { performWebScraping } = require('../services/meet/scraping');

    
//     if (action === 'validatePage') {
//       try {

//         const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);

//         const tempChatId = uuidv4();
        
//         const tempChat = {
//           _id: tempChatId,
//           name: `Validation - ${url}`,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           messages: [],
//           agent: null,
//           pinned: false,
//           typeChat: 'scraping',
//           state: {
//             step: 'initial',
//             websiteUrl: null,
//             websiteScreenshot: null,
//             websitePdf: null,
//             userScreenshot: null,
//             userText: null,
//             matchedComponent: null,
//             extractedData: {},
//             templates: [],
//             currentTemplate: null
//           }
//         };

//         await dbChat.insert(tempChat);

//         await performWebScraping({
//           res,
//           token: user.tokenGPT,
//           websiteUrl: url,
//           userId: id,
//           agentId: null,
//           chatId: tempChatId,
//           conf: {
//             userId: id,
//             agentId: null,
//             chatId: tempChatId,
//             scrapId: tempChatId
//           },
//           isValidation: true 
//         });

//         res.end();
//         return;
//       } catch (validationError) {
//         console.error('Validation error:', validationError);
        
//         const errorData = JSON.stringify({
//           type: 'info',
//           timestamp: new Date().toISOString(),
//           data: {
//             id: 'validation-error',
//             type: 'error',
//             input: { token: 0, price: 0 },
//             output: { token: 0, price: 0 },
//             text: {
//               status: 'validation-error',
//               text: "❌ Error al validar la página web",
//               error: validationError.message
//             },
//             timestamp: new Date().toISOString(),
//             finishedAt: new Date().toISOString(),
//           },
//         });

//         res.write(errorData + '\n');
//         res.end();
//         return;
//       }
//     }

//     const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);

//     const tempChatId = uuidv4();
    
//     const tempChat = {
//       _id: tempChatId,
//       name: `Scraping - ${url}`,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       messages: [],
//       agent: null,
//       pinned: false,
//       typeChat: 'scraping',
//       state: {
//         step: 'initial',
//         websiteUrl: null,
//         websiteScreenshot: null,
//         websitePdf: null,
//         userScreenshot: null,
//         userText: null,
//         matchedComponent: null,
//         extractedData: {},
//         templates: [],
//         currentTemplate: null
//       }
//     };

//     await dbChat.insert(tempChat);

//     await performWebScraping({
//       res,
//       token: user.tokenGPT,
//       websiteUrl: url,
//       userId: id,
//       agentId: null,
//       chatId: tempChatId,
//       conf: {
//         userId: id,
//         agentId: null,
//         chatId: tempChatId,
//         scrapId: tempChatId
//       }
//     });

//     res.end();

//   } catch (error) {
//     console.error('Error en scrapingController:', error);
    
//     const errorData = JSON.stringify({
//       type: 'info',
//       timestamp: new Date().toISOString(),
//       data: {
//         id: 'error',
//         type: 'error',
//         input: { token: 0, price: 0 },
//         output: { token: 0, price: 0 },
//         text: {
//           text: "❌ Error al procesar la solicitud de scraping",
//           error: error.message
//         },
//         timestamp: new Date().toISOString(),
//         finishedAt: new Date().toISOString(),
//       },
//     });

//     res.write(errorData + '\n');
//     res.end();
//   }
// };

const scrapingController = async (req, res) => {
  try {
    const { agentId, chatId } = req.params;
    const { value, scrapId } =  JSON.parse(req.body);
    console.log('scrapingController', value, scrapId);

    const user = req.user;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    // res.writeHead(200, {
    //   'Content-Type': 'text/plain',
    //   'Transfer-Encoding': 'chunked',
    //   'Cache-Control': 'no-cache',
    //   'Connection': 'keep-alive'
    // });


    await meetScraping({
      res,
      token: user.tokenGPT,
      prompt: req.body,
      type: 'scraping',
      value: value,
      conf: {
        userId: id,
        agentId: agentId,
        chatId: chatId,
        scrapId: scrapId
      }
    })


    res.end();

  } catch (error) {
    console.error('Error en scrapingController:', error);
  

    res.write(errorData + '\n');
    res.end();
  }
};

const graphController = async (req, res) => {
  try {
    const { agentId, chatId } = req.params;
    const { value, status, graphId } =  JSON.parse(req.body);
    console.log('graphController', value, status, graphId);

    const user = req.user;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    // res.writeHead(200, {
    //   'Content-Type': 'text/plain',
    //   'Transfer-Encoding': 'chunked',
    //   'Cache-Control': 'no-cache',
    //   'Connection': 'keep-alive'
    // });


    await meetGraph({
      res,
      token: user.tokenGPT,
      prompt: req.body,
      type: 'scraping',
      value: value,
      status: status,
      conf: {
        userId: id,
        agentId: agentId,
        chatId: chatId,
        scrapId: graphId
      }
    })


    res.end();

  } catch (error) {
    console.error('Error en scrapingController:', error);
  

    // res.write(errorData + '\n');
    res.end();
  }
};


const templateSaveController = async (req, res) => {
  try {
    const { template } = req.body;
    const user = req.user;
    const id = user._id.split("_").pop();
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbTemplate = await connectDB(`db_${selectedWorkspace}_templates`);

    const newTemplate = {
      ...template,
    }

    res.status(200).json({
      success: true,
      message: "Template guardado exitosamente",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error en templateSaveController:", error);
    res.status(500).json({
      success: false,
      error: "Error al guardar el template",
    });
  }
}

const getDefaultAutomateAgentController = async (req, res) => {
  try {
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace';

    const dbAgent = await connectDB(`db_${selectedWorkspace}_agents`);

    // Buscar agentes con isAutomateDefault en true
    const result = await dbAgent.find({
      selector: {
        isAutomateDefault: true
      }
    });

    if (result.docs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No se encontraron agentes con automatización por defecto",
        agents: [],
        count: 0
      });
    }

    return res.status(200).json({
      success: true,
      message: "Agentes con automatización por defecto encontrados",
      agents: result.docs,
      count: result.docs.length
    });

  } catch (error) {
    console.error("Error en getDefaultAutomateAgentController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al buscar agentes con automatización por defecto"
    });
  }
};

module.exports = {
  getChatListController,
  getChatMessagesController,
  getChatAgentsController,
  deleteChatController,
  emptyChatController,
  sendMessageController,
  validateTokenGPT,
  updateChatsAgentsController,
  createAgentController,
  getAgentsController,
  getAgentsByIdsController,
  getPublicAgentsController,
  updateAgentPinnedController,
  getAgentByIdController,
  updateAgentController,
  updateChatPinnedController,
  updateChatNameController,
  deleteAgentController,
  deleteChatAgentController,
  updateMessagePinLikeController,
  deleteMessageController,
  deleteAllChatsAgentsController,
  getAgentImagesController,
  restartLastMessageController,
  searchInWebController,
  duplicateAgent,
  getAllAgentsWithCreatorController,
  scrapingController,
  graphController,
  templateSaveController,
  getDefaultAutomateAgentController
};



