const axios = require("axios");
const { sendTextData } = require("../processChat.js");
const { assistantAgent, assistantPrompt } = require("../automate/utils");


const meetScript = async ({
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
      chatId,
      agent
    } = conf

    console.log('prompt: meet script', prompt)

    // console.log('conf: ', conf)

    const response = await assistantPrompt({
      res,
      token,
      prompt: {
        num: 4,
        interlocutors: ['PDF', 'Tu del futuro'],
        kpis: [
          'Conectar una API de whatsapp, usa conectando..',
          'Analizar el número de whatsapp, estoy conectado haciendo una lista',
          'Hablar con OpenAi para analizar las conversaciones',
          'Usar OpenAi para crear una tabla de datos',
        ]
      },
      conf
    })

    console.log('Response from assistantPrompt:', response)

    // El assistantPrompt ya envía los datos via sendTextData
    // Solo necesitamos retornar true para indicar éxito
    return true
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  meetScript
}
