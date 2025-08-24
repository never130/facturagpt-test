const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

const {
  extractCodeBlocks,
} = require("./automate/utils");


const { sendTextData, sendRealTime, getTokensById, getUserById, updateAccount, updateTokens } = require('./processChat.js');
const {
  createApiScraping,
  cancelApiScraping,
  createTableFromApi,
  addDoc,
  openDoc,
  cancelDoc
} = require("./meet/fn");

const {
  meetComingSoon,
  meetAction,
  meetApi,
  meetScript,
  meetApp,
  meetExitAgent,
  meetAudio,
  meetAutomate,
  meetDoc,
  meetGraph,
  meetGym,
  meetDeliver,
  meetLocation,
  meetImage,
  meetOnline,
  meetScraping,
  meetOther,
  meetToken,
  meetTable,
  meetAddItem,
  meetDeleteItem,
  meetEditItem,
  meetSearchItem,
  meetHelper,
  meetTimer,
  meetClock
} = require("./meet");

// const { Token } = require("aws-sdk");



const meetGPT = async ({
  id,
  res,
  token,
  agent,
  prompt,
  agentId,
  chatId,
  timestamp,
  threadId,
  docId,
  appId,
  scrapId,
  imageId,
  replyId,
  isRAG,
  isHelper,
}) => {
  return new Promise(async (resolve, reject) => {
    try {

      const skProjRegex = /^sk-proj-[A-Za-z0-9-_]{100,}$/;
      const skClaudeRegex = /^sk-ant-api\d{2}-[A-Za-z0-9_-]{60,}$/;
      const skGeminiRegex = /^sk-gemini-[A-Za-z0-9_-]{60,}$/;


      if (skProjRegex.test(prompt) || skClaudeRegex.test(prompt) || skGeminiRegex.test(prompt)) {

        let tokenObject = {}
        skProjRegex.test(prompt) ? tokenObject = { token: prompt, type: "gpt" }
          : tokenObject = { token: prompt, type: "claudeAnthropic" }
        let text

        const tokens = await getTokensById(id)

        console.log('tokens', tokens)

        if (!tokens?.tokens?.find(tok => tok.token == tokenObject.token)) {

          await updateTokens({
            data: {
              ...tokens,
              tokens: [{ token: tokenObject.token, active: true, type: tokenObject.type }, ...(tokens?.tokens?.map(tok => { return { token: tok.token, active: false, type: tok.type } }) || [])],
            },
            id
          })


          console.log('tokens 1234', id)
          const userData = await getUserById(id)

          console.log('userData', userData)

          const updated = await updateAccount({
            data: {
              ...userData,
              tokenGPT: tokenObject.token
            },
          })

          text = `El token ha sido ingresado correctamente. ¡Acceso autorizado! 🎉`

        } else {
          text = `El token ya ha sido introducido`
        }



        await sendTextData({
          res,
          // text,
          data: {
            text,
            status: 200
          },
          type: 'token'
        })

        resolve({
          success: false,
          text: text
        });

        return false
      }



      if (typeof prompt === 'string' && prompt?.startsWith('fn-')) {
        await fnPrompt(prompt)
      }


      if (!token || token === '' || token === undefined || token === null) {
        let text = `Parece que falta el token necesario para continuar. Asegúrate de ingresarlo correctamente. Si no tienes un token válido, es posible que necesites generar uno nuevo o revisar la configuración de autenticación. Si el problema persiste, revisa la documentación o contacta al soporte técnico para obtener asistencia.`

        sendTextData({
          res,
          // text,
          data: {
            text,
            status: 401
          },
          type: 'token'
        })

        resolve({
          success: false,
          text: text
        });
        return false
      }


      let promptRAG = ''
      if (isRAG) {
        promptRAG = `
        Items a analizar:
        ${JSON.stringify(isRAG)}

        Si hay dos o más items pon el primero que encuentres como docs, assets, contacts o agents
        
        *REGLAS*
        - Añade una variable "data" que sea un objeto con todos los parametros que se vayan a añadir donde [key] sera un camelcase
        y [value] será lo que diga el usuario, si faltan datos obvialos como key,value.
        - Todas las variables en ingles, camelcase y sin faltas de ortografia.
        - Añademe sólo cuando el usuario pide eliminar un campo o parametro dentro de "data"."removeField" con el campo o parametro que el usuario quiera eliminar.
        `
      }

      let systemPrompt = `
      Eres un agente que tiene que devolverme un JSON con el siguiente formato:

      {
        "type": "table" | "automate" | "action" | "graph" | "api" | "other" | "audio" | "image" | "online" | "edit-docs" | "edit-assets" | "edit-contacts" | "edit-agents" | "add-docs" | "add-assets" | "add-contacts" | "add-agents" | "delete-agents" | "search-docs" | "search-assets" | "search-contacts" | "search-agents" | "exit-agent",
      
        "data": {
          "key": "value"
          "lyrics": "Extraer el texto de la cancion si es type audio",
          "scrapItem": "Si es type scraping, información sobre el scraping que se va a hacer,  obj obligatorio: { name, description, db_name }",
          "scrapVariables": "Si es type scraping, un array con todas las variables que puede detectar el scrap, ejemplo factura de la luz: cif, name.. añade hasta 10 si es posible, obj obligatorio: { name, title, description, type (text, number, date, boolean, array, object, etc..)}",
          ... // añade todos los campos que el usuario quiera añadir, si no hay ninguno, no añadas nada.
              // si el usuario manda un nombre siempre sera contactName
              // si el usuario manda un email siempre sera contactEmail
        }
      }

        TYPE según la consulta del cliente:
      - table: Si el usuario te pide una tabla
      - automate: Si el usuario te pide una automatización
      - action: Si el usuario te pide una acción
      - graph: Si el usuario te pide una gráfica
      - api: Si el usuario te pide una conexión api..
      - audio: Si el usuario te pide un audio o voz
      - image: Si el usuario te pide una imagen
      - scraping: Si el usuario te pide un scraping de una página web o catalogo
      - token: Si el usuario te pide configurar o añadir un token o quiere cambiarlo
      - other: Si no está buscando nada en especifico o no se puede determinar el tipo
      
      Ordenes:
      - exit-agent: Si el usuario quiere salir de una automatización, documento, scraping, etc.. diciendo cualquier tipo como "salir", "parar", "desconectar", "terminar", "cancelar", "stop", "exit", "quit", "end", "finish", "no más", "basta", "ya no", "detener", "interrumpir"
      
      - add-app: Si el usuario te pide crear una aplicación, web, app, sitio web, etc..
      - add-docs: Si el usuario te pide crear un documento, html, diseño, pdf, excel
      - add-assets: Si el usuario te pide agregar un activo
      - add-agents: Si el usuario te pide agregar un agente
      - add-contacts: Si el usuario te pide agregar un contacto
      - add-workspaces: Si el usuario te pide agregar un workspace
      - add-tables: Si el usuario te pide agregar una tabla
      
      - edit-docs: Si el usuario te pide editar un documento o parametro de él
      - edit-assets: Si el usuario te pife editar un activo o parametro de él
      - edit-contacts: Si el usuario te pide editar un contacto o parametro de él
      - edit-agents: Si el usuario te pide editar un agente o parametro de él
      - edit-workspaces: Si el usuario te pide editar un workspace o parametro de él
      - edit-tables: Si el usuario te pide editar una tabla o parametro de él
      
      - search-docs: Si el usuario te pide un documento o quiere buscarlo
      - search-assets: Si el usuario te pide un activo, producto, servicio o quiere buscarlo
      - search-contacts: Si el usuario te pide un contacto o quiere buscarlo
      - search-agents: Si el usuario te pide un agente o quiere buscarlo
      - search-workspaces: Si el usuario te pide un workspace o quiere buscarlo
      - search-apps: Si el usuario te pide un workspace o quiere buscarlo
      - search-tables: Si el usuario te pide una tabla o quiere buscarla
      
      Especiales:
      - helper: Si el usuario te pide ayuda, o quiere saber más sobre algo de la plataforma.
      - location:  Si el usuario quiere una ubicación, quiere ver un mapa, o la ubicación de algo.
      - clock: Si el usuario quiere saber la hora, o la hora de una ciudad.
      - timer: Si el usuario quiere saber el tiempo, o la temperatura de una ciudad, cronometro, temporizador, alarma o cuenta atrás.
      - online: Si el usuario te pide una conexión online o buscar cualquier cosa en internet
      - food: Cuando hable del food, comida, etc..
      - gym: Cuando hable del 
      - script: Si el usuario te pide una conexión api, como whatsapp, email.. 
      - deliver: Si el usuario quiere pedir un delivery o un pedido, o en un restaurante.
      - news: Si el usuario quiere saber las noticias de algo.
      
      - coming-soon: Cuando el usuario te hable sobre DEPORTEGPT, EDUGPT, EVENTOSGPT, LEGALGPT, TALENTO GPT, TURISMO GPT, GRÁFICAS
      - coming-soon: Cuando el usuario te hable sobre APPS, MAPA, CRONOMETRO y TEMPORIZADOR, BLUETOOTH, TAREAS, GENERAR DOCUMENTOS, TAREAS, CALENDAR CHAT
      ${promptRAG}
      
      Devuelveme el JSON completo, no me devuelvas nada más.
      `


      let json_response = null


      if(isHelper) {
        console.log('isHelper: ', isHelper)
        await meetHelper({
          res,
          type: prompt,
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
            token: token
          }
        })

        return false
      }

      if (!replyId && typeof prompt !== 'object') {
        const pre_response = await axios.post("https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            temperature: 0.7,
            max_tokens: 2096,
            messages: [{
              role: 'user',
              content: [{
                type: 'text',
                text: systemPrompt
              },
              {
                type: 'text',
                text: prompt
              }]
            }],
          }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });


        const value_response = extractCodeBlocks(pre_response.data.choices[0].message.content)

        json_response = JSON.parse(value_response[1])
      }

      console.log('json_response: ', json_response)


      if (json_response?.type === 'exit-agent') {
        await meetExitAgent({
          res,
          text: prompt,
          type: 'exit-agent',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })

        resolve({
          success: true,
          text: 'Agente salido correctamente'
        })
        return false
      } 

      if (json_response?.type === 'coming-soon') {
        await meetComingSoon({
          res,
          text: prompt,
          type: 'coming-soon',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      }


      if (replyId) {
        const systemPrompt = [{
          role: 'user',
          content: `Quiero saber más sobre esta pregunta: ${replyId.text}, ademas de eso quiero que me des una respuesta sobre el tema del usuario.	`
        }, {
          role: 'user',
          content: prompt
        }]

        const response = await sendRealTime({
          res,
          token,
          systemPrompt: systemPrompt,
          userId: id,
          agentId,
          chatId,
        })

        resolve({
          success: true,
          text: response.text
        })
        return false
      } else if (docId || json_response?.type === 'add-docs') {
        await meetDoc({
          res,
          text: prompt,
          type: 'add-docs',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
            docId: docId,
            token: token,
            agent: agent,
            // prompt: prompt
          }
        })
      } else if (appId || json_response?.type === 'add-app') {

        await meetApp({
          res,
          prompt,
          type: 'add-app',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
            appId: appId || 'new-app'
          }
        })

      } else if (json_response?.type === 'deliver') {

        await meetDeliver({
          res,
          prompt,
          type: 'deliver',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
          }
        })

      } else if (json_response?.type === 'gym') {
        await meetGym({
          res,
          text: prompt,
          type: 'gym',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'location') {
        await meetLocation({
          res,
          text: prompt,
          type: 'location',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'helper') {
        await meetHelper({
          res,
          text: prompt,
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
            token: token
          }
        })
      } else if (json_response?.type === 'timer') {
        await meetTimer({
          res,
          text: prompt,
          type: 'timer',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'clock') {
        await meetClock({
          res,
          text: prompt,
          type: 'ubi',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type == 'script') {
        await meetScript({
          res,
          token,
          prompt,
          type: 'script',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
            agent: agent
          }
        })
      } else if (json_response?.type == 'api') {
        await meetApi({
          res,
          token,
          prompt,
          type: 'api',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
            agent: agent
          }
        })
      } else if (json_response?.type === 'online') {

        await meetOnline({
          res,
          token,
          prompt,
          type: 'online',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })

      } else if (scrapId || json_response?.type === 'scraping') {

        await meetScraping({
          res,
          token,
          prompt: {
            ...json_response,
            prompt: prompt
          },
          type: 'scraping',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId,
            scrapId: scrapId
          }
        })

      } else if (json_response?.type === 'image') {

        await meetImage({
          res,
          token,
          prompt,
          type: 'image',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })

      } else if (json_response?.type === 'audio') {


        await meetAudio({
          res,
          token,
          prompt: json_response?.data,
          type: 'audio',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })

      } else if (json_response?.type === 'action') {
        await meetAction({
          res,
          token,
          text: prompt,
          type: 'action',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'automate') {
        await meetAutomate({
          res,
          text: prompt,
          type: 'automate',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })


      } else if (json_response?.type === 'graph') {

        await meetGraph({
          res,
          token,
          prompt,
          type: 'graph',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'table') {

        await meetTable({
          res,
          prompt,
          type: 'table',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'token') {
        await meetToken({
          res,
          token,
          agent,
          prompt,
          type: 'token',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'other') {
        await meetOther({
          res,
          token,
          agent,
          prompt,
          type: 'other',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'add-assets' || json_response?.type === 'add-contacts' || json_response?.type === 'add-agents') {
        await meetAddItem({
          res,
          prompt,
          data: json_response.data,
          type: 'add-assets',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (json_response?.type === 'search-docs' || json_response?.type === 'search-assets' || json_response?.type === 'search-contacts' || json_response?.type === 'search-agents' || json_response?.type === 'search-apps' || json_response?.type === 'search-workspaces' || json_response?.type === 'search-tables') {
        await meetSearchItem({
          res,
          prompt,
          data: json_response,
          // type: 'search-assets',
          type: json_response?.type,
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (isRAG && (json_response?.type === 'edit-docs' || json_response?.type === 'edit-assets' || json_response?.type === 'edit-contacts' || json_response?.type === 'edit-agents')) {

        await meetEditItem({
          res,
          prompt,
          type: 'edit-docs',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })
      } else if (isRAG && (json_response?.type === 'delete-docs' || json_response?.type === 'delete-assets' || json_response?.type === 'delete-contacts' || json_response?.type === 'delete-agents')) {
        await meetDeleteItem({
          res,
          prompt,
          type: 'delete-docs',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })

      } else if (!isRAG) {
        await sendTextData({
          res,
          text: 'No se encontro ninguna acción para realizar',
          type: 'text',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })

        resolve({
          success: true,
          text: 'Mira tu nueva tabla'
        })

        return false
      }
    } catch (e) {
      console.error('Error in meetGPT:', e);
      resolve({
        success: false,
        text: 'Error al procesar la solicitud'
      });
    }
  })
}







const fnPrompt = async ({
  prompt,
  userId,
  agentId,
  chatId,
  threadId,
  docId
}) => {
  try {
    const fn = prompt.split('-')[1]

    switch (fn) {
      case 'createApiScraping':
        createApiScraping({ res, userId: id, agentId, chatId, timestamp, })
        break
      case 'cancelApiScraping':
        cancelApiScraping({ res, userId: id, chatId, timestamp })
        break
      case 'createTableFromApi':
        createTableFromApi({ res, userId: id, agentId, chatId, timestamp, })
        break
      case 'addDoc':
        addDoc({ res, userId: id, token, prompt, agentId, chatId, timestamp, })
        break
      case 'openDoc':
        openDoc({ res, userId: id, chatId, timestamp, })
        break
      case 'cancelDoc':
        cancelDoc({ res, userId: id, chatId, timestamp, })
        break

    }

    resolve({
      success: true,
      text: 'fn-' + fn
    })

    return false
  } catch (error) {
    console.error('Error in fnPrompt:', error);
  }
}



module.exports = {
  meetGPT,
  fnPrompt
};
