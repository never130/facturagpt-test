const { Router } = require("express");
const { authenticateToken } = require('../middlewares/auth/auth');
const { saveQRConfiguration, getAllQRConfigurations, deleteQRConfiguration } = require("../controllers/qrCode");

const qrCodeRouter = Router();

qrCodeRouter
  .put("/saveConfig", authenticateToken, saveQRConfiguration)
  .get("/getAllConfigs", authenticateToken, getAllQRConfigurations)
  .delete("/deleteConfig/:configId", authenticateToken, deleteQRConfiguration);

module.exports = qrCodeRouter;
