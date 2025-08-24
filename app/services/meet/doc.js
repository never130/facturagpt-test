const axios = require("axios");
const { sendTextData } = require("../processChat.js");
const { connectDB } = require("../../controllers/utils.js");


const { assistantAgent } = require("../automate/utils.js");

const meetDoc = async ({
  res,
  text,
  type,
  conf
}) => {
  try {
    const {
      userId,
      agentId,
      chatId,
      docId,
      token,
      agent
    } = conf


    try {
      const dbTemplate = await connectDB(`db_${userId}_template`)

      let template = null

      if (!docId) {
        await assistantAgent({
          res,
          token,
          agent,
          prompt: text,
          userId,
          agentId,
          chatId,
          docId,
          action: {
            text: `Gracias por proporcionar la información. Ahora puedes generar el documento o realizar otras acciones.`,
            view: 'minimized',
            automate: [{
              id: "add-doc",
              icon: "📄",
              title: "Generar documento",
              description: "Crea un nuevo documento con los datos proporcionados",
              prompt: `Generar documento con los datos configurados`,
              fn: 'addDoc'
            }, {
              id: "open-doc",
              icon: "📖",
              title: "Abrir documento",
              description: "Abre y visualiza un documento existente",
              prompt: `Abrir documento existente para visualización`,
              fn: 'openDoc'
            }, {
              id: "cancel-doc",
              icon: "❌",
              title: "Cancelar documento",
              description: "Cancela la creación del documento actual",
              prompt: `Cancelar la creación del documento`,
              fn: 'cancelDoc'
            }],
          },
          data: {
            "nameDocument": {
              "description": "Cómo quieres llamar al documento",
              "required": true,
              "type": "ejemplo.pdf"
            },

            "themeDocument": {
              "description": "Explicación corta del tema de estos documentos",
              "type": "string"
            },
            "pageDocument": {
              "description": "El número de páginas que quieres que tenga el documento",
              "default": 0,
              "type": "0"
            },
          }
        })
      } else if (template && template.status == 200) {
        const existingDocId = isDoc ? isDoc.id : null
        const existingHtml = isDoc ? isDoc.html : null


      } else if (template && template.status == 200 && template.completed) {
        return ({
          success: true,
          text: template.html
        })
      } else if (template && template.status == 202) {
        await assistantAgent({
          res,
          token,
          agent,
          prompt: text,
          userId: userId,
          agentId,
          chatId
        })
      }


      return ({
        success: true,
        text: 'Funcion add doc'
      })
      return false

    } catch (error) {
      console.error('Error generating document:', error)

      await sendTextData({
        res,
        text: 'Error al generar el documento. Por favor, intenta de nuevo.',
        type: 'text',
        conf: {
          userId: userId,
          agentId: agentId,
          chatId: chatId
        }
      })

      return({
        success: false,
        text: 'Error al generar el documento'
      })
      return false
    }

  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  meetDoc
}