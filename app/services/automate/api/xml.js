
const { catchedAsync, response } = require("../../../utils/err");

const { v4: uuidv4 } = require('uuid');

const fs = require("fs");
const path = require("path");

const facturaXMLPath = path.join(__dirname, "../../emailXMLS/fac_data.txt");
const albaranXMLPath = path.join(__dirname, "../../emailXMLS/alb_data.txt");

const facturaXML = fs.readFileSync(facturaXMLPath, "utf-8"); 
const albaranXML = fs.readFileSync(albaranXMLPath, "utf-8"); 

const { processItems } = require('../gpt')

const convert = require("xml-js");


const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "SCW8EPCVF1YTQXK0AC7P",
  secretAccessKey: "cd4ea464-15e8-4baf-848d-8db28cd880cf",
  endpoint: "https://s3.fr-par.scw.cloud",
  s3ForcePathStyle: true,
});



const xmlFilter = async ({
    user,
    attach,
    processedData
  }) => {
    try {
  
      let xmlFile;
      let xmlData;
  
      const file_xml = `${attach.originalname.split(".")[0]}.xml`;
      
      if (processedData?.documentType === "factura") {
        xmlFile = facturaXML;
        uploadType = "notificacion_fraC";
      } else if (processedData?.documentType === "albarán") {
        xmlFile = albaranXML;
        uploadType = "notificacion_albC";
      }

      if (processedData?.documentType && xmlFile) {
        const json = convert.xml2json(xmlFile, {
          compact: true,
          spaces: 4,
        });
  
        xmlData = JSON.parse(json);
      }
  

      const obj = processItems(xmlData, processedData);
  
      let text = convert.json2xml(JSON.stringify(obj), {
        compact: true,
        spaces: 4,
      });
  
  
      xmlFile = {
        buffer: text,
        originalname: attach.originalname,
      };
  
      const tempFilePath = path.join(__dirname, "../temp/" + file_xml);
      await fs.promises.writeFile(tempFilePath, xmlFile.buffer);
  

      const userPath = `${user._id}/`;
      const xmlPath = `${userPath}xml/`;
      const bucketName = "factura-gpt";
  

      try {
        await s3.putObject({
          Bucket: bucketName,
          Key: xmlPath,
          Body: ''
        }).promise();
      } catch (error) {
        console.error('Error creating xml folder:', error);
      }
      
      const params = {
        Bucket: bucketName,
        Key: `${xmlPath}FILE-${uuidv4()}_${file_xml}`,
        Body: xmlFile.buffer,
        ContentType: 'application/xml',
      };
  
      await s3.upload(params).promise();
  
    } catch (error) {
      console.error("ERROR ON XML FILTER", error);
    }
  }
  

  module.exports = {
    xmlFilter: catchedAsync(xmlFilter),
  };
  