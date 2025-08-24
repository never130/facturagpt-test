const axios = require("axios"); 
const { sendTextData } = require("../processChat.js");

const meetAudio = async ({
    res,
    prompt,
    token,
    type,
    conf
}) => {
    try {
        const {
            userId,
            agentId,
            chatId
        } = conf

        console.log('prompt', prompt)

        // const scriptPrompt = `
        // Eres un extractor de contenido de audio. El usuario ha enviado el siguiente mensaje:
        // "${prompt}"
        
        // Tu tarea es extraer ÚNICAMENTE el texto que el usuario quiere que se convierta en audio.
        // Ignora completamente:
        // - Instrucciones como "dime este texto", "lee esto", "haz la voz de", "convierte a audio"
        // - Comandos o peticiones del usuario
        // - Cualquier texto que no sea el contenido a reproducir
        
        // Extrae solo el texto que debe ser narrado/reproducido en audio.
        // Si el usuario menciona un estilo de voz específico, mantenlo pero elimina la instrucción.
        // Responde únicamente con el texto limpio a ser convertido en audio, sin explicaciones adicionales.`

        // const scriptResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
        //   model: "gpt-4o-mini",
        //   temperature: 0.7,
        //   max_tokens: 4096,
        //   messages: [{
        //     role: 'user',
        //     content: scriptPrompt
        //   }]
        // }, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: `Bearer ${token}`,
        //   }
        // });

        // const script = scriptResponse.data.choices[0].message.content;

        console.log('script!!w', prompt)

        const audio = await axios.post(`https://api.openai.com/v1/audio/speech`, {
          // input: script,
          input: prompt.lyrics || '',
          model: "tts-1",
          voice: "alloy",
          response_format: "mp3",
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer'
        });

        const base64Audio = Buffer.from(audio.data).toString('base64');
        const audioBase64 = `data:audio/mp3;base64,${base64Audio}`;


        await sendTextData({
          res,
          data: {
            audio:audioBase64,
            timestamp: new Date().toISOString(),
            text: prompt.lyrics || '',
          },
          type: 'audio',
          conf: {
            userId: userId,
            agentId: agentId,
            chatId: chatId
          }
        })

        return {
          success: true,
          text: 'Mira tu nuevo audio'
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetAudio
}