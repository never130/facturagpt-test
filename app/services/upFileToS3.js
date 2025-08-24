const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  endpoint: "https://s3.fr-par.scw.cloud",
  accessKeyId: "SCW8EPCVF1YTQXK0AC7P",
  secretAccessKey: "cd4ea464-15e8-4baf-848d-8db28cd880cf",
  s3ForcePathStyle: true,
});

  
const uploadToScalewayS3FromBuffer = async (
  buffer,
  originalName,
  mimeType,
  selectedWorkspace,
  pathKey = "/Inicio/"
) => {
  if (!buffer) throw new Error("No se recibió un archivo válido");

  const docId = uuidv4();
  const path = `${selectedWorkspace}/`;
  const newPath = (pathKey === "/Inicio/" || pathKey === "") ? path : pathKey;

  const params = {
    Bucket: "factura-gpt",
    Key: `${newPath}FILE-${docId}_${originalName}`,
    Body: buffer,
    ContentType: mimeType,
  };

  const response = await s3.upload(params).promise();
  return response;
};

module.exports = uploadToScalewayS3FromBuffer;
