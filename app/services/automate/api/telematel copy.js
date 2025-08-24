const { catchedAsync, response } = require("../../../utils/err");
const { processItems } = require('../pdf')
const { flattenTextNodes } = require('../../../controllers/utils')

const axios = require('axios');
const fs = require("fs");
const path = require("path");

const facturaXMLPath = path.join(__dirname, "../../telematel/fac_data.txt");
const albaranXMLPath = path.join(__dirname, "../../telematel/alb_data.txt");

const facturaXML = fs.readFileSync(facturaXMLPath, "utf-8"); 
const albaranXML = fs.readFileSync(albaranXMLPath, "utf-8"); 

const convert = require("xml-js");


const telematelFilter = async ({
  processedData,
  config
}) => {
  try {
    const { host, port, username, password } = config

    return {
      success: true,
      data: '13456'
    }

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

    let supplier = await getSupplier({
      token: tokenResponse.data.access_token,
      host: host,
      port: port,
      id: processedData.clientCif
    }).catch(error => {
      throw new Error(`Error getting supplier: ${error.message}`);
    });

    const documentType = processedData?.documentType || false

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
          price: parseFloat(processedData.partialAmount),
          line_type: 'S'
        }]

        objFlatten.invoice.taxes = [{
          tax_id: 1,
          tax_type: 1,
          tax_base: parseFloat(processedData.partialAmount),
          tax_amount: parseFloat(processedData.taxesAmount),
          invoice_tax_amount: parseFloat(processedData.totalAmount),
          tax_rate: parseFloat(processedData.taxesRate),
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
        tax_base: parseFloat(processedData.partialAmount),
        tax_amount: parseFloat(processedData.taxesAmount),
        invoice_tax_amount: parseFloat(processedData.totalAmount),
        tax_rate: parseFloat(processedData.taxesRate),
        description_type_tax: 'IVA',
        type_tax: 'IVA'
      }]

      if (processedData.taxesAmountIRPF !== 'NOT FOUND') {
        objFlatten.invoice.taxes.push({
          tax_line: 2,
          tax_id: 1,
          tax_type: 1,
          tax_base: parseFloat(processedData.partialAmount),
          tax_amount: parseFloat(processedData.taxesAmountIRPF),
          invoice_tax_amount: parseFloat(processedData.totalAmount),
          tax_rate: parseFloat(processedData.taxesRateIRPF),
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
        throw new Error(`Error posting invoice: ${error.message}`);
      });

      return {
        success: true,
        data: api_factura.data
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
            line.product_id = supplier?.supplier?.user_character5          } else {
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
        throw new Error(`Error posting delivery: ${error.message}`);
      });

      return {
        success: true,
        data: api_albaran.data
      }
    }
  } catch (error) {
    console.error("\n\nERROR ON XML FILTER", error.message);
    return {
      success: false,
      error: error.message
    }
  }
}

module.exports = {
  telematelFilter: catchedAsync(telematelFilter),
};

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
    console.error('\nERROR ON GET PRODUCT', error)
  }
}