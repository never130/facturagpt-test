const { default: axios } = require("axios");
const sharp = require('sharp');


const { convertPDFToPNG, mergeResults } = require("./utils");

const calculateCost = ({ inputTokens, outputTokens, imageSize }) => {
  const pricePerToken = {
    input: 0.00000015,  
    output: 0.0000006   
  };

  const textCost = (inputTokens * pricePerToken.input) + (outputTokens * pricePerToken.output);

  const [widthStr, heightStr] = imageSize.split("x");
  const imageWidth = parseInt(widthStr, 10);
  const imageHeight = parseInt(heightStr, 10);

  const maxDimension = Math.max(imageWidth, imageHeight);
  const minDimension = Math.min(imageWidth, imageHeight);

  let scaledWidth, scaledHeight;

  if (maxDimension <= 2048) {
    const scaleFactor = 768 / minDimension;
    scaledWidth = Math.floor(imageWidth * scaleFactor);
    scaledHeight = Math.floor(imageHeight * scaleFactor);
  } else {
    const scaleFactor = 2048 / maxDimension;
    const initialWidth = Math.floor(imageWidth * scaleFactor);
    const initialHeight = Math.floor(imageHeight * scaleFactor);

    const minScaledDimension = Math.min(initialWidth, initialHeight);
    const secondScaleFactor = 768 / minScaledDimension;
    scaledWidth = Math.floor(initialWidth * secondScaleFactor);
    scaledHeight = Math.floor(initialHeight * secondScaleFactor);
  }

  const tilesX = Math.ceil(scaledWidth / 512);
  const tilesY = Math.ceil(scaledHeight / 512);
  const totalTiles = tilesX * tilesY;

  const imageTokens = (totalTiles * 170) + 85;

  const imageCost = imageTokens * pricePerToken.input;

  const totalCost = textCost + imageCost;

  return {
    textCost,
    imageCost,
    totalCost,
    breakdown: {
      inputTokens,
      outputTokens,
      imageTokens,
      imageSize,
      scaledSize: `${scaledWidth}x${scaledHeight}`,
      tiles: `${tilesX}x${tilesY}`,
      pricePerToken
    }
  };
};



const documentGPT = async ({
  token,
  image,
  items = [],
  imageSize = "1536x2048",
}) => {
  const buildDynamicPrompt = (items) => {
    const fields = items.map(item => {
      return `- "${item.name}": ${item.title}${item.description ? ` - ${item.description}` : ''}`;
    }).join('\n');

    return `**INSTRUCCIONES**
    Tu tarea es analizar el contenido del documento proporcionado para extraer información relevante. Debes seguir estas reglas estrictamente:
    
    1. **Identificar el Tipo de Documento**
       - Determina si el documento es una **factura** o un **albarán**. En los casos en los que se encuentre la palabra "factura" en el documento, considera que es una factura. De caso contrario, considera que es un albarán. ESTA PROPIEDAD TIENE QUE TENER UNO DE LOS DOS VALORES OBLIGATORIOS: "factura" o "albarán".
       - Devuelve una propiedad llamada "documentType" con los valores "factura" o "albarán" según corresponda.
    
    2. **Valores Comunes para Ambos Tipos de Documento**
        - **Número de Pedido (numberOrder)**: Busca el número de pedido (puede aparecer como "Número de pedido:", "Pedido:", "Ped: " o variantes similares).
        - *Nota*: Este número no debe confundirse con el número de factura o albarán.
        - Si no encuentras este dato, devuelve "numberOrder": "NOT FOUND".
      
    3. **Reglas Generales**
       - Si no encuentras un valor esperado, asignale "NOT FOUND".
    
    4. **Datos Específicos por Tipo de Documento**
  
      - Extrae los siguientes datos:
      ${fields}
    
    5. **Formato de Respuesta**
      Devuelve un objeto JSON con los siguientes campos:
      ${items.map(item => `- "${item.value}": valor encontrado`).join('\n')}
    
    Consideraciones Finales:
    - Convierte TODOS los números a números con 2 decimales, por más que sea entero. Eliminar tipo de moneda y símbolo. (2,000.24€ -> 2000.24, 20€ -> 20.00)
    - Evita confusiones entre el número de pedido, número de factura, y número de albarán.
    - No incluyas datos confidenciales, como el número de cliente, más allá de lo especificado.
    - Para cada campo, asegúrate de seguir el formato especificado en su descripción.
    `;
  };

  const systemPrompt = buildDynamicPrompt(items);
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
      temperature: 0.7,
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
      return { error: 'Failed to parse JSON response', totalTokens, totalPrice: totalCost };
    }

    if (parsedResponse.error) {
      return {
        error: parsedResponse?.error,
        totalTokens,
        totalPrice: totalCost
      };
    }

    return { ...parsedResponse, totalTokens, totalPrice: totalCost };
  } catch (e) {
    console.error("Error in documentGPT:", e);
    return {
      error: e.message || "An error occurred in documentGPT",
      totalTokens: 0,
      totalPrice: 0,
    };
  }
};


const automateGPT = async ({
  token,
  prompt,
}) => {

 
  let systemPrompt = `Tu tarea es crear una configuración de automatización basada en el prompt del usuario. Debes generar un objeto JSON completo con todos los campos necesarios para configurar una automatización en el sistema.

**INSTRUCCIONES ESPECÍFICAS:**

**Título de la Automatización** (inputValue): 
- "inputValue" Genera un título descriptivo basado en el prompt del usuario "Automatización para procesar facturas de Gmail".

**Email de destino**:
- "filesArrayEmails": ["destinatario@email.com"], es un array []

**Palabras Clave del Asunto**:
- "filesArrayKeyWords": ["subject"], es un array []

**Palabras Clave del Cuerpo**:
- "bodyArrayKeyWords": Array con palabras clave relevantes al prompt ["factura", "billing", "invoice"]

**Configuración de Exportación**:
- "selectStandardExport" true (siempre true para exportaciones estándar)

**Configuración de Fechas**:
- "date": Una opción de los siguientes valores, Ejemplos:"1 Day", "2 Days", "3 Days", "4 Days", "5 Days", "6 Days", "7 Days", "1 Week"]

**Frecuencia de Acción**:
- "selectedActionFrequency": Array con opciones ["Default", "30 Minutes", "1 Hour", "6 Hours", "12 Hours"]

**Ruta de la carpeta**:
- "folderLocation": ruta de la carpeta donde se guardarán los archivos ["/Users/juan/Desktop/test"]

**Formato de Archivo**:
- "fileFormat": Array con formatos relevantes ["XML", "PDF", "JSON", "CSV"]
  
**Renombrado de Archivos**:
- "renameFile": "nombre_archivo_automatico"

**Configuración de Notas**:
- "noteEnabled": true/false
- "noteText": "Texto de la nota personalizada"
  
**Nombre de la Automatización**:
- "automateName": "Nombre descriptivo de la automatización"
  
**Configuración de Outlook**:
- "mailBoxOutlook": true/false según el tipo de automatización
- "outlookBody": "Mensaje personalizado para Outlook"
- "outlookSubject": "Asunto del email de Outlook"
- "outlookTo": ["destinatario@email.com"], es un array []

**Configuración de Gmail**:
- "mailBoxGmail": true/false según el tipo de automatización
- "gmailBody": "Mensaje personalizado para Gmail"
- "gmailSubject": "Asunto del email de Gmail"
- "gmailTo": ["destinatario@email.com"], es un array []

**Errroes**:
- "notificateErrors": true/false según el tipo de automatización

**phoneListNotificate**:
- "phoneListNotificate": ["+34666666666"], es un array []
- "whatsAppMessage": "whatsapp00458<div><br></div>"


**PROMPT DEL USUARIO:**
${prompt}


**FORMATO DE RESPUESTA:**
Devuelve ÚNICAMENTE un objeto JSON válido con todos los campos mencionados, adaptados al contexto del prompt del usuario. No incluyas explicaciones adicionales, solo el JSON.`;


  const conversation0 = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: systemPrompt,
        },
      ],
    },
  ];



  systemPrompt = `**Filtros y Condiciones**:
- "labels": Es un array de etiquetas que contiene información sobre las variables que va a filtrar []
  - "labels[].name": Titulo de la etiqueta
  **Parametros de la etiqueta aquí viene un array de variables, "conditionCurrency" es un array []**
    - "labels[].conditionCurrency[].title": "Nombre de la etiqueta"
    - "labels[].conditionCurrency[].value": "Valor en camelcase como variable"
    - "labels[].conditionCurrency[].description": "Descripción de la etiqueta"
  **Condiciones de la etiqueta, son unos prompts que permtien dar operaciones logicas a las variables "conditions" es un array []**
    - "labels[].conditions[].title": "Nombre de la etiqueta"
    - "labels[].conditions[].value": "Nombre de la etiqueta"
    - "labels[].conditions[].description": "Nombre de la etiqueta"
  **Condiciones de la etiqueta, "filters" es un array []**
    - "labels[].filters[]": "SQL para filtrar los emails"`



  const conversation1 = [{
      role: "user",
      content: [
        {
          type: "text",
          text: systemPrompt,
        },
      ],
    }];


  try {
    const response0 = await axios.post( "https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 12096,
        messages: conversation0,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const response1 = await axios.post( "https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 12096,
        messages: conversation1,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  


  let [codeType0, cleanedCode0] = await extractCodeBlocks(response0.data.choices[0].message.content);
  let [codeType1, cleanedCode1] = await extractCodeBlocks(response1.data.choices[0].message.content);

    let parsedResponse;
    try {
      parsedResponse = {
        ...JSON.parse(cleanedCode0),
        ...JSON.parse(cleanedCode1),
      }
    } catch (parseError) {
      return { error: 'Failed to parse JSON response' };
    }

    if (parsedResponse.error) {
      return {
        error: parsedResponse?.error,
      };
    }

    return { ...parsedResponse };
  } catch (e) {
    console.error("Error in documentGPT:", e);
    return {
      error: e.message || "An error occurred in documentGPT",
      totalTokens: 0,
      totalPrice: 0,
    };
  }
};

const imageToHtmlGPT1 = async ({ token, base64 }) => {
	try {

    console.log("base64", base64);
		let imageBase64 = null;
		if (typeof base64 !== "string") {
			return { error: "Invalid base64 input" };
		}

		const isDataUrl = base64.startsWith("data:");
		const mimeMatch = isDataUrl ? base64.match(/^data:([^;]+);base64,(.*)$/) : null;
		const mimeType = mimeMatch ? mimeMatch[1] : null;
		const rawBase64 = mimeMatch ? mimeMatch[2] : (isDataUrl ? "" : base64);

		if ((mimeType && mimeType.includes("pdf")) || (!mimeType && rawBase64.startsWith("JVBERi0"))) {
			const pdfBuffer = Buffer.from(rawBase64 || "", "base64");
			const images = await convertPDFToPNG(pdfBuffer);
			if (!images || images.length === 0) {
				return { error: "No se pudo convertir el PDF a imagen" };
			}
			imageBase64 = images[0].toString("base64");
		} else if (mimeType && mimeType.startsWith("image/")) {
			imageBase64 = rawBase64;
		} else if (!isDataUrl) {
			imageBase64 = rawBase64 || base64;
		} else {
			return { error: "Formato base64 no soportado" };
		}

		const imageUrl = `data:image/png;base64,${imageBase64}`;

		// Obtener dimensiones nativas de la imagen para orientar una maquetación de coordenadas absolutas
		let naturalWidth = 1024;
		let naturalHeight = 1448;
		try {
			const meta = await sharp(Buffer.from(imageBase64, "base64")).metadata();
			if (meta?.width && meta?.height) {
				naturalWidth = meta.width;
				naturalHeight = meta.height;
			}
		} catch {}

		const systemPrompt = `Eres un conversor que recibe una imagen de un documento (derivada de un PDF) y debes generar un HTML + CSS que replique el diseño con fidelidad ~95%-pixel-perfect.

	Requisitos estrictos:
	- Devuelve SOLO un documento HTML válido dentro de un único bloque de código, sin comentarios adicionales.
	- Incluye un <head> con <meta charset> y <meta name="viewport">.
	- Maqueta en un sistema de coordenadas absoluto basado en el tamaño nativo de la imagen (${naturalWidth}x${naturalHeight} px):
	  - Crea un contenedor .page con width: ${naturalWidth}px; height: ${naturalHeight}px; background-image con la imagen recibida.
	  - Superpone capas (texto, tablas, cajas) con position: absolute y coordenadas en px para coincidir visualmente con el diseño.
	  - Usa clases y evita estilos inline salvo cuando sea imprescindible.
	- Responsividad: envuelve .page en un contenedor que escale con transform: scale() para encajar al ancho disponible manteniendo el aspect-ratio. Añade media queries para >=768px y >=1024px si hay ajustes tipográficos.
	- Respeta tipografías, pesos, colores, alineaciones, tablas y jerarquías visuales. Para tablas, usa <table> con <thead>/<tbody> cuando aplique.
	- Si hay logotipos o imágenes internas no extraíbles, deja placeholders con cajas del tamaño aproximado.
	- Importante: NO establezcas alturas fijas (height) en contenedores. Deja que el contenido determine la altura. Evita style="height:..." en el HTML generado.
	- El resultado debe ser autocontenido (sin dependencias externas) y listo para insertar en un editor de HTML.
	- No incluyas explicaciones; SOLO el HTML completo en el bloque de código.`;

		const messages = [
			{
				role: "user",
				content: [
					{ type: "image_url", image_url: { url: imageUrl, detail: "high", size: "1536x2048" } },
					{ type: "text", text: systemPrompt },
				],
			},
		];

		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions",
			{ model: "gpt-4o", temperature: 0.1, max_tokens: 8000, messages },
			{ headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
		);

		const content = response.data.choices[0]?.message?.content || "";
		const [codeType, cleaned] = await extractCodeBlocks(content);
		let html = cleaned || content;
		if (!html || !html.includes("<html")) {
			html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Documento</title>
  <style>
    body { margin: 0; background: #f3f4f6; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    .viewport { width: 100%; display: grid; place-items: center; padding: 1rem; box-sizing: border-box; }
    .scale-wrap { position: relative; transform-origin: top left; }
    .page {
      position: relative;
      background: url('${imageUrl}') top left / cover no-repeat #fff;
      box-shadow: 0 10px 30px rgba(0,0,0,.08);
      border: 1px solid rgba(0,0,0,.06);
    }
    @media (min-width: 768px) { .viewport { padding: 2rem; } }
    @media (min-width: 1024px) { .viewport { padding: 3rem; } }
  </style>
</head>
<body>
  <div class="viewport">
    <div id="scale" class="scale-wrap">
      <div class="page"></div>
    </div>
  </div>

</body>
</html>`;
		}
		return { html };
	} catch (e) {
		console.error("Error in imageToHtmlGPT:", e);
		return { error: e.message || "An error occurred in imageToHtmlGPT" };
	}
};


// Crea HTML a partir de la imagen, dividiéndola en secciones verticales de sliceHeight px
// Para cada sección, pide al modelo un JSON con elementos posicionados y luego compone un HTML único
const imageToHtmlGPT = async ({ token, base64, sliceHeight = 500 }) => {
	try {
    // console.log("base64", base64);
    // return false
		if (typeof base64 !== "string") {
			return { error: "Invalid base64 input" };
		}

		const isDataUrl = base64.startsWith("data:");
		const mimeMatch = isDataUrl ? base64.match(/^data:([^;]+);base64,(.*)$/) : null;
		const mimeType = mimeMatch ? mimeMatch[1] : null;
		const rawBase64 = mimeMatch ? mimeMatch[2] : (isDataUrl ? "" : base64);

		let imageBase64 = null;
		if ((mimeType && mimeType.includes("pdf")) || (!mimeType && rawBase64.startsWith("JVBERi0"))) {
			const pdfBuffer = Buffer.from(rawBase64 || "", "base64");
			const images = await convertPDFToPNG(pdfBuffer);
			if (!images || images.length === 0) {
				return { error: "No se pudo convertir el PDF a imagen" };
			}
			imageBase64 = images[0].toString("base64");
		} else if (mimeType && mimeType.startsWith("image/")) {
			imageBase64 = rawBase64;
		} else if (!isDataUrl) {
			imageBase64 = rawBase64 || base64;
		} else {
			return { error: "Formato base64 no soportado" };
		}

		// Dimensiones nativas
		let naturalWidth = 1024;
		let naturalHeight = 1448;
		try {
			const meta = await sharp(Buffer.from(imageBase64, "base64")).metadata();
			if (meta?.width && meta?.height) {
				naturalWidth = meta.width;
				naturalHeight = meta.height;
			}
		} catch {}

		// Generar slices verticales
		const totalSlices = Math.ceil(naturalHeight / sliceHeight);
		const sliceBuffers = [];
		for (let i = 0; i < totalSlices; i++) {
			const top = i * sliceHeight;
			const height = Math.min(sliceHeight, naturalHeight - top);
			const sliced = await sharp(Buffer.from(imageBase64, "base64"))
				.extract({ left: 0, top, width: naturalWidth, height })
				.png()
				.toBuffer();
			sliceBuffers.push({ index: i, top, height, pngBase64: sliced.toString("base64") });
		}
    console.log("sliceBuffers", sliceBuffers);

		// Prompt para pedir JSON de elementos posicionados por slice
		const buildSystemPrompt = (width, height) => `Eres un etiquetador de layout. Te doy una imagen (un "slice" vertical de un documento) y debes devolver TODOS los textos, imágenes y estructuras tabulares detectados, SIN OMITIR NADA.

Salida estricta: devuelve SOLO un bloque de código JSON válido (array) con objetos con esta forma:
[
  {
    "type": "text" | "image" | "table" | "group",
    "label": "logo" | "icon" | "photo" | "stamp" | "graphic" (solo si type="image", obligatorio),
    "importance": "high" | "medium" | "low" (solo si type="image", obligatorio; considera high para logos visibles, iconos destacados y fotos grandes),
    "content": "texto tal como aparece" (solo si type="text"),
    "bbox": { "x": px, "y": px, "width": px, "height": px },
    "fontSize": px (opcional, recomendado en texto),
    "fontWeight": "normal" | "bold" (opcional),
    "color": "#RRGGBB" (opcional),
    "align": "left" | "center" | "right" (opcional),
    "borderColor": "#RRGGBB" (solo texto con caja/borde, opcional),
    "borderWidth": px (solo texto con caja/borde, opcional),
    "borderStyle": "solid" | "dashed" | "dotted" (opcional),
    "borderRadius": px (opcional),
    "backgroundColor": "#RRGGBB" (opcional),
    "padding": px (opcional)
  },
  {
    "type": "table",
    "bbox": { "x": px, "y": px, "width": px, "height": px },
    "hasHeader": true|false,
    "cells": [
      { "rowIndex": 0, "colIndex": 0, "bbox": {"x":px,"y":px,"width":px,"height":px}, "content": "texto", "isHeader": true|false,
        "borderColor": "#RRGGBB" (opcional), "borderWidth": px (opcional), "borderStyle": "solid"|"dashed"|"dotted" (opcional) }
      ...
    ]
  },
  {
    "type": "group",
    "bbox": { "x": px, "y": px, "width": px, "height": px },
    "layout": "flex" | "grid",
    "columns": number (solo si grid),
    "gapPx": px (opcional),
    "children": [ elementos "text" o "image" anidados, con sus campos habituales ]
  },
  ...
]

Reglas de precisión:
- Coordenadas absolutas en px relativas al slice (0,0 arriba-izquierda). Tamaño del slice: ${width}x${height}.
- Cajas súper ajustadas (sin holgura): margen máximo ±2 px respecto al contenido real.
- NO solapes cajas entre sí. Si hay solape, ajusta bboxes para que no se superpongan.
- IMÁGENES: marca como type="image" cualquier bloque visual (foto, logo, icono, sello, gráfico). Si un área es imagen, NO devuelvas elementos de texto superpuestos a esa área. El texto embebido en el propio logo/foto NO debe devolverse como elementos de texto separados. No etiquetes líneas decorativas o separadores como imagen.
- TEXTO: no te saltes ningún texto que NO esté dentro de áreas de imagen. Respeta saltos de línea y agrupaciones por bloques.
- No incluyas explicaciones ni HTML. 
- SOLO el JSON en un único bloque de código. 
- No propongas estilos de height para HTML.
- La posición debe ser exacta en cada elemento.
- Reporta únicamente bboxes.`;

		// Llamar al modelo por cada slice en paralelo
		const sliceResults = await Promise.all(
			sliceBuffers.map(async (slice) => {
        console.log("slice", slice.height);
				const imageUrl = `data:image/png;base64,${slice.pngBase64}`;
				const systemPrompt = buildSystemPrompt(naturalWidth, slice.height);
				const messages = [
					{
						role: "user",
						content: [
							{ type: "image_url", image_url: { url: imageUrl, detail: "high", size: "2048x2048" } },
							{ type: "text", text: systemPrompt },
						],
					},
				];

				const response = await axios.post(
					"https://api.openai.com/v1/chat/completions",
					{ model: "gpt-4.1", temperature: 0.1, max_tokens: 8000, messages },
					{ headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
				);

				const content = response.data.choices[0]?.message?.content || "";
				const [codeType, cleaned] = await extractCodeBlocks(content);
				console.log("cleaned", cleaned);
        let elements = [];
				try {
					elements = JSON.parse(cleaned || content);
					if (!Array.isArray(elements)) elements = [];
				} catch {}
				return { slice, elements };
			})
		);

		// Post-proceso: recortar imágenes reales desde el documento y eliminar textos superpuestos a imágenes
		function overlapRatio(a, b) {
			const x1 = Math.max(a.x, b.x);
			const y1 = Math.max(a.y, b.y);
			const x2 = Math.min(a.x + a.width, b.x + b.width);
			const y2 = Math.min(a.y + a.height, b.y + b.height);
			const interW = Math.max(0, x2 - x1);
			const interH = Math.max(0, y2 - y1);
			const inter = interW * interH;
			const areaA = Math.max(1, a.width * a.height);
			const areaB = Math.max(1, b.width * b.height);
			// usar IoU para ser más estricto con el solape
			const union = areaA + areaB - inter;
			return union > 0 ? inter / union : 0;
		}

		const extractedImages = [];
		for (const { slice, elements } of sliceResults) {
			// Recortar imágenes y construir bboxes en coordenadas del documento completo
			for (const el of elements) {
				if (el?.type === 'image' && el?.bbox) {
					let sx = Math.max(0, Math.round(el.bbox.x || 0));
					let syInSlice = Math.max(0, Math.round(el.bbox.y || 0));
					let sw = Math.max(1, Math.round(el.bbox.width || 0));
					let sh = Math.max(1, Math.round(el.bbox.height || 0));
					// Ligero padding para no cortar bordes de logos/fotos
					sx = Math.max(0, sx - 2);
					syInSlice = Math.max(0, syInSlice - 2);
					sw = sw + 4;
					sh = sh + 4;
					const sy = Math.max(0, slice.top + syInSlice);
					const left = Math.min(naturalWidth - 1, sx);
					const top = Math.min(naturalHeight - 1, sy);
					const width = Math.min(sw, naturalWidth - left);
					const height = Math.min(sh, naturalHeight - top);
					try {
						const cropped = await sharp(Buffer.from(imageBase64, "base64"))
							.extract({ left, top, width, height })
							.png()
							.toBuffer();
						extractedImages.push({
							sliceIndex: slice.index,
							bbox: { x: left, y: top, width, height },
							base64: cropped.toString("base64"),
						});
					} catch {}
				}
			}
			// Eliminar textos que estén dentro de cualquier bbox de imagen del mismo slice
			const imageBoxes = elements.filter(e => e?.type === 'image' && e?.bbox).map(e => ({
				x: e.bbox.x,
				y: e.bbox.y,
				width: e.bbox.width,
				height: e.bbox.height,
			}));
			for (let i = elements.length - 1; i >= 0; i--) {
				const el = elements[i];
				if (el?.type === 'text' && el?.bbox) {
					const tbox = { x: el.bbox.x, y: el.bbox.y, width: el.bbox.width, height: el.bbox.height };
					const overlaps = imageBoxes.some(img => overlapRatio(tbox, img) > 0.2);
					if (overlaps) {
						elements.splice(i, 1);
					}
				}
			}
		}

		// Componer HTML final autocontenido y responsivo con escala, SIN fondo
		const htmlParts = [];
		htmlParts.push(`<style>`);
		htmlParts.push(`body { margin: 0; background: #f3f4f6; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }`);
		htmlParts.push(`.viewport { width: 100%; display: grid; place-items: center; padding: 16px; box-sizing: border-box; }`);
		htmlParts.push(`.scale-wrap { width: 100%; position: relative; transform-origin: top left; }`);
		htmlParts.push(`.doc { width: 100%; }`);
		htmlParts.push(`.slice { width: 100%; background: #fff; margin: 0 auto; box-shadow: 0 2px 12px rgba(0,0,0,.04); border: 1px solid rgba(0,0,0,.06); padding: 8px 8px 12px; box-sizing: border-box; }`);
		htmlParts.push(`.item { zoom: 0.7; display: block; white-space: pre-wrap; box-sizing: border-box; }`);
		htmlParts.push(`.item img { width: 100%; height: auto; display: block; }`);
		htmlParts.push(`@media (min-width: 768px) { .viewport { padding: 8px; } }`);
		htmlParts.push(`@media (min-width: 1024px) { .viewport { padding: 12px; } }`);
		htmlParts.push(`</style>`);
		htmlParts.push(`<div class="doc">`);

		for (const { slice, elements } of sliceResults) {
			htmlParts.push(`<section class="slice">`);
			// Orden natural por posición vertical
			const sorted = [...elements].sort((a, b) => (a?.bbox?.y || 0) - (b?.bbox?.y || 0));
			let prevBottom = 0;
			for (const el of sorted) {
				const bbox = el?.bbox || {};
				const leftPx = Math.max(0, parseFloat(bbox.x || 0));
				const topPx = Math.max(0, parseFloat(bbox.y || 0));
				const wPx = Math.max(0, parseFloat(bbox.width || 0));
				const hPx = Math.max(0, parseFloat(bbox.height || 0));
				// Márgenes relativos: avance vertical por diferencia con el elemento anterior
				const marginTopPx = Math.max(0, topPx - prevBottom);
				prevBottom = Math.max(prevBottom, topPx + hPx);
				const leftPercent = naturalWidth > 0 ? Math.max(0, Math.min(100, (leftPx / naturalWidth) * 100)) : 0;
				const widthPercent = naturalWidth > 0 ? Math.max(0, Math.min(100, (wPx / naturalWidth) * 100)) : null;
				const marginTopVW = naturalWidth > 0 ? (marginTopPx / naturalWidth) * 100 : 0;
				const fontSize = el?.fontSize ? Math.round(el.fontSize) : undefined;
				const fontWeight = el?.fontWeight && (el.fontWeight === 'bold' ? 'bold' : 'normal');
				const color = typeof el?.color === 'string' ? el.color : undefined;
				const align = typeof el?.align === 'string' ? el.align : undefined;
				// No fijamos height; dejamos que el contenido lo determine
				const styleParts = [
					`margin-top:${marginTopVW.toFixed(3)}vw`,
					`margin-left:${leftPercent.toFixed(2)}%`,
					widthPercent != null ? `width:${widthPercent.toFixed(2)}%` : `width:${wPx}px`
				];
				if (el?.backgroundColor) styleParts.push(`background-color:${el.backgroundColor}`);
				if (el?.borderColor) styleParts.push(`border-color:${el.borderColor}`);
				if (el?.borderStyle || el?.borderWidth || el?.borderColor) styleParts.push(`border-style:${el?.borderStyle || 'solid'}`);
				if (el?.borderWidth) {
					const bwVW = (parseFloat(el.borderWidth) / naturalWidth) * 100;
					styleParts.push(`border-width:${bwVW.toFixed(3)}vw`);
				}
				if (el?.borderRadius) styleParts.push(`border-radius:${Math.round(el.borderRadius)}px`);
				if (el?.padding) {
					const pVW = (parseFloat(el.padding) / naturalWidth) * 100;
					styleParts.push(`padding:${pVW.toFixed(3)}vw`);
				}
				if (fontSize) {
					const fsVW = (fontSize / naturalWidth) * 100;
					styleParts.push(`font-size:${fsVW.toFixed(3)}vw`);
				}
				if (fontWeight) styleParts.push(`font-weight:${fontWeight}`);
				if (color) styleParts.push(`color:${color}`);
				if (align) styleParts.push(`text-align:${align}`);
				if (el?.type === 'table' && Array.isArray(el.cells)) {
					// Render básico de tabla usando grid, con bordes por celda si existen
					const inferredCols = (el.columns != null ? el.columns : (Math.max(...el.cells.map(c => (c.colIndex || 0))) + 1)) || 1;
					const cols = Math.min(4, Math.max(1, inferredCols));
					const gap = el.gapPx ? Math.round(el.gapPx) : 0;
					const tableStyles = [`display:grid`,`grid-template-columns:repeat(${cols}, 1fr)`, `gap:${gap}px`, ...styleParts];
					htmlParts.push(`<div class="item table" style="${tableStyles.join(';')}">`);
					for (const cell of el.cells.sort((a,b)=> (a.rowIndex - b.rowIndex) || (a.colIndex - b.colIndex))) {
						const cs = [];
						if (cell.borderColor) cs.push(`border-color:${cell.borderColor}`);
						if (cell.borderStyle || cell.borderWidth || cell.borderColor) cs.push(`border-style:${cell.borderStyle || 'solid'}`);
						if (cell.borderWidth) {
							const cbwVW = (parseFloat(cell.borderWidth) / naturalWidth) * 100;
							cs.push(`border-width:${cbwVW.toFixed(3)}vw`);
						}
						const safeCell = (typeof cell.content === 'string' ? cell.content : '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
						htmlParts.push(`<div class="cell" style="${cs.join(';')}">${safeCell}</div>`);
					}
					htmlParts.push(`</div>`);
				} else if (el?.type === 'group' && Array.isArray(el.children)) {
					const gap = el.gapPx ? Math.round(el.gapPx) : 0;
					const layout = el.layout === 'grid' ? 'grid' : 'flex';
					const cols = Math.min(4, Math.max(1, el.columns || 2));
					const groupStyles = [...styleParts];
					if (layout === 'grid') {
						groupStyles.push(`display:grid`);
						groupStyles.push(`grid-template-columns:repeat(${cols},1fr)`);
						groupStyles.push(`gap:${gap}px`);
					} else {
						groupStyles.push(`display:flex`);
						groupStyles.push(`gap:${gap}px`);
						groupStyles.push(`flex-wrap:wrap`);
					}
					htmlParts.push(`<div class="item group" style="${groupStyles.join(';')}">`);
					for (const child of el.children) {
						const childText = (typeof child?.content === 'string' ? child.content : '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
						if (child?.type === 'image') {
							htmlParts.push(`<div class="child"><img src="${'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 48\"><rect width=\"64\" height=\"48\" fill=\"#e5e7eb\"/><path d=\"M8 36l12-12 8 8 12-12 16 16H8z\" fill=\"#cbd5e1\"/><circle cx=\"18\" cy=\"16\" r=\"4\" fill=\"#cbd5e1\"/></svg>') }" alt="img"/></div>`);
						} else {
							htmlParts.push(`<div class="child">${childText}</div>`);
						}
					}
					htmlParts.push(`</div>`);
				} else if (el?.type === 'image') {
					// Buscar la imagen recortada correspondiente en extractions
					const absLeft = leftPx;
					const absTop = slice.top + topPx;
					const found = extractedImages.find(img => Math.abs(img.bbox.x - absLeft) <= 2 && Math.abs(img.bbox.y - absTop) <= 2 && Math.abs(img.bbox.width - wPx) <= 2 && Math.abs(img.bbox.height - hPx) <= 2);
					let src = found ? `data:image/png;base64,${found.base64}` : '';
					if (!src) {
						src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 48"><rect width="64" height="48" fill="#e5e7eb"/><path d="M8 36l12-12 8 8 12-12 16 16H8z" fill="#cbd5e1"/><circle cx="18" cy="16" r="4" fill="#cbd5e1"/></svg>');
					}
					htmlParts.push(`<div class="item" style="${styleParts.join(';')}"><img src="${src}" alt="img"/></div>`);
				} else {
					const safeText = (typeof el?.content === 'string' ? el.content : '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
					htmlParts.push(`<div class="item text" style="${styleParts.join(';')}">${safeText}</div>`);
				}
			}
			htmlParts.push(`</section>`);
		}

		htmlParts.push(`</div>`); // .doc
		htmlParts.push(`</div>`); // .scale-wrap
		htmlParts.push(`</div>`); // .viewport
		htmlParts.push(`<script>`);
		htmlParts.push(`(function(){
  var W = ${naturalWidth};
  function fit(){
    var vw = Math.max(document.documentElement.clientWidth||0, window.innerWidth||0) - 32;
    var el = document.getElementById('scale');
    if (!el) return;
    var s = Math.min(vw / W, 1);
    el.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit); fit();
})();`);
		htmlParts.push(`</script>`);
		htmlParts.push(`</body>`);
		htmlParts.push(`</html>`);

		return { html: htmlParts.join(""), images: extractedImages };
	} catch (e) {
		console.error("Error in imageToHtmlSlicesGPT:", e);
		return { error: e.message || "An error occurred in imageToHtmlSlicesGPT" };
	}
};

const getGPTData = async ({
  attach,
  token,
}) => {
  try {
    const fileBuffer = attach.buffer;
    let imageBuffers = [];

    if (
      attach.mimetype === "application/pdf" ||
      attach.mimeType === "application/pdf"
    ) {
      imageBuffers = await convertPDFToPNG(fileBuffer);
    } else if (attach && (attach.mimetype?.startsWith("image/") || attach.mimeType?.startsWith("image/"))) {
      if (attach.mimetype === "image/webp" || attach.mimeType === "image/webp") {
        const pngBuffer = await sharp(fileBuffer)
          .png()
          .toBuffer();
        imageBuffers.push(pngBuffer);
      } else {
        imageBuffers.push(fileBuffer);
      }
    }


    let [sheetName, items] = await documentTypeGPT(imageBuffers[0].toString("base64"), token);

     return { sheetName, items }
    if (sheetName === "404") {
      return {
        status: 404,
        error: "Document type not found",
        totalTokens: 0,
        totalPrice: 0,
      };
    }


    let totalTokens = 0;
    let totalPrice = 0;
    let allResults = [];


    for (const [index, imageBuffer] of imageBuffers.entries()) {
      const imageUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;

      let result = {};

      let attemptResult = await documentGPT({
        token,
        image: imageUrl,
        items,
      });


      totalTokens += attemptResult.totalTokens || 0;
      totalPrice += attemptResult.totalPrice || 0;

      if (attemptResult.error) {
        console.warn(
          `Error for page ${index + 1}/${imageBuffers?.length}: ${attemptResult.error}`
        );
        continue;
      }


      allResults.push(attemptResult);
    }

    let mergedResult = mergeResults(allResults);
    return {
      ...mergedResult,
      sheetName,
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







const getDocumentTypes = () => {
  const filterDocs = require('../../../src/views/Dashboard/components/Automate/Components/FileInput/selectInfoToProcces/filterDocs.json');
  const categories = [];

  Object.entries(filterDocs).forEach(([docKey, docValue]) => {
    docValue.items.forEach(item => {
      categories.push([item.title, item.value, docKey, item.items]);
    });
  });

  return categories;
};

const documentTypeGPT = async (image, token) => {
  const documentTypes = getDocumentTypes();

  const systemPrompt = `**INSTRUCCIONES**
  Tu tarea es analizar la imagen proporcionada para determinar qué tipo de documento es. 
  Debes seleccionar UNA SOLA opción de la siguiente lista de documentos disponibles:
  ${documentTypes.map(([title]) => `- ${title}`).join('\n')}
  
  IMPORTANTE:
  1. Solo puedes devolver el name en formato camelCase que corresponde al documento detectado
  2. Si no puedes identificar el documento con certeza, devuelve "404"
  3. No incluyas explicaciones ni texto adicional, solo el name o "404"
  4. Los names disponibles son: ${documentTypes.map(([, value]) => value).join(', ')}
  `;

  try {
    const body = {
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 5000,
      messages: [{
        role: "user",
        content: [{
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${image}`,
            detail: "high",
            size: "1536x2048"
          }
        }, {
          type: "text",
          text: systemPrompt
        }]
      }]
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

    const result = response.data.choices[0].message.content.trim();

    const validNames = documentTypes.map(([, value]) => value);
    if (validNames.includes(result)) {
      const foundItem = documentTypes.find(([, value]) => value === result);

      if (foundItem) {
        const [, value, , items] = foundItem;
        return [value, items];
      }
    }

    return ["404", []];
  } catch (error) {
    console.error("Error en documentTypeGPT:", error.message);
    return ["404", []];
  }
};






const filterGpt = async (prompt, token) => {
  try {

    const systemPrompt = `
    Puedes recibir 3 tipos de mensajes: 

    1. Mensajes sobre tipos de documentos
    Si recibes un mensaje que especifica cualquier tipo de documento (ej: "factura de luz", "factura de agua", "certificado medico",  etc.),
    debes entender el tipo de documento y devolver una lista de campos relevantes o variables que se usan para ese tipo de documento.
    El objeto debe tener como pimer atributo el título del mensaje recibido, y luego un array de objetos con los campos relevantes.
    El titulo debe ser el mensaje recibido bien escrito si es que esta mal escrito y con un formato explicativo como por ejemplo: "Campos reelevantes para ...".
    Los objetos del array deben tener los siguientes atributos:
    - title: Nombre del campo relevante (ej: "CIF del cliente")
    - description: Descripción del campo relevante (ej: "CIF del cliente del documento")
    - value: Nombre de la variable en camelCase (ej: "clientCif")
    
    Por ejemplo, para una factura de luz, deberías buscar y devolver un array de json:
    - CIF/NIF del cliente
    - Nombre del cliente
    - Dirección
    - Email
    - Número de contrato
    - Potencia contratada
    - Consumo
    - Periodo de facturación
    - Importes (base, impuestos, total)

    **Formato de la Respuesta**:
    Devuelve en formato JSON correcto:
    { title:,
    data: [{
      "title", 
      "description",
      "value"
    }, 
    ...
    ]}
   
    

    2. Mensajes sobre variables específicas
    Si recibes un mensaje que solicita buscar variables específicas (ej: "agregar cif", "buscar email"),
    debes devolver información sobre cómo buscar esa variable en el documento.
    
    **Formato de la Respuesta**:
    Devuelve en formato JSON correcto:
    { title: "El mensaje recibido bien escrito si es que esta mal escrito",
    data: [{
      "title": "Búsqueda de CIF",
      "description": "Instrucciones para encontrar el CIF en el documento",
      "value": "nombre de la variable referente a title pero en camelcase"
    }, 
    ...
    ]}

    3. Otros mensajes
    Para cualquier otro tipo de mensaje que no coincida con los anteriores:
    
    **Formato de la Respuesta**:
    Devuelve en formato JSON correcto:
    { title: "El mensaje recibido bien escrito si es que esta mal escrito",
    data:[{
      "title": "not found",
      "description": "Prompt enviado incorrecto",
      "value": "El mensaje no coincide con ningún formato esperado"
    }, 
    ...
    ]}

    **Atributos a detectar**:
    ${prompt}
    `;

    const body = {
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
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

    const titleDescription =
      response.data.choices[0]?.message?.content || "No response";
    const [codeType, codeBlocks] = await extractCodeBlocks(titleDescription);
    const titleDescriptionParsed = JSON.parse(codeBlocks);
    return titleDescriptionParsed;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error fetching response";
  }
};

const filterImageGpt = async ({
  token,
  image,
}) => {

  let systemPrompt = `Si recibes una imagen de un documento, debes detectar los atributos que se encuentran en el documento.
  Devuelve una lista de campos relevantes o variables que se usan para ese tipo de documento.

  Por ejemplo, para una factura de luz, deberías buscar y devolver un array de json:
  - CIF/NIF del cliente
  - Nombre del cliente
  - Dirección
  - Email

  **Formato de la Respuesta**:
  Devuelve en formato JSON correcto:
 { "title": "el tipo de documento que has detectado y la empresa emisora del mismo, por ejemplo: factura de luz",
  "data":
   [{
    "title": "Campos relevantes para factura de luz",
    "description": "Lista de campos que se deben extraer de una factura de luz",
    "value": "nombre de la variable referente a title pero en camelcase"
  }, 
  ...
  ]}`


  const imageSize = "1536x2048";

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
      temperature: 0.7,
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

    if (parsedResponse.error) {
      return {
        error: parsedResponse?.error,
        totalTokens,
        totalPrice: totalCost,
      };
    }
    return { data: parsedResponse, totalTokens, totalPrice: finalPrice };
  } catch (e) {
    console.error("Error in documentGPT:", e);
    return {
      error: e.message || "An error occurred in documentGPT",
      totalTokens: 0,
      totalPrice: 0,
    };
  }
};


module.exports = {
  calculateCost,
  getGPTData,
  documentGPT,
  automateGPT,
  imageToHtmlGPT,
  // imageToHtmlSlicesGPT,
  
  filterGpt,
  filterImageGpt
};



async function extractCodeBlocks(fullCode) {
  const regexTripleQuotes = /```(\w+)[\s\S]+?```/g;
  let matchesTripleQuotes = [...fullCode.matchAll(regexTripleQuotes)];

  if (matchesTripleQuotes.length > 0) {
    const codeBlock = matchesTripleQuotes[0][0];
    const codeType = matchesTripleQuotes[0][1].toLowerCase();

    const cleanedCodeBlock = codeBlock
      .replace(/```(\w+)/, "")
      .replace(/```$/, "")
      .trim();

    const cleanedCodeWithoutComments = cleanedCodeBlock
      .split("\n")
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");

    return [codeType, cleanedCodeWithoutComments];
  } else {
    const regexComments = /^\/\/.*$/gm;
    const cleanedCodeWithoutComments = fullCode
      .replace(regexComments, "")
      .trim();

    return ["plaintext", cleanedCodeWithoutComments];
  }
}
