const axios = require("axios");
const { extractCodeBlocks } = require("../automate/utils");
const { sendTextData, sendRealTime } = require("../processChat.js");


const meetComingSoon = async ({
    res,
    text,
    token,
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
                text: 'text',
            },
            type: 'coming-soon',
            conf: {
                userId,
                agentId,
                chatId
            }
        })

        
        return false
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetComingSoon
}