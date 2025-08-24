const axios = require("axios"); 
const { connectDB } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");

const meetDeleteItem = async ({
    res,
    prompt,
    type,
    conf
}) => {
    try {
    
        const type = type.split('-')[1]

        let db = null

        if (type === 'docs') {
          db = await connectDB(`db_${id}_docs`)
        } else if (type === 'assets') {
          db = await connectDB(`db_${id}_assets`)
        } else if (type === 'contacts') {
          db = await connectDB(`db_${id}_contacts`)
        } else if (type === 'agents') {
          db = await connectDB(`db_${id}_agents`)
        } else {
          await sendTextData({
            res,
            text: `No se encontró el ${type}`,
            type: 'stream',
            conf: {
              userId: id,
              agentId: agentId,
              chatId: chatId
            }
          })

          resolve({
            success: true,
            text: 'Mira tu nueva tabla'
          })

          return false
        }


        const result = await db.find({
          selector: {
            _id: isRAG[0].id
          },
          limit: 1
        })


        if (result.docs.length == 0) {
          await sendTextData({
            res,
            text: `No se encontró el ${type} #${isRAG[0].id}`,
            type: 'stream',
            conf: {
              userId: id,
              agentId: agentId,
              chatId: chatId
            }
          })

          resolve({
            success: true,
            text: 'Mira tu nueva tabla'
          })

          return false
        }

        await db.destroy(result.docs[0]._id, result.docs[0]._rev)

        await sendTextData({
          res,
          text: `Se ha eliminado ${type} #${isRAG[0].id}`,
          type: 'stream',
          conf: {
            userId: id,
            agentId: agentId,
            chatId: chatId
          }
        })


        resolve({
          success: true,
          text: 'Mira tu nueva tabla'
        })
        return falses    
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetDeleteItem
}