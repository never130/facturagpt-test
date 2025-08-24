const { connectDB } = require('../automate/utils');
const { sendTextData, sendRealTime } = require('../processChat');
const fs = require('fs');
const path = require('path');


const meetApp = async ({ res, prompt, type, conf }) => {

  try {
    const assistantResult = await assistantAgent({
      res,
      prompt: `Vamos a crear una aplicación React. Necesito que me ayudes a definir los detalles.`,
      token,
      agent,
      userId: id,
      agentId: agentId,
      chatId: chatId,
      appId: appId || 'new-app',
      action: {
        text: 'Aplicación React creada exitosamente',
        automate: []
      },
      data: {
        appName: {
          description: "Nombre de la aplicación",
          type: "text",
          required: true
        },
        appDescription: {
          description: "Descripción de lo que hace la aplicación",
          type: "text",
          required: true
        },
        appType: {
          description: "Tipo de aplicación (web, dashboard, ecommerce, blog, portfolio, etc.)",
          type: "text",
          required: true
        },
        features: {
          description: "Características principales que debe tener la aplicación (separadas por comas)",
          type: "text",
          required: false
        },
        styling: {
          description: "Estilo visual preferido (moderno, minimalista, corporativo, colorido, etc.)",
          type: "text",
          required: false
        },
        components: {
          description: "Componentes específicos que debe incluir (navbar, sidebar, forms, tables, etc.)",
          type: "text",
          required: false
        }
      }
    });

    if (assistantResult.success && assistantResult.data?.type === 'end-process') {
      await generateReactApp({
        res,
        token,
        prompt,
        appData: assistantResult.data,
        conf: {
          userId: id,
          agentId: agentId,
          chatId: chatId,
          appId: appId || 'new-app'
        }
      });
    }

  } catch (error) {
    console.error('Error al generar la aplicación React. Por favor, intenta de nuevo.', error);
  }
}


module.exports = { meetApp };



const generateReactApp = async ({
  res,
  token,
  prompt,
  appData,
  conf,
  appId
}) => {
  try {
    const { userId, agentId, chatId, appId } = conf;

    const appName = appData.appName || 'ReactApp';
    const appDescription = appData.appDescription || 'Una aplicación React moderna';
    const appType = appData.appType || 'web';
    const features = appData.features || '';
    const styling = appData.styling || 'moderno';
    const components = appData.components || '';

    const reactPrompt = `
Genera una aplicación React completa basada en los siguientes requisitos:

**Información de la aplicación:**
- Nombre: ${appName}
- Descripción: ${appDescription}
- Tipo: ${appType}
- Características: ${features}
- Estilo: ${styling}
- Componentes: ${components}

**Requisitos técnicos:**
- Usa React 18+ con hooks
- Usa Tailwind CSS para estilos
- Crea una estructura de archivos organizada
- Incluye componentes reutilizables
- Usa TypeScript para mejor tipado
- Incluye un README.md con instrucciones
- Crea un package.json con dependencias necesarias

**Estructura de archivos requerida:**
- src/App.tsx (componente principal)
- src/components/ (carpeta de componentes)
- src/pages/ (carpeta de páginas)
- src/utils/ (carpeta de utilidades)
- src/types/ (carpeta de tipos TypeScript)
- public/index.html
- package.json
- README.md
- tailwind.config.js
- tsconfig.json

**Reglas importantes:**
- El código debe ser funcional y listo para usar
- Usa las mejores prácticas de React
- Incluye comentarios explicativos
- El diseño debe ser responsive
- Usa iconos de Heroicons o similar
- Incluye estados de carga y error
- Usa React Router para navegación si es necesario

Genera el código completo para cada archivo en formato JSON con la siguiente estructura:
{
  "files": {
    "src/App.tsx": "contenido del archivo",
    "src/components/Header.tsx": "contenido del archivo",
    ...
  }
}
`;

   

    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: reactPrompt
        }],

        stream: true
      },
      responseType: 'stream'
    });



    let text = ''
    let buffer = ''
    const MIN_CHUNK_SIZE = 50



    response.data.on('data', async chunk => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '');
          if (jsonStr === '[DONE]') {
            if (buffer.length > 0) {
              await sendTextData({
                res,
                data: {
                  path: prompt.path,
                  buffer,
                },
                type: 'app',
                conf: {
                  appId: appId
                }
              })
              text += buffer
              buffer = ''
            }
            return;
          }

          try {
            const json = JSON.parse(jsonStr);
            const content = json.choices?.[0]?.delta?.content;

            if (content) {
              buffer += content

              if (buffer.length >= MIN_CHUNK_SIZE) {
                await sendTextData({
                  res,
                  data: {
                    path: prompt.path,
                    buffer,
                  },
                  type: 'app',
                  conf: {
                    appId: appId
                  }
                })
                text += buffer
                buffer = ''
              }
            }
          } catch (err) {
            console.error('Error al parsear JSON:', err.message);
          }
        }
      }
    });

    response.data.on('end', async () => {

      if (userId && agentId && chatId) {
        await sendTextData({
          res,
          data: {
            path: prompt.path,
            buffer: text,
          },
          type: 'app',
          conf: {
            userId: userId,
            agentId: agentId,
            chatId: chatId,
            appId: appId
          }
        })
      }

      res.end();
      return {
        success: true,
        text: text
      }
    });

    response.data.on('error', err => {
      console.error('Error de stream:', err.message);
      return {
        success: false,
        text: 'Error al procesar la solicitud2'
      }
    });


  } catch (error) {
    console.error('Error generating React app:', error);

    await sendTextData({
      res,
      text: 'Error al generar la aplicación React. Por favor, intenta de nuevo.',
      type: 'text',
      conf: {
        userId: conf.userId,
        agentId: conf.agentId,
        chatId: conf.chatId
      }
    });
  }
};
