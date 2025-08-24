const { Router } = require("express");
const automationsRouter = Router();

const multer = require("multer");
const upload = multer();

const { authenticateToken } = require('../middlewares/auth/auth')




const { 
  scrapApi 
} = require("../services/automate/api");
const { gmailRedirectController, gmailLogin } = require("../services/automate/api/gmail");



automationsRouter

.get("/gmailRedirect", gmailRedirectController)
.get('/gmailLogin', gmailLogin)



module.exports = automationsRouter;
