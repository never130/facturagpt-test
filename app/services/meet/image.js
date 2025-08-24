const axios = require("axios");
const { sendTextData } = require("../processChat.js");


const meetImage = async ({
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
        Eres un agente que tiene que devolverme una imagen con el siguiente prompt:
        ${prompt}
        `

        const image = await axios.post(`https://api.openai.com/v1/images/generations`, {
          prompt: systemPrompt,
          n: 1,
          size: "1024x1024"
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });


        await sendTextData({
          res,
          data: image.data.data[0].url,
          type: 'image',
          conf: {
            userId: userId,
            agentId: agentId,
            chatId: chatId
          }
        })

        return {
            success: true,
            text: 'Mira tu nueva imagen'
        }

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetImage
}