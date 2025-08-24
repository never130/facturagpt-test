const { Router } = require("express");
const whatsappTokenRouter = Router();
const { authenticateToken } = require('../middlewares/auth/auth')
const {
  createWhatsappTokenController,
  getUserDevicesController,
  disconnectDeviceController,
  sendWhatsappMessageController,
  getChatDetailsController,
  initializeWhatsApp
} = require("../controllers/whatsappToken");

whatsappTokenRouter
  .post("/createWhatsappToken", authenticateToken, createWhatsappTokenController)
  .get("/user/devices/:userId", authenticateToken, getUserDevicesController)
  .post('/users/chats', authenticateToken, getChatDetailsController)
  .post("/disconnectDevice", authenticateToken, disconnectDeviceController)
  .post("/sendWhatsappMessage", authenticateToken, sendWhatsappMessageController)

module.exports = whatsappTokenRouter;
