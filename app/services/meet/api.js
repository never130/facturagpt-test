const axios = require("axios");
const { sendTextData } = require("../processChat.js");
const { assistantAgent } = require("../automate/utils");


const meetApi = async ({
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

      // console.log('conf: ', conf)



      await sendTextData({
        res,
        token,
        data: {
          text: '¡Perfecto! He configurado los parámetros para tu API de scraping. Ahora puedes definir todos los detalles necesarios para extraer los datos que necesitas.',
        },
        // type: 'connect-api',
        type: 'api',
        conf: {
          userId,
          agentId,
          chatId,
          apiId: 'jeidkj'
        }
      })

      return false
        await assistantAgent({
            res,
            token,
            agent,
            prompt,
            userId: id,
            agentId,
            chatId,
            action: {
              text: `**Gracias por tu ayuda, ya tengo toda la información que necesito para crear la automatización:**\n`,
              automate: [{
                ini: true,
                id: "create-api-automation",
                icon: "🔗",
                title: "Crear API de Scraping",
                description: "Crea una automatización de API para scraping de datos",
                prompt: `Crear API de scraping con los parámetros configurados`,
                fn: 'createApiScraping'
              }, {
                id: "cancel-api-automation",
                icon: "❌",
                title: "Cancelar",
                description: "Cancelar la creación de API de scraping",
                prompt: `Cancelar la creación de API de scraping`,
                fn: 'cancelApiScraping'
              }, {
                id: "create-table-automation",
                icon: "📊",
                title: "Crear Tabla",
                description: "Crear una tabla con los datos de la API",
                prompt: `Crear una tabla con los datos extraídos de la API`,
                fn: 'createTableFromApi'
              }],
            },
            data: {
              "targetUrl": {
                "description": "URL del sitio web o API que quieres scrapear",
                "type": "string",
                "required": true
              },
             
            }
          })
  
          resolve({
            success: true,
            text: '¡Perfecto! He configurado los parámetros para tu API de scraping. Ahora puedes definir todos los detalles necesarios para extraer los datos que necesitas.'
          })
  
          return false
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetApi
}
