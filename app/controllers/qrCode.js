const { catchedAsync } = require("../utils/err");
const { connectDB } = require("./utils");


const saveQRConfiguration = async (req, res) => {
  try {
    const { config } = req.body;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    if (!config || !config.id) {
      return res.status(400).json({
        success: false,
        message: "Configuration ID is required",
      });
    }

    const db = await connectDB(`db_${selectedWorkspace}_qr`);
    
    const docId = `qr-${config.id}`;
    
    let existingDoc;
    try {
      existingDoc = await db.get(docId);
    } catch (error) {
      existingDoc = { _id: docId };
    }
    
    const updatedDoc = {
      ...existingDoc,
      ...config,
      type: 'qr_config',
      updatedAt: new Date().toISOString(),
    };
    
    if (!existingDoc.createdAt) {
      updatedDoc.createdAt = updatedDoc.updatedAt;
    }
    
    const response = await db.insert(updatedDoc);
    
    return res.status(200).json({
      success: true,
      message: "QR configuration saved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error saving QR configuration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save QR configuration",
      error: error.message,
    });
  }
};


const getAllQRConfigurations = async (req, res) => {
  try {
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'
    
    const db = await connectDB(`db_${selectedWorkspace}_qr`);
    
    const result = await db.find({
      selector: {
        type: 'qr_config'
      }
    });
    
    
    if (result.docs) {
      result.docs.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; 
      });
    }
    
    return res.status(200).json({
      success: true,
      configurations: result.docs || [],
    });
  } catch (error) {
    console.error("Error retrieving QR configurations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve QR configurations",
      error: error.message,
    });
  }
};


const deleteQRConfiguration = async (req, res) => {
  try {
    const { configId } = req.params;
    const user = req.user;
    const selectedWorkspace = user?.selectedWorkspace || 'defaultworkspace'

    if (!configId) {
      return res.status(400).json({
        success: false,
        message: "Configuration ID is required",
      });
    }
    
    const db = await connectDB(`db_${selectedWorkspace}_qr`);
    
    let docToDelete;
    try {
      docToDelete = await db.get(configId);
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(404).json({
          success: false,
          message: "QR configuration not found",
        });
      }
      throw error;
    }
    
    await db.destroy(docToDelete._id, docToDelete._rev);
    
    return res.status(200).json({
      success: true,
      message: "QR configuration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting QR configuration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete QR configuration",
      error: error.message,
    });
  }
};

module.exports = {
  saveQRConfiguration: catchedAsync(saveQRConfiguration),
  getAllQRConfigurations: catchedAsync(getAllQRConfigurations),
  deleteQRConfiguration: catchedAsync(deleteQRConfiguration),
};
