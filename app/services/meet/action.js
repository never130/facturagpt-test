const axios = require("axios");
const { extractCodeBlocks } = require("../automate/utils");
const { sendTextData, sendRealTime } = require("../processChat.js");


const meetAction = async ({
    res,
    text,
    token,
    type,
    conf
}) => {
    try {
        const {
            userId,
            agentId,
            chatId,
        } = conf


        const systemPrompt1 = [{
            role: 'user',
            content: `Dame un texto de 20 palabras como respuesta a la siguiente pregunta:`
        }, {
            role: 'user',
            content: text
        }]

        const realtimeResult = await sendRealTime({
            res,
            token,
            systemPrompt: systemPrompt1,
            userId,
            agentId,
            chatId
        })


        if (!realtimeResult.success) {
            return false
        }

        const systemPrompt2 = `
  Eres un agente y vas a devolverme una lista como sobre este
  tema: ${text}

  Basándote en esta respuesta previa: "${realtimeResult.text}"

  [{
    icon: "🔍",
    title: "titulo de la pregunta",
    subtitle: "subtitulo de la pregunta",
    text: "texto de la pregunta",
    sql: {
      selector: "codigo del selector couchdb"
    }
  }, ..]
  `

        await sendTextData({
            res,
            text: 'e',
            type: 'pause'
        })


        const actionResult = await axios.post("https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                temperature: 0.7,
                max_tokens: 2096,
                messages: [{
                    role: 'user',
                    content: [{
                        type: 'text',
                        text: systemPrompt2
                    }]
                }],
            }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });


        if (!actionResult.data.choices[0].message.content) {
            return false
        }

        const value_response = extractCodeBlocks(actionResult.data.choices[0].message.content)
        const json_response_data = JSON.parse(value_response[1])


        await sendTextData({
            res,
            data: json_response_data,
            type: 'action',
            conf: {
                userId,
                agentId,
                chatId
            }
        })

        
        return false
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetAction
}