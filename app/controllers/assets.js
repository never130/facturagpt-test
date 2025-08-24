
const { catchedAsync } = require("../utils/err");
const { connectDB } = require("./utils");

const { v4: uuidv4 } = require("uuid");


const getAllAssets = async (req, res) => {
  try {
    const { user } = req;
    const { limit = 99999, skip, search } = req.query;
    const { sortAlpha, statusFilter, sortQuantity, sortDate, dateOrder } = req.body;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    let selector = {};

    let limitDate = null;
    if (sortDate) {
      limitDate = new Date();
      const now = new Date();
      switch (sortDate) {
        case "1month": limitDate.setMonth(now.getMonth() - 1); break;
        case "3month": limitDate.setMonth(now.getMonth() - 3); break;
        case "6month": limitDate.setMonth(now.getMonth() - 6); break;
        case "1year": limitDate.setFullYear(now.getFullYear() - 1); break;
        default: limitDate = null;
      }


    }

    const orConditions = [];

    if (limitDate) {
      orConditions.push(
        { createdAt: { "$gt": limitDate.toISOString() } },
        { updatedAt: { "$gt": limitDate.toISOString() } }
      );
    }

    if (search) {
      orConditions.push(
        { name: { $regex: `(?i)${search}` } },
        { description: { $regex: `(?i)${search}` } }
      );
    }

    if (orConditions.length > 0) {
      selector["$and"] = [
        {
          "$or": orConditions.filter(cond => "createdAt" in cond || "updatedAt" in cond)
        },
        {
          "$or": orConditions.filter(cond => "name" in cond || "description" in cond)
        }
      ];
    }

    if (statusFilter && statusFilter !== "Todos") {
      selector.status = statusFilter;
    }
 
    let assets
    let totalAssets
    if (search || sortDate) {
      totalAssets = await dbAssets.find({
        selector,
        limit: 999999,
      });

      assets = await dbAssets.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

    }
    else if (selector.status) {
      totalAssets = await dbAssets.find({
        selector,
        limit: 999999,
      });

      assets = await dbAssets.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
    }
    else {
      assets = await dbAssets.find({
        selector,
        limit: parseInt(limit),
        skip: parseInt(skip),
      });
    }



    let filteredAssets = assets.docs;

    if (sortAlpha) {
      filteredAssets.sort((a, b) => {
        const fieldA = a.name?.toLowerCase() || "";
        const fieldB = b.name?.toLowerCase() || "";

        if (sortAlpha === "A-Z") {
          return fieldA.localeCompare(fieldB); 
        } else if (sortAlpha === "Z-A") {
          return fieldB.localeCompare(fieldA); 
        }
        return 0; 
      });
    }

    if (dateOrder) {
      filteredAssets.sort((a, b) => {
        const fieldA = a.createdAt?.toLowerCase() || "";
        const fieldB = b.createdAt?.toLowerCase() || "";

        if (dateOrder === "falling") {
          return fieldA.localeCompare(fieldB); 
        } else if (dateOrder === "ascendant") {
          return fieldB.localeCompare(fieldA); 
        }
        return 0; 
      });
    }

    if (sortQuantity) {
      filteredAssets.sort((a, b) => {
        const valueA = a.quantity || 0;
        const valueB = b.quantity || 0;

        if (sortQuantity === "Menor a Mayor") {
          return valueA - valueB; 
        } else if (sortQuantity === "Mayor a Menos") {
          return valueB - valueA; 
        }
        return 0; 
      });
    }


    const total = await dbAssets.find({
      selector: {},
      fields: ['_id'],  
      limit: 999999
    });


    let localSkip = skip
    let localTotal = total.docs.length
    if (statusFilter === "Todos" || statusFilter === null) {
      if (search) {
        localSkip = 1
        localTotal = totalAssets.docs.length
      }
    }
    else {
      localSkip = 1
      localTotal = totalAssets?.docs?.length || 0
    }

    return res.status(200).send({
      success: true,
      assets: filteredAssets,
      total: localTotal,
      limit: parseInt(limit),
      skip: parseInt(localSkip),
      pages: Math.ceil(total / limit),
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error on getAllAssets");
  }
};


const getAsset = async (req, res) => {
  try {
    const { assetId } = req.body;
    const user = req.user;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const asset = await dbAssets.get(assetId);

    return res.status(200).json({ message: 'Asset encontrado', data: asset });
  } catch (err) {
    console.error("Error en getAssetController:", err);
    return res.status(500).send("Error on getAssetController");
  }
};


const updateAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const assetData = req.body; 
    const user = req.user;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const assetDoc = await dbAssets.get(assetId);

    const updatedAsset = {
      ...assetDoc, 
      ...assetData.assetData,
      _rev: assetDoc._rev,
    };

    const response = await dbAssets.insert(updatedAsset);

    return res.status(200).json({ message: 'Contacto actualizado', data: response });
  } catch (err) {
    console.error("Error en updateContactController:", err);
    return res.status(500).send("Error on updateContactController");
  }
};
const setDocIdInAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const { docId } = req.body;
    const user = req.user;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const assetDoc = await dbAssets.get(assetId);

    const updatedAsset = {
      ...assetDoc,
      docId, 
      _rev: assetDoc._rev,
    };

    const response = await dbAssets.insert(updatedAsset);

    return res.status(200).json({ message: 'Asset actualizado con docId', data: response });
  } catch (err) {
    console.error("Error en setDocIdInAsset:", err);
    return res.status(500).send("Error en setDocIdInAsset");
  }
};

const createAsset = async (req, res) => {
  try {
    const assetData = req.body;
    const user = req.user;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const newAssetId = uuidv4();  

    const now = new Date().toISOString();
    const newAsset = {
      _id: newAssetId,  
      ...assetData.assetData,  
      userId: user._id, 
      createdAt: now,
      updatedAt: now
    };

    const response = await dbAssets.insert(newAsset);

    return res.status(201).json({ message: 'Activo creado exitosamente', data: response });
  } catch (err) {
    console.error("Error en createAsset:", err);
    return res.status(500).send("Error al crear activo");
  }
};

const getAssetsByTags = async (req, res) => {
  try {
    const { tags } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: "Se requiere un arreglo de tags válido." });
    }

    const selector = {
      "selectedtags": {
        "$elemMatch": {
          "name": { "$in": tags }
        }
      }
    };

    const result = await dbAssets.find({ selector });

    const assetIds = result.docs.map((doc) => doc.docId);

    return res.status(200).json({
      message: 'IDs de activos encontrados por tags',
      data: assetIds
    });

  } catch (err) {
    console.error("Error en getAssetsByTags:", err);
    return res.status(500).send("Error al obtener activos por tags");
  }
};


const deleteAsset = async (req, res) => {
  try {
    let { clientSelected } = req.body;
    const user = req.user;

    if (!clientSelected) {
      return res.status(400).json({ message: "clientSelected es requerido" });
    }

    if (typeof clientSelected === "string") {
      clientSelected = [clientSelected];
    }

    if (!Array.isArray(clientSelected)) {
      return res.status(400).json({ message: "clientSelected debe ser un array o un string" });
    }

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const assetsToDelete = await Promise.all(
      clientSelected.map(async (assetId) => {
        const assetDoc = await dbAssets.get(assetId);
        return { _id: assetDoc._id, _rev: assetDoc._rev, _deleted: true };
      })
    );

    const response = await dbAssets.bulk({ docs: assetsToDelete });

    return res.status(200).json({ message: "Assets eliminados correctamente", data: response });
  } catch (err) {
    console.error("Error en deleteAsset:", err);
    return res.status(500).send("Error al eliminar los assets");
  }
};

const deleteAllAssets = async (req, res) => {

  try {
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const result = await dbAssets.find({
      selector: {}, 
      limit: 9999999,
    });

    if (!result.docs.length) {
      return res.status(200).json({ message: "No hay assets para eliminar" });
    }

    const assetsToDelete = result.docs.map((doc) => ({
      _id: doc._id,
      _rev: doc._rev,
      _deleted: true,
    }));

    const response = await dbAssets.bulk({ docs: assetsToDelete });

    return res.status(200).json({
      message: "Todos los assets han sido eliminados correctamente",
      data: response,
    });
  } catch (err) {
    console.error("Error en deleteAllAssets:", err);
    return res.status(500).send("Error eliminando todos los assets");
  }
};



const getAssetsStatusViewed = async (req, res) => {
  try {
    const { user } = req;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbAsset = await connectDB(`db_${selectedWorkspace}_assets`);
    const result = await dbAsset.find({
      selector: {
        $or: [
          { seen: false },
          { seen: { $exists: false } },
        ],
      },
      fields: ["_id"],
    });

    return res.status(200).json({
      totalUnseenAssets: result.docs.length,
    });
  } catch (err) {
    console.error("Error al obtener assets no vistos:", err);
    return res.status(500).json({
      message: "Error al obtener el estado de los assets.",
    });
  }
};

const markAssetAsSeen = async (req, res) => {
  try {
    const { user } = req;
    const { _id } = req.params;

    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    const dbAssets = await connectDB(`db_${selectedWorkspace}_assets`);

    const assetDoc = await dbAssets.get(_id);

    if (assetDoc.seen === true) {
      return res.status(200).json({
        message: "El asset ya estaba marcado como visto.",
        alreadySeen: true,
        updatedId: assetDoc._id,
      });
    }

    const updatedDoc = {
      ...assetDoc,
      seen: true,
    };

    const response = await dbAssets.insert(updatedDoc);

    return res.status(200).json({
      message: "Asset marcado como visto.",
      alreadySeen: false,
      updatedId: response.id,
    });
  } catch (err) {
    console.error(`Error al marcar asset como visto:`, err);
    return res.status(500).json({
      message: "Error al actualizar el estado del asset.",
    });
  }
};


module.exports = {
  getAllAssets: catchedAsync(getAllAssets),
  updateAsset: catchedAsync(updateAsset),
  setDocIdInAsset: catchedAsync(setDocIdInAsset),
  createAsset: catchedAsync(createAsset),
  getAssetsByTags: catchedAsync(getAssetsByTags),
  deleteAsset: catchedAsync(deleteAsset),
  deleteAllAssets: catchedAsync(deleteAllAssets),
  getAsset: catchedAsync(getAsset),
  getAssetsStatusViewed: catchedAsync(getAssetsStatusViewed),
  markAssetAsSeen: catchedAsync(markAssetAsSeen),
};