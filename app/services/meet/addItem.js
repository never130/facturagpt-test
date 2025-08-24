const axios = require("axios");
const { extractCodeBlocks, connectDB } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");
const { v4: uuidv4 } = require('uuid');

const meetAddItem = async ({
    res,
    data,
    type,
    conf
}) => {
    try {
        const {
            userId,
            agentId,
            chatId
        } = conf

        const typeItem = type.split('-')[1]

        let db = null
        if (typeItem === 'docs') {
            db = await connectDB(`db_${userId}_docs`)
        } else if (typeItem === 'assets') {
            db = await connectDB(`db_${userId}_assets`)
        } else if (typeItem === 'contacts') {
            db = await connectDB(`db_${userId}_contacts`)
        } else if (typeItem === 'agents') {
            db = await connectDB(`db_${userId}_agents`)
        } else {
            await sendTextData({
                res,
                text: `No se encontró el ${typeItem}`,
                type: 'stream',
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
        }

        const dataItem = {
            ...data,
            _id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }


        await db.insert(dataItem)

        const responseRAG = cleanDataObject(dataItem);

        await sendTextData({
            res,
            text: `Se ha añadido ${type} correctamente con los siguientes datos: \n 
${Object.entries(responseRAG).map(([key, value]) => `${key}: ${value}`).join('\n')}`,
            type: 'stream',
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
    meetAddItem
}





const cleanDataObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const cleaned = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === '_id' || key === '_rev') {
      continue;
    }

    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (typeof value === 'object') {
      continue;
    }

    cleaned[key] = value;
  }

  return cleaned;
};