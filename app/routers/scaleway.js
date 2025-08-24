const { Router } = require("express");

const { authenticateToken } = require('../middlewares/auth/auth')

const multer = require("multer");
const upload = multer();

const scalewayRouter = Router();
const {
  checkOrCreateUserBucketController,
  getUserFilesController,
  uploadFilesController,
  createFolderController,
  moveObjectController,
  deleteObjectController,
  changeLocation,
  updateNameFileController,
  duplicateUserFolderController,
  renameFolderController,
  duplicateFileController,
  emptyFolderController,
} = require("../controllers/scaleway");

scalewayRouter
  .get("/check-user-bucket/:userId", authenticateToken, checkOrCreateUserBucketController)
  .post("/get-user-files/:userId", authenticateToken, getUserFilesController)
  .post("/upload-files", authenticateToken, upload.array("files"), uploadFilesController)
  .post("/create-folder", authenticateToken, createFolderController)
  .post("/move-object", authenticateToken, moveObjectController)
  .put("/change-location-object", authenticateToken, changeLocation)
  .put("/update-name-file", authenticateToken, updateNameFileController)
  .put("/update-name-folder/:userId", authenticateToken, renameFolderController)
  .post("/delete-object", authenticateToken, deleteObjectController)
  .post("/duplicate-folder-files/:userId", authenticateToken, duplicateUserFolderController)
  .post("/duplicate-file", authenticateToken, duplicateFileController)
  .post("/empty-folder", authenticateToken, emptyFolderController);

module.exports = scalewayRouter;
