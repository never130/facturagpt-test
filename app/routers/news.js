const { Router } = require("express");
const { syncNews } = require("../controllers/news");
const { catchedAsync } = require("../utils/err");

const { authenticateToken } = require('../middlewares/auth/auth')

const newsRouter = Router();


newsRouter.get("/sync", authenticateToken, catchedAsync(syncNews));

module.exports = newsRouter;
