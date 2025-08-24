const { connectDB } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");


const meetSearchItem = async ({
    res,
    prompt,
    type,
    data,
    conf
}) => {
    try {
        const {
            userId,
            agentId,
            chatId
        } = conf

        const typeItem = type.split('-')[1]

        console.log('typeItem', typeItem)

        const db = await connectDB(`db_${userId}_${typeItem}`)
        const result = await db.find({
          selector: {
            _id: data?.id
          },
          limit: 1
        })

        let doc = null
        if (result.docs.length > 0) {
          doc = result.docs[0]
        }

        await sendTextData({
          res,
          data: {
            id: doc?._id,
            type: typeItem,
            data: doc
          },
          type: 'viewer',
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
    meetSearchItem
}