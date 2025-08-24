const { connectDB } = require("../../controllers/utils");
const { parentPort } = require('worker_threads');
const { getGPTDataTelematel } = require('./pdf');
const { getGPTData } = require('./gpt')
const { saveNotificationData, saveAttachmentData } = require("./utils");

const { v4: uuidv4 } = require('uuid');


const { filterGoogleSheet } = require('./api/googlesheet')

const { createFolder, putFile } = require('../../controllers/scaleway')

const { processItems } = require('./pdf')
const { flattenTextNodes } = require('../../controllers/utils')

const axios = require('axios');
const fs = require("fs");
const path = require("path");

const facturaXMLPath = path.join(__dirname, "../telematel/fac_data.txt");
const albaranXMLPath = path.join(__dirname, "../telematel/alb_data.txt");

const facturaXML = fs.readFileSync(facturaXMLPath, "utf-8"); 
const albaranXML = fs.readFileSync(albaranXMLPath, "utf-8"); 

const convert = require("xml-js");



const originalConsoleLog = console.log;
console.log = function (...args) {
  if (args[0]?.startsWith('\n') || args[0]?.includes('❌')) {
    originalConsoleLog.apply(console, args);
  }
};


const logWithColor = (message, color = COLORS.WHITE, bgColor = '') => {
  console.log(`${bgColor}${color}${message}${COLORS.RESET}`);
};

const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m'
};












console.log('🚀 Worker iniciado');

parentPort.on('message', async (message) => {
  try {
    console.log('📥 Worker recibió mensaje:', message.type);
    switch (message.type) {
      case 'NEW_TASKS':
        console.log(`📦 Procesando ${message.tasks.length} tareas nuevas`);
        for (const task of message.tasks) {

          logWithColor(`\n📧 Procesando tarea (${task.name})\n`, COLORS.MAGENTA);

          if (task.type === 'AUTOMATION') {
            const { result,tokenGPT, userId, db, auth, pageCost = 0.20 } = task.data;
            
            const file = {
              buffer: result.buffer,
              originalname: result.name,
              mimetype: result.contentType,
              size: result.size
            };

            
            let processedData = null;
            let telematel = null;


            processedData = await getGPTDataTelematel({
              attach: file,
              token: tokenGPT
            });

            if(processedData.error) {
              return parentPort.postMessage({
                type: 'TASK_COMPLETED',
                taskId: task.id,
                metrics: {
                  cost: processedData.pages * pageCost,
                  processedData: processedData
                }
              })
            }


            console.log('\n\nprocess', processedData)
            telematel = await telematelFilter({
              processedData: processedData,
              config: {
                host: auth.host,
                port: auth.port,
                username: auth.j_username,
                password: auth.j_password,
              }
            });


            const today = new Date();
            const dateFolder = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
            const nameFolder = processedData.clientCif || 'default';
            const folderPath = `${userId}/${dateFolder}/${nameFolder}/`;

            const responseFolder = await createFolder(
              'factura-gpt',
              folderPath
            )

            console.log('\n\nresponseFolder', folderPath, responseFolder)

            const responseFile = await putFile(
              'factura-gpt', 
              `${userId}/FILE-${uuidv4()}_${result.name}`, 
              result.buffer, 
              result.contentType
            )


            await saveNotificationData({
              userId: userId
            })
            await saveAttachmentData({
              userId: userId,
              docId: db._id,
              dovRev: db._rev,
              data: processedData,
            });


            parentPort.postMessage({
              type: 'TASK_COMPLETED',
              taskId: task.id,
              metrics: {
                cost: processedData.pages * pageCost,
                telematel: telematel.data
              }
            });

            console.log(`✅ Tarea ${task.id} completada y mensaje enviado al proceso principal`);
          }

          const memoryUsage = process.memoryUsage();
          parentPort.postMessage({
            type: 'MEMORY_UPDATE',
            memoryUsage: memoryUsage.heapUsed / 1024 / 1024 
          });
        }
        break;
    }
  } catch (error) {
    console.error('❌ Error no capturado en worker:', error);
    parentPort.postMessage({
      type: 'ERROR',
      error: error.message
    });
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  parentPort.postMessage({
    type: 'ERROR',
    error: reason.message || reason
  });
}); 























const telematelFilter = async ({
  processedData,
  config
}) => {
  try {
    const { host, port, username, password } = config

    let xmlFile;
    let xmlData;

    if (processedData?.documentType === "factura") {
      xmlFile = facturaXML;
    } else if (processedData?.documentType === "albarán") {
      xmlFile = albaranXML;
    }

    if (processedData?.documentType && xmlFile) {
      const json = convert.xml2json(xmlFile, {
        compact: true,
        spaces: 4,
      });

      xmlData = JSON.parse(json);
    }

    const obj = processItems(xmlData, processedData);
    let objFlatten = flattenTextNodes(obj)

    
    const tokenResponse = await axios.post(`http://${host}:${port}/gomanage/static/auth/j_spring_security_check`, {
      j_username: username,
      j_password: password
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).catch(error => {
      throw new Error(`Error getting token: ${error.message}`);
    });

    if (!tokenResponse?.data?.access_token) {
      throw new Error('No access token received');
    }

    
    const documentType = processedData?.documentType || false
    
    let supplier = await getSupplier({
      token: tokenResponse.data.access_token,
      host: host,
      port: port,
      id: processedData?.clientCif?.replace(/[\s-]/g,'')
    }).catch(error => {
      throw new Error(`Error getting supplier: ${error.message}`);
    });


    if (!supplier.success) {
      supplier = await getSupplier({
        token: tokenResponse.data.access_token,
        host: host,
        port: port,
        id: '12345678Z'
      }).catch(error => {
        throw new Error(`Error getting fallback supplier: ${error.message}`);
      });

      if (!supplier.success) {
        return {
          success: false,
          message: 'Supplier not found and create 9999'
        }
      }

      if (documentType === "factura") {
        objFlatten.invoice.vendor_id = '9999'
        objFlatten.invoice.vat_number = '12345678Z'
      } else if (documentType === "albarán") {
        objFlatten.delivery.vendor_id = '9999'
        objFlatten.delivery.vat_number = '12345678Z'
      }
    } else {
      if (documentType === "factura") {
        objFlatten.invoice.vendor_id = supplier?.supplier?.code
      } else if (documentType === "albarán") {
        objFlatten.delivery.vendor_id = supplier?.supplier?.code
      }
    }

    const supplierType = supplier?.supplier?.supplier_type || false

    if (documentType === "factura") {
      if (!supplierType) {
        const product = await getProduct({
          token: tokenResponse.data.access_token,
          host: host,
          port: port,
          reference: supplier?.supplier?.user_character5
        }).catch(error => {
          throw new Error(`Error getting product: ${error.message}`);
        });

        objFlatten.invoice.lines = [{
          product_id: supplier?.supplier?.user_character5,
          description: product?.product?.description_short,
          supplier_delivery_note_id: '',
          quantity: parseFloat(1.00),
          price_quantity: parseFloat(1.00),
          discount_1: parseFloat(0.00),
          notification_line_number: 1,
          line_order: 1,
          price: parseFloat(processedData.partialAmount.toString().replace(',', '.')),
          line_type: 'S'
        }]

        objFlatten.invoice.taxes = [{
          tax_id: 1,
          tax_type: 1,
          tax_base: parseFloat(processedData.partialAmount.toString().replace(',', '.')),
          tax_amount: parseFloat(processedData.taxesAmount.toString().replace(',', '.')),
          invoice_tax_amount: parseFloat(processedData.totalAmount.toString().replace(',', '.')),
          tax_rate: parseFloat(processedData.taxesRate.toString().replace(',', '.')),
          description_type_tax: 'IVA',
          type_tax: 'IVA'
        }]

        objFlatten.invoice.invoice_type = 'S'
      } else {
        const summedPrices = {};

        for (let line of objFlatten.invoice.lines) {
          const noteId = line.supplier_delivery_note_id?.replace('R-', '') || '';
          if (!summedPrices[noteId]) {
            summedPrices[noteId] = 0;
          }
          summedPrices[noteId] += (line.price * line.price_quantity);
        }

        const newLines = Object.entries(summedPrices).map(([noteId, totalPrice], index) => ({
          product_id: supplier.supplier.user_character5,
          supplier_delivery_note_id: noteId,
          quantity: 1.00,
          price_quantity: 1.00,
          discount_1: 0.00,
          notification_line_number: index + 1,
          line_order: index + 1,
          price: totalPrice,
          line_type: 'A'
        }));

        objFlatten.invoice.lines = newLines;
      }

      objFlatten.invoice.taxes = [{
        tax_line: 1,
        tax_id: 1,
        tax_type: 1,
        tax_base: parseFloat(processedData.partialAmount.toString().replace(',', '.')),
        tax_amount: parseFloat(processedData.taxesAmount.toString().replace(',', '.')),
        invoice_tax_amount: parseFloat(processedData.totalAmount.toString().replace(',', '.')),
        tax_rate: parseFloat(processedData.taxesRate.toString().replace(',', '.')),
        description_type_tax: 'IVA',
        type_tax: 'IVA'
      }]

      if (processedData.taxesAmountIRPF !== 'NOT FOUND') {
        objFlatten.invoice.taxes.push({
          tax_line: 2,
          tax_id: 1,
          tax_type: 1,
          tax_base: parseFloat(processedData.partialAmount.toString().replace(',', '.')),
          tax_amount: parseFloat(processedData.taxesAmountIRPF.toString().replace(',', '.')),
          invoice_tax_amount: parseFloat(processedData.totalAmount.toString().replace(',', '.')),
          tax_rate: parseFloat(processedData.taxesRateIRPF.toString().replace(',', '.')),
          description_type_tax: 'IRPF',
          type_tax: 'IRPF'
        })
      }

      delete objFlatten.invoice.vendor_id
      objFlatten.invoice.invoice_type = 'A'

      const api_factura = await axios.post(`http://${host}:${port}/gomanage/web/data/apitmt-purchases-invoicenotifications/`, {
        ...objFlatten.invoice
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `OECP ${tokenResponse.data.access_token}`
        }
      }).catch(error => {
        console.error("\n\nERROR INVOICE", error);
      });


      return {
        success: true,
        data: objFlatten.invoice
      }
      
    } else if (documentType === "albarán") {
      const products = []

      for (let line of objFlatten.delivery.lines) {
        if (!line.product_reference) {
          line.product_id = supplier?.supplier?.user_character5
        } else {
          const product = await getProduct({
            token: tokenResponse.data.access_token,
            host: host,
            port: port,
            id: objFlatten.delivery.vendor_id,
            reference: line.product_reference
          }).catch(error => {
            throw new Error(`Error getting product for delivery: ${error.message}`);
          });

          if (!product.success) {
            line.product_id = supplier?.supplier?.user_character5
          } else {
            line.product_id = product.product.product_id
            line.product_reference = product.product.product_reference
          }
        }

        products.push(line)
      }
      objFlatten.delivery.lines = products

      const api_albaran = await axios.post(`http://${host}:${port}/gomanage/web/data/apitmt-purchases-deliverynotifications/`, {
        ...objFlatten.delivery
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `OECP ${tokenResponse.data.access_token}`
        }
      }).catch(error => {
        console.error("\n\nERROR ALBARAN", error);
      });


      return {
        success: true,
        data: objFlatten.delivery
      }
    }
  } catch (error) {
    console.error("\n\nERROR ON XML FILTER", error);
    return {
      success: false,
      error: error.message
    }
  }
}



const getSupplier = async ({
  token,
  host,
  port,
  id,
}) => {
  try {


    const query = `query GetSupplier {
        master_files {
          suppliers(first: 1, where: {tax_identification_number: { equals: "${id}" }}) {
            totalCount
            nodes {
              tax_identification_number
              code
              supplier_type
              user_character5
            }
          }
        }
      }`

    const api_graphql = await axios.post(`http://${host}:${port}/gomanage/web/data/graphql/`, {
      query
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `OECP ${token}`
      }
    })

    const supplier = api_graphql.data.data.master_files.suppliers

    if (supplier.nodes.length === 0) {
      return {
        success: false,
      }
    }

    return {
      success: true,
      supplier: supplier.nodes[0]
    }

  } catch (error) {
    console.error('\nERROR ON GET SUPPLIER', error)
  }
}

const getProduct = async ({
  token,
  host,
  port,
  id,
  reference
}) => {
  try {
    let params = {}

    if (!id) {
      params = {
        product_id: reference
      }
    } else {
      params = {
        product_reference: reference,
        customer_id: parseInt(id)
      }
    }

    const api_product = await axios.get(`http://${host}:${port}/gomanage/web/data/apitmt-products/Get`, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `OECP ${token}`
      }
    })

    const product = api_product.data
    if (!product?.product_id) {
      return {
        success: false,
      }
    }

    return {
      success: true,
      product: product
    }
  } catch (error) {
    console.error('\nERROR ON GET PRODUCT', error.response.data)
  }
}