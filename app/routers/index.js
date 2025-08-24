const { Router } = require("express");

const mainRouter = Router();

const routerUser = require("./user");
const workspacesManagerRouter = require("./workspaces");


mainRouter.use("/user", routerUser);
mainRouter.use("/workspace", workspacesManagerRouter);


module.exports = mainRouter;
