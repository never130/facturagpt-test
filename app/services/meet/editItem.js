const axios = require("axios");
const { extractCodeBlocks, connectDB } = require("../automate/utils");
const { sendTextData } = require("../processChat.js");


const meetEditItem = async ({
    res,
    prompt,
    type,
    conf
}) => {
    try {
        const type = json_response?.type.split('-')[1]

        if (type === 'docs') {

          try {
            const dbDocs = await connectDB(`db_${id}_docs`)
            const result = await dbDocs.find({
              selector: {
                _id: isRAG[0].id
              },
              limit: 1
            })

            if (result.docs.length === 0) {
              await sendTextData({
                res,
                text: `No se encontró el documento #${isRAG[0].id}`,
                type: 'text',
                conf: {
                  userId: id,
                  agentId: agentId,
                  chatId: chatId
                }
              })

              resolve({
                success: false,
                text: 'Documento no encontrado'
              })
              return false
            }

            const existingDoc = result.docs[0]
            const existingDocId = existingDoc._id
            const existingHtml = existingDoc.html || ''
            const existingCode = existingDoc.code || ''

            let documentPrompt = `
Eres un asistente especializado en la creación y edición de documentos profesionales con múltiples páginas utilizando un conjunto de funciones HTML predefinidas.

## Funciones HTML Disponibles

### Estructura de Páginas
- page(content, pageNumber, title) - Crea una página completa con numeración
- pageHeader(title, subtitle) - Encabezado de página
- pageFooter(pageNumber, totalPages) - Pie de página con numeración
- pageBreak() - Separador de páginas

### Títulos y Encabezados
- title1(text, id) - Título principal H1
- title2(text, id) - Subtítulo H2  
- title3(text, id) - Subtítulo H3
- title4(text, id) - Subtítulo H4
- title5(text, id) - Subtítulo H5
- title6(text, id) - Subtítulo H6

### Contenido de Texto
- paragraph(text, id) - Párrafos de texto
- strong(text) - Texto en negrita
- em(text) - Texto en cursiva
- code(text) - Código inline
- pre(text) - Bloques de código
- blockquote(text) - Citas destacadas

### Listas
- ul(items, id) - Listas no numeradas
- ol(items, id) - Listas numeradas
- li(text) - Elementos de lista individuales

### Enlaces e Imágenes
- a(text, href) - Enlaces
- img(src, alt) - Imágenes

### Contenedores y Estructura
- div(content, id) - Contenedores div
- span(text) - Elementos span
- section(content, id) - Secciones
- article(content, id) - Artículos
- aside(content, id) - Contenido lateral
- header(content, id) - Encabezados
- footer(content, id) - Pie de página
- nav(content, id) - Navegación
- main(content, id) - Contenido principal

### Tablas
- table(headers, rows, id) - Tablas con encabezados y filas

### Elementos de Separación
- hr() - Líneas horizontales
- br() - Saltos de línea

### Formularios
- form(content, action, method) - Formularios
- input(type, name, placeholder, value) - Campos de entrada
- textarea(name, placeholder, rows, cols) - Áreas de texto
- button(text, type) - Botones
- label(text, forAttr) - Etiquetas
- select(options, name) - Listas desplegables
- option(text, value) - Opciones de selección

## Documento Existente para Editar

ID del documento: ${existingDocId}

Código JavaScript actual del documento:
\`\`\`javascript
${existingCode}
\`\`\`

HTML actual del documento:
${existingHtml}

## Solicitud de Edición del Usuario

${prompt}

## Instrucciones para la Edición

1. **Mantén los identificadores existentes** cuando sea posible para preservar la estructura
2. **Solo modifica las secciones** que el usuario solicite cambiar
3. **Preserva la estructura general** del documento
4. **Agrega nuevos identificadores únicos** para elementos nuevos
5. **Todo el contenido debe estar dentro de secciones** con IDs únicos
6. **Si el usuario quiere eliminar un campo**, usa el parámetro removeField en el JSON de respuesta
7. **Si el usuario quiere eliminar todo el documento**, devuelve type: "delete-docs"

## Respuesta Requerida

Devuelve ÚNICAMENTE el código JavaScript que genera el HTML del documento editado, sin bloques de código markdown, sin texto adicional ni explicaciones.

Ejemplo de respuesta:
section(
  title1("Título del Documento", "main-title") +
  section(
    paragraph("Contenido del documento", "main-content")
  , "content-section")
, "main-section")
`

            const documentResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
              model: "gpt-4o-mini",
              temperature: 0.7,
              max_tokens: 4000,
              messages: [{
                role: 'user',
                content: documentPrompt
              }]
            }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              }
            });

            const generatedCode = documentResponse.data.choices[0].message.content

            const documentCode = generatedCode.trim()

            if (documentCode.toLowerCase().includes('delete-docs') || json_response?.data?.removeField === 'all') {
              await dbDocs.destroy(existingDoc._id, existingDoc._rev)

              await sendTextData({
                res,
                text: `Documento #${existingDocId} eliminado correctamente`,
                type: 'text',
                conf: {
                  userId: id,
                  agentId: agentId,
                  chatId: chatId
                }
              })

              resolve({
                success: true,
                text: 'Documento eliminado correctamente'
              })
              return false
            }

            const htmlFunctions = {
              page: (content, pageNumber, title) => `
                <div class="page" id="page-${pageNumber}" data-page="${pageNumber}" data-title="${title}">
                  <div class="page-content">
                    ${content}
                  </div>
                  
                </div>
              `,
              pageHeader: (title, subtitle) => `
                <section id="page-header-${uuidv4()}" class="page-header">
                  <h1 class="document-title">${title}</h1>
                  ${subtitle ? `<h2 class="document-subtitle">${subtitle}</h2>` : ''}
                  <hr class="header-divider">
                </section>
              `,
              pageFooter: (pageNumber, totalPages) => `
                <section id="page-footer-${uuidv4()}" class="page-footer">
                  <hr class="footer-divider">
                  <div class="footer-content">
                    <span class="page-number">Página ${pageNumber} de ${totalPages}</span>
                    <span class="document-date">${new Date().toLocaleDateString()}</span>
                  </div>
                </section>
              `,
              pageBreak: () => '<section id="page-break-' + uuidv4() + '" class="page-break"></section>',

              title1: (text, id = null) => `<section id="${id || 'title1-' + uuidv4()}"><h1>${text}</h1></section>`,
              title2: (text, id = null) => `<section id="${id || 'title2-' + uuidv4()}"><h2>${text}</h2></section>`,
              title3: (text, id = null) => `<section id="${id || 'title3-' + uuidv4()}"><h3>${text}</h3></section>`,
              title4: (text, id = null) => `<section id="${id || 'title4-' + uuidv4()}"><h4>${text}</h4></section>`,
              title5: (text, id = null) => `<section id="${id || 'title5-' + uuidv4()}"><h5>${text}</h5></section>`,
              title6: (text, id = null) => `<section id="${id || 'title6-' + uuidv4()}"><h6>${text}</h6></section>`,
              paragraph: (text, id = null) => `<section id="${id || 'paragraph-' + uuidv4()}"><p>${text}</p></section>`,
              strong: (text) => `<section id="strong-' + uuidv4() + '"><strong>${text}</strong></section>`,
              em: (text) => `<section id="em-' + uuidv4() + '"><em>${text}</em></section>`,
              code: (text) => `<section id="code-' + uuidv4() + '"><code>${text}</code></section>`,
              pre: (text) => `<section id="pre-' + uuidv4() + '"><pre>${text}</pre></section>`,
              blockquote: (text) => `<section id="blockquote-' + uuidv4() + '"><blockquote>${text}</blockquote></section>`,
              ul: (items, id = null) => `<section id="${id || 'ul-' + uuidv4()}"><ul>${items.map(item => `<li>${item}</li>`).join('')}</ul></section>`,
              ol: (items, id = null) => `<section id="${id || 'ol-' + uuidv4()}"><ol>${items.map(item => `<li>${item}</li>`).join('')}</ol></section>`,
              li: (text) => `<section id="li-' + uuidv4() + '"><li>${text}</li></section>`,
              a: (text, href) => `<section id="a-' + uuidv4() + '"><a href="${href}">${text}</a></section>`,
              img: (src, alt) => `<section id="img-' + uuidv4() + '"><img src="${src}" alt="${alt}"></section>`,
              div: (content, id = null) => `<section id="${id || 'div-' + uuidv4()}"><div>${content}</div></section>`,
              span: (text) => `<section id="span-' + uuidv4() + '"><span>${text}</span></section>`,
              section: (content, id = null) => `<section id="${id || 'section-' + uuidv4()}">${content}</section>`,
              article: (content, id = null) => `<section id="${id || 'article-' + uuidv4()}"><article>${content}</article></section>`,
              aside: (content, id = null) => `<section id="${id || 'aside-' + uuidv4()}"><aside>${content}</aside></section>`,
              header: (content, id = null) => `<section id="${id || 'header-' + uuidv4()}"><header>${content}</header></section>`,
              footer: (content, id = null) => `<section id="${id || 'footer-' + uuidv4()}"><footer>${content}</footer></section>`,
              nav: (content, id = null) => `<section id="${id || 'nav-' + uuidv4()}"><nav>${content}</nav></section>`,
              main: (content, id = null) => `<section id="${id || 'main-' + uuidv4()}"><main>${content}</main></section>`,
              table: (headers, rows, id = null) => {
                const headerRow = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`
                const dataRows = rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')
                return `<section id="${id || 'table-' + uuidv4()}"><table><thead>${headerRow}</thead><tbody>${dataRows}</tbody></table></section>`
              },
              hr: () => '<section id="hr-' + uuidv4() + '"><hr></section>',
              br: () => '<section id="br-' + uuidv4() + '"><br></section>',
              form: (content, action = '', method = 'post') => `<section id="form-' + uuidv4() + '"><form action="${action}" method="${method}">${content}</form></section>`,
              input: (type, name, placeholder = '', value = '') => `<section id="input-' + uuidv4() + '"><input type="${type}" name="${name}" placeholder="${placeholder}" value="${value}"></section>`,
              textarea: (name, placeholder = '', rows = 4, cols = 50) => `<section id="textarea-' + uuidv4() + '"><textarea name="${name}" placeholder="${placeholder}" rows="${rows}" cols="${cols}"></textarea></section>`,
              button: (text, type = 'button') => `<section id="button-' + uuidv4() + '"><button type="${type}">${text}</button></section>`,
              label: (text, forAttr = '') => `<section id="label-' + uuidv4() + '"><label${forAttr ? ` for="${forAttr}"` : ''}>${text}</label></section>`,
              select: (options, name) => `<section id="select-' + uuidv4() + '"><select name="${name}">${options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}</select></section>`,
              option: (text, value) => `<section id="option-' + uuidv4() + '"><option value="${value}">${text}</option></section>`
            }

            const generatedHtml = (function () {
              const { page, pageHeader, pageFooter, pageBreak, title1, title2, title3, title4, title5, title6, paragraph, strong, em, code, pre, blockquote, ul, ol, li, a, img, div, span, section, article, aside, header, footer, nav, main, table, hr, br, form, input, textarea, button, label, select, option } = htmlFunctions;
              return eval(documentCode);
            })()


           

            const pageStyles = ``
           
            const pageScript = ``

            const completeHtml = pageStyles + '<div class="document-container">' + generatedHtml + '</div>' + pageScript

            const updatedDocData = {
              ...existingDoc,
              html: completeHtml,
              code: documentCode,
              prompt: prompt,
              data: json_response.data || {},
              updatedAt: new Date().toISOString(),
            }

            await dbDocs.insert(updatedDocData)

            await sendTextData({
              res,
              data: {
                id: updatedDocData._id,
                html: generatedHtml,
                code: documentCode,
                status: 200,
                message: 'Documento editado correctamente'
              },
              type: 'doc',
              conf: {
                userId: id,
                agentId: agentId,
                chatId: chatId
              }
            })

            resolve({
              success: true,
              text: 'Documento editado correctamente'
            })
            return false

          } catch (error) {
            console.error('Error editing document:', error)

            await sendTextData({
              res,
              text: 'Error al editar el documento. Por favor, intenta de nuevo.',
              type: 'text',
              conf: {
                userId: id,
                agentId: agentId,
                chatId: chatId
              }
            })

            resolve({
              success: false,
              text: 'Error al editar el documento'
            })
            return false
          }
        }

        let db = null
        if (type === 'assets') {
          db = await connectDB(`db_${id}_assets`)
        } else if (type === 'contacts') {
          db = await connectDB(`db_${id}_contacts`)
        } else if (type === 'agents') {
          db = await connectDB(`db_${id}_agents`)
        } else {
          sendTextData({
            res,
            text: `No se encontró el ${type} #${isRAG[0].id}`,
            type: 'stream',
            conf: {
              userId: id,
              agentId: agentId,
              chatId: chatId
            }
          })

          resolve({
            success: true,
            text: 'Documento actualizado'
          })

          return false
        }

        const result = await db.find({
          selector: {
            _id: isRAG[0].id
          },
          limit: 1
        })

        if (result.docs.length == 0) {
          await sendTextData({
            res,
            text: `No se encontró el ${type} #${isRAG[0].id}`,
            type: 'stream',
            conf: {
              userId: id,
              agentId: agentId,
              chatId: chatId
            }
          })
        } else {

          const data = {
            ...result.docs[0],
            ...(json_response?.data?.removeFiled ? {} : json_response.data),
            updatedAt: new Date().toISOString(),
          }

          if (json_response.data?.removeField) {
            delete data[json_response.data.removeField]
            delete data.removeField
          }

          await db.insert(data)

          const responseRAG = cleanDataObject(data);

          await sendTextData({
            res,
            text: `Documento actualizado ${type} #${isRAG[0].id} \n 
${Object.entries(responseRAG).map(([key, value]) => `${key}: ${value}`).join('\n')}`,
            type: 'stream',
            conf: {
              userId: id,
              agentId: agentId,
              chatId: chatId
            }
          })
        }

        resolve({
          success: true,
          text: 'Documento actualizado'
        })
        return false

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    meetEditItem
}