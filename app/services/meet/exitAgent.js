const axios = require("axios"); 
const { connectDB } = require("../automate/utils");
const { sendTextData } = require("../processChat");

const meetExitAgent = async ({
    res,
    prompt,
    type,
    conf
}) => {
    try {

        const { 
          userId, 
          agentId, 
          chatId 
        } = conf;
        
        if (chatId) {
          try {
            const dbChat = await connectDB(`db_${userId}_chat`)
            // const chat = await dbChat.get(chatId)

            let chat = await dbChat.find({
              selector: {
                _id: chatId
              }
            })

            console.log('chat: ', chat)

            if (chat.docs.length > 0) {
              chat = chat.docs[0]
            } else {
              chat = {
                _id: chatId,
              }
            }

            console.log('chat: ', chat)
            console.log('chatId: ', chatId)


            chat.data = {}
            chat.action = {}
            chat.state = {}
            chat.threadId = null
            chat.docId = null
            chat.appId = null
            chat.scrapId = null

            await dbChat.insert(chat)
            
          } catch (error) {
            console.error('Error clearing chat automation data:', error)
          }
        }
        

        const exitMessages = [
          '¡Perfecto! He salido del modo asistente. ¿En qué más puedo ayudarte?',
          'Entendido, he terminado el proceso. ¿Hay algo más en lo que pueda asistirte?',
          '¡Listo! Ya no estoy en modo asistente. ¿Qué te gustaría hacer ahora?',
          'De acuerdo, he cancelado el proceso. ¿En qué puedo ayudarte?',
          '¡Perfecto! He salido del modo bot. ¿Qué necesitas ahora?',
          'Entendido, he parado el asistente. ¿Hay algo más que quieras hacer?',
          '¡Listo! He terminado con el proceso. ¿En qué más puedo ser útil?',
          'De acuerdo, he desconectado del modo asistente. ¿Qué te gustaría hacer?'
        ]

        const randomMessage = exitMessages[Math.floor(Math.random() * exitMessages.length)]

        console.log('randomMessage: ', randomMessage)

        await sendTextData({
          res,
          data: {
            text: randomMessage,
            type: 'text'
          },
          type: 'exit-agent',
          conf: {
            userId: userId,
            agentId: agentId,
            chatId: chatId
          }
        })

        return {
          success: true,
          text: 'Automation exited successfully'
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetExitAgent
}