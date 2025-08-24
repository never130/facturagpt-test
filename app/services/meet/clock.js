// const axios = require("axios");
// const { extractCodeBlocks } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");


const meetClock = async ({
    res,
    text,
    type,
    conf
}) => {

    try {

        await sendTextData({
            res,
            data: {
                text: 'hello world'
            },
            type: 'clock'
        })
    } catch (error) {
        console.error(error)
    }


}

module.exports = {
    meetClock
}