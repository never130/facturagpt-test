
const createApiScraping = async ({
    res,
    userId,
    agentId,
    chatId,
    threadId,
    timestamp
}) => {

    try {
        await sendTextData({
            res,
            data: {
                timestamp: timestamp,
                status: 201,
                message: 'createApiScraping',
            },
            type: 'fn',
        })


        const dbChat = await connectDB(`db_${userId}_chat`)
        const chat = await dbChat.get(chatId)

        if (!chat) {
            return {
                success: false,
                message: 'Chat not found'
            }
        }

        const targetUrl = chat.data.targetUrl || ''

        const updatedMessages = chat.messages.map(message => {
            if (message && message.timestamp !== timestamp) {
                return message
            }
        }).filter(Boolean)

        chat.threadId = null
        chat.data = {}
        chat.messages = updatedMessages
        chat.action.success = 201

        await dbChat.insert(chat)

        await sendTextData({
            res,
            type: 'api',
            data: {
                status: 201,
                message: 'createApiScraping',
                url: targetUrl,
            },
            conf: {
                userId: userId,
                agentId: agentId,
                chatId: chatId,
                threadId: threadId
            }
        })
    } catch (error) {
        console.error('Error in createApiScraping:', error);
    }

}


const cancelApiScraping = async ({
    res,
    userId,
    chatId,
    timestamp
}) => {

    try {

        const dbChat = await connectDB(`db_${userId}_chat`)
        const chat = await dbChat.get(chatId)

        if (!chat) {
            return {
                success: false,
                message: 'Chat not found'
            }
        }

        const updatedMessages = chat.messages.map(message => {
            if (message.timestamp === timestamp) {
                return {
                    ...message,
                    text: {
                        ...message.text,
                        status: 500
                    },
                }
            }

            return message
        })

        chat.threadId = null
        chat.data = {}
        chat.messages = updatedMessages
        chat.action.success = 500

        await dbChat.insert(chat)

        await sendTextData({
            res,
            data: {
                timestamp: timestamp,
                status: 500,
                message: 'Api scraping cancelled',
                updatedMessages: updatedMessages
            },
            type: 'fn',
        })
    } catch (error) {
        console.error('Error in cancelApiScraping:', error);
    }

}


const createTableFromApi = async ({
    res,
    userId,
    agentId,
    chatId,
    timestamp
}) => {

    try {
        await sendTextData({
            res,
            text: {
                timestamp: timestamp,
                status: 202,
                message: 'createTableFromApi',
            },
            type: 'fn',
        })

        const dbChat = await connectDB(`db_${userId}_chat`)
        const chat = await dbChat.get(chatId)

        if (!chat) {
            return {
                success: false,
                message: 'Chat not found'
            }
        }

        const updatedMessages = chat.messages.map(message => {
            if (message && message.timestamp !== timestamp) {
                return message
            }
        }).filter(Boolean)

        chat.threadId = null
        chat.data = {}
        chat.messages = updatedMessages
        chat.action.success = 201

        await dbChat.insert(chat)

        const data = [{
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
        }, {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
        }, {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
        }, {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
        }]

        await sendTextData({
            res,
            data: data,
            type: 'table',
            conf: {
                userId: userId,
                agentId: agentId,
                chatId: chatId
            }
        })

    } catch (error) {
        console.error('Error in createTableFromApi:', error);
    }

}



const addDoc = async ({
    res,
    token,
    prompt,
    userId,
    agentId,
    chatId,
    docId,
    timestamp
}) => {
    try {

        const dbTemplate = await connectDB(`db_${userId}_template`)

        const existingDocId = null
        const existingHtml = null

        let documentPrompt = `
  Eres un asistente especializado en la creación de documentos profesionales con múltiples páginas utilizando un conjunto de funciones HTML predefinidas.
  
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
  
  ## Instrucciones de Uso para Documentos Multi-Página
  
  1. **Estructura del Documento**: Usa page() para crear cada página del documento
  2. **Numeración**: Cada página debe tener un número y título descriptivo
  3. **Contenido por Página**: Organiza el contenido de manera lógica por páginas
  4. **Navegación**: Incluye navegación entre páginas cuando sea apropiado
  5. **Consistencia**: Mantén un estilo consistente en todas las páginas
  
  ## IMPORTANTE - Estructura de Secciones e Identificadores Únicos
  
  **REGLAS OBLIGATORIAS:**
  1. **Todo el contenido debe estar dentro de secciones**: Cada elemento HTML se envuelve automáticamente en una sección con ID único
  2. **Identificadores únicos**: Cada elemento debe tener un identificador único para permitir modificaciones posteriores
  3. **Estructura jerárquica**: Usa secciones anidadas para organizar el contenido de manera lógica
  
  **Formato de uso:**
  - Para páginas: page(content, pageNumber, "page-title")
  - Para secciones: section(content, "section-id")
  - Para párrafos: paragraph(text, "paragraph-id") 
  - Para títulos: title1(text, "title-id")
  - Para listas: ul(items, "list-id")
  - Para tablas: table(headers, rows, "table-id")
  
  **Ejemplo de estructura correcta:**
  \`\`\`javascript
  page(
    section(
      title1("Título Principal", "main-title") +
      paragraph("Contenido del párrafo", "main-content") +
      section(
        title2("Subtítulo", "subtitle") +
        ul(["Item 1", "Item 2"], "list-items")
      , "subsection-1")
    , "main-section")
  , 1, "Página Principal")
  \`\`\`
  
  ## Ejemplo de Documento Multi-Página
  
  \`\`\`javascript
  page(
    section(
      pageHeader("Manual de Usuario", "Guía Completa") +
      title1("Introducción", "intro-title") +
      paragraph("Este manual le ayudará a utilizar nuestro software.", "intro-content") +
      pageFooter(1, 3)
    , "intro-section")
  , 1, "Introducción") +
  page(
    section(
      pageHeader("Manual de Usuario", "Guía Completa") +
      title1("Instalación", "installation-title") +
      paragraph("Siga estos pasos para instalar el software:", "installation-content") +
      section(
        ol(["Paso 1", "Paso 2", "Paso 3"], "installation-steps")
      , "steps-section") +
      pageFooter(2, 3)
    , "installation-section")
  , 2, "Instalación") +
  page(
    section(
      pageHeader("Manual de Usuario", "Guía Completa") +
      title1("Configuración", "config-title") +
      paragraph("Configure el software según sus necesidades.", "config-content") +
      section(
        table(["Parámetro", "Valor", "Descripción"], [["param1", "valor1", "desc1"]], "config-table")
      , "table-section") +
      pageFooter(3, 3)
    , "config-section")
  , 3, "Configuración")
  \`\`\`
  
  ## Solicitud del Usuario
  
  ${prompt}
  
  ${existingDocId ? (`
  ## Documento Existente para Editar
  
  ID del documento: ${existingDocId}
  HTML actual del documento:
  
  ${existingHtml}
  
  INSTRUCCIONES ESPECIALES PARA EDICIÓN:
  - Mantén los identificadores existentes cuando sea posible
  - Solo modifica las secciones que el usuario solicite cambiar
  - Preserva la estructura general del documento
  - Agrega nuevos identificadores únicos para elementos nuevos
  `) : ''}
  
  ## Respuesta Requerida
  
  Devuelve ÚNICAMENTE el código JavaScript que genera el HTML del documento, sin bloques de código markdown, sin texto adicional ni explicaciones.
  
  Ejemplo de respuesta:
  page(
    section(
      pageHeader("Título del Documento", "Subtítulo") +
      title1("Contenido de la página", "main-title") +
      paragraph("Contenido del documento", "main-content") +
      pageFooter(1, 1)
    , "main-content-section")
  , 1, "Página Principal")
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


        const completeHtml = '<div class="document-container">' + generatedHtml + '</div>'


        const docData = {
            _id: existingDocId || uuidv4(),
            html: completeHtml,
            code: documentCode,
            prompt: prompt,
            createdAt: existingDocId ? undefined : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        await dbTemplate.insert(docData)


        await sendTextData({
            res,
            data: {
                id: docData._id,
                docId: docData._id,
                html: generatedHtml,
                code: documentCode,
                status: 200,
                message: existingDocId ? 'Documento actualizado correctamente' : 'Documento creado correctamente'
            },
            type: 'doc',
            conf: {
                userId: userId,
                agentId: agentId,
                chatId: chatId,
                docId: docData._id
            }
        })




        const dbChat = await connectDB(`db_${userId}_chat`)
        const chat = await dbChat.get(chatId)

        if (!chat) {
            return {
                success: false,
                message: 'Chat not found'
            }
        }

        const updatedMessages = chat.messages.map(message => {
            if (message && message.timestamp !== timestamp) {
                return message
            }
        }).filter(Boolean)

        chat.threadId = null
        chat.messages = updatedMessages
        chat.action.success = 200

        await dbChat.insert(chat)

    } catch (error) {
        console.error('Error in addDoc:', error);
    }

}


const openDoc = async ({
    res,
    userId,
    agentId,
    chatId,
    timestamp
}) => {
    try {

        await sendTextData({
            res,
            text: {
                timestamp: timestamp,
                status: 201,
                message: 'openDoc',
            },
            type: 'doc',
        })

        const dbChat = await connectDB(`db_${userId}_chat`)
        const chat = await dbChat.get(chatId)

        if (!chat) {
            return {
                success: false,
                message: 'Chat not found'
            }
        }

        const updatedMessages = chat.messages.map(message => {
            if (message && message.timestamp !== timestamp) {
                return message
            }
        }).filter(Boolean)

        chat.threadId = null

        chat.messages = updatedMessages
        chat.action.success = 201

        await dbChat.insert(chat)


    } catch (error) {
        console.error('Error in openDoc:', error);
    }

}

const cancelDoc = async ({
    res,
    userId,
    chatId,
    timestamp
}) => {
    try {

        await sendTextData({
            res,
            text: {
                timestamp: timestamp,
                status: 202,
                message: 'cancelDoc',
            },
            type: 'doc',
        })

        const dbChat = await connectDB(`db_${userId}_chat`)
        const chat = await dbChat.get(chatId)

        if (!chat) {
            return {
                success: false,
                message: 'Chat not found'
            }
        }

        const updatedMessages = chat.messages.map(message => {
            if (message && message.timestamp !== timestamp) {
                return message
            }
        }).filter(Boolean)

        chat.threadId = null
        chat.messages = updatedMessages
        chat.action.success = 202

        await dbChat.insert(chat)


    } catch (error) {
        console.error('Error in cancelDoc:', error);
    }
}

module.exports = {
    createApiScraping,
    cancelApiScraping,
    createTableFromApi,
    addDoc,
    openDoc,
    cancelDoc
}