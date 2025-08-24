const { catchedAsync } = require("../utils/err");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const { connectDB } = require("./utils");
const s3 = new AWS.S3({
  accessKeyId: "SCW8EPCVF1YTQXK0AC7P",
  secretAccessKey: "cd4ea464-15e8-4baf-848d-8db28cd880cf",
  endpoint: "https://s3.fr-par.scw.cloud",
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: 'fr-par'
});

const doesFolderExist = async (bucketName, folderKey) => {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: folderKey,
      MaxKeys: 1,
    };
    const response = await s3.listObjectsV2(params).promise();
    return response.Contents.length > 0;
  } catch (error) {
    console.error("Error checking folder existence:", error);
    throw error;
  }
};

const putFolderObject = async (bucketName, folderKey) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: folderKey,
      Body: "",
    };
     return await s3.putObject(params).promise();
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

const getFolderData = async (bucketName, folderKey) => {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: folderKey,
      MaxKeys: 1,
    };
    const response = await s3.listObjectsV2(params).promise();
    if (response.Contents && response.Contents.length > 0) {
      return response.Contents[0];
    }
    return null;
  } catch (error) {
    console.error("Error getting folder data:", error);
    throw error;
  }
};


const copyObject = async (bucketName, sourceKey, destinationKey) => {
  try {
    const params = {
      Bucket: bucketName,
      CopySource: `${bucketName}/${encodeURIComponent(sourceKey)}`,
      Key: destinationKey,
    };
    const response = await s3.copyObject(params).promise();
    return response
  } catch (error) {
    console.error("Error copying object:", error);
    throw error;
  }
};

const deleteObject = async (bucketName, key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };


    const response = await s3.deleteObject(params).promise();
    return response
  } catch (error) {
    console.error("Error deleting object:", error);
    throw error;
  }
};


const createFolder = async (bucketName, folderKey) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: folderKey,
      Body: "",
    };
    await s3.putObject(params).promise();
  } catch (error) {
    console.error(`Error creando la carpeta ${folderKey}:`, error);
  }
};


const putFile = async (bucketName, key, body, contentType) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };
    const response = await s3.upload(params).promise();
    return response
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}


const checkOrCreateUserBucketController = async (req, res) => {
  try {
    const { userId } = req.params;
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'


    const bucketName = "factura-gpt";
    const userFolder = `${selectedWorkspace}/`;
    const facturasFolder = `${userFolder}facturas/`;
    const recibosFolder = `${userFolder}recibos/`;


    const folderExists = async (folderKey) => {
      try {
        const params = {
          Bucket: bucketName,
          Prefix: folderKey,
          MaxKeys: 1,
        };
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents.length > 0;
      } catch (error) {
        console.error(
          `Error verificando la existencia de ${folderKey}:`,
          error
        );
        return false;
      }
    };




    if (!(await folderExists(userFolder))) {
      await createFolder(userFolder);
    }
    if (!(await folderExists(facturasFolder))) {
      await createFolder(facturasFolder);
    }
    if (!(await folderExists(recibosFolder))) {
      await createFolder(recibosFolder);
    }

    return res.status(200).send("Bucket created successfully");
  } catch (err) {
    console.error("Error in checkOrCreateUserBucketController:", err);
    return res.status(500).send("Error checking for user bucket");
  }
};

const getUserFilesController = async (req, res) => {
  try {
    const { userId } = req.params;
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'
    const { filters,currentPath } = req.body;
    const id =userId.split("_").pop()
    const bucketName = "factura-gpt";
    const userPrefix = `${selectedWorkspace}/`;

    const prefixToUse = currentPath || userPrefix; 

const dbDocs = await connectDB(`db_${selectedWorkspace}_docs`);



    const params = {
      Bucket: bucketName,
      Prefix: prefixToUse,
      Delimiter: '/',
    };

        const getCleanName = (key) => {
          const parts = key.split("/");
          if (key.endsWith("/")) {
            return parts[parts.length - 2] || "";
          } else {
            const fileName = parts[parts.length - 1];
            return fileName.replace(/^FILE-[^_]+_/, "");
          }
        };
    

    try {
      const data = await s3.listObjectsV2(params).promise();

      const folders = data.CommonPrefixes.map(prefix => ({
        Key: prefix.Prefix,
        isFolder: true,
      }));

      const files = data.Contents.filter(item => item.Key !== prefixToUse);
      
      let userData = [...folders, ...files];

if (currentPath) {
  userData = userData.filter((item) => {
    return item.Key.startsWith(currentPath) && item.Key !== currentPath;
  });
}



      const selectedOption = filters?.selectedOption || {};
      const dateFilter = selectedOption?.date;
      const alphaFilter = selectedOption?.["Orden Alfabético"];

      if (dateFilter) {
        const now = new Date();
        let dateLimit = new Date();

        switch (dateFilter) {
          case "1month":
            dateLimit.setMonth(now.getMonth() - 1);
            break;
          case "3month":
            dateLimit.setMonth(now.getMonth() - 3);
            break;
          case "6month":
            dateLimit.setMonth(now.getMonth() - 6);
            break;
          case "1year":
            dateLimit.setFullYear(now.getFullYear() - 1);
            break;
          default:
            break;
        }

        userData = userData.filter((file) => {
          return new Date(file.LastModified) >= dateLimit;
        });
      }

const keyWordsList = filters?.keyWordsList || [];

if (Array.isArray(keyWordsList) && keyWordsList.length > 0) {
  const loweredKeywords = keyWordsList.map((kw) => kw.toLowerCase());

  userData = userData.filter((file) => {
    const cleanName = getCleanName(file.Key).toLowerCase();
    return loweredKeywords.some((kw) => cleanName.includes(kw));
  });
}


const selectedCategories = filters?.selectedCategories || [];

if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
  try {
    const result = await dbDocs.find({
      selector: {
        "category.title": { "$in": selectedCategories }
      },
      fields: ["_id"]
    });

    const matchingIds = result.docs.map((doc) => doc._id);

    userData = userData.filter((file) =>
      matchingIds.some((id) => file.Key.includes(id))
    );
  } catch (err) {
    console.error("Error filtering by selectedCategories:", err);
  }
}

const selectedTypes = filters?.selectedTypes || [];

if (Array.isArray(selectedTypes) && selectedTypes.length > 0) {
  const loweredTypes = selectedTypes.map((type) => type.toLowerCase());

  userData = userData.filter((file) => {
    const extensionMatch = file.Key.match(/\.(\w+)$/); 
    const fileExt = extensionMatch ? extensionMatch[1].toLowerCase() : null;
    return fileExt && loweredTypes.includes(fileExt);
  });
}

const selectedTagsFilters = filters?.selectedTagsFilters || [];

if (Array.isArray(selectedTagsFilters) && selectedTagsFilters.length > 0) {
  try {
    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const tagFilteredDocs = await dbAssets.find({
      selector: {
        selectedtags: {
          $elemMatch: {
            name: { $in: selectedTagsFilters }
          }
        }
      }
    });

    const validAssetIds = tagFilteredDocs.docs.map((doc) => doc.docId);
    userData = userData.filter((file) =>
      validAssetIds.some((docId) => file.Key.includes(docId))
    );
  } catch (err) {
    console.error("Error filtering by tags:", err);
  }
}
      if (alphaFilter === "A-Z" || alphaFilter === "Z-A") {
        userData.sort((a, b) => {
          const nameA = getCleanName(a.Key).toLowerCase();
          const nameB = getCleanName(b.Key).toLowerCase();
          return alphaFilter === "A-Z"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        });
      }
      return res.status(200).send(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  } catch (err) {
    console.error("Error in getUserFilesController:", err);
    return res.status(500).send("Error getting user files");
  }
};


const updateNameFileController = async (req, res) => {
  try {
    const { newName, path, oldKey } = req.body;

    const bucket = "factura-gpt";


    const newKey = path.includes("FILE-")
      ? `${path}${newName}`
      : path.endsWith("/")
        ? `${path}${newName}`
        : `${path}/${newName}`;



    const encodedCopySource = `${bucket}/${encodeURIComponent(oldKey)}`;




    await s3
      .copyObject({
        Bucket: bucket,
        CopySource: encodedCopySource,
        Key: newKey,
      })
      .promise();


    await s3
      .deleteObject({
        Bucket: bucket,
        Key: oldKey,
      })
      .promise();

    return res.status(200).send({
      message: "Archivo renombrado correctamente",
      newKey,
    });
  } catch (err) {
    console.error("Error in updateNameFileController:", err);
    return res.status(500).send("Error renombrando archivo");
  }
};

const createFolderController = async (req, res) => {
  try {
    const { folderPath } = req.body;

    if (!folderPath) {
      return res.status(400).json({
        success: false,
        message: "folderPath is required",
      });
    }

    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace;

    if (!selectedWorkspace) {
      return res.status(400).json({
        success: false,
        message: "Workspace no especificado en el usuario",
      });
    }

    const bucketName = "factura-gpt";

    // Asegurarse de que la ruta termine en "/"
    const fullFolderKey = folderPath.endsWith("/") ? folderPath : folderPath + "/";

    try {
      // Verificar si la carpeta ya existe
      const folderExists = await doesFolderExist(bucketName, fullFolderKey);
      if (folderExists) {
        // Si ya existe, solo devolvemos los datos actuales
        const existingFolderData = await getFolderData(bucketName, fullFolderKey);
        return res.status(200).json(existingFolderData ? [existingFolderData] : []);
      }

      // 1. Crear la carpeta en S3
      const folderResponse = await putFolderObject(bucketName, fullFolderKey);
      const ETag = folderResponse.ETag;
      const cleanETag = ETag.replace(/^"|"$/g, ''); // Limpiar comillas

      // 2. Conectar a la base de datos de CouchDB
      const dbName = `db_${selectedWorkspace}_docs`;
      const db = await connectDB(dbName);

      // 3. Crear el documento para la carpeta
      const createdAt = new Date().toISOString();

      const doc = {
        _id: cleanETag, // Puedes usar el ETag limpio como _id, o generar uno
        type: "folder", // Tipo para identificar que es una carpeta
        ETag: cleanETag,
        path: fullFolderKey,
        name: fullFolderKey.split('/').filter(Boolean).pop() || 'root',
        createdAt,
        isFolder: true,
        bgColor: "#ADD8E6", // Color por defecto para carpetas
      };

      // 4. Guardar en CouchDB
      await db.insert(doc);

      // 5. Obtener datos actualizados de la carpeta (opcional)
      const newFolderData = await getFolderData(bucketName, fullFolderKey);

      return res.status(200).json(newFolderData ? [newFolderData] : []);

    } catch (error) {
      console.error("Error al crear carpeta en S3 o en CouchDB:", error);
      return res.status(500).json({
        success: false,
        message: "Error al crear la carpeta",
        details: error.message,
      });
    }

  } catch (err) {
    console.error("Error en createFolderController:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};


const renameFolderController = async (req, res) => {
  try {
    const { userId } = req.params;
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const { oldFolder, newFolder } = req.body;

    const bucket = "factura-gpt";
    const oldPrefix = `${selectedWorkspace}/${oldFolder}/`;
    const newPrefix = `${selectedWorkspace}/${newFolder}/`;


    let isTruncated = true;
    let continuationToken = null;
    let allObjects = [];

    while (isTruncated) {
      const params = {
        Bucket: bucket,
        Prefix: oldPrefix,
        ContinuationToken: continuationToken,
      };
      const response = await s3.listObjectsV2(params).promise();
      allObjects.push(...response.Contents);
      isTruncated = response.IsTruncated;
      continuationToken = response.NextContinuationToken;
    }

    if (allObjects.length === 0) {
      return res.status(404).json({ message: "No se encontraron archivos en la carpeta original." });
    }


    await Promise.all(
      allObjects.map(async (object) => {
        const oldKey = object.Key;
        const relativePath = oldKey.slice(oldPrefix.length);
        const newKey = `${newPrefix}${relativePath}`;

        await s3.copyObject({
          Bucket: bucket,
          CopySource: `${bucket}/${oldKey}`,
          Key: newKey,
        }).promise();
      })
    );


    const deleteInChunks = async (objects) => {
      const chunkSize = 1000;
      for (let i = 0; i < objects.length; i += chunkSize) {
        const chunk = objects.slice(i, i + chunkSize).map((obj) => ({ Key: obj.Key }));
        const deleteParams = {
          Bucket: bucket,
          Delete: {
            Objects: chunk,
          },
        };

        const deleteResponse = await s3.deleteObjects(deleteParams).promise();

        if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
          console.warn("Errores al eliminar objetos:", deleteResponse.Errors);
          return res.status(500).json({
            message: "Error al eliminar algunos archivos de la carpeta antigua.",
            errors: deleteResponse.Errors,
          });
        }
      }
    };

    await deleteInChunks(allObjects);

    return res.status(200).json({
      message: "Carpeta renombrada correctamente",
      newPrefix,
    });
  } catch (err) {
    console.error("Error renombrando carpeta:", err);
    return res.status(500).send("Error renombrando carpeta");
  }
};


const moveObjectController = async (req, res) => {
  try {
    const { sourceKey, destinationKey, isFolder } = req.body;

    if (!sourceKey || !destinationKey) {
      return res.status(400).json({
        success: false,
        message: "sourceKey and destinationKey are required",
      });
    }



    const bucketName = "factura-gpt";

    if (!destinationKey.endsWith("/")) {
      destinationKey += "/";
    }

    if (!isFolder) {
      const fileName = sourceKey.split("/").pop();
      const newKey = `${destinationKey}${fileName}`;

      await copyObject(bucketName, sourceKey, newKey);

      await deleteObject(bucketName, sourceKey);

      return res.status(200).json({ success: true, message: "File moved", newKey });
    } else {
      if (!sourceKey.endsWith("/")) {
        sourceKey += "/";
      }

      const folderSegments = sourceKey.split("/").filter(Boolean);
      const folderName = folderSegments[folderSegments.length - 1];

      const targetFolderKey = `${destinationKey}${folderName}/`;
      await putFolderObject(bucketName, targetFolderKey);

      const data = await s3
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: sourceKey,
        })
        .promise();

      if (!data.Contents || data.Contents.length === 0) {
        await deleteObject(bucketName, sourceKey);
        return { success: true, message: "Empty folder moved" };
      }

      const itemsMoved = [];
      for (const obj of data.Contents) {
        const oldKey = obj.Key;
        const relativePath = oldKey.slice(sourceKey.length);

        const newKey = `${targetFolderKey}${relativePath}`;

        if (oldKey === sourceKey) {
          continue;
        }

        await copyObject(bucketName, oldKey, newKey);
        await deleteObject(bucketName, oldKey);

        itemsMoved.push({ oldKey, newKey });
      }

      await deleteObject(bucketName, sourceKey);

      return res.status(200).send({
        success: true,
        message: "Folder moved",
        targetFolderKey,
        itemsMoved,
      });
    }
  } catch (err) {
    console.error("Error in moveObjectController:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error moving object" });
  }
};

const deleteObjectController = async (req, res) => {
  try {
    const { key, isFolder } = req.body;

    if (!key) {
      return res
        .status(400)
        .json({ success: false, message: "key is required" });
    }

    const bucketName = "factura-gpt";

    if (!isFolder) {
      const response = await deleteObject(bucketName, key);
      return { success: true, message: "File deleted", deletedKey: key };
    } else {
      let folderKey = key;
      if (!folderKey.endsWith("/")) {
        folderKey += "/";
      }

      const listParams = {
        Bucket: bucketName,
        Prefix: folderKey,
      };
      const data = await s3.listObjectsV2(listParams).promise();
      if (!data.Contents || data.Contents.length === 0) {
        await deleteObject(bucketName, folderKey);
        return { success: true, message: "Folder was empty or not found" };
      }

      const deletedItems = [];
      for (const obj of data.Contents) {
        await deleteObject(bucketName, obj.Key);
        deletedItems.push(obj.Key);
      }

      return res.status(200).send({
        success: true,
        message: "Folder and all nested objects deleted",
        folderKey,
        deletedItems,
      });
    }
  } catch (err) {
    console.error("Error in deleteObjectController:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting object" });
  }
};

const emptyFolderController = async (req, res) => {
  try {
    const { key } = req.body;
console.log('key',key)
    if (!key) {
      return res
        .status(400)
        .json({ success: false, message: "key is required" });
    }

    const bucketName = "factura-gpt";
    let folderKey = key;
    
    // Asegurar que el key termine con "/" para indicar que es una carpeta
    if (!folderKey.endsWith("/")) {
      folderKey += "/";
    }

    // Listar todos los objetos dentro de la carpeta
    const listParams = {
      Bucket: bucketName,
      Prefix: folderKey,
    };

    const data = await s3.listObjectsV2(listParams).promise();
    
    if (!data.Contents || data.Contents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "La carpeta está vacía o no existe",
        folderKey,
        deletedItems: []
      });
    }

    // Eliminar solo los objetos DENTRO de la carpeta, NO la carpeta principal
    const deletedItems = [];
    const deletePromises = [];

    for (const obj of data.Contents) {
      // IMPORTANTE: Solo eliminar objetos que NO sean la carpeta principal
      // La carpeta principal tiene exactamente el mismo key que folderKey
      if (obj.Key !== folderKey) {
        deletePromises.push(
          deleteObject(bucketName, obj.Key)
            .then(() => {
              deletedItems.push(obj.Key);
            })
            .catch(err => {
              console.error(`Error eliminando objeto ${obj.Key}:`, err);
              throw err;
            })
        );
      }
    }

    // Si no hay objetos para eliminar (solo la carpeta principal), retornar
    if (deletePromises.length === 0) {
      return res.status(200).json({
        success: true,
        message: "La carpeta ya está vacía",
        folderKey,
        deletedItems: []
      });
    }

    // Ejecutar todas las eliminaciones en paralelo
    await Promise.all(deletePromises);

    return res.status(200).json({
      success: true,
      message: "Carpeta vaciada exitosamente",
      folderKey,
      deletedItems,
      totalDeleted: deletedItems.length
    });

  } catch (err) {
    console.error("Error in emptyFolderController:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error vaciando la carpeta" });
  }
};

const changeLocation = async (req, res) => {

  const { oldKey, newKey } = req.body;

  await s3
    .copyObject({
      Bucket: "factura-gpt",
      CopySource: `${"factura-gpt"}/${oldKey}`,
      Key: newKey,
    })
    .promise();


  await s3
    .deleteObject({
      Bucket: "factura-gpt",
      Key: oldKey,
    })
    .promise();

  return res.status(200).send({
    success: true,
    message: "files changed location",
  });
};



const uploadUserFileController = async (req, res) => {
  try {
    const { userId } = req.params;
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const { folder } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file provided");
    }



    const path = `${selectedWorkspace}/${folder}/`;

    const bucketName = "factura-gpt";
    const uploadPromises = files.map((file) => {
      const params = {
        Bucket: bucketName,
        Key: `${path}${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      return s3.upload(params).promise();
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error("Error uploading files to Scaleway:", error);
      throw error;
    }

    return res.status(200).send(response);
  } catch (err) {
    console.error("Error in uploadUserFileController:", err);
    return res.status(500).send("Error uploading user file");
  }
};

const uploadFilesController = async (req, res) => {
  try {
    const { path } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const bucketName = "factura-gpt";
    const uploadPromises = files.map((file) => {
      const params = {
        Bucket: bucketName,
        Key: `${path}${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      return s3.upload(params).promise();
    });

    try {
      const results = await Promise.all(uploadPromises);

      return res.status(200).send(results);
    } catch (error) {
      console.error("Error uploading files to Scaleway:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in uploadFilesController:", error);
    return res.status(500).send("Error uploading files");
  }
};










const duplicateUserFolderController = async (req, res) => {
  try {
    const { userId } = req.params;
    const selectedWorkspace = req.user?.selectedWorkspace || 'defaultworkspace'

    const { sourceFolder, destinationFolder,newText } = req.body;

    if (!sourceFolder || !destinationFolder) {
      return res.status(400).send("Both source and destination folders are required");
    }

    const bucketName = "factura-gpt";
    const sourcePath = `${selectedWorkspace}/${sourceFolder}`;
    let destinationBase = `${selectedWorkspace}/${destinationFolder}`.replace(/\/?$/, '');



    const listParams = {
      Bucket: bucketName,
      Prefix: sourcePath,
    };

    const data = await s3.listObjectsV2(listParams).promise();

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).send("No files found in the source folder");
    }
    const isFolder = data.Contents.some(item => item.Key.endsWith("/"));
    
    if (isFolder) {
      destinationBase += ' ' + newText;
    }
    
    const destinationPath = `${destinationBase}/`; 
    
    const cleanAfterUUID = (filename) => {
      return filename.replace(/^(FILE-[a-f0-9\-]+_)+/, "");
    };
    
    

    const copyPromises = data.Contents.map(async (file) => {
      try {
        const getObjectParams = {
          Bucket: bucketName,
          Key: file.Key,
        };
    
        const fileData = await s3.getObject(getObjectParams).promise();
    
        const newUUID = uuidv4();
    
        let relativePath = file.Key.replace(sourcePath, "");
        relativePath = relativePath.replace(/^\/+/, "");
    
        const pathParts = relativePath.split("/");
        const fileNameOriginal = pathParts.pop();
        const subfolders = pathParts.length > 0 ? pathParts.join("/") + "/" : "";
    
        const cleanAfterUUID = (filename) => {
          return filename.replace(/^(FILE-[a-f0-9\-]+_)+/, "");
        };
    
        let fileNameNew;
        if (fileNameOriginal.startsWith("FILE-")) {
          const cleanedName = cleanAfterUUID(fileNameOriginal);
          fileNameNew = `FILE-${newUUID}_${cleanedName}`;
        } else {
          fileNameNew = fileNameOriginal;
        }
    
        const finalPath = `${destinationPath}${subfolders}${fileNameNew}`;
    
        const uploadParams = {
          Bucket: bucketName,
          Key: finalPath,
          Body: Buffer.from(fileData.Body),
          ContentType: fileData.ContentType,
        };
    
        const uploadResult = await s3.upload(uploadParams).promise();
    

        if (!file.Key.endsWith("/")) {
          const originalKey = file.Key.split("/").pop();
          const match = originalKey.match(/^FILE-([a-f0-9\-]+)/i);
          if (!match || !match[1]) {
            console.error("No se pudo extraer el ID del archivo original:", originalKey);
            return;
          }
        
          const originalDocId = match[1];
          const newDocId = newUUID;
          const db = await connectDB(`db_${selectedWorkspace}_docs`);
        
          let originalDoc;
          try {
            originalDoc = await db.get(originalDocId, { attachments: true });
          } catch (err) {
            console.error("No se encontró el documento en DB para ID:", originalDocId);
            return;
          }
        
          const {
            _id, _rev, _attachments, ...docCopy
          } = originalDoc;
        
          const newDoc = {
            ...docCopy,
            _id: newDocId,
            type: "pdf",
            filename: cleanAfterUUID(fileNameOriginal),
            ETag: uploadResult.ETag.replace(/^"|"$/g, ""),
          };
        
          const insertResponse = await db.insert(newDoc);
        
          const attachmentNames = Object.keys(originalDoc._attachments || {});
          if (attachmentNames.length === 0) {
            console.warn("No se encontró ningún attachment en el documento original");
            return;
          }
        
          const attachmentName = attachmentNames[0];
          const attachmentData = originalDoc._attachments[attachmentName];
        
          await db.attachment.insert(
            newDocId,
            attachmentName,
            Buffer.from(attachmentData.data, "base64"),
            attachmentData.content_type,
            { rev: insertResponse.rev }
          );
          return { key: finalPath, newDocId };
        }
        

    
      } catch (error) {
        console.error("Error duplicating file and document:", error);
        throw error;
      }
    });
    
    const resultsRaw = await Promise.all(copyPromises);
    const results = resultsRaw.filter(Boolean); 
    
    return res.status(200).send(results);
    
  } catch (err) {
    console.error("Error duplicating folder:", err);
    return res.status(500).send("Error duplicating folder");
  }
};






const duplicateFileController = async (req, res) => {
  try {
    const { user } = req;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const { sourceKey, location, docId } = req.body;

    if (!sourceKey) {
      return res.status(400).send("sourceKey is required");
    }

    const bucketName = "factura-gpt";

    const parts = sourceKey.split("/");
    const originalFilename = parts.pop(); 
    const basePath = parts.join("/");

    const dotIndex = originalFilename.lastIndexOf(".");
    let baseName = originalFilename;
    let extension = "";

    if (dotIndex > 0 && dotIndex < originalFilename.length - 1) {
      baseName = originalFilename.slice(0, dotIndex);
      extension = originalFilename.slice(dotIndex);
    }

    const afterUuid = baseName.split("_").slice(1).join("_");
    const cleanedAfterUuid = afterUuid.replace(/\s\(\d+\)$/, "");

    const newUuid = uuidv4();
    const baseNameWithUuid = `FILE-${newUuid}_${cleanedAfterUuid}`; 

    const targetPath = location?.trim() ? location.replace(/\/+$/, "") : basePath;
   
    const newFilename = `${baseNameWithUuid}${extension}`


    const destinationKey = `${targetPath}/${newFilename}`;

    const fileData = await s3
      .getObject({
        Bucket: bucketName,
        Key: sourceKey,
      })
      .promise();

    const uploadResult = await s3
      .upload({
        Bucket: bucketName,
        Key: destinationKey,
        Body: fileData.Body,
        ContentType: fileData.ContentType || "application/pdf",
      })
      .promise();

    await duplicateDocDB(docId, uploadResult, selectedWorkspace, baseNameWithUuid);

    return res.status(200).send({
      message: "File duplicated successfully",
      newKey: destinationKey,
      result: uploadResult,
    });
  } catch (err) {
    console.error("Error duplicating file:", err);
    return res.status(500).send("Error duplicating file");
  }
};


const duplicateDocDB = async (docId, s3File, id, nameDoc) => {
  const ETag = s3File.ETag.replace(/^"|"$/g, "");

  const db = await connectDB(`db_${id}_docs`);

  const key = s3File.Key.split("/").pop();
  const match = key.match(/^FILE-([a-f0-9\-]+)/i);

  if (!match || !match[1]) {
    console.error("No se pudo extraer el ID del nombre del archivo:", key);
    return;
  }

  const extractedId = match[1]; 

  let originalDoc;
  try {
    originalDoc = await db.get(docId, { attachments: true });
  } catch (err) {
    console.error("Error obteniendo el documento original:", err);
    return;
  }

  const {
    _id,        
    _rev,       
    _attachments, 
    ...docCopy
  } = originalDoc;

  const newDoc = {
    ...docCopy,
    _id: extractedId,
    type: "pdf",
    filename: nameDoc,
    ETag,
  };

  try {
    const insertResponse = await db.insert(newDoc);

    const attachmentNames = Object.keys(originalDoc._attachments || {});
    if (attachmentNames.length === 0) {
      console.warn("No se encontró ningún attachment en el documento original");
      return;
    }

    const attachmentName = attachmentNames[0]; 
    const attachmentData = originalDoc._attachments[attachmentName];

    await db.attachment.insert(
      extractedId,
      attachmentName,
      Buffer.from(attachmentData.data, "base64"),
      attachmentData.content_type,
      { rev: insertResponse.rev }
    );

  } catch (err) {
    console.error("Error al duplicar el documento:", err);
  }
};


module.exports = {
  createFolder,
  putFile,

  uploadUserFileController: catchedAsync(uploadUserFileController),
  deleteObjectController: catchedAsync(deleteObjectController),
  moveObjectController: catchedAsync(moveObjectController),
  createFolderController: catchedAsync(createFolderController),
  getUserFilesController: catchedAsync(getUserFilesController),
  checkOrCreateUserBucketController: catchedAsync(checkOrCreateUserBucketController),
  uploadFilesController: catchedAsync(uploadFilesController),
  changeLocation: catchedAsync(changeLocation),
  updateNameFileController: catchedAsync(updateNameFileController),
  duplicateUserFolderController: catchedAsync(duplicateUserFolderController),
  duplicateFileController: catchedAsync(duplicateFileController),
  renameFolderController: catchedAsync(renameFolderController),
  emptyFolderController: catchedAsync(emptyFolderController),
};
