const axios = require("axios");
const { extractCodeBlocks } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");


const meetGraph = async ({
    res,
    token,
    prompt,
    type,
    status,
    value,
    conf
}) => {
    try {
        const {
            userId,
            agentId,
            chatId
        } = conf

        const systemPrompt = ` `

        console.log('status', status)

        if(!status) {
            const json_response = await axios.post("https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    temperature: 0.7,
                    max_tokens: 2096,
                    messages: [{
                        role: 'user',
                        content: [{
                            type: 'text',
                            text: `Analiza el siguiente texto y crea una visualización de datos apropiada:
    
    ${systemPrompt}
    
    Basándote en el contenido, genera un JSON con la siguiente estructura:
    {
    "type": "graph",
    "style": "pie|bar|flow|sequence", // Elige el estilo más apropiado para los datos
    "data": {
      "title": "Título descriptivo de la visualización",
      // Para gráficos de pie:
      "slices": [
        {"label": "Categoría 1", "value": 30},
        {"label": "Categoría 2", "value": 70}
      ],
      // Para gráficos de barras:
      "bars": [
        {"label": "Categoría 1", "value": 20},
        {"label": "Categoría 2", "value": 30}
      ],
      // Para diagramas de flujo:
      "nodes": [
        {"id": "A", "label": "Inicio"},
        {"id": "B", "label": "Proceso"},
        {"id": "C", "label": "Fin"}
      ],
      "edges": [
        {"from": "A", "to": "B"},
        {"from": "B", "to": "C"}
      ],
      // Para diagramas de secuencia:
      "participants": ["A", "B"],
      "messages": [
        {"from": "A", "to": "B", "text": "Mensaje"},
        {"from": "B", "to": "A", "text": "Respuesta"}
      ]
    }
    }
    
    Elige el tipo de visualización más apropiado basándote en los datos y el contexto proporcionado.`
                        }],
                    }],
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
    
            const value_response = extractCodeBlocks(json_response.data.choices[0].message.content)
            console.log(value_response)
            const json_response_data = JSON.parse(value_response[1])
    
    
            await sendTextData({
                res,
                data: json_response_data,
                type: 'graph',
                conf: {
                    userId: userId,
                    agentId: agentId,
                    chatId: chatId
                }
            })
            await sendTextData({
                res,
                text: 'ee',
                type: 'pause'
            })
            return {
                success: true,
                text: 'Mira tu nueva grafica'
            }
        }


        let header = {
            res,
            data: {
                status: 201,
            },
            type: 'graph',
            conf: {
                userId: userId,
                agentId: agentId,
                chatId: chatId
            }
        }


        if(status == 200) {
            header.data.status = 201
            const response = await sendTextData(header)
        } else if(status == 201) {
            header.data.status = 202
            const response = await sendTextData(header)
        } else if(status == 202) {
            header.data.status = 203
            const response = await sendTextData(header)
        } else if(status == 203) {
            header.data.status = 204
            const response = await sendTextData(header)
        } 

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetGraph
}