const axios = require('axios');

const { connectDB } = require('../controllers/utils');
const { v4: uuidv4 } = require("uuid");
const tiktoken = require('tiktoken');

const sendTextData = async ({
  res,
  text = '',
  data = null,
  type,
  conf = {}
}) => {
  try {
    const {
      tokenOutputCost = 0,
      userId,
      agentId,
      chatId,
      threadId,
      docId,
      appId,
      scrapId,
      replyId,
      record,
      typeChat,
      selectedWorkspace
    } = conf

    let prompt = ""
    if (type == "text") {
      prompt = text
    }

    const encoder = tiktoken.encoding_for_model("gpt-4o-mini");
    const tokenOutput1 = encoder.encode(prompt);
    const tokensOutput = Array.from(tokenOutput1);

    const timestamp = new Date().toISOString()

    if (selectedWorkspace && chatId) {
      const dbChat = await connectDB(`db_${selectedWorkspace}_chat`);
      let chat;

      try {
        chat = await dbChat.get(chatId);
      } catch (err) {
        if (err.statusCode === 404) {
          chat = {
            _id: chatId,
            agent: agentId || 'default',
            name: "Nuevo Chat",
            messages: [],
            typeChat,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const newChat = await dbChat.insert(chat);
          chat._rev = newChat.rev;
        } else {
          console.error("Error inesperado al buscar el chat:", err);
          throw err;
        }
      }

      if (type == "me" && chat?.autoClear) chat.messages = []

      const message = {
        type: type == "me" ? "me" : "bot",
        userId: "1234",
        text: data || text,
        timestamp: timestamp,
        ...(threadId ? { threadId: threadId } : null),
        ...(docId ? { docId: docId } : null),
        ...(appId ? { appId: appId } : null),
        ...(scrapId ? { scrapId: scrapId } : null),
        ...(replyId ? { replyId: replyId } : null),
        ...(record ? { isRecord: record } : null),
        ...((type == "table" && typeof data == "object") ? { isTable: true } : {}),
        ...((type == "graph" && typeof data == "object") ? { isGraph: true } : {}),
        ...((type == "api" && typeof data == "object") ? { isApi: true } : {}),
        ...((type == "action") ? { isAction: true } : {}),
        ...((type == "online") ? { isOnline: true } : {}),
        ...((type == "automate") ? { isAutomate: true } : {}),
        ...((type == "active") ? { isActive: true } : {}),
        ...((type == "image") ? { isImage: true } : {}),
        ...((type == "audio") ? { isAudio: true } : {}),
        ...((type == "viewer") ? { isViewer: true } : {}),
        ...((type == "location") ? { isLocation: true } : {}),
        ...((type == "token") ? { isToken: true } : {}),
      };

      chat.messages.push(message)


      chat.updatedAt = new Date().toISOString()

      const result = await dbChat.insert(chat)

    }


    let textChunk = ''
    if (type === 'me' || type === 'bot-end') {
      // return false
    }
    // else if (type === 'automate') {
    //   textChunk = data
    // } 
    else if (
(!text && data)
      // ||
      // type === 'app' ||
      // type === 'scraping' ||
      // type === 'fn' ||
      // type === 'doc' ||
      // type === 'api' ||
      // type === 'action' ||
      // type === 'table' ||
      // type === 'graph' ||
      // type === 'image' ||
      // type === 'audio' ||
      // type === 'online' ||
      // type === 'viewer'
    ) {
      textChunk = data
    } else {
      textChunk = text?.replace(/\n/g, '<br/>') || text;
    }

    let n = 1

    if (
      data
      // type == "app" ||
      // type == "doc" ||
      // type == "fn" ||
      // type == "api" ||
      // type == "viewer" ||
      // type == "stream" ||
      // type == "table" ||
      // type == "graph" ||
      // type == "action" ||
      // type == "automate" ||
      // type == "asset" ||
      // type == "image" ||
      // type == "audio" ||
      // type == "online"
    ) {
      // n = 2
      n = 2
    }


    for (let i = 0; i < n; i++) {
      res.write(
        JSON.stringify({
          type: 'info',
          timestamp: 'ABC123DEF4567890XYZ'.repeat(1000),
          data: {
            id: '1234',
            type: type,
            input: {
              token: 0,
              price: 0,
            },
            output: {
              token: tokensOutput.length,
              price: tokenOutputCost,
            },
            text: textChunk,
            threadId: threadId,
            docId: docId,
            appId: appId,
            scrapId: scrapId,
            timestamp: timestamp,
            finishedAt: new Date().toISOString(),
          },
        }) + '\n'
      );
    }

  } catch (error) {
    console.error('Error sending text data:', error);
  }
};

const sendRealTime = async ({
  res,
  token,
  systemPrompt,
  userId = null,
  agentId = null,
  chatId = null,
  threadId = null,
  docId = null,
  appId = null,
  scrapId = null
}) => {
  return new Promise(async (resolve, reject) => {

    try {

      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: 'gpt-4o-mini',
          messages: systemPrompt,

          stream: true
        },
        responseType: 'stream'
      });

      let text = ''
      let buffer = ''
      const MIN_CHUNK_SIZE = 50

      response.data.on('data', async chunk => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '');
            if (jsonStr === '[DONE]') {
              if (buffer.length > 0) {
                await sendTextData({
                  res,
                  text: buffer,
                  type: 'text',
                  conf: {
                    threadId: threadId,
                    docId: docId,
                    appId: appId,
                    scrapId: scrapId
                  }
                })
                text += buffer
                buffer = ''
              }
              // return;
            }

            try {
              const json = JSON.parse(jsonStr);
              const content = json.choices?.[0]?.delta?.content;

              if (content) {
                buffer += content

                if (buffer.length >= MIN_CHUNK_SIZE) {
                  await sendTextData({
                    res,
                    text: buffer,
                    type: 'text',
                    conf: {
                      threadId: threadId,
                      docId: docId,
                      appId: appId,
                      scrapId: scrapId
                    }
                  })
                  text += buffer
                  buffer = ''
                }
              }
            } catch (err) {
              console.error('Error al parsear JSON:', err.message);
            }
          }
        }
      });

      response.data.on('end', async () => {
        if (userId && agentId && chatId) {
          await sendTextData({
            res,
            text: text,
            type: 'bot-end',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId,
              threadId: threadId,
              docId: docId,
              appId: appId,
              scrapId: scrapId
            }
          })
        }
// el res.end es para que el stream se cierre, lo dejo comentado por si acaso ya que estaba asi
        // res.end();
        resolve({
          success: true,
          text: text
        })
      });

      response.data.on('error', err => {
        console.error('Error de stream:', err.message);
        reject({
          success: false,
          text: 'Error al procesar la solicitud2'
        })
      });
    } catch (error) {
      console.error('Error in sendRealTime:', error);
      reject({
        success: false,
        text: 'Error al procesar la solicitud1'
      })
    }
  })
}

const getTokensById = async (id) => {
  const db = await connectDB(`db_${id}_auth`);
  const result = await db.find({
    selector: {},
    limit: 999999,
  });
  return result.docs[0];
}

const getUserById = async (id) => {
  const db = await connectDB("db_accounts");
  const result = await db.find({
    selector: {
      _id: { $regex: `${id}$` }
    },
    limit: 1,
  });
  return result.docs[0];
}

const updateAccount = async ({ data }) => {
  const db = await connectDB("db_accounts");
  const existingDoc = await db.get(data.id);

  const updatedDoc = {
    ...existingDoc,
    ...data,
    _rev: existingDoc._rev,
  };

  const resp = await db.insert(updatedDoc);
  return resp
};

const updateTokens = async ({ data, id }) => {

  console.log('12345')
  console.log('data', data)
  console.log('id', id)
  const db = await connectDB(`db_${id}_auth`);
  let updatedDoc;

  if (data?._id) {
    const existingDoc = await db.get(data._id);
    updatedDoc = {
      ...existingDoc,
      ...data,
      _rev: existingDoc._rev,
    };

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

  return resp
};


module.exports = {
  sendTextData,
  sendRealTime,
  getTokensById,
  getUserById,
  updateAccount,
  updateTokens
}