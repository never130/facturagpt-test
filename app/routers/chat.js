const { Router } = require("express");
const { authenticateToken } = require('../middlewares/auth/auth')


const { 
  getChatListController,
  getChatMessagesController,
  deleteChatController,
  emptyChatController,
  sendMessageController,
  validateTokenGPT,
  updateChatsAgentsController,
  createAgentController,
  getAgentsController,
  getAgentsByIdsController,
  updateAgentPinnedController,
  getAgentByIdController,
  updateAgentController,
  updateChatPinnedController,
  updateChatNameController,
  deleteAgentController,
  deleteChatAgentController,
  updateMessagePinLikeController,
  deleteMessageController,
  deleteAllChatsAgentsController,
  getAgentImagesController,
  restartLastMessageController,
  getPublicAgentsController,
  searchInWebController,
  duplicateAgent,
  getAllAgentsWithCreatorController,
  scrapingController,
  graphController,
  templateSaveController,
  getDefaultAutomateAgentController
} = require("../controllers/chat");

const chatByClientRouter = Router();

chatByClientRouter

  .get("/list", authenticateToken, getChatListController)
  .get("/:chatId/messages", authenticateToken, getChatMessagesController)
  .delete("/:chatId", authenticateToken, deleteChatController)
  .post("/:agentId/:chatId/messages", authenticateToken, sendMessageController)
  .post("/:chatId/restart-messages", authenticateToken, restartLastMessageController)
  .post("/:chatId/search-in-web", authenticateToken, searchInWebController)
  
  .delete("/empty/:chatId", authenticateToken, emptyChatController)
  .put("/:chatId/pin", authenticateToken, updateChatPinnedController)
  .put("/:chatId/update-name", authenticateToken, updateChatNameController)
  .post("/validate-token", authenticateToken, validateTokenGPT)
  
  .put("/:chatId/messages/pin-like", authenticateToken, updateMessagePinLikeController)
  .put("/:chatId/messages/delete", authenticateToken, deleteMessageController)
  
  .post("/update-chats-agents", authenticateToken, updateChatsAgentsController)
  .post("/create-agent", authenticateToken, createAgentController)
  .get("/get-agents", authenticateToken, getAgentsController)
  .post("/get-agents-by-ids", authenticateToken, getAgentsByIdsController)
  .post("/get-public-agents", authenticateToken, getPublicAgentsController)
  .put("/pin-agents/:agentId", authenticateToken, updateAgentPinnedController)
  .get("/search-agent/:agentId", authenticateToken, getAgentByIdController)
  .put("/update-agent/:agentId", authenticateToken, updateAgentController)
  .post("/delete-agent/:agentId", authenticateToken, deleteAgentController)
  .delete("/delete-chat-agent/:name", authenticateToken, deleteChatAgentController)
  .delete("/delete-all-chats-agents/:type", authenticateToken, deleteAllChatsAgentsController)
  .post("/get-images-agents", authenticateToken, getAgentImagesController)
  .post("/duplicate-agent", authenticateToken, duplicateAgent)
  .post("/get-public-agents-with-creator", authenticateToken, getAllAgentsWithCreatorController)
  // .post("/template-save", authenticateToken, templateSaveController)
  .post("/scraping/:agentId/:chatId", authenticateToken, scrapingController)
  .post("/graph/:agentId/:chatId", authenticateToken, graphController)
  .get("/default-automate-agent", authenticateToken, getDefaultAutomateAgentController)

module.exports = chatByClientRouter;
