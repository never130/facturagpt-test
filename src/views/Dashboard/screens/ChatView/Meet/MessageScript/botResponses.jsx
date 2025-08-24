import { ReactComponent as IconWhatsapp } from './assets/icon-whatsapp.svg';
import { ReactComponent as IconGmail } from './assets/icon-gmail.svg';

export const botResponses = {
    whatsapp: {
        name: "WhatsApp Bot",
        avatar: <IconWhatsapp />,
        color: "#fff",
        messages: [
            {
                id: 1,
                type: "connecting",
                text: "Conectando a WhatsApp...",
                delay: 1000
            },
            {
                id: 2,
                type: "message",
                text: "¡Hola! Soy el bot de WhatsApp. Estoy conectado y listo para ayudarte.",
                delay: 2000
            },
            {
                id: 3,
                type: "thinking",
                text: "Analizando tu número de teléfono...",
                delay: 1500
            },
            {
                id: 4,
                type: "message",
                text: "✅ Tu número está conectado correctamente.",
                delay: 1000
            },
            {
                id: 5,
                type: "message",
                text: "También he encontrado estos números en tu sistema: +34 123 456 789, +34 987 654 321",
                delay: 2500
            },
            {
                id: 6,
                type: "message",
                text: "¿Quieres que proceda con la extracción de mensajes?",
                delay: 2000
            },
            {
                id: 7,
                type: "waiting",
                text: "Esperando respuesta del Email Bot...",
                delay: 3000
            },
            {
                id: 8,
                type: "message",
                text: "Perfecto, voy a crear el workflow para extraer los mensajes de WhatsApp.",
                delay: 2000
            },
            {
                id: 9,
                type: "processing",
                text: "Creando automatización...",
                delay: 4000
            },
            {
                id: 10,
                type: "message",
                text: "✅ Workflow creado exitosamente. ¿Quieres que lo añada al sistema?",
                delay: 2000
            },
            {
                id: 11,
                type: "message",
                text: "¡Perfecto! Workflow añadido. Ahora puedes enviar documentos y verás la magia.",
                delay: 2500
            }
        ]
    },
    email: {
        name: "Gmail Bot",
        avatar: <IconGmail />,
        color: "#fff",
        messages: [
            {
                id: 1,
                type: "connecting",
                text: "Conectando a Email...",
                delay: 3000
            },
            {
                id: 2,
                type: "message",
                text: "¡Hola! Soy el bot de Email. Me estoy conectando a tu servidor de correo.",
                delay: 2000
            },
            {
                id: 3,
                type: "thinking",
                text: "Verificando credenciales de email...",
                delay: 2000
            },
            {
                id: 4,
                type: "message",
                text: "✅ Tu email está conectado correctamente.",
                delay: 1000
            },
            {
                id: 5,
                type: "message",
                text: "He encontrado estos emails en tu sistema: usuario@empresa.com, admin@empresa.com",
                delay: 2500
            },
            {
                id: 6,
                type: "message",
                text: "¿Tienes alguna planilla o workflow específico que quieras que configure?",
                delay: 2000
            },
            {
                id: 7,
                type: "thinking",
                text: "Analizando solicitud de WhatsApp Bot...",
                delay: 2000
            },
            {
                id: 8,
                type: "message",
                text: "¡Excelente idea! Voy a crear un workflow que permita extraer emails automáticamente.",
                delay: 2500
            },
            {
                id: 9,
                type: "processing",
                text: "Configurando filtros y automatización...",
                delay: 3500
            },
            {
                id: 10,
                type: "message",
                text: "✅ Workflow de email creado. ¿Procedo con la integración?",
                delay: 2000
            },
            {
                id: 11,
                type: "message",
                text: "¡Integración completada! Ambos workflows están sincronizados y listos.",
                delay: 2500
            }
        ]
    }
};

export const getCurrentStep = (messageIndex) => {
    if (messageIndex < 3) return "Conectando APIs";
    if (messageIndex < 6) return "Verificando credenciales";
    if (messageIndex < 8) return "Analizando datos";
    if (messageIndex < 10) return "Creando workflows";
    return "Integración completada";
};

export const getProgressPercentage = (messageIndex, totalMessages) => {
    return Math.min((messageIndex / totalMessages) * 100, 100);
}; 