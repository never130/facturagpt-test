// const axios = require("axios");
// const { extractCodeBlocks } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");


const meetTimer = async ({
    res,
    text,
    type,
    conf
}) => {

    try {

        const { 
            userId, 
            agentId, 
            chatId 
        } = conf;

        await sendTextData({
            res,
            data: {
                text: 'hello world'
            },
            type: 'timer',
            conf: {
                userId: userId,
                agentId: agentId,
                chatId: chatId
            }
        })
    } catch (error) {
        console.error(error)
    }

//     try {
//         const systemPrompt1 = [{
//             role: 'user',
//             content: `Dame un texto de 20 palabras como respuesta a la siguiente pregunta:`
//         }, {
//             role: 'user',
//             content: prompt
//         }]

//         const realtimeResult = await sendRealTime({
//             res,
//             token,
//             systemPrompt: systemPrompt1,
//             userId: id,
//             agentId,
//             chatId
//         })

//         if (!realtimeResult.success) {
//             resolve({
//                 success: false,
//                 text: 'Error al procesar la solicitud'
//             })
//             return false
//         }

//         const systemPrompt2 = `
//   Eres un agente y vas a devolverme una lista como sobre este
//   tema: ${prompt}

//   Basándote en esta respuesta previa: "${realtimeResult.text}"

//   [{
//     icon: "🔍",
//     title: "titulo de la pregunta",
//     text: "texto de la pregunta",
//     sql: {
//       selector: "codigo del selector couchdb"
//     }
//   }, ..]
//   `

//         sendTextData({
//             res,
//             text: 'e',
//             type: 'pause'
//         })

//         const actionResult = await axios.post("https://api.openai.com/v1/chat/completions",
//             {
//                 model: "gpt-4o-mini",
//                 temperature: 0.7,
//                 max_tokens: 2096,
//                 messages: [{
//                     role: 'user',
//                     content: [{
//                         type: 'text',
//                         text: systemPrompt2
//                     }]
//                 }],
//             }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         if (!actionResult.data.choices[0].message.content) {
//             resolve({
//                 success: false,
//                 text: 'Error al procesar la solicitud'
//             })
//             return false
//         }

//         const value_response = extractCodeBlocks(actionResult.data.choices[0].message.content)
//         const json_response_data = JSON.parse(value_response[1])

//         await sendTextData({
//             res,
//             data: json_response_data,
//             type: 'action',
//             conf: {
//                 userId: id,
//                 agentId: agentId,
//                 chatId: chatId
//             }
//         })

//         resolve({
//             success: true,
//             text: 'Mira tu nueva automatizacion'
//         })
//         return false
//     } catch (error) {
//         console.error(error)
//     }
}

module.exports = {
    meetTimer
}