const { Router } = require("express");

const { authenticateToken } = require("../middlewares/auth/auth");

const {
  getAllAssets,
  updateAsset,
  createAsset,
  deleteAsset,
  getAsset,
  deleteAllAssets,
  setDocIdInAsset,
  getAssetsByTags,
  markAssetAsSeen,
  getAssetsStatusViewed
} = require("../controllers/assets");

const assetsRouter = Router();

assetsRouter
  .post("/getAllAssets", authenticateToken, getAllAssets)
  .post("/getAsset", authenticateToken, getAsset)
  .put("/updateAsset/:assetId", authenticateToken, updateAsset)
  .put("/setDocIdInAsset/:assetId", authenticateToken, setDocIdInAsset)
  .post("/createAsset", authenticateToken, createAsset)
  .post("/getAssetsByTags", authenticateToken, getAssetsByTags)
  .delete("/deleteAsset", authenticateToken, deleteAsset)
  .delete("/deleteAllAssets", authenticateToken, deleteAllAssets)
  .get("/get-assets-status-viewed", authenticateToken, getAssetsStatusViewed)
  .get("/mark-asset-as-seen/:_id", authenticateToken, markAssetAsSeen)

module.exports = assetsRouter;
