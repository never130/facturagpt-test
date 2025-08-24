const { Router } = require("express");
const stripeRouter = Router();

const { authenticateToken } = require('../middlewares/auth/auth')

const {
  createSetupIntentController,
  attachCustomPaymentMethodController,
  createCustomPaymentIntentController,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} = require("../controllers/stripe");


stripeRouter
  .post("/create-setup-intent", authenticateToken, createSetupIntentController)
  .post("/attach-custom-payment-method", authenticateToken, attachCustomPaymentMethodController)
  .post("/create-custom-payment-intent", authenticateToken, createCustomPaymentIntentController)
  .post("/delete-payment-method", authenticateToken, deletePaymentMethod)
  .post("/default-payment-method", authenticateToken, setDefaultPaymentMethod);

module.exports = stripeRouter;
