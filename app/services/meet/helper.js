// const axios = require("axios");
// const { extractCodeBlocks } = require("../automate/utils");
const fs = require("fs");
const path = require("path");
const { sendTextData, sendRealTime, getTokensById } = require("../processChat.js");

const { helpContent } = require('./help/index.js')

// Cache simple en memoria para evitar lecturas repetidas del JSON
let cachedHelpText = null;
const getHelpText = () => {
  if (cachedHelpText) return cachedHelpText;
  try {
    const helpJsonPath = path.resolve(
      "/var/www/facturagpt/src/translation/helpPage/es/helpPage.json"
    );
    const raw = fs.readFileSync(helpJsonPath, "utf-8");
    const data = JSON.parse(raw);
    const values = Object.values(data)
      .filter((v) => typeof v === "string" && v.trim().length > 0)
      .join("\n");
    cachedHelpText = values;
    return cachedHelpText;
  } catch (e) {
    console.error("No se pudo cargar helpPage.json:", e?.message || e);
    return "";
  }
};

const getToken = async (userId, conf) => {
  // Prioridad: conf.token -> ENV -> token activo en auth DB
  if (conf?.token && typeof conf.token === "string") return conf.token;
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  try {
    const authDoc = await getTokensById(userId);
    const active = authDoc?.tokens?.find((t) => t?.active && t?.token);
    return active?.token || null;
  } catch (e) {
    return null;
  }
};

const meetHelper = async ({ res, text, type, conf }) => {
  try {
    const {
        userId, 
        agentId, 
        chatId, 
        token 
    } = conf || {};

    console.log('type: ', type)

    if(!type) {

      await sendTextData({
        res,
        token,
        data: {
          text: "Hola, soy el asistente de ayuda de FacturaGPT. ¿En qué puedo ayudarte?",
          type: 'text',
        },
        type: "helper",
        conf: {
          userId,
          agentId,
          chatId,
        }
      });
    }


    const helpText = getHelpText();

    const prompt = ` Quiero información sobre ${text} en 4 fragmentos de 1000 caracteres coge la infromación de la base de documemnto que te di antes `
   
    const systemPrompt = [
      {
        role: "system",
        content:
          // "Eres un asistente de ayuda de FacturaGPT. Responde de forma breve, clara y en español. Usa exclusivamente la siguiente base de conocimiento. Si la respuesta no aparece, indica que no hay información disponible en el Centro de Ayuda.",
          "Eres un asistente de ayuda de FacturaGPT. Responde de forma breve, clara y en español."
      },
      {
        role: "system",
        content: `Base de conocimiento (helpPage):\n\n${helpText}\n\n${JSON.stringify(helpContent)}`,
      },
      {
        role: "user",
        content: prompt || "",
      },
    ];

    await sendRealTime({
      res,
      token,
      systemPrompt,
      userId,
      agentId,
      chatId,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  meetHelper,
};