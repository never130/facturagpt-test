const { Router } = require("express");

const mainRouter = Router();

const routerStripe = require("./stripe");
const routerUser = require("./user");
const automateRouter = require("./automate");
const scalewayRouter = require("./scaleway");
const contactsRouter = require("./contacts");
const assetsRouter = require("./assets");
const docsRouter = require("./docs");
const chatRouter = require("./chat");
const notificationRouter = require("./notifications");
const whatsappTokenRouter = require("./whatsappToken");
const qrCodeRouter = require("./qrCode");
const calendarRouter = require("./calendar");
const gmailRouter = require("./gmail");
const scrapingRouter = require("./scraping");
const workspacesManagerRouter = require("./workspaces");


const newsRouter = require("./news");


mainRouter.use("/calendar", calendarRouter);
mainRouter.use("/gmail", gmailRouter);

mainRouter.use("/news", newsRouter);

mainRouter.use("/user", routerUser);
mainRouter.use("/stripe", routerStripe);
mainRouter.use("/scaleway", scalewayRouter);

mainRouter.use("/assets", assetsRouter);
mainRouter.use("/contacts", contactsRouter);
mainRouter.use("/docs", docsRouter);

mainRouter.use("/notifications", notificationRouter);
mainRouter.use("/chat", chatRouter);
mainRouter.use("/automate", automateRouter);
mainRouter.use("/whatsappToken", whatsappTokenRouter);
mainRouter.use("/qrCode", qrCodeRouter);
mainRouter.use("/scraping", scrapingRouter);
mainRouter.use("/workspace", workspacesManagerRouter);


module.exports = mainRouter;
