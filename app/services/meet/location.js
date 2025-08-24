const axios = require("axios");
const { sendTextData } = require("../processChat.js");


const meetLocation = async ({
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
      } = conf


      await sendTextData({
        res,
        data: {
          text: "Hola, ¿en qué te puedo ayudar?",
          status: 200
        },
        type: "location",
        conf: {
          userId: userId,
          agentId: agentId,
          chatId: chatId,
        }
      })

        // await assistantAgent({
        //   res,
        //   token,
        //   agent,
        //   action: [{
        //     id: "gym",
        //     icon: "🏋️",
        //     title: "Gimnasio",
        //     description: "Gimnasio",
        //     prompt: "Gimnasio",
        //     fn: 'gym'
        //   }],
        //   data: {
        //     "gym": {
        //       "description": "Gimnasio",
        //       "type": "string",
        //       "required": true
        //     },
        //     "peso_actual": {
        //       "description": "Peso actual en kg",
        //       "type": "number",
        //       "required": true
        //     },
        //     "peso_objetivo": {
        //       "description": "Peso objetivo en kg",
        //       "type": "number",
        //       "required": true
        //     },
        //     "altura": {
        //       "description": "Altura en cm",
        //       "type": "number",
        //       "required": true
        //     },
        //     "edad": {
        //       "description": "Edad en años",
        //       "type": "number",
        //       "required": true
        //     },
        //   }

        // })

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetLocation
}