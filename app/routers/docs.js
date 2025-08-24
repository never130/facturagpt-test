const { Router } = require("express");

const { authenticateToken } = require('../middlewares/auth/auth')

const multer = require("multer");
const upload = multer();
const {
  getAllDocsByContactController,
  deleteDocsController,
  deleteAssetFromDocsController,
  getDocByIdController,
  addDoc,
  updateContactId,
  updateDoc,



  saveAppFiles,
  getDocsBGColorController,
  updateDocBGColorController,

} = require("../controllers/docs");



const docsByClientRouter = Router();

docsByClientRouter
  .post("/alldocsByContact", authenticateToken, getAllDocsByContactController)
  .post("/deleteDocs", authenticateToken, deleteDocsController)
  .post("/deleteAssetFromDocs", authenticateToken, deleteAssetFromDocsController)
  .get("/getOneDocs/:docId", authenticateToken, getDocByIdController)
  .post("/addDocs",  upload.array("files"),authenticateToken, addDoc)
  .put("/updateContactId", authenticateToken, updateContactId)
  .put("/updateDoc", authenticateToken, updateDoc)
  .post("/saveApp", authenticateToken, saveAppFiles)
  .get("/getDocsBGColor", authenticateToken, getDocsBGColorController)
  .put("/updateDocBGColor", authenticateToken, updateDocBGColorController)

module.exports = docsByClientRouter;
