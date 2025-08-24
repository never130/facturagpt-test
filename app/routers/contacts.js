const { Router } = require("express");
const clientsRouter = Router();

const { authenticateToken } = require('../middlewares/auth/auth')

const {
  createContactController,
  getAllContactsController,
  updateContactController,
  deleteContactController,
  getOneContactController,
  getContactImageController,
  deleteAllContactsController,
  getContactsStatusViewed,
  markContactAsSeen,
} = require("../controllers/contacts");

clientsRouter
  .post("/createContact", authenticateToken, createContactController)
  .post("/getAllContacts", authenticateToken, getAllContactsController)
  .put("/updateContact/:contactId", authenticateToken, updateContactController)
  .delete("/deleteContacts", authenticateToken, deleteContactController)
  .delete("/deleteAllContacts", authenticateToken, deleteAllContactsController)
  .get("/getContact/:clientId/:userId", authenticateToken, getOneContactController)
  .get("/getContactImage/:contactId/", authenticateToken, getContactImageController)
  .get("/get-contacts-status-viewed", authenticateToken, getContactsStatusViewed)
  .get("/mark-contact-as-seen/:_id", authenticateToken, markContactAsSeen)

module.exports = clientsRouter;
