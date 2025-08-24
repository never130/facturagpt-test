const path = require('path');
const fs = require('fs')
const { PDFDocument } = require("pdf-lib");
const { fromPath } = require('pdf2pic');
const { v4: uuidv4 } = require("uuid");
const sharp = require('sharp');
const axios = require('axios');
const { sendTextData, sendRealTime } = require('../processChat');

const nano = require("nano")("http://admin:1234@127.0.0.1:5984");

const connectDB = async (tableName) => {
  let db;
  try {
    await nano.db.get(tableName);
    db = nano.db.use(tableName);
    return db;
  } catch (error) {
    if (error.statusCode === 404) {
      try {
        await nano.db.create(tableName);
        db = nano.db.use(tableName);
        return db;
      } catch (createError) {
        console.error("Error al crear la base de datos:", createError);
        throw createError;
      }
    } else {
      console.error("Error al obtener información de la base de datos:", error);
    }
  }
};


const calculateTaxesAndDiscounts = (products) => {
  return products.map((product) => {
    let {
      productQuantity,
      productPartial,
      productDiscountRate,
      productImport,
    } = product;

    productQuantity = Number(productQuantity) || 0;
    productPartial = Number(productPartial) || 0;
    productDiscountRate = Number(productDiscountRate) || 0;
    productImport = Number(productImport) || 0;

    const productImportWithoutDiscount = parseFloat(
      (productQuantity * productPartial).toFixed(2)
    );
    const productDiscountAmount = parseFloat(
      (
        productImportWithoutDiscount -
        (productImportWithoutDiscount -
          (productImportWithoutDiscount * productDiscountRate) / 100)
      ).toFixed(2)
    );
    const productImportWithTaxes = parseFloat(
      (productImport * 1.21).toFixed(2)
    );

    return {
      ...product,
      productImportWithoutDiscount: productImportWithoutDiscount.toFixed(2),
      productDiscountAmount: productDiscountAmount.toFixed(2),
      productImportWithTaxes: productImportWithTaxes.toFixed(2),
      productDiscountRate: productDiscountRate.toFixed(2),
    };
  });
};

const convertToNumber = (input) => {
  const number = parseFloat(input);

  if (isNaN(number)) {
    return 0;
  }

  return parseFloat(number.toFixed(2));
};

const mergeResults = (resultsArray) => {
  const mergedResult = {};

  resultsArray.forEach((result) => {
    for (const key in result) {
      if (Array.isArray(result[key])) {
        mergedResult[key] = mergedResult[key] || [];
        mergedResult[key] = [...mergedResult[key], ...result[key]];
        mergedResult[key] = removeDuplicatesFromArray(mergedResult[key]);
      } else if (typeof result[key] === "object" && result[key] !== null) {
        mergedResult[key] = mergedResult[key] || {};
        mergedResult[key] = { ...mergedResult[key], ...result[key] };
      } else {
        if (!mergedResult[key]) {
          mergedResult[key] = result[key];
        }
      }
    }
  });

  return mergedResult;
};

const removeDuplicatesFromArray = (array) => {
  const seen = new Set();
  return array.filter((item) => {
    const serializedItem = JSON.stringify(item);
    return seen.has(serializedItem) ? false : seen.add(serializedItem);
  });
};

const convertPDFToPNG = async (buffer) => {
  const tempDir = path.join(__dirname, "./temp");
  const uniqueId = uuidv4();
  const tempPdfPath = path.join(tempDir, `${uniqueId}.pdf`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  await fs.promises.writeFile(tempPdfPath, buffer);

  const pdfDoc = await PDFDocument.load(buffer);
  const totalPages = pdfDoc.getPageCount();

  const pdf2pic = fromPath(tempPdfPath, {
    density: 300,
    saveFilename: uniqueId,
    savePath: tempDir,
    format: "png",
    width: 1024,
    height: 1365,
  });

  const imageBuffers = [];

  for (let page = 1; page <= totalPages; page++) {
    try {
      const pageResult = await pdf2pic(page, { responseType: "image" });

      if (pageResult && pageResult.path) {
        try {
          const pngBuffer = await fs.promises.readFile(pageResult.path);
          await sharp(pngBuffer).metadata();
          imageBuffers.push(pngBuffer);
        } catch (readError) {
          console.error(`Error reading PNG for page ${page}:`, readError);
          const retryResult = await pdf2pic(page, {
            responseType: "image",
            density: 150,
            width: 512,
            height: 682
          });
          if (retryResult && retryResult.path) {
            const retryBuffer = await fs.promises.readFile(retryResult.path);
            imageBuffers.push(retryBuffer);
          }
        }

        try {
          await fs.promises.unlink(pageResult.path);
        } catch (unlinkError) {
          console.error(`Error deleting temp file for page ${page}:`, unlinkError);
        }
      } else {
        console.warn(`Failed to convert page ${page} to PNG`);
      }
    } catch (error) {
      console.error(`Error converting page ${page} to PNG:`, error);
    }
  }

  try {
    await fs.promises.unlink(tempPdfPath);
  } catch (err) {
    console.error('Error deleting temp PDF file:', err);
  }

  return imageBuffers;
};

const replaceNotFoundWithEmptyString = (obj) => {
  for (const key in obj) {
    if (obj[key] === "NOT FOUND" || obj[key] === "notfound") {
      obj[key] = "";
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = replaceNotFoundWithEmptyString(obj[key]);
    }
  }
  return obj;
};

const extractCIF = (inputString) => {
  if (!inputString) return "";

  const sanitizedString = inputString.replace(/[\s-]/g, "");

  const cifMatch = sanitizedString.match(/(?:ES)?([A-Z])(\d{8})/i);

  if (!cifMatch) {
    return inputString;
  }

  const [, letter, numbers] = cifMatch;

  return `${letter.toUpperCase()}${numbers}`;
};

const extractNIF = (inputString) => {
  const numbersMatch = inputString?.match(/\d{8}/);
  if (!numbersMatch) return inputString;

  const numbers = numbersMatch[0];
  const regex = /[A-Z]/;
  const after = inputString.slice(numbersMatch.index + 8).match(regex);

  return after ? `${numbers}${after[0]}` : inputString;
};


const extractCodeBlocks = (fullCode) => {
  const regexTripleQuotes = /```(\w+)[\s\S]+?```/g
  let matchesTripleQuotes = [...fullCode.matchAll(regexTripleQuotes)]

  if (matchesTripleQuotes.length > 0) {
    const codeBlock = matchesTripleQuotes[0][0]
    const codeType = matchesTripleQuotes[0][1].toLowerCase()

    const cleanedCodeBlock = codeBlock
      .replace(/```(\w+)/, '')
      .replace(/```$/, '')
      .trim()

    const cleanedCodeWithoutComments = cleanedCodeBlock
      .split('\n')
      .filter((line) => !line.trim().startsWith('//'))
      .join('\n')

    return [codeType, cleanedCodeWithoutComments]
  } else {
    const regexComments = /^\/\/.*$/gm
    const cleanedCodeWithoutComments = fullCode
      .replace(regexComments, '')
      .trim()

    return ['plaintext', cleanedCodeWithoutComments]
  }
}



const saveNotificationData = async ({ selectedWorkspace }) => {
  try {
    // const id = userId?.split("_").pop();
    const dbNotifications = await connectDB(`db_${selectedWorkspace}_notifications`);

    let price = 0
    let dataCategory = []
    let dataOptions = []
    let icon = "https://facturagpt.com/assets/icon/logo.svg"
    let location = 'path>subpath'
    let email = 'me'

    const notifications = [{
      email,
      type: 'file',
      text: "Archivo encontrado",
      value: 10,
      location,
      category: [
        "excepcional",
        "current_lost",
        "social_security",
        "compensations"
      ],
      options: ["Compartir"]
    }, {
      email,
      type: 'data',
      text: "Datos procesados",
      value: 10,
      location,
      category: [
        "salary",
        "services",
        "supplies",
        "publicity",
        "banking",
      ],
      options: ["Compartir"]
    }, {
      email,
      type: 'auto',
      text: "Automatización procesada",
      value: 2,
      location,
      category: [],
      options: ["Compartir"]
    }]


    const dataNotification = notifications.map((item, index) => {
      price += item.value

      dataCategory = [...new Set([...dataCategory, item.category])];
      dataOptions = [...new Set([...dataOptions, item.options])];

      let icon = ''

      if (item.type == 'file') {
        icon = 'https://facturagpt.com/assets/icon/file.svg'
      } else if (item.type == 'data') {
        icon = 'https://facturagpt.com/assets/icon/data.svg'
      } else if (item.type == 'auto') {
        icon = 'https://facturagpt.com/assets/icon/auto.svg'
      }

      return {
        email,
        location,
        icon,
        text: item.text,
        value: item.value,
        category: item.category,
        options: item.options,
      }
    });


    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = currentDate.toLocaleString("en-US", { month: "short" });
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    const notificationId = uuidv4();

    await dbNotifications.createIndex({
      index: {
        fields: ["createdAt"],
      },
    });



    dbNotifications.insert({
      id: notificationId,
      title: "Document procesado con éxito",
      date: `${day} ${month} ${year}`,
      time: `${hours}:${minutes} ${period}`,
      month: `${currentMonth}-${currentYear}`,
      icon: icon,
      notifications: dataNotification,
      options: dataOptions,
      category: dataCategory,
      type: "pay",
      value: price,
      currency: "EUR",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

  } catch (err) {

  }
}

const saveAttachmentData = async ({ selectedWorkspace, docId, dovRev, data }) => {
  try {
    // const id = userId?.split("_").pop();

    const dbDocs = await connectDB(`db_${selectedWorkspace}_docs`);
    const dbContacts = await connectDB(`db_${selectedWorkspace}_contacts`);
    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);




    let contactId = uuidv4();

    let doc = {
      ...(docId && { _id: docId }),
      ...(dovRev && { _rev: dovRev }),
      status: 'processed',
      statusAt: new Date().toISOString(),
      name: data?.name || "factuaaa.pdf",
      mymeType: 'pdf',
      contactId: contactId,
      date: data?.invoiceDate,
      year: data?.invoiceDate,
      month: data?.invoiceDate,
      day: data?.invoiceDate,
      number: data?.numberDocument,
      total: data?.totalAmount,
      discount: data?.discountAmount,
      partial: data?.partialAmount,
    };

    let contact = {
      _id: contactId,

      contactName: data?.clientName || "",
      companyEmail: "",
      type: data?.type || "",
      companyPhoneNumber: data?.clientPhoneNumber ? [data?.clientPhoneNumber] : [],
      codeCountry: "",
      webSite: "",
      billingEmail: "",
      contactZip: "",
      country: "",
      contactCif: data?.clientCif || "",
      preferredCurrency: "",
      cardNumber: "",
      companyAddress: data?.clientAddress || "",
      companyCity: "",
      companyProvince: "",
      companyCountry: "",
      infoBill: [],
      paymethod: [],

    };

    data.productList?.map(async (asset, index) => {
      let assetId = uuidv4();
      let assetDoc = {
        _id: assetId,
        docId: docId,
        contactId: contactId,
        ref: asset?.productRef,
        name: "",
        type: "other",
        category: "other",
        taxe: "",
        provider_default: "",
        cost_production: "",
        retail_price: "",
        supplement: "",
        name_store: "",
        sku: "",
        tags: [],
        parameters: [],
        description: asset?.productDescription,
        code: asset?.code,
        generated: asset?.generated,
        maxPrice: asset?.maxPrice,
        minPrice: asset?.minPrice,
        averagePrice: asset?.averagePrice,
        supplier_name: asset?.supplier_name,
        supplier_address: asset?.supplier_address,
        quantity: asset?.productQuantity,
        unit: asset?.productUnit,
        partial: asset?.productPartial,
        import: asset?.productImport,
        discount: asset?.productDiscount,
        rate: asset?.productDiscountRate,
        partial: asset?.productPartial,
      };

      await dbAssets.insert(assetDoc);
    });

    await dbDocs.insert(doc);
    await dbContacts.insert(contact);
  } catch (err) {
    console.error("err", err);
  }
};



const validateToken = async (token) => {
  try {

    await axios.get("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true
  } catch (e) {
    return false
  }
}



const assistantPrompt = async ({
  res,
  prompt,
  token,
  conf
}) => {
  try {

    const {
      userId,
      agentId,
      chatId,
      threadId,
      docId,
      appId,
      scrapId,
    } = conf

    // Interlocutors:
    // - Whatsapp
    // - Gmail
    // - OpenAi
    // - FacturaGPT

    // El tema de la conversación es sobre:
    //  - Conectar una API de whatsapp, usa conectando..
    //  - Analizar el número de whatsapp, estoy conectado haciendo una lista
    //  - Hablar con OpenAi para analizar las conversaciones
    //  - Usar OpenAi para crear una tabla de datos
    //  - Pedir conectarte a Gmail para analizar mensajes
    //  - Analizar con OpenAi los datos del email
    //  - Conectar a la plataforma de FacturaGPT

    const num = prompt?.num || 20

    const interlocutors = prompt?.interlocutors || ['PDF', 'Tu del futuro']

    const kpis = prompt?.kpis || []

    const systemPrompt = [{
      role: 'system',
      content: `
      Eres un asistente experto en crear guiones de conversación. Genera un guión en formato JSON con la siguiente estructura:
      {
        "duration": number, // Duración en segundos calculada como: (palabras_totales * 0.5) + (num_interlocutores * 2)
        "interlocutors": [
          {
            "name": string,
            "role": string,
            "temperature": number, // Entre 0 y 1, donde 0 es muy formal/frío y 1 es muy casual/emotivo
            "personality": string
          }
        ],
        "conversation": [
          {
            "speaker": string,
            "text": string,
            "emotion": string,
            "timestamp": number
          }
        ]
      }

      Utiliza el formato de guión profesional y asegúrate de que la conversación sea natural y fluida.
      Los timestamps deben ser coherentes con la duración total calculada.

      Número máximo de mensajes: ${num}

      Interlocutores:
      ${interlocutors.map((interlocutor) => `- ${interlocutor}`).join('\n')}

      El tema de la conversación es sobre:
      ${kpis.map((kpi) => `- ${kpi}`).join('\n')}
      `
    }]

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: systemPrompt,
      max_tokens: 6000,
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })


    const content_value = extractCodeBlocks(response.data.choices[0].message.content)
    // const json = JSON.parse(content_value[1])
    
    const value = JSON.parse(content_value[1])
    console.log('json response', value)
    await sendTextData({
      res,
      data: {
        data: value,
        status: 200
      },
      type: 'script',
      conf: {
        userId,
        agentId,
        chatId,
        scrapId
      }
    })


  } catch (error) {
    console.error('Error in assistantPrompt:', error);
  }
}


const assistantAgent = async ({
  res,
  prompt,
  token,
  agent,
  userId,
  agentId,
  chatId,
  threadId = null,
  docId = null,
  appId = null,
  scrapId = null,
  action = [],
  data = null,
}) => {

  const getCurrentId = () => {
    if (threadId) return { id: threadId, type: 'threadId' };
    if (docId) return { id: docId, type: 'docId' };
    if (appId) return { id: appId, type: 'appId' };
    if (scrapId) return { id: scrapId, type: 'scrapId' };
    return { id: uuidv4(), type: 'threadId' };
  };

  const buildConf = (currentIdInfo) => {
    return {
      userId: userId,
      agentId: agentId,
      chatId: chatId,
      threadId: currentIdInfo.type === 'threadId' ? currentIdInfo.id : null,
      docId: currentIdInfo.type === 'docId' ? currentIdInfo.id : null,
      appId: currentIdInfo.type === 'appId' ? currentIdInfo.id : null,
      scrapId: currentIdInfo.type === 'scrapId' ? currentIdInfo.id : null
    };
  };

  const fnAgent = async ({
    res,
    token,
    prompt,
    userId,
    agentId,
    chatId,
    threadId,
    docId,
    appId,
    scrapId
  }) => {
    try {
      const {
        tone = 50,
        answer = 50,
        ageOfInterlocutor = 50,
        availability = 50,
        useOfEmojis = 50,
        inclusiveLanguage = 50,
        formality = 50,
        presicion = 50,
        coherence = 50,
        emotionalLanguage = 50,
      } = agent || {}


      const arr = []

      const systemPrompt = [{
        role: 'user',
        content: `
Eres un interlocutor que debe obtener un dato específico de un usuario a través de una pregunta.

${prompt}

**CONFIGURACIÓN DE PERSONALIDAD DEL INTERLOCUTOR (Escala 0-100%, por defecto 50%)**

${arr}
- **Tono (${tone || 50}%)**: Ajusta el estilo general del lenguaje
  - 0-20%: Muy directo y desenfadado
  - 21-40%: Informal y cercano
  - 41-60%: Equilibrado y natural
  - 61-80%: Formal y estructurado
  - 81-100%: Muy sobrio y profesional

- **Respuesta (${answer || 50}%)**: Define el nivel de detalle
  - 0-20%: Resumen básico (1-2 frases)
  - 21-40%: Explicación concisa
  - 41-60%: Respuesta equilibrada
  - 61-80%: Explicación detallada
  - 81-100%: Análisis profundo paso a paso

- **Edad/Experiencia del interlocutor (${ageOfInterlocutor || 50}%)**: Adapta según el nivel de conocimiento
  - 0-20%: Principiante (explicaciones muy básicas)
  - 21-40%: Básico-intermedio
  - 41-60%: Intermedio (equilibrado)
  - 61-80%: Intermedio-avanzado
  - 81-100%: Experto (conceptos avanzados)

- **Disponibilidad (${availability || 50}%)**: Controla la disposición a ayudar
  - 0-20%: Estilo neutro y distante
  - 21-40%: Moderadamente disponible
  - 41-60%: Equilibrado en disponibilidad
  - 61-80%: Proactivo y cercano
  - 81-100%: Muy acompañante y proactivo

- **Uso de emojis (${useOfEmojis || 50}%)**: Cantidad de emojis en las respuestas
  - 0-20%: Ningún emoji
  - 21-40%: Emojis sutiles ocasionales
  - 41-60%: Uso equilibrado de emojis
  - 61-80%: Emojis frecuentes para énfasis
  - 81-100%: Muchos emojis expresivos

- **Lenguaje inclusivo (${inclusiveLanguage || 50}%)**: Atención a diversidad y neutralidad
  - 0-20%: Lenguaje tradicional sin consideraciones especiales
  - 21-40%: Inclusión básica
  - 41-60%: Equilibrado en inclusión
  - 61-80%: Lenguaje muy inclusivo
  - 81-100%: Máxima atención a diversidad y neutralidad

- **Formalidad (${formality || 50}%)**: Estilo relajado vs profesional
  - 0-20%: Muy relajado y casual
  - 21-40%: Informal
  - 41-60%: Equilibrado entre formal e informal
  - 61-80%: Profesional
  - 81-100%: Muy formal y corporativo

- **Precisión (${presicion || 50}%)**: Rigurosidad en datos y argumentos
  - 0-20%: Aproximación general y flexible
  - 21-40%: Precisión básica
  - 41-60%: Precisión equilibrada
  - 61-80%: Alta precisión
  - 81-100%: Exactitud quirúrgica y rigurosa

- **Coherencia (${coherence || 50}%)**: Conexión lógica en el discurso
  - 0-20%: Simple y directo
  - 21-40%: Coherencia básica
  - 41-60%: Coherencia equilibrada
  - 61-80%: Bien hilado y argumentado
  - 81-100%: Máxima coherencia lógica y estructura

- **Lenguaje emocional (${emotionalLanguage || 50}%)**: Componente emocional
  - 0-20%: Frío y objetivo
  - 21-40%: Poco emocional
  - 41-60%: Equilibrado emocionalmente
  - 61-80%: Cálido y humano
  - 81-100%: Muy emocional y empático

**La pregunta debe:**
- Un texto plano
- Reunir la personalidad del interlocutor 
- Usar en todo momento la configuración de personalidad
- No debe de contener ninguna bienvenida, es una conversación fluida
- Sí es un booleano hazlo natural haciendo que el usuario conteste con "si" o "no" o una respuesta positiva o negativa.

**Obligatorio:**
- Usa la descripción y el tipo de respuesta, para aclarar
la respuesta, muchas veces la información es vaga y requiere de aclaración,
por eso necesito que la pregunta sea clara y descrptiva si es necesario, para que la
entienda un joven de 7 años.


`
      }]

      await sendRealTime({
        res,
        token,
        systemPrompt,
        userId,
        agentId,
        chatId,
        threadId,
        docId,
        appId,
        scrapId
      })
    } catch (error) {
      console.error('Error in fnAgent:', error);
    }
  }

  const dbChat = await connectDB(`db_${userId}_chat`)

  console.log('chatId', chatId)
  let chat = await dbChat.find({
    selector: {
      _id: chatId
    }
  })


  console.log('chat', chat)

  if (!chat) {
    return false
  }

  return new Promise(async (resolve, reject) => {
    try {
      const currentIdInfo = getCurrentId();

      if (!chat.data?.info
        || (!currentIdInfo.id && typeof data === 'object')
      ) {

        let iniData = {}
        Object.keys(data || {}).map((item) => {
          iniData[item] = {
            ...data[item],
            verified: false,
            timestamp: null
          }
        })

        const getAvailableKeys = (data, currentData = {}) => {
          return Object.keys(data || {}).filter((key) => {
            const field = data[key];

            if (field.timestamp !== null) {
              return false;
            }

            if (field.end === true) {
              return false;
            }

            if (field.has) {
              const dependencies = field.has.split('|');
              return dependencies.every(dep => {
                if (typeof currentData[dep] === 'boolean') {
                  return currentData[dep] === true;
                }
                return currentData[dep] !== undefined && currentData[dep] !== null && currentData[dep] !== '';
              });
            }

            return true;
          });
        };

        const availableKeys = getAvailableKeys(iniData, chat.data || {});
        const requiredKeys = availableKeys.filter(key => iniData[key].required === true);
        const nonRequiredKeys = availableKeys.filter(key => !iniData[key].required);

        const keysToUse = requiredKeys.length > 0 ? requiredKeys : nonRequiredKeys;
        const key = keysToUse[Math.floor(Math.random() * keysToUse.length)]


        const answerPrompt = () => {
          return `**Información de la pregunta "${key}"** 
          - Descripción de la pregunta: ${chat.data.info[key]?.description}
          - Tipo de respuesta: ${chat.data.info[key]?.type}
          `
        }


        chat.action = action || []

        chat.data = {
          info: {
            ...iniData,
            [key]: {
              ...iniData[key],
              verified: false,
              timestamp: new Date().toISOString()
            }
          }
        }

        await dbChat.insert(chat)
        await fnAgent({
          res,
          token,
          prompt: answerPrompt(),
          userId,
          agentId,
          chatId,
          threadId: currentIdInfo.type === 'threadId' ? currentIdInfo.id : null,
          docId: currentIdInfo.type === 'docId' ? currentIdInfo.id : null,
          appId: currentIdInfo.type === 'appId' ? currentIdInfo.id : null,
          scrapId: currentIdInfo.type === 'scrapId' ? currentIdInfo.id : null
        })


        resolve({
          success: true,
          [currentIdInfo.type]: currentIdInfo.id
        })
      } else {
        const currentIdInfo = getCurrentId();

        const info = Object.values(chat.data.info || {})
          .map(item => item.timestamp).filter(Boolean)
          .sort().pop()

        const key = Object.keys(chat.data.info || {}).find(key => chat.data.info[key].timestamp === info)

        const assistantSystemPrompt = [{
          role: 'user',
          content: `
Actúa como un asistente experto en procesamiento de datos entregando un JSON con la respuesta del usuario.     
      
Devuelve un JSON con la siguiente estructura:
{
  "name": "${key}",
  "value": "el resultado que el usuario ha contestado, intenta resumir, mejor o analizar el valor1",
  "accuracy": 8, // Nivel de acierto de 0-10 (0=totalmente incorrecto, 10=perfecto)
  "confidence": 7, // Nivel de confianza de 0-10 (0=no sabe, 10=totalmente seguro)
  "feedback": "breve explicación del nivel de acierto"
}

Parametro clave: 
 - ${key}

Formato del tipo: 
 - ${chat.data.info[key].type}

Descripción del campo pendiente:	
 - ${chat.data.info[key].description}


El usuario ha contestado:
- ${prompt}


CRITERIOS DE EVALUACIÓN:
- accuracy 0-3: Respuesta completamente incorrecta o irrelevante
- accuracy 4-6: Respuesta parcialmente correcta pero confusa
- accuracy 7: Respuesta aceptable pero necesita aclaración
- accuracy 8-10: Respuesta correcta y clara

- confidence 0-3: Usuario no sabe o está muy confundido
- confidence 4-6: Usuario está inseguro o necesita ayuda
- confidence 7-10: Usuario está seguro de su respuesta

IMPORTANTE: Si el usuario dice salir de la automatización | documento acompañado de "salir", "parar", "cancelar", "terminar", "desconectar", "no más", "basta", "ya no", "detener", "interrumpir", "abandonar", "dejar", "cesar", "finalizar", "concluir", "acabar", "cerrar", "no quiero continuar", "ya no quiero", "me aburro", "es suficiente", "ya está bien", "no más preguntas", "me aburro", "es suficiente", "ya está bien" 
No confundir nunca con la respuesta si es un booleano.

{
  "type": "exit-automate",
  "value": "exit",
  "accuracy": 10,
  "confidence": 10,
  "feedback": "Usuario quiere salir de la automatización"
}

Devuelve ÚNICAMENTE el JSON, sin texto adicional.`
        }, {
          role: 'user',
          content: prompt
        }]

        const assistantResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
          model: "gpt-4o-mini",
          temperature: 0.7,
          max_tokens: 2096,
          messages: assistantSystemPrompt
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });

        const value_response = extractCodeBlocks(assistantResponse.data.choices[0].message.content)


        let json_response
        try {
          if (value_response && value_response.length >= 2) {
            json_response = JSON.parse(value_response[1])
          } else {
            console.error('Invalid value_response structure:', value_response)
            throw new Error('Invalid response structure')
          }
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError)

          await sendTextData({
            res,
            text: 'Lo siento, hubo un error procesando tu respuesta. Por favor, intenta de nuevo.',
            type: 'text',
            conf: buildConf(currentIdInfo)
          })

          resolve({
            success: false,
            text: 'Error parsing response'
          })
          return
        }

        if (json_response?.type === 'exit-automate') {
          try {
            const dbChat = await connectDB(`db_${userId}_chat`)
            const chat = await dbChat.get(chatId)

            chat.data = {}
            chat.action = {}
            chat.threadId = null

            await dbChat.insert(chat)
          } catch (error) {
            console.error('Error clearing chat automation data from assistantAgent:', error)
          }

          const exitMessages = [
            '¡Perfecto! He salido del modo automatización. ¿En qué más puedo ayudarte?',
            'Entendido, he terminado la automatización. ¿Hay algo más en lo que pueda asistirte?',
            '¡Listo! Ya no estoy en modo automatización. ¿Qué te gustaría hacer ahora?',
            'De acuerdo, he cancelado la automatización. ¿En qué puedo ayudarte?',
            '¡Perfecto! He salido del proceso automatizado. ¿Qué necesitas ahora?',
            'Entendido, he parado la automatización. ¿Hay algo más que quieras hacer?',
            '¡Listo! He terminado con la automatización. ¿En qué más puedo ser útil?',
            'De acuerdo, he desconectado del modo automatización. ¿Qué te gustaría hacer?'
          ]

          const randomMessage = exitMessages[Math.floor(Math.random() * exitMessages.length)]

          await sendTextData({
            res,
            text: randomMessage,
            type: 'text',
            conf: buildConf(currentIdInfo)
          })

          resolve({
            success: true,
            data: { type: 'exit-automate' }
          })
          return
        }

        const currentAttempts = chat.data.info[key]?.attempts || 0
        const maxAttempts = 3

        if (json_response.accuracy < 7) {
          chat.data.info[key] = {
            ...chat.data.info[key],
            attempts: currentAttempts + 1,
            lastResponse: json_response,
            timestamp: new Date().toISOString()
          }

          await dbChat.insert(chat)

          if (currentAttempts < maxAttempts) {
            await generateGuidedQuestion({
              res,
              token,
              key,
              chat,
              json_response,
              userId,
              agentId,
              chatId,
              threadId: currentIdInfo.type === 'threadId' ? currentIdInfo.id : null,
              docId: currentIdInfo.type === 'docId' ? currentIdInfo.id : null,
              appId: currentIdInfo.type === 'appId' ? currentIdInfo.id : null,
              scrapId: currentIdInfo.type === 'scrapId' ? currentIdInfo.id : null
            })
          } else {
            await moveToNextQuestion({
              res,
              token,
              chat,
              userId,
              agentId,
              chatId,
              threadId: currentIdInfo.type === 'threadId' ? currentIdInfo.id : null,
              docId: currentIdInfo.type === 'docId' ? currentIdInfo.id : null,
              appId: currentIdInfo.type === 'appId' ? currentIdInfo.id : null,
              scrapId: currentIdInfo.type === 'scrapId' ? currentIdInfo.id : null
            })
          }

          resolve({
            success: true,
            data: json_response
          })
          return
        }

        chat.data = {
          ...chat.data,
          [key]: json_response.value,
          info: {
            ...chat.data.info,
            [key]: {
              ...chat.data.info[key],
              verified: true,
              attempts: 0,
              accuracy: json_response.accuracy,
              confidence: json_response.confidence
            }
          }
        }

        await dbChat.insert(chat)

        chat = await dbChat.get(chat._id)
        if (chat.data.info[key]?.end === true) {

          chat.data = {
            ...chat.data,
            [key]: json_response.value,
            info: {
              ...chat.data.info,
              [key]: {
                ...chat.data.info[key],
                verified: true,
                attempts: 0,
                accuracy: json_response.accuracy,
                confidence: json_response.confidence
              }
            }
          }

          await dbChat.insert(chat)

          if (typeofchat.action == 'object') {
            await sendTextData({
              res,
              data: {
                text: chat.action.text || 'Proceso completado exitosamente',
                variable: Object.entries(chat.data || {}).filter(([key]) => key !== 'info' && key !== 'undefined').map(([key, value]) => ({
                  key,
                  value,
                  description: chat.data.info?.[key]?.description || '',
                  type: chat.data.info?.[key]?.type || '',
                })),
                action: chat.action.automate || []
              },
              type: 'automate',
              conf: buildConf(currentIdInfo)
            })


            resolve({
              success: true,
              data: { type: 'end-process' }
            })
          } else if (chat.action) {
            resolve({
              success: true,
              value: json_response.value,
              action: chat.action
            })
          }
          return
        }

        const getAvailableKeysForNext = (info, currentData = {}) => {
          return Object.keys(info || {}).filter((key) => {
            const field = info[key];

            if (field.timestamp !== null || field.verified === true) {
              return false;
            }

            if (field.end === true) {
              return false;
            }

            if (field.has) {
              const dependencies = field.has.split('|');
              return dependencies.every(dep => {
                if (typeof currentData[dep] === 'boolean') {
                  return currentData[dep] === true;
                }
                return currentData[dep] !== undefined && currentData[dep] !== null && currentData[dep] !== '';
              });
            }

            return true;
          });
        };

        const availableKeys = getAvailableKeysForNext(chat.data.info, chat.data);

        if (availableKeys.length === 0) {

          if (typeof chat.action == 'object') {
            await sendTextData({
              res,
              data: {
                text: chat.action.text || 'Proceso completado exitosamente',
                variable: Object.entries(chat.data || {}).filter(([key]) => key !== 'info' && key !== 'undefined').map(([key, value]) => ({
                  key,
                  value,
                  description: chat.data.info?.[key]?.description || '',
                  type: chat.data.info?.[key]?.type || '',
                })),
                action: chat.action.automate || []
              },
              type: 'automate',
              conf: buildConf(currentIdInfo)
            })
            resolve({
              success: true,
              data: { type: 'end-process' }
            })
          } else if (chat.action) {
            resolve({
              success: true,
              value: json_response.value,
              action: chat.action
            })
          }

          return
        }

        const hasDependentKeys = availableKeys.filter(key => {
          const field = chat.data.info[key];
          if (!field.has) return false;

          const dependencies = field.has.split('|');
          return dependencies.some(dep => {
            const depField = chat.data.info[dep];
            if (!depField) return false;

            if (depField.timestamp) {
              const depTime = new Date(depField.timestamp);
              const now = new Date();
              const diffSeconds = (now - depTime) / 1000;
              return diffSeconds < 5;
            }
            return false;
          });
        });

        const keysToUse = hasDependentKeys.length > 0 ? hasDependentKeys : availableKeys;

        const requiredKeys = keysToUse.filter(key => chat.data.info[key].required === true);
        const nonRequiredKeys = keysToUse.filter(key => !chat.data.info[key].required);

        const finalKeysToUse = requiredKeys.length > 0 ? requiredKeys : nonRequiredKeys;
        const keyPrompt = finalKeysToUse[Math.floor(Math.random() * finalKeysToUse.length)];

        if (!keyPrompt) {
          if (typeof chat.action == 'object') {
            await sendTextData({
              res,
              data: {
                text: chat.action.text || 'Proceso completado exitosamente',
                variable: Object.entries(chat.data || {}).filter(([key]) => key !== 'info' && key !== 'undefined').map(([key, value]) => ({
                  key,
                  value,
                  description: chat.data.info?.[key]?.description || '',
                  type: chat.data.info?.[key]?.type || '',
                })),
                action: chat.action.automate || []
              },
              type: 'automate',
              conf: buildConf(currentIdInfo)
            })
            resolve({
              success: true,
              data: { type: 'end-process' }
            })
          } else if (chat.action) {
            resolve({
              success: true,
              value: json_response.value,
              action: chat.action
            })
          }
          return
        }

        const answerPrompt = () => {
          const fieldInfo = chat?.data?.info[keyPrompt];
          if (!fieldInfo) {
            console.error('Field info not found for key:', keyPrompt);
            return 'Error: Información del campo no encontrada';
          }
          return ` - "${keyPrompt}" (${fieldInfo.type || 'text'}): ${fieldInfo.description || 'Sin descripción'}`
        }

        chat.data = {
          ...chat.data,
          [key]: json_response.value,
          info: {
            ...chat.data.info,
            [key]: {
              ...chat.data.info[key],
              verified: true,
              attempts: 0,
              accuracy: json_response.accuracy,
              confidence: json_response.confidence
            },
            [keyPrompt]: {
              ...chat.data.info[keyPrompt],
              verified: false,
              timestamp: new Date().toISOString(),
              attempts: 0
            }
          }
        }

        await dbChat.insert(chat)

        let _keys = Object.keys(chat.data.info || {})
        let isAllData = true

        for (const key of _keys) {
          const field = chat.data.info[key];

          if (!field.has || (field.has && field.has.split('|').every(dep => {
            if (typeof chat.data[dep] === 'boolean') {
              return chat.data[dep] === true;
            }
            return chat.data[dep] !== undefined && chat.data[dep] !== null && chat.data[dep] !== '';
          }))) {
            if (field.required === true || !field.has) {
              if (!chat.data[key] && key !== "undefined") {
                isAllData = false;
              }
            }
          }
        }

        if (!isAllData) {
          await fnAgent({
            res,
            token,
            prompt: answerPrompt(),
            userId,
            agentId,
            chatId,
            threadId,
            docId,
            appId,
            scrapId
          })
        } else {
          await sendTextData({
            res,
            data: {
              text: chat.action.text,
              variable: Object.entries(chat.data || {}).filter(([key]) => key !== 'info' && key !== 'undefined').map(([key, value]) => ({
                key,
                value,
                description: chat.data.info?.[key]?.description || '',
                type: chat.data.info?.[key]?.type || '',
              })),
              action: chat.action.automate || []
            },
            type: 'automate',
            conf: buildConf(currentIdInfo)
          })
        }

        resolve({
          success: true,
          data: json_response
        })
      }

    } catch (error) {
      reject({
        success: false,
        error: 'Error al procesar la solicitud'
      });
    }
  });
};

const assistantLanguage = async ({ text, language = "español", token = null }) => {
  try {
    let systemPrompt = []

    if (text.name && text.description) {
      systemPrompt = [{
        role: 'user',
        content: `
      Eres un experto en traducciones.
      Traduceme el siguiente texto al ${language}:
      Texto Name:${text.name}
      Texto Description:${text.description}
  
      *Reglas*
      - Devuelve el texto traducido en el mismo idioma que el texto original
      
      Devuelve en el formato: 
  
      {
        "name": "nombre traducido",
        "description": "descripción traducida"
      }
      `}]
    } else {
      systemPrompt = [{
        role: 'user',
        content: `
      Eres un experto en traducciones.
      Traduceme el siguiente texto al ${language}:
      Texto :${text}
  
      *Reglas*
      - Devuelve el texto traducido en el mismo idioma que el texto original
      - No devuelvas nada más que el texto traducido
      `}]
    }


    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 2096,
      messages: systemPrompt
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });


    const value_response = extractCodeBlocks(response.data.choices[0].message.content)

    if (typeof value_response[1] === 'object') {
      return JSON.parse(value_response[1])
    } else {
      return value_response[1]
    }

  } catch (error) {
    console.error('Error in languageToLan:', error);
    return "español"
  }
}

const generateGuidedQuestion = async ({
  res,
  token,
  key,
  chat,
  json_response,
  userId,
  agentId,
  chatId,
  threadId = null,
  docId = null,
  appId = null
}) => {

  const getCurrentId = () => {
    if (threadId) return { id: threadId, type: 'threadId' };
    if (docId) return { id: docId, type: 'docId' };
    if (appId) return { id: appId, type: 'appId' };
    return { id: uuidv4(), type: 'threadId' };
  };

  const buildConf = (currentIdInfo) => {
    return {
      userId: userId,
      agentId: agentId,
      chatId: chatId,
      threadId: currentIdInfo.type === 'threadId' ? currentIdInfo.id : null,
      docId: currentIdInfo.type === 'docId' ? currentIdInfo.id : null,
      appId: currentIdInfo.type === 'appId' ? currentIdInfo.id : null,
      scrapId: currentIdInfo.type === 'scrapId' ? currentIdInfo.id : null
    };
  };

  const currentIdInfo = getCurrentId();
  try {
    const currentAttempts = chat.data.info[key]?.attempts || 0
    const accuracy = json_response.accuracy || 0
    const confidence = json_response.confidence || 0
    const feedback = json_response.feedback || ""

    let guidanceLevel = "básico"
    if (currentAttempts === 2) {
      guidanceLevel = "muy específico"
    } else if (currentAttempts === 1) {
      guidanceLevel = "específico"
    }

    let toneLevel = "amable"
    if (accuracy <= 3) {
      toneLevel = "muy directo"
    } else if (accuracy <= 6) {
      toneLevel = "directo"
    }


    const systemPrompt = [{
      role: 'user',
      content: `
Eres un asistente experto en ayudar a usuarios que están teniendo dificultades para responder preguntas.

CONTEXTO:
- Pregunta original: "${chat.data.info[key].description}"
- Tipo de dato esperado: ${chat.data.info[key].type}
- Nivel de acierto de la respuesta anterior: ${accuracy}/10
- Nivel de confianza del usuario: ${confidence}/10
- Feedback de la respuesta anterior: "${feedback}"
- Número de intentos: ${currentAttempts}
- Nivel de guía requerido: ${guidanceLevel}
- Tono requerido: ${toneLevel}

OBJETIVO:
Genera una pregunta más específica y guiada que ayude al usuario a responder correctamente.

REGLAS:
- Si accuracy ≤ 3: El usuario está muy confundido, da ejemplos específicos
- Si accuracy 4-6: El usuario entiende parcialmente, aclara el formato esperado
- Si accuracy = 7: El usuario está cerca, solo necesita un pequeño ajuste
- Si confidence ≤ 3: El usuario no está seguro, ofrece opciones o ejemplos
- Si confidence 4-6: El usuario está inseguro, confirma que está en el camino correcto
- Si confidence ≥ 7: El usuario está seguro pero se equivoca, corrige suavemente

La pregunta debe ser:
- Máximo 2 frases
- Muy específica sobre qué necesitas
- Incluir ejemplos si es necesario
- Usar el tono apropiado según el nivel de acierto

Devuelve ÚNICAMENTE la pregunta, sin texto adicional.`
    }]

    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 256,
      messages: systemPrompt
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });

    const guidedQuestion = response.data.choices[0].message.content

    await sendTextData({
      res,
      text: guidedQuestion,
      type: 'stream',
      conf: buildConf(currentIdInfo)
    })


  } catch (error) {
    console.error('Error in generateGuidedQuestion:', error);
    await sendTextData({
      res,
      text: `Por favor, intenta responder de nuevo: ${chat.data.info[key].description}`,
      type: 'text',
      conf: buildConf(currentIdInfo)
    })
  }
}

const moveToNextQuestion = async ({
  res,
  token,
  userId,
  agentId,
  chatId,
  threadId = null,
  docId = null,
  appId = null,
  scrapId = null
}) => {

  const getCurrentId = () => {
    if (threadId) return { id: threadId, type: 'threadId' };
    if (docId) return { id: docId, type: 'docId' };
    if (appId) return { id: appId, type: 'appId' };
    if (scrapId) return { id: scrapId, type: 'scrapId' };
    return { id: uuidv4(), type: 'threadId' };
  };

  const buildConf = (currentIdInfo) => {
    return {
      userId: userId,
      agentId: agentId,
      chatId: chatId,
      threadId: currentIdInfo.type === 'threadId' ? currentIdInfo.id : null,
      docId: currentIdInfo.type === 'docId' ? currentIdInfo.id : null,
      appId: currentIdInfo.type === 'appId' ? currentIdInfo.id : null,
      scrapId: currentIdInfo.type === 'scrapId' ? currentIdInfo.id : null
    };
  };

  const currentIdInfo = getCurrentId();
  try {

    const dbChat = await connectDB(`db_${userId}_chat`)

    let chat = await dbChat.get(chatId)

    const currentKey = Object.keys(chat.data.info || {}).find(key =>
      chat.data.info[key].timestamp && !chat.data.info[key].verified
    )

    if (currentKey) {
      chat.data.info[currentKey] = {
        ...chat.data.info[currentKey],
        verified: true,
        skipped: true,
        attempts: chat.data.info[currentKey].attempts || 0
      }
    }


    await dbChat.insert(chat)

    const getAvailableKeysForNext = (info, currentData = {}) => {
      return Object.keys(info || {}).filter((key) => {
        const field = info[key];

        if (field.timestamp !== null || field.verified === true) {
          return false;
        }

        if (field.end === true) {
          return false;
        }

        if (field.has) {
          const dependencies = field.has.split('|');
          return dependencies.every(dep => {
            if (typeof currentData[dep] === 'boolean') {
              return currentData[dep] === true;
            }
            return currentData[dep] !== undefined && currentData[dep] !== null && currentData[dep] !== '';
          });
        }

        return true;
      });
    };

    const availableKeys = getAvailableKeysForNext(chat.data.info, chat.data);

    if (availableKeys.length === 0) {
      await sendTextData({
        res,
        data: {
          text: chat.action.text || 'Proceso completado exitosamente',
          variable: Object.entries(chat.data || {}).filter(([key]) => key !== 'info' && key !== 'undefined').map(([key, value]) => ({
            key,
            value,
            description: chat.data.info?.[key]?.description || '',
            type: chat.data.info?.[key]?.type || '',
          })),
          action: chat.action.automate || []
        },
        type: 'automate',
        conf: buildConf(currentIdInfo)
      })
      return
    }

    const hasDependentKeys = availableKeys.filter(key => {
      const field = chat.data.info[key];
      if (!field.has) return false;

      const dependencies = field.has.split('|');
      return dependencies.some(dep => {
        const depField = chat.data.info[dep];
        if (!depField) return false;

        if (depField.timestamp) {
          const depTime = new Date(depField.timestamp);
          const now = new Date();
          const diffSeconds = (now - depTime) / 1000;
          return diffSeconds < 5;
        }
        return false;
      });
    });

    const keysToUse = hasDependentKeys.length > 0 ? hasDependentKeys : availableKeys;

    const requiredKeys = keysToUse.filter(key => chat.data.info[key].required === true);
    const nonRequiredKeys = keysToUse.filter(key => !chat.data.info[key].required);

    const finalKeysToUse = requiredKeys.length > 0 ? requiredKeys : nonRequiredKeys;

    if (finalKeysToUse.length > 0) {
      const nextKey = finalKeysToUse[Math.floor(Math.random() * finalKeysToUse.length)]

      if (!nextKey) {
        await sendTextData({
          res,
          data: {
            text: chat.action.text || 'Proceso completado exitosamente',
            variable: Object.entries(chat.data || {}).filter(([key]) => key !== 'info' && key !== 'undefined').map(([key, value]) => ({
              key,
              value,
              description: chat.data.info?.[key]?.description || '',
              type: chat.data.info?.[key]?.type || '',
            })),
            action: chat.action.automate || []
          },
          type: 'automate',
          conf: buildConf(currentIdInfo)
        })
        return
      }

      chat.data.info[nextKey] = {
        ...chat.data.info[nextKey],
        verified: false,
        timestamp: new Date().toISOString(),
        attempts: 0
      }

      await dbChat.insert(chat)

      const answerPrompt = () => {
        const fieldInfo = chat?.data?.info[nextKey];
        if (!fieldInfo) {
          console.error('Field info not found for key:', nextKey);
          return 'Error: Información del campo no encontrada';
        }
        return ` - "${nextKey}" (${fieldInfo.type || 'text'}): ${fieldInfo.description || 'Sin descripción'}`
      }


      await fnAgent({
        res,
        token,
        prompt: answerPrompt(),
        userId,
        agentId,
        chatId,
        threadId: currentIdInfo.type === 'threadId' ? currentIdInfo.id : null,
        docId: currentIdInfo.type === 'docId' ? currentIdInfo.id : null,
        appId: currentIdInfo.type === 'appId' ? currentIdInfo.id : null,
        scrapId: currentIdInfo.type === 'scrapId' ? currentIdInfo.id : null
      })
    } else {
      await sendTextData({
        res,
        data: {
          text: chat.action.text || 'Proceso completado exitosamente',
          variable: Object.entries(chat.data || {}).filter(([key]) => key !== 'info' && key !== 'undefined').map(([key, value]) => ({
            key,
            value,
            description: chat.data.info?.[key]?.description || '',
            type: chat.data.info?.[key]?.type || '',
          })),
          action: chat.action.automate || []
        },
        type: 'automate',
        conf: buildConf(currentIdInfo)
      })
    }

  } catch (error) {
    console.error('Error in moveToNextQuestion:', error);
  }
}





module.exports = {
  assistantPrompt,
  assistantAgent,
  assistantLanguage,
  generateGuidedQuestion,
  moveToNextQuestion,

  validateToken,
  connectDB,

  saveNotificationData,
  saveAttachmentData,

  calculateTaxesAndDiscounts,
  convertToNumber,
  mergeResults,
  removeDuplicatesFromArray,
  convertPDFToPNG,
  replaceNotFoundWithEmptyString,
  extractCIF,
  extractNIF,
  extractCodeBlocks
}