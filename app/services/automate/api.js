const { default: axios } = require('axios');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const { connectDB } = require("../../controllers/utils");

const { extractCodeBlocks } = require("./utils");


const { sendTextData } = require("../processChat");



const scrapApi = async (req, res) => {
  try {
    const user = req.user
    const id = user._id.split("_").pop()
    const token = user.tokenGPT;

    const { web } = JSON.parse(req.body);
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    await page.goto(web);

    let faviconBase64 = null;
    let faviconMimeType = 'image/png'; 

    try {
      const faviconInfo = await page.evaluate(() => {
        const favicon = document.querySelector('link[rel="icon"][type*="png"]') ||
          document.querySelector('link[rel="icon"][type*="svg"]') ||
          document.querySelector('link[rel="icon"]') ||
          document.querySelector('link[rel="shortcut icon"]') ||
          document.querySelector('link[rel="apple-touch-icon"]');

        if (favicon) {
          let mimeType = favicon.type || 'image/png';
          const url = favicon.href;

          if (url.includes('.svg')) {
            mimeType = 'image/svg+xml';
          } else if (url.includes('.ico')) {
            mimeType = 'image/x-icon';
          } else if (url.includes('.jpg') || url.includes('.jpeg')) {
            mimeType = 'image/jpeg';
          } else if (url.includes('.webp')) {
            mimeType = 'image/webp';
          }

          return {
            url: favicon.href,
            type: mimeType
          };
        }

        return {
          url: '/favicon.ico',
          type: 'image/x-icon'
        };
      });


      if (faviconInfo.url && faviconInfo.url !== '/favicon.ico') {
        try {
          let faviconUrl = faviconInfo.url;
          if (faviconUrl.startsWith('/')) {
            faviconUrl = new URL(faviconUrl, web).href;
          } else if (!faviconUrl.startsWith('http')) {
            faviconUrl = new URL(faviconUrl, web).href;
          }

          const faviconResponse = await page.goto(faviconUrl);
          if (faviconResponse && faviconResponse.ok()) {
            const buffer = await faviconResponse.body();
            faviconBase64 = buffer.toString('base64');
            faviconMimeType = faviconInfo.type;
          }
        } catch (error) {
        }
      }

      if (!faviconBase64) {
        try {
          const faviconResponse = await page.goto(new URL('/favicon.ico', web));
          if (faviconResponse && faviconResponse.ok()) {
            const buffer = await faviconResponse.body();
            faviconBase64 = buffer.toString('base64');
            faviconMimeType = 'image/x-icon';
          }
        } catch (error) {
          console.error("Error al obtener favicon por defecto:", error.message);
        }
      }

      if (faviconBase64) {

        if (faviconBase64.length > 20 * 1024 * 1024) {
          faviconBase64 = null;
        }
      } else {
        console.error("No se pudo obtener el favicon");
      }


    } catch (error) {
      console.error("Error general al obtener favicon:", error.message);
    }

    const pageText = await page.evaluate(() => {
      function extractAllText(element) {
        let text = '';
        
        if (element.textContent) {
          text += element.textContent + ' ';
        }
        
        const attributes = ['title', 'alt', 'placeholder', 'aria-label', 'data-content'];
        attributes.forEach(attr => {
          if (element.getAttribute(attr)) {
            text += element.getAttribute(attr) + ' ';
          }
        });
        
        const codeElements = element.querySelectorAll('pre, code, .code, .api-code, .endpoint, .method');
        codeElements.forEach(codeEl => {
          text += codeEl.textContent + ' ';
        });
        
        const docElements = element.querySelectorAll('.documentation, .api-docs, .endpoint-docs, .parameter, .response');
        docElements.forEach(docEl => {
          text += docEl.textContent + ' ';
        });
        
        return text;
      }
      
      const bodyText = extractAllText(document.body);
      
      const innerText = document.body.innerText || '';
      
      const combinedText = bodyText + ' ' + innerText;
      
      return combinedText;
    });


    const lines = [];
    let currentChunk = '';
    const words = pageText.slice(0, 10000).split(/\s+/);

    for (const word of words) {
      if ((currentChunk + ' ' + word).length >= 500) {
        if (currentChunk) {
          lines.push(currentChunk.trim());
        }
        currentChunk = word;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + word;
      }
    }

    if (currentChunk.trim()) {
      lines.push(currentChunk.trim());
    }

    if (lines.length === 0) {
      lines.push(pageText);
    }

    for (const line of lines) {
      await sendTextData({
        res,
        text: line,
        type: 'text'
      })
    }

    const systemPrompt = `
        Eres un experto en análisis de APIs. Analiza el siguiente contenido de una página web que contiene documentación de una API y extrae TODA la información disponible.

        CONTENIDO A ANALIZAR:
        ${pageText}

        INSTRUCCIONES:
        1. Identifica TODOS los endpoints disponibles en la documentación
        2. Para cada endpoint, extrae TODA la información disponible
        3. Si falta información, indícalo claramente
        4. Devuelve un JSON estructurado con la siguiente estructura:

        {
          "name": "Nombre de la API",
          "baseUrl": "URL base de la API",
          "version": "Versión de la API",
          "description": "Descripción general de la API"
          "endpoints": [
            {
              "name": "Nombre del endpoint",
              "method": "GET|POST|PUT|DELETE|PATCH",
              "path": "/ruta/completa/del/endpoint",
              "description": "Descripción detallada del endpoint",
              "authentication": "Tipo de autenticación requerida (si aplica)",
              "parameters": {
                "path": [
                  {
                    "name": "nombre_parametro",
                    "type": "string|number|boolean|object|array",
                    "required": true|false,
                    "description": "Descripción del parámetro",
                    "example": "ejemplo_valor"
                  }
                ],
                "query": [
                  {
                    "name": "nombre_parametro",
                    "type": "string|number|boolean|object|array",
                    "required": true|false,
                    "description": "Descripción del parámetro",
                    "example": "ejemplo_valor"
                  }
                ],
                "body": {
                  "type": "object|array",
                  "schema": {
                    "properties": {
                      "campo1": {
                        "type": "string|number|boolean|object|array",
                        "required": true|false,
                        "description": "Descripción del campo",
                        "example": "ejemplo_valor"
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Respuesta exitosa",
                  "schema": {
                    "type": "object|array",
                    "properties": {
                      "campo1": {
                        "type": "string|number|boolean|object|array",
                        "description": "Descripción del campo"
                      }
                    }
                  },
                  "example": {
                    "campo1": "valor_ejemplo"
                  }
                },
                "400": {
                  "description": "Error de validación",
                  "schema": {
                    "type": "object",
                    "properties": {
                      "error": {
                        "type": "string",
                        "description": "Mensaje de error"
                      }
                    }
                  }
                }
              },
              "examples": [
                {
                  "name": "Ejemplo de uso",
                  "request": {
                    "method": "GET",
                    "url": "https://api.ejemplo.com/endpoint",
                    "headers": {
                      "Authorization": "Bearer token"
                    },
                    "body": {
                      "parametro": "valor"
                    }
                  },
                  "response": {
                    "status": 200,
                    "body": {
                      "resultado": "datos"
                    }
                  }
                }
              ]
            }
          ]
        }

        REGLAS IMPORTANTES:
        - No invites o incluyas datos por defecto, solo lo que se encuentre en la documentación
        - NO omitas ningún endpoint que encuentres
        - Si no hay información para un campo, usa null o un objeto vacío
        - Mantén la estructura JSON válida
        - Incluye TODOS los métodos HTTP disponibles para cada endpoint
        - Extrae TODOS los parámetros (path, query, body) disponibles
        - Incluye TODAS las respuestas posibles (200, 400, 401, 403, 404, 500, etc.)
        - Si hay ejemplos de código, inclúyelos en el campo "examples"
        - Si hay información de autenticación, inclúyela
        - Si hay rate limits o límites de uso, inclúyelos en la descripción
        - Si hay headers requeridos, inclúyelos en los ejemplos

        Devuelve ÚNICAMENTE el JSON válido, sin texto adicional ni explicaciones.
        `;
s

    const messages = [
      { role: "user", content: systemPrompt }
    ];


    

    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 12096,
      messages: messages
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });


    const [codeType, cleanedCode] = await extractCodeBlocks(response.data.choices[0].message.content);


    let api = JSON.parse(cleanedCode)

    if (faviconBase64) {
      api.image = {
        data: faviconBase64,
        mimeType: faviconMimeType
      };
    }

 

    const testDir = path.join(__dirname, 'test');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const apiName = api.name ? api.name.replace(/[^a-zA-Z0-9]/g, '_') : `api_${id}`;
    const fileName = `${apiName}.json`;
    const filePath = path.join(testDir, fileName);

    const fsPromse = await fs.promises.writeFile(filePath, JSON.stringify(api, null, 2))

    const dbApi = await connectDB(`db_${id}_api`)

    const result = await dbApi.insert(api)


    api._id = result.id
    api.image = `data:${faviconMimeType};base64,${faviconBase64}`

    await sendTextData({
        res,
        data: api,
        type: 'stream'
    })


  } catch (error) {
    console.error('Error en testDemo:', error);

    return false
  }
}

module.exports = {
  scrapApi
};