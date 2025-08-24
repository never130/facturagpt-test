const { Router } = require("express");
const automationsRouter = Router();

const multer = require("multer");
const upload = multer();

const { authenticateToken } = require('../middlewares/auth/auth')

const {
  importDataController,

  createAutomationController,
  getAllUserAutomationsController,
  getAllUserAutomationsControllerWithFilter,
  updateAutomationController,
  deleteAutomationController,

  addAuthController,
  getAuthController,
  deleteAuthController,
  getAutomatesByIdsController,
  getAllUserAutomationsByInputSeachController,
  filterGptController,
  filterImageGptController,
  importConnectionAttachmentController,
  promptAutomateController,
  getSelectedAutomationsController,
  imageToHtmlController,
} = require("../controllers/automate");


const { 
  scrapApi 
} = require("../services/automate/api");


const { getStatsPolling } = require("../services/automate/core");
const { oneDriveAuthController, oneDriveRedirectController, oneDriveIsAuthenticatedController, oneDriveLogOutController, oneDriveFiles } = require("../services/automate/api/onedrive");
const { tryConnectionAutomateController } = require("../services/automate/api/gmail");
const { outlookAuthController, outlookRedirectController, outlookIsAuthenticatedController, outlookLogOutController, outlookEmails } = require("../services/automate/api/outlook");
const { driveAuthController, driveRedirectController, driveIsAuthenticatedController, driveLogOutController, driveFiles } = require("../services/automate/api/drive");
const { getTelematelTokenController,telematelIsAuthenticatedController,telematelFilesController } = require("../services/automate/api/telematel");

automationsRouter
.get("/status/polling", authenticateToken, getStatsPolling)
.post("/tryConnectionAutomate", authenticateToken, tryConnectionAutomateController)
.post("/importConnectionAttachment", authenticateToken, importConnectionAttachmentController)

.post("/importData", authenticateToken, importDataController)

.post("/createAutomation", authenticateToken, createAutomationController)
.get("/getAllUserAutomations/:userId", authenticateToken, getAllUserAutomationsController)
.post("/getAllUserAutomationsWithFilter/:userId", authenticateToken, getAllUserAutomationsControllerWithFilter)
.put("/updateAutomation/:automationId", authenticateToken, updateAutomationController)
.delete("/deleteAutomation/:automationId", authenticateToken, deleteAutomationController)

.get("/outlookAuth", outlookAuthController)
.get("/outlookRedirect", outlookRedirectController)
.get("/outlookIsAuthenticated", authenticateToken, outlookIsAuthenticatedController)
.get("/outlookLogOut", outlookLogOutController)
.post("/outlookEmails", authenticateToken, outlookEmails)

.get("/driveAuth", driveAuthController)
.get("/driveRedirect", driveRedirectController)
.get("/driveIsAuthenticated", authenticateToken, driveIsAuthenticatedController)
.get("/driveLogOut", driveLogOutController)
.post("/driveFiles", authenticateToken, driveFiles)

.post("/addAuth", authenticateToken, addAuthController)
.get("/getAuth/:type", authenticateToken, getAuthController)
.delete("/deleteAuth/:authId", authenticateToken, deleteAuthController) 
.post("/getAutomatesByIds", authenticateToken, getAutomatesByIdsController)
.post("/getAllUserAutomations", authenticateToken, getAllUserAutomationsByInputSeachController)
.post("/filtergpt", authenticateToken, filterGptController)
.post("/filterImageGpt", authenticateToken, upload.single("file"), filterImageGptController)

.get("/oneDriveAuth", oneDriveAuthController)
.get("/oneDriveRedirect", oneDriveRedirectController)
.get("/oneDriveIsAuthenticated", authenticateToken, oneDriveIsAuthenticatedController)
.get("/oneDriveLogOut", oneDriveLogOutController)
.post("/oneDriveFiles", authenticateToken, oneDriveFiles)

.post("/getTelematelToken", authenticateToken, getTelematelTokenController)
.get("/telematelIsAuthenticated", authenticateToken, telematelIsAuthenticatedController)
.post("/telematelFiles", authenticateToken, telematelFilesController)
.post("/getSelectedAutomations", authenticateToken, getSelectedAutomationsController)

.post("/promptAutomate", authenticateToken, promptAutomateController)
.post("/imageToHtml", authenticateToken, imageToHtmlController)

.post("/scrap", authenticateToken, scrapApi)


module.exports = automationsRouter;
