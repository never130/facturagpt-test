const axios = require("axios");
const { extractCodeBlocks } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");


const meetTable = async ({
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
        } = conf

        await sendTextData({
            res,
            text: 'Voy a analizar las diferentes tablas.',
            type: 'text',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
          await sendTextData({
            res,
            text: 'e',
            type: 'pause'
          })
  
          await sendTextData({
            res,
            text: 'Pennsando que tablas voy a darte',
            type: 'text',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
          await sendTextData({
            res,
            text: 'e',
            type: 'pause'
          })
  
          const data = [{
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
          }, {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
          }, {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
          }, {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
          }]
  
  
          await sendTextData({
            res,
            data: {
              text: 'Toma la siguiente tabla y analiza los datos',
              data: data,
            },
            type: 'table',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
          await sendTextData({
            res,
            text: 'e',
            type: 'pause'
          })
  
          await sendTextData({
            res,
            text: 'Toma la siguiente tabla y analiza los datos',
            type: 'text',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
          await sendTextData({
            res,
            text: 'e',
            type: 'pause'
          })
  
          await sendTextData({
            res,
            data: {
              text: 'Toma la siguiente tabla y analiza los datos',
              data: data,
            },
            type: 'table',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
  
          await sendTextData({
            res,
            text: 'Analizando los datos',
            type: 'text',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
          await sendTextData({
            res,
            text: 'e',
            type: 'pause'
          })
  
  
          await sendTextData({
            res,
            text: 'Toma dos tablas más',
            type: 'text',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
          await sendTextData({
            res,
            text: 'e',
            type: 'pause'
          })
  
          await sendTextData({
            res,
            data: {
              text: 'Toma la siguiente tabla y analiza los datos',
              data: data,
            },
            type: 'table',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
          await sendTextData({
            res,
            text: 'e',
            type: 'pause'
          })
  
          await sendTextData({
            res,
            data: {
              text: 'Toma la siguiente tabla y analiza los datos',
              data: data,
            },
            type: 'table',
            conf: {
              userId: userId,
              agentId: agentId,
              chatId: chatId
            }
          })
  
  
  
        return {
            success: true,
            text: 'Mira tu nueva tabla'
        }
  
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetTable
}