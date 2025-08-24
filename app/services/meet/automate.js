const axios = require("axios");
const { extractCodeBlocks } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");


const meetAutomate = async ({
    res,
    text,
    type,
    conf
}) => {
    try {

        await assistantAgent({
            res,
            token,
            agent,
            prompt,
            userId: id,
            agentId,
            chatId,
            action: {
                text: `Gracias por proporcionar la información. Ahora puedes crear o actualizar la automatización.`,
                automate: [{
                    id: "create-automation",
                    icon: "💰",
                    title: "Crear automatización",
                    description: "Crea una automatización con estos datos de forma automatica",
                    prompt: `Necesito calcular el salario de un empleado al dia será salaryLige/200`,
                    fn: 'alerta123'
                }, {
                    id: "refresh-automation",
                    icon: "🚫",
                    title: "Actualizar automatización",
                    description: "Actualiza una automatización con estos datos de forma automatica",
                    prompt: `Necesito actualizar la automatización con estos datos de forma automatica`,
                    fn: 'refresh123'
                }],
            },
            data: {
                "senders": {
                    "description": "De que personas vas a recibir los emails",
                    "type": "[info@example.com, info2@example.com]"
                },
                "resume": {
                    "description": "El resumen de estos documentos",
                    "required": true,
                    "type": "string"
                },
                "subject": {
                    "description": "El asunto de estos documentos",
                    "type": "string"
                },
                "body": {
                    "description": "Qué contenido tiene en comun estos documentos",
                    "type": "string"
                },
                "attachment": {
                    "description": "Son pdfs, excels, qué formatos o hay más",
                    "type": "[pdf, excel, word, etc]"
                },
                "dates": {
                    "description": "Son fechas especificas o le da igual",
                    "type": "[2025-01-01, 2025-01-02]"
                },
                "frequency": {
                    "description": "Son frecuentes o no, si son frecuentes, cuántas veces a la semana",
                    "type": "[Default, 15 Minutes, 30 Minutres, 1 Hours, Hour 4, 6, 7]"
                },
                "rule": {
                    "description": "Hay alguna regla que tenga que saber para los documentos",
                    "type": "string"
                },
                "saveAttachment": {
                    "description": "Quieres guardar los archivos en la base de datos",
                    "type": "boolean"
                },
                "notificationActive": {
                    "description": "Quieres que se notifique al usuario cuando se encuentre un documento",
                    "type": "boolean"
                },
                "notificationType": {
                    "description": "Qué tipo de notificación quieres que se envíe",
                    "has": "noficationActive",
                    "type": "[google, telegram, email]"
                },
                "notificationSuccess": {
                    "description": "Qué tipo de notificación quieres que se envíe",
                    "has": "noficationActive|notificationType",
                    "type": "[error, success, info]"
                },
            }
        })


        resolve({
            success: true,
            text: 'Mira tu nueva automatizacion'
        })
        return false
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetAutomate
}
