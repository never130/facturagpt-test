const { catchedAsync } = require("../utils/err");
const { connectDB } = require("./utils");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "SCW8EPCVF1YTQXK0AC7P",
  secretAccessKey: "cd4ea464-15e8-4baf-848d-8db28cd880cf",
  endpoint: "https://s3.fr-par.scw.cloud",
  s3ForcePathStyle: true,
});

const addDoc = async (req, res) => {
  try {
    const { doc } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    console.log('creando con este: selectedWorkspace')
    const files = req.files;

    const parsedDoc = JSON.parse(doc);

    const now = new Date().toISOString();
    const docWithDate = { ...parsedDoc, createdAt: now, updatedAt: now }

    if (files && files.length > 0 && docWithDate.location) {
      const path = docWithDate.location.endsWith('/')
        ? docWithDate.location
        : `${docWithDate.location}/`;

      const bucketName = "factura-gpt";

      const uploadPromises = files.map((file) => {
        const params = {
          Bucket: bucketName,
          Key: `${path}${docWithDate.documentTitle}.pdf`,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        return s3.upload(params).promise();
      });

      try {
        const results = await Promise.all(uploadPromises);

        docWithDate.uploadedFiles = results.map((r) => r.Location);

        const ETag = results[0].ETag.replace(/"/g, "");
        docWithDate._id = ETag;

      } catch (err) {
        console.error("Error uploading to S3:", err);
        return res.status(500).send("Error uploading file(s) to S3");
      }
    }

    const db = await connectDB(`db_${selectedWorkspace}_docs`);
    const response = await db.insert(docWithDate);

    return res.status(200).json({
      success: true,
      message: "Transacción agregada correctamente",
      data: response,
      etag: docWithDate._id,
    });
  } catch (error) {
    console.error("Error al agregar la transacción:", error);
    return res.status(500).send("No se pudo agregar la transacción");
  }
};



const getAllDocsByContactController = async (req, res) => {
  try {
    const user = req.user
    const { limit = 99999, skip, search } = req.query;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const { contactId, sortAlpha, statusFilter, sortQuantity, sortDate, dateOrder } = req.body;

    if (!contactId) {
      return res
        .status(400)
        .json({ error: "Se requiere un id de cliente válido" });
    }

    const db = await connectDB(`db_${selectedWorkspace}_docs`)
    let selector = {};


    if (sortDate) {
      const now = new Date();
      let limitDate = new Date();
      switch (sortDate) {
        case "1month": limitDate.setMonth(now.getMonth() - 1); break;
        case "3month": limitDate.setMonth(now.getMonth() - 3); break;
        case "6month": limitDate.setMonth(now.getMonth() - 6); break;
        case "1year": limitDate.setFullYear(now.getFullYear() - 1); break;
        default: limitDate = null;
      }

      if (limitDate) {
        selector.$or = [
          { createdAt: { $gt: limitDate.toISOString() } },
          { updatedAt: { $gt: limitDate.toISOString() } },
        ];
      }
    }

    if (contactId && contactId !== "allDocs") {
      selector.contactId = contactId;
    }


    if (search) {
      selector._id = {
        $regex: `(?i)${search}`
      };
    }
    let doc
    let totalDocs = []
    if (search || sortDate) {
      totalDocs = await db.find({
        selector,
      })
      doc = await db.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      })
    }
    else if (selector.status) {
      totalDocs = await db.find({
        selector,
      })
      doc = await db.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      })
    }
    else {
      doc = await db.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      })
    }


    let filteredDocs = doc.docs;

    if (filteredDocs.length == 0) {
      return res.status(200).json({
        success: false,
        docs: []
      });
    }
    if (sortAlpha) {
      filteredDocs.sort((a, b) => {
        const aName = a._id?.toLowerCase() || "";
        const bName = b._id?.toLowerCase() || "";
        return sortAlpha === "A-Z"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
    }

    if (dateOrder) {
      filteredDocs.sort((a, b) => {
        const aDate = a.createdAt?.toLowerCase() || "";
        const bDate = b.createdAt?.toLowerCase() || "";
        return dateOrder === "falling"
          ? aDate.localeCompare(bDate)
          : bDate.localeCompare(aDate);
      });
    }



    const total = await db.find({
      selector: { contactId: contactId },
      fields: ['_id']
    });


    let localSkip = skip
    let localTotal = total.docs.length
    if (statusFilter === "Todos" || statusFilter === null) {
      if (search) {
        if (totalDocs.docs.length) {
          localSkip = 1
          localTotal = totalDocs.docs.length
        }
      }
    }
    else {
      if (statusFilter) {
        if (totalDocs.docs.length) {
          localSkip = 1
          localTotal = totalDocs.docs.length
        }
      }
    }

    return res.status(200).json({
      success: true,
      skip: localSkip,
      docs: filteredDocs,
      total: localTotal,
    });




  } catch (error) {
    console.error("Error en getAllTransactionsByClientController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener las bases de datos",
    });
  }
};

const getDocByIdController = async (req, res) => {
  try {
    const { docId } = req.params;
    
    if (!docId || typeof docId !== "string") {
      return res
      .status(400)
      .json({ error: "Se requiere un docId válido" });
    }
    
    
    try {
      const user = req.user
      const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

      const db_doc = await connectDB(`db_${selectedWorkspace}_docs`)
      const db_contact = await connectDB(`db_${selectedWorkspace}_contacts`)
      const db_asset = await connectDB(`db_${selectedWorkspace}_assets`)

      try {
        const dbDoc = await db_doc.find({
          selector: {
            _id: docId
          }
        });

        if (dbDoc.docs.length == 0) {
          return res.status(404).send({
            success: false
          })
        }

        const clientId = dbDoc.docs[0].contactId

        const dbContact = await db_contact.find({
          selector: {
            _id: clientId
          }
        })



        let contact = {}
        if (dbContact.docs.length !== 0) {
          contact = dbContact.docs[0]
        }

        const dbAsset = await db_asset.find({
          selector: {
            docId: docId
          }
        });



        return res.status(200).send({
          success: true,
          doc: dbDoc.docs[0],
          contact: contact,
          assets: dbAsset.docs
        })
      } catch (docError) {
        if (docError.status !== 404) {
          console.error(
            `Error al obtener el documento ${docId} en la base de datos`,
          );
        }
      }



    } catch (error) {
      console.error("Error al obtener la transacción:", error);
      return res.status(500).send({
        success: false
      })
    }



  } catch (error) {
    console.error("Error en getTransactionByIdController:", error);
    return res.status(500).json({
      success: false,
      error: "Error al obtener la transacción",
    });
  }
};

const deleteDocsController = async (req, res) => {
  try {
    let { docsIds } = req.body;
    const user = req.user
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    if (typeof docsIds === "string") {
      docsIds = [docsIds];
    }

    try {

      const db = await connectDB(`db_${selectedWorkspace}_docs`)

      const docsToDelete = await Promise.all(
        docsIds.map(async (docId) => {
          const docDocument = await db.get(docId);
          return { _id: docDocument._id, _rev: docDocument._rev, _deleted: true };
        })
      );
      const response = await db.bulk({ docs: docsToDelete });

      return res.status(200).json({ message: "Assets eliminados correctamente", data: response });
    } catch (error) {
      console.error("Error al procesar las transacciones:", error);
      throw new Error("Falló la eliminación de transacciones.");
    }


  } catch (err) {
    console.error("Error en deleteTransactionController:", err);
    return res
      .status(500)
      .send("Ocurrió un error al intentar eliminar las transacciones.");
  }
};

const deleteAssetFromDocsController = async (req, res) => {
  try {
    const { docId, productRef } = req.body;



    try {

      const user = req.user
      const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

      const db = await connectDB(`db_${selectedWorkspace}_docs`)

      try {
        const doc = await db.get(docId);


        const updatedProductList = doc.totalData.productList.filter(
          (product) => product.productRef !== productRef
        );

        doc.totalData.productList = updatedProductList;

        await db.insert(doc);
      } catch (docError) {
        console.error(
          `Error al procesar el documento ${docId} en la base de datos ${dbName}:`,
          docError
        );
      }



      return res.status(200).json({
        message: "Documento procesado correctamente en la base de datos.",
        data: {
          success: true,
          message:
            "Documento procesado correctamente en la base de datos.",
        }
      });

    } catch (error) {
      console.error("Error al procesar las transacciones:", error);
      throw new Error("Falló la eliminación de transacciones.");
    }


  } catch (err) {
    console.error("Error en deleteTransactionController:", err);
    return res
      .status(500)
      .send("Ocurrió un error al intentar eliminar las transacciones.");
  }
};






const updateContactId = async (req, res) => {
  try {
    const { docId, contactId } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    if (!docId || !contactId) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos necesarios: docId o contactId",
      });
    }

    const db = await connectDB(`db_${selectedWorkspace}_docs`);
    const doc = await db.get(docId);

    const updatedDoc = {
      ...doc,
      contactId,
    };

    const response = await db.insert(updatedDoc);

    return res.status(200).json({
      success: true,
      message: "contactId actualizado correctamente",
      data: response,
    });
  } catch (error) {
    console.error("Error al actualizar el contactId:", error);
    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar el contactId",
      error: error.message,
    });
  }
};

const updateDoc = async (req, res) => {
  try {
    const { docId, updates } = req.body;  
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    if (!docId || !updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos necesarios: docId o updates (objeto con campos a actualizar)",
      });
    }
    const db = await connectDB(`db_${selectedWorkspace}_docs`);

    let doc; try {
      doc = await db.get(docId);
    } catch (error) {
      if (error.statusCode === 404) {
        doc = { _id: docId };
      } else {
        console.error(`Error getting document with ID ${docId}:`, error);
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          code: error.code || 'unknown',
          statusCode: error.statusCode || 'unknown'
        });
        error.message = `Error getting document: ${error.message}`;
        throw error;
      }
    }


    const updatedDoc = {
      ...doc,
      ...updates,
    };
    try {
      const response = await db.insert(updatedDoc);

      return res.status(200).json({
        success: true,
        message: "Campos actualizados correctamente",
        data: response,
      });
    } catch (insertError) {
      console.error(`Error inserting/updating document with ID ${docId}:`, insertError);
      console.error("Insert error details:", {
        message: insertError.message,
        name: insertError.name,
        code: insertError.code || 'unknown',
        statusCode: insertError.statusCode || 'unknown'
      });
      throw insertError;
    }
  } catch (error) {
    console.error("Error al actualizar los campos:", error);

    return res.status(500).json({
      success: false,
      message: "No se pudo actualizar los campos",
      error: error.message,
    });
  }
};








const saveAppFiles = async (req, res) => {
  try {
    const { files, appId } = req.body;

    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_app`);



    if (!appId) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos necesarios: appId",
      });
    }

    const app = await db.find({
      selector: {
        appId: appId,
      }
    })



    if (app.docs.length > 0) {
      const updatedFiles = Object.keys(files).reduce((acc, key) => {
        acc[key] = files[key];
        return acc;
      }, { ...app.docs[0].files });
      const data = {
        _id: app.docs[0]._id,
        _rev: app.docs[0]._rev,
        appId: appId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: updatedFiles,
      }

      const response = await db.insert(data);

      return res.status(200).json({
        success: true,
        message: "Archivos guardados correctamente",
        data: response,
      });
    } else {
      const data = {
        appId: app.docs[0]._id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: files,
      }
    }

  } catch (error) {
    console.error("Error al guardar los archivos:", error);
  }
}
const getDocsBGColorController = async (req, res) => {
  try {
 const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const db = await connectDB(`db_${selectedWorkspace}_docs`);

    console.log('db_${selectedWorkspace}_docs', `db_${selectedWorkspace}_docs`)

    // Opción 1: Usar find() con selector vacío y especificar los campos
    const result = await db.find({
      selector: {}, // Trae todos los documentos
      fields: ['_id', 'ETag', 'bgColor','path'], // Solo estos campos
    });
console.log('result',result)
    // Mapear para asegurar consistencia (por si falta algún campo)
    const docs = result.docs.map(doc => ({
      _id: doc._id,
      ETag: doc.ETag || null,
      bgColor: doc.bgColor || null,
      path: doc.path || null,
    }));

    return res.status(200).json({
      total: docs.length,
      docs,
    });
  } catch (error) {
    console.error('Error al obtener metadatos de documentos:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message,
    });
  }
};


const updateDocBGColorController = async (req, res) => {
  try {

    const { bgColor, etag} = req.body;
console.log('se esta recibiendo esto:',etag)
    if (!etag) {
      return res.status(400).json({ error: 'Falta el etag del documento' });
    }

    if (!bgColor) {
      return res.status(400).json({ error: 'Falta el color (bgColor)' });
    }

    // Validación básica de color (opcional)
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^(rgba?|hsla?)\(.+\)$/i;
    if (!colorRegex.test(bgColor.trim())) {
      return res.status(400).json({
        error: 'Formato de color inválido',
        formatos: '#hex, rgb(), rgba(), hsl(), hsla()'
      });
    }

    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace';
    const dbName = `db_${selectedWorkspace}_docs`;

    const db = await connectDB(dbName);

    // Crear índice si no existe (una vez es suficiente, pero no hace daño)
    await db.createIndex({
      index: { fields: ['ETag', 'path'] },
      name: 'index-by-etag',
      type: 'json'
    });
 let doc = null;

    // 1. Buscar por ETag
    let result = await db.find({
      selector: { ETag: etag },
      limit: 1
    });

    if (result.docs.length > 0) {
      doc = result.docs[0];
    } else {
      // 2. Si no se encuentra por ETag, buscar por path
      result = await db.find({
        selector: { path: etag },
        limit: 1
      });

      if (result.docs.length > 0) {
        doc = result.docs[0];
      }
    }

    // Si no se encontró ni por ETag ni por path
    if (!doc) {
      return res.status(404).json({
        error: 'Documento no encontrado',
        details: `No se encontró un documento con ETag o path: ${etag}`
      });
    }
    // Actualizar solo el campo bgColor
    const updatedDoc = {
      ...doc,
      bgColor: bgColor
    };

    // Guardar el documento actualizado
    const response = await db.insert(updatedDoc); // o db.put()

    // Responder con éxito
    return res.status(200).json({
      success: true,
      message: 'Color de fondo actualizado correctamente',
      _id: doc._id,
      ETag: doc.ETag,
      bgColor: bgColor,
      rev: response.rev
    });
  } catch (error) {
    console.error('Error al actualizar el color por ETag:', error);
    
    if (error.name === 'conflict') {
      return res.status(409).json({
        error: 'Conflicto de concurrencia',
        details: 'El documento fue modificado por otro proceso. Intente nuevamente.'
      });
    }

    return res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};



module.exports = {
  addDoc: catchedAsync(addDoc),
  getDocByIdController: catchedAsync(getDocByIdController),
  getAllDocsByContactController: catchedAsync(getAllDocsByContactController),
  deleteDocsController: catchedAsync(deleteDocsController),
  updateContactId: catchedAsync(updateContactId),
  updateDoc: catchedAsync(updateDoc),
  deleteAssetFromDocsController: catchedAsync(deleteAssetFromDocsController),
  saveAppFiles: catchedAsync(saveAppFiles),
  getDocsBGColorController: catchedAsync(getDocsBGColorController),
  updateDocBGColorController: catchedAsync(updateDocBGColorController),
};
