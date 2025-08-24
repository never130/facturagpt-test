const axios = require("axios");
const { sendTextData } = require("../processChat.js");


const meetOnline = async ({
    res,
    token,
    prompt,
    type,
    conf
}) => {
    try {

        const {
            userId,
            agentId,
            chatId
        } = conf

        const systemPrompt = `
        Eres un agente que tiene que devolverme una respuesta sobre este tema:
        ${prompt}
        `

        const online = await axios.post(`https://api.openai.com/v1/chat/completions`, {
          model: "gpt-4o-mini-search-preview",
          max_tokens: 2096,
          web_search_options: {
            search_context_size: "low",
            user_location: {
              type: "approximate",
              approximate: {
                country: "GB",
                city: "London",
                region: "London"
              }
            }
          },
          messages: [{
            role: 'user',
            content: systemPrompt
          }]
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });


        const onlineText = online.data.choices[0].message.content
        const onlineAnnotations = online.data.choices[0].message.annotations

        console.log('onlineText', onlineText)
        console.log('onlineAnnotations', onlineAnnotations)

        await sendTextData({
          res,
          data: {
            text: onlineText,
            annotations: onlineAnnotations
          },
          type: 'online',
          conf: {
            userId,
            agentId,
            chatId
          }
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetOnline
}