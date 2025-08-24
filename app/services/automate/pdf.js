const sharp = require('sharp')
const { default: axios } = require("axios");
const fs = require('fs');
const path = require('path');

const {
  extractCodeBlocks
} = require('./utils')

const {
  calculateCost
} = require('./gpt')


const { convertPDFToPNG, mergeResults } = require("./utils");




const ini_document = `**INSTRUCCIONES**
    Tu tarea es analizar el contenido del documento proporcionado para extraer información relevante. Debes seguir estas reglas estrictamente:
    
    1. **Identificar el Tipo de Documento**
       - Determina si el documento es una **factura** o un **albarán**. En los casos en los que se encuentre la palabra "factura" en el documento, considera que es una factura. De caso contrario, considera que es un albarán. ESTA PROPIEDAD TIENE QUE TENER UNO DE LOS DOS VALORES OBLIGATORIOS: "factura" o "albarán".
       - Devuelve una propiedad llamada "documentType" con los valores "factura" o "albarán" según corresponda.
    
    
    2. **Reglas Generales**
       - Si no encuentras un valor esperado, asignale "NOT FOUND".
      - No cambies el nombre de las propiedades.
      - No añadas propiedades que no estén en el formato de la respuesta.

    3. **Datos Específicos por Tipo de Documento**
  
      - "documentType": Si es un albarán o factura
      - "invoiceDate": Fecha de la factura
      - "invoiceIssueDate": Fecha de emisión de la factura en formato YYYY-MM-DD.
      - "expirationDateYear": Año de vencimiento de la factura.
      - "expirationDateMonth": Mes de vencimiento de la factura.
      - "expirationDateDay": Día de vencimiento de la factura.
      - "numberDocument": Número de la factura / albaran.
      - "taxesRate": Valor de los impuestos e.g 21, es un entero.
      - "taxesRateIRPF": Valor de los impuestos de IRPF e.g 15, es un entero.
      - "totalAmount": Importe total de la factura.
      - "partialAmount": Importe parcial de la factura.
      - "discountAmount": Descuento aplicado en la factura.
      - "taxesAmount": Importe de los impuestos.
      - "taxesAmountIRPF": Importe de los impuestos de IRPF.
    

    5. **Formato de la Respuesta**:

    Si no encuentras ningún atributo, devuelve {"error": true}.
    Devuelve en formato JSON correcto:
    {
      "documentType": "valor encontrado",
      "invoiceDate": "valor encontrado",
      ...
    }
    
    ** IMPORTANTE **
    1. Convierte TODOS los numeros a numeros con 2 decimales, por mas que sea entero. Eliminar tipo de moneda y simbolo. (2,000.24€ -> 2000.24, 20€ -> 20.00)
    2. Evita confusiones entre el número de pedido, número de factura, y número de albarán.
    `



    const documentGPTTelematel = async ({
      token,
      image,
      searchCif = false,
      searchCifCompany = false,
      imageSize = "1536x2048",
    }) => {

      let systemPrompt = '';
    
      if (searchCif) {
        systemPrompt = `
        Busca los atributos: el CIF del cliente.
          
          - **CIF**: Puede aparecer al lado de "CIF", "C.I.F.", o variantes similares. 
            - Representado por 1 letra seguida de 8 números, separados opcionalmente por guiones o espacios (por ejemplo, "A-53466839").
            - Puede aparecer sin estar precedido por ninguna etiqueta que haga referencia al CIF. (por ejemplo, "A53466839").
            - No va seguido de full.
            - Si encuentras el CIF, devuélvelo como un objeto con la propiedad "clientCif" y ese valor. Si no encuentras ninguno, usa {"clientCif": "NOT FOUND"}.
         
        Devuelve los resultados como un JSON válido, incluyendo ambos atributos.`;
      } else if (searchCifCompany) {
        systemPrompt = `
        Busca los atributos: 
        - companyCif: el CIF de la empresa.
        - refDocument: referencia del documento.
    
        Dame los valores exactos, no me des otros valores que no cumplan con las reglas siguientes.
    
        ** REGLAS ESTRICTAS PARA refDocument **
        1. UBICACIÓN:
           - SOLO buscar en la CABECERA del documento
           - Típicamente está en la parte superior derecha
           - NUNCA buscar en las líneas de productos
           - NUNCA buscar en el pie de página
           - NUNCA buscar en la sección de datos del cliente
        
        2. IDENTIFICACIÓN:
           - DEBE estar junto a palabras como:
             * "Referencia:"
             * "Ref.:"
             * "Ref. Cliente:"
             * "Su Referencia:"
             * "Nº Referencia:"
             * "Nº Ref.:"
           - Estas palabras pueden estar en mayúsculas o minúsculas
           - La referencia DEBE estar:
             * En la misma línea que la palabra "Referencia" o "Ref."
             * O justo debajo de estas palabras
             * Separado por un espacio o dos puntos
             * Devuelve la primera referencia para evitar darme la de productos.
           - La referencia puede ser:
             * Un número
             * Un texto
             * Una combinación de letras y números
             * Cualquier texto que esté junto a las palabras mencionadas
           - Ejemplos de cómo se ve:
             * "Referencia: 12345"
             * "Ref.: ABC123"
             * "Su Referencia: PEDIDO-2024"
             * "Nº Referencia: CLIENTE-001"
        
        3. QUÉ NO ES refDocument:
           - NO es el número de factura/albarán
           - NO es la referencia de un producto
           - NO es un CIF/DNI/NIF
           - NO es el número de documento
           - NO es cualquier otro texto que no esté junto a las palabras mencionadas en la sección 2
           - NO es una referencia de un producto
           - No esta en la linea de productos
          
        ** REGLAS PARA companyCif **
        1. UBICACIÓN:
           - SOLO buscar en la CABECERA del documento
           - Típicamente está en la parte superior
           - DEBE estar en la sección de datos del cliente
           - NUNCA buscar en las líneas de productos
           - NUNCA buscar en el pie de página
           - NUNCA buscar en la sección de referencias
        
        2. IDENTIFICACIÓN:
           - Es el CIF o DNI o NIF del cliente que recibe la factura
           - DEBE estar junto a palabras como:
             * "CIF:"
             * "C.I.F.:"
             * "CIF/DNI:"
             * "NIF/CIF:"
           - Estas palabras pueden estar en mayúsculas o minúsculas
           - El CIF DEBE estar:
             * En la misma línea que la palabra CIF
             * O justo debajo de estas palabras
             * Separado por un espacio o dos puntos
           - DEBE estar en la misma sección que:
             * El nombre del cliente
             * La dirección del cliente
             * Otros datos del cliente
               
        3. QUÉ NO ES companyCif:
           - NO es un DNI (8 números + 1 letra)
           - NO es un NIF que no cumpla el formato de CIF
           - NO es un número de teléfono
           - NO es un código postal
           - NO es un número de cuenta bancaria
           - NO es cualquier otro número que no cumpla el formato de CIF
           - NO es el CIF de la empresa emisora
           - NO está en la sección de referencias
        
       
           ** Respuesta **
           {
            "companyCif": "valor encontrado",
            "refDocument": "valor encontrado"
           }
        `
      } else {
        systemPrompt = ini_document;
      }
    

  
    
      const conversation = [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image,
                detail: "high",
                size: imageSize,
              },
            },
            {
              type: "text",
              text: systemPrompt,
            },
          ],
        },
      ];
    
      try {
        const body = {
          model: "gpt-4o-mini",
          temperature: 0.9,
          max_tokens: 12096,
          messages: conversation,
        };
    
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        const result = response.data.choices[0].message.content;
    
        const inputTokens = systemPrompt.split(/\s+/).length;
        const outputTokens = result.split(/\s+/).length;
        const totalTokens = inputTokens + outputTokens;
    
        const { totalCost } = calculateCost({
          inputTokens,
          outputTokens,
          imageSize
        });
    
    
        let [codeType, cleanedCode] = await extractCodeBlocks(result);
    
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(cleanedCode);
        } catch (parseError) {
        }
    
        if (parsedResponse?.error) {
          return {
            error: parsedResponse?.error,
            totalTokens,
            totalPrice: totalCost,
          };
        }
    
        return { ...parsedResponse, totalTokens, totalPrice: totalCost };
      } catch (e) {
        console.error("Error in documentGPT pdf:", e.response.data);
        return {
          error: e.message || "An error occurred in documentGPT",
          totalTokens: 0,
          totalPrice: 0,
        };
      }
    };


const getGPTDataTelematel = async ({ attach, token }) => {
  try {
    const fileBuffer = attach.buffer;
    let imageBuffers = [];

    if (
      attach.mimetype === "application/pdf" ||
      attach.mimeType === "application/pdf"
    ) {
      imageBuffers = await convertPDFToPNG(fileBuffer);
    } else if (attach && (attach.mimeType?.startsWith("image/") || attach.mimetype?.startsWith("image/"))) {
      imageBuffers.push(fileBuffer);
    }

    let totalTokens = 0; 
    let totalPrice = 0; 
    let allResults = []; 

    let documentType = null;
    let documentTypeChanged = false;

    if (imageBuffers.length > 0) {
      const firstPageBuffer = imageBuffers[0];
      
      let firstPageResult = {};
      let attempts = 0;
      const maxAttempts = 2;
      let clientCifFound = false;

      while (attempts < maxAttempts) {
        attempts++;
        let attemptResult;
        if (attempts === 1 && !clientCifFound) {
          attemptResult = await processImageSections(
            firstPageBuffer,
            token
          );

          let attemptResultCif = await processImageSections(
            firstPageBuffer,
            token,
            true
          );

          if (attemptResultCif.companyCif && attemptResultCif.companyCif !== "NOT FOUND") {
            attemptResult.companyCif = attemptResultCif.companyCif;
          }

          if (attemptResultCif.refDocument && attemptResultCif.refDocument !== "NOT FOUND") {
            attemptResult.refDocument = attemptResultCif.refDocument;
          }
        } else {
          attemptResult = await documentGPTTelematel({
            token,
            image: `data:image/png;base64,${firstPageBuffer.toString("base64")}`,
          });
        }


        totalTokens += attemptResult.totalTokens || 0;
        totalPrice += attemptResult.totalPrice || 0;

        if (attemptResult.error) {
          continue;
        }

        const keysToExclude = ["totalPrice", "totalTokens"];
        const remainingKeys = Object.keys(attemptResult).filter(
          (key) => !keysToExclude.includes(key)
        );

        if (
          remainingKeys.length > 0 &&
          remainingKeys.every((key) => key === "clientCif")
        ) {
          remainingKeys.forEach((key) => {
            firstPageResult[key] = attemptResult[key];
          });
        } else {
          firstPageResult = mergeResults([firstPageResult, attemptResult]);
        }

        if (
          attemptResult.clientCif &&
          attemptResult.clientCif !== "NOT FOUND"
        ) {
          clientCifFound = true;
        }

        if (firstPageResult.documentType && documentType && firstPageResult.documentType !== documentType) {
          documentTypeChanged = true;
        } else if (firstPageResult.documentType && !documentType) {
          documentType = firstPageResult.documentType;
        }
      }

      if (documentTypeChanged) {
        return {
          error: "Document type changed, stopping processing",
        };
      }

      let { products, tokens, price } = await processProductsSection(firstPageBuffer, token);
     
      firstPageResult.productList = products ? JSON.parse(products) : [];

      totalTokens += tokens;
      totalPrice += price;

      allResults.push(firstPageResult);
    }

    if (imageBuffers.length > 1) {
      const remainingPages = imageBuffers.slice(1);
      const pagePromises = remainingPages.map(async (imageBuffer, index) => {

        let result = {};
      
        let { products, tokens, price } = await processProductsSection(imageBuffer, token);
        result.productList = products ? JSON.parse(products) : [];

        totalTokens += tokens;
        totalPrice += price;

        return result;
      });

      const remainingResults = await Promise.all(pagePromises);
      
      const validResults = remainingResults.filter(result => result !== null);
      
      if (validResults.length !== remainingResults.length) {
        return {
          error: "Document type changed, stopping processing",
        };
      }

      allResults.push(...validResults);
    }

    const finalResult = allResults.reduce((acc, result) => {
      return mergeResults([acc, result]);
    }, {});

    return {
      ...finalResult,
      pages: imageBuffers.length,
      totalTokens,
      totalPrice,
      attachFromEmail: attach.emailId,
      attachFileName: attach.filename,
    };
  } catch (error) {
    console.error("\n\nERROR ON GETATTACHMENTDATA", error);
    return {
      error: error.message || "An unexpected error occurred",
      totalTokens: 0,
      totalPrice: 0,
    };
  }
};







const getProductsGPT = async ({
  token,
  image,
  imageSize = "1536x2048",
  previousData = null,
}) => {




  let systemPrompt;


  systemPrompt =
    `Extrae únicamente los productos reales ignorando encabezados, títulos o líneas que no contengan información de producto.

Reglas generales:
1. Ignora filas que no sean productos, como aquellas que contienen la palabra "albarán", encabezados de columnas, subtotales, etc.
2. Todas las propiedades deben extraerse con precisión exacta: no omitas ceros, comas, puntos, espacios, cambies el orden de los caracteres, u otros caracteres visibles.
3. Los campos deben respetar el mismo orden de columnas y te filas. Si una referencia (productRef) está en una columna, la siguiente debe estar en la misma columna exacta.
4. Tener en cuenta todos los productos que se encuentren en la imagen, incluso si se repiten.
5. Devuelve solo un array JSON sin texto adicional.
6. El **productAlbaran** debe ser obligatorio que este por encima de la linea que del producto, nunca poner el número de albaran de abajo.

Para cada producto válido, extrae las siguientes propiedades:
json
[
  {
    "productRef": "Referencia del producto o artículo, suele estar a la izquierda en cada linea de productos, no es el número del documento (Ej: '1001621', 'ABC123', 'REF. XXX'). No saltarse ningun carácter, es tu mayor objetivo. ",
    "productDescription": "Descripción detallada del producto, sin incluir la palabra 'albarán'.",
    "productQuantity": "Cantidad (numérica) del producto.",
    "productImportUnit": "Precio unitario en euros. Si no existe, usa '0.00'.",
    "productDiscount": "Porcentaje de descuento (%). Ej: 10.00 = 10%. Esta en la columna 'Dto.', 'DTO' o 'DESCUENTO'. Suele estar después del importe unitario y entre el importe total. Si no existe, usa '0.00'.",
    "productImportTotal": "Importe total final tras aplicar cantidad y descuentos. Si no se encuentra, usar '0.00'.",
    "productAlbaran": "Número de albarán más cercano (de arriba) y anterior (formato 'R-XXXXXXXXXX', 'OBRA XXX', etc). Esta arriba de la linea de productos. Priorizar el número del albarán. Si no se encuentra, dejar como ''.",
    "productRAEE": "Importe de la tasa RAEE, si existe, de lo contrario '0.00'.",
  }
]`



  if (previousData.length > 0) {
    systemPrompt =
      `Obtuve esta informacion en la iteracion anterior: 
    ${JSON.stringify(previousData)}

    REALIZA UNA BUSQUEDA INTENSIVA PARA ASEGURAR DE QUE NO HAYA MAS PRODUCTOS. 
    Mejora la precisión de los campos, si ves inconsistencias.
    Sobre todo que la referencia del articulo sea exacta a la imagen,
    si ves algo cambialo.
    
    ${systemPrompt}
    `
  }


  const conversation = [
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: image,
            detail: "high",
            size: imageSize,
          },
        },
        {
          type: "text",
          text: systemPrompt,
        },
      ],
    },
  ];

  try {
    const body = {
      model: "gpt-4o-mini",
      temperature: 0.9,
      max_tokens: 12096,
      messages: conversation,
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data.choices[0].message.content;

    let [codeType, cleanedCode] = await extractCodeBlocks(result);

    const inputTokens = systemPrompt.split(/\s+/).length;
    const outputTokens = result.split(/\s+/).length;
    const totalTokens = inputTokens + outputTokens;

    const { totalCost } = calculateCost({
      inputTokens,
      outputTokens,
      imageSize,
    });



    return {
      products: cleanedCode,
      tokens: totalTokens,
      price: totalCost,
    };
  } catch (e) {   
    return {
      error: e.message || "An error occurred in documentGPT",
      totalTokens: 0,
      totalPrice: 0,
    };
  }
};

const processItems = (obj, gpt) => {
  let forLines = {};
  function getDateComponent(dateString, opt) {
    const dateParts = dateString.split("/");
    let date;

    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      const dayInt = parseInt(day, 10);
      const monthInt = parseInt(month, 10);
      if (dayInt > 31) {
        date = new Date(`${year}-${monthInt}-${dayInt.toString().slice(-2)}`);
      }
      else {
        date = new Date(`${year}-${monthInt}-${dayInt}`);
      }
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date)) {
      return "";
    }

    switch (opt) {
      case "day":
        return String(date.getDate());
      case "month":
        return String(date.getMonth() + 1);
      case "year":
        return String(date.getFullYear());
      default:
        return "";
    }
  }

  function replaceRecursive(variableName, innerGpt, gptTotal) {
    let gpt = innerGpt;
    let opt = variableName.split("::")[1];
    let name = variableName.split("::")[0];

    if (!gpt[name] && name === "invoiceDate") {
      gpt = gptTotal;

      if (gpt[name] && typeof gpt[name] === "string") {
        let dateResponse = getDateComponent(gpt[name], opt);
        return dateResponse;
      }
    }

    let updatedGPT = gpt[name];

    let replacementValue = "";

    
    if (typeof updatedGPT === "string") {
      let dateResponse = getDateComponent(updatedGPT, opt);
      return dateResponse;
    }
    if (typeof updatedGPT === "number" && Number.isFinite(updatedGPT)) {
      let operator = opt.charAt(0);
      let value = opt.slice(1);

      if (typeof value === "string" && gpt[value]) {
        value = parseFloat(gpt[value]);
      } else {
        value = parseFloat(value);
      }

      if (operator === "+") {
        replacementValue = (updatedGPT + value).toFixed(3);
      } else if (operator === "-") {
        replacementValue = (updatedGPT - value).toFixed(3);
      } else if (operator === "*" || operator === "x") {
        replacementValue = (updatedGPT * value).toFixed(3);
      } else if (operator === "/" || operator === ":" || operator === "%") {
        replacementValue = (updatedGPT / value).toFixed(3);
      }
    } else if (updatedGPT instanceof Date && !isNaN(updatedGPT.getTime())) {
      const year = updatedGPT.getFullYear();
      const month = updatedGPT.getMonth() + 1;
      const day = updatedGPT.getDate();

      if (opt === "quarter") {
        replacementValue = Math.floor((month - 1) / 3) + 1;
      } else if (opt === "year") {
        replacementValue = year;
      } else if (opt === "month") {
        replacementValue = month;
      } else if (opt === "day") {
        replacementValue = day;
      }
    }

    return replacementValue;
  }

  function searchRecursive(currentObj, parentKey = null, parentData = null) {
    let modifiedObj = { ...currentObj };

    function isNumericKeyedObject(obj) {
      return (
        Object.keys(obj).length > 0 &&
        Object.keys(obj).every((key) => !isNaN(key))
      );
    }

    for (let key in modifiedObj) {
      if (
        modifiedObj[key] &&
        modifiedObj[key]._attributes &&
        modifiedObj[key]._attributes["for-data"]
      ) {
        const variable = modifiedObj[key]._attributes["for-data"];

        if (!forLines[variable]) {
          forLines[variable] = { n: 0 };
        }

        delete modifiedObj[key]._attributes;
        let updatedArray = [];

        if (gpt[variable] && Array.isArray(gpt[variable])) {
          for (let i = 0; i < gpt[variable].length; i++) {
            let clonedItem = JSON.parse(JSON.stringify(modifiedObj[key]));
            clonedItem = searchRecursive(clonedItem, key, variable);

            clonedItem._attributes = { id: i + 1 };
            updatedArray.push(clonedItem);
            forLines[variable].n++;
          }
        }

        modifiedObj[key] = updatedArray;
      } else if (
        typeof modifiedObj[key] === "object" &&
        modifiedObj[key] !== null
      ) {
        if (isNumericKeyedObject(modifiedObj[key])) {
          let updatedArray = [];
          for (let i = 0; i < modifiedObj[key].length; i++) {
            let clonedItem = JSON.parse(JSON.stringify(modifiedObj[key][i]));
            clonedItem = searchRecursive(clonedItem, key, parentData);
            updatedArray.push(clonedItem);
          }

          modifiedObj[key] = updatedArray;
        } else {
          modifiedObj[key] = searchRecursive(modifiedObj[key], key, parentData);
        }
      } else if (
        typeof modifiedObj[key] === "string" &&
        modifiedObj[key].match(/^\%.*\%$/)
      ) {
        let variableName = modifiedObj[key].slice(1, -1);
        let replacementValue = "";
        let valueGPT = gpt;

        if (!gpt[variableName] && parentData && forLines[parentData]) {
          const n = forLines[parentData].n;
          valueGPT = {
            ...gpt[parentData][n],
            n: n + 1,
          };
        }

        replacementValue = valueGPT.hasOwnProperty(variableName)
          ? valueGPT[variableName]
          : "";

        if (variableName.includes("::")) {
          replacementValue = replaceRecursive(variableName, valueGPT, gpt);
        }
        modifiedObj[key] = replacementValue;
      }
    }

    return modifiedObj;
  }

  return searchRecursive(obj);
};


const processImageSections = async (
  imageBuffer,
  token,
  searchCompanyCif = false,

) => {

  try {
  

    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Invalid image dimensions.");
    }

    const { width, height } = metadata;

    let sections = [];
    if (searchCompanyCif) {
      sections = [
        {
          name: "Top Company Cif",
          left: 0,
          top:  Math.round(height * 0.10),
          width: Math.round(width),
          height: Math.round(height * 0.40),
        },
      ];
    } else {
      sections = [
        {
          name: "Left Side",
          left: 0,
          top: Math.round(height * 0.2),
          width: Math.round(width * 0.15),
          height: Math.round(height * 0.6),
          rotate: true,
        },
        {
          name: "Bottom",
          left: Math.round(width * 0.1),
          top: Math.round(height * 0.9),
          width: Math.round(width * 0.9),
          height: Math.round(height * 0.1 - 1),
          rotate: false,
        },
        {
          name: "Right Side",
          left: Math.round(width * 0.85 - 1),
          top: Math.round(height * 0.2),
          width: Math.round(width * 0.15),
          height: Math.round(height * 0.6),
          rotate: true,
        },
        {
          name: "Top",
          left: Math.round(width * 0.1),
          top: Math.round(height * 0),
          width: Math.round(width * 0.9),
          height: Math.round(height * 0.2 - 1),
          rotate: false,
        },
      ];
    }

    for (const section of sections) {
      const sectionImage = sharp(imageBuffer);


      const validSection = {
        left: Math.max(0, Math.min(section.left, width)),
        top: Math.max(0, Math.min(section.top, height)),
        width: Math.max(1, Math.min(section.width, width - section.left)),
        height: Math.max(1, Math.min(section.height, height - section.top)),
      };


      if (validSection.width <= 0 || validSection.height <= 0) {
        console.warn(`Skipping invalid section: ${section.name}`);
        continue;
      }

      try {
        let sectionBuffer = await sectionImage.extract(validSection).toBuffer();
        if (section.rotate) {
          sectionBuffer = await sharp(sectionBuffer).rotate(90).toBuffer();
        }



        const sectionImageUrl = `data:image/png;base64,${sectionBuffer.toString("base64")}`;

        const imageSize = `${validSection.width}x${validSection.height}`;

        const result = await documentGPTTelematel({
          token,
          image: sectionImageUrl,
          searchCif: searchCompanyCif ? false : true,
          searchCifCompany: searchCompanyCif,
          imageSize,
        });

        if (result.error) {
          console.warn(
            `Error in documentGPT for section "${section.name}": ${result.error}`
          );
          continue;
        }

        if (searchCompanyCif && result.companyCif && result.companyCif !== "NOT FOUND") {
          return result;
        } else if (!searchCompanyCif && result.clientCif && result.clientCif !== "NOT FOUND") {
          return result;
        }


      } catch (sectionError) {
        console.error(
          `Error processing section "${section.name}":`,
          sectionError
        );
      }
    }

    return { error: "Client CIF or NIF not found in any image section" };
  } catch (error) {
    console.error("Error in processImageSections:", error);
    return { error: error.message || "Failed to process image sections" };
  }
};


const processProductsSection = async (imageBuffer, token) => {
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("Invalid image dimensions.");
    }

    const { width, height } = metadata;

    const sectionImage = sharp(imageBuffer);
    const validSection = {
      left: 25,
      top: Math.round(height * 0.2),
      width: Math.round(width - 50),
      height: Math.round(height * 0.6),
    };


    try {
      const rawSectionBuffer = await sectionImage
        .extract(validSection)
        .toBuffer();

      const sectionBuffer = await sharp(rawSectionBuffer)
        .png({ quality: 100 })
        .toBuffer();


      const sectionImageUrl = `data:image/png;base64,${sectionBuffer.toString("base64")}`;
      const imageSize = `${validSection.width}x${validSection.height}`;

      let allProducts = [];
      let previousProducts = [];
      let attempts = 0;
      let consecutiveNoNewProducts = 0;
      const requiredConsecutiveNoNew = 2; 


      let totalTokens = 0;
      let totalPrice = 0;

      while (consecutiveNoNewProducts < requiredConsecutiveNoNew) {
        attempts++;

        const { products, tokens, price } = await getProductsGPT({
          token,
          image: sectionImageUrl,
          imageSize,
          previousData: previousProducts
        });

        totalTokens += tokens;
        totalPrice += price;

        let currentProducts = [];
        try {
          currentProducts = JSON.parse(products);
        } catch (parseError) {
          console.error("Could not parse JSON:", parseError);
          return products;
        }

        if (attempts === 1) {
          allProducts = currentProducts;
          previousProducts = currentProducts;
          continue;
        }

        const newProducts = currentProducts.filter(newProduct => {
          return !previousProducts.some(existingProduct =>
            existingProduct.productRef === newProduct.productRef &&
            existingProduct.productAlbaran === newProduct.productAlbaran
          );
        });

        if (newProducts.length > 0) {
         
          allProducts = [...allProducts, ...newProducts];
          previousProducts = currentProducts;
          consecutiveNoNewProducts = 0; 
        } else {
          consecutiveNoNewProducts++;
        }
      }

      return {
        products: JSON.stringify(allProducts),
        tokens: totalTokens,
        price: totalPrice,
      };

    } catch (sectionError) {
      console.error("Error processing document:", sectionError);
      return { error: sectionError.message };
    }
  } catch (error) {
    console.error("Error in processProductsSection:", error);
    return { error: error.message || "Failed to process image sections" };
  }
};



module.exports = {  
  documentGPTTelematel,
  getGPTDataTelematel,
  getProductsGPT,
  processItems,
  processImageSections,
  processProductsSection
}