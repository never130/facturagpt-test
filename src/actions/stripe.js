import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";




export const attachCustomPaymentMethod = createAsyncThunk(
  "stripe/attachCustomPaymentMethod",
  async (payMethod) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/stripe/attach-custom-payment-method`,
        { payMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error adding new payment intent:", error);
      throw new Error("Failed to add new payment intent");
    }
  }
);


export const createPaymentIntent = createAsyncThunk(
  "stripe/createPaymentIntent",
  async ({ amount, currency }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/stripe/create-payment-intent`,
        { amount, currency },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error adding new payment intent:", error);
      throw new Error("Failed to add new payment intent");
    }
  }
);



export const createSetupIntent = createAsyncThunk(
  "stripe/createSetupIntent",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      
      const res = await apiBackend.post(
        `/stripe/create-setup-intent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { clientSecret: res.data.clientSecret };
    } catch (error) {
      console.error(
        "Error creating setup intent:",
        error.response?.data || error.message
      );

    }
  }
);

export const deletePaymentIntent = createAsyncThunk(
  "stripe/deletePaymentIntent",
  async ({ paymentMethodId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/stripe/delete-payment-method`,
        { paymentMethodId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error adding new payment intent:", error);
      throw new Error("Failed to add new payment intent");
    }
  }
);



export const defaultPaymentIntent = createAsyncThunk(
  "stripe/defaultPaymentIntent",
  async ({ paymentMethodId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/stripe/default-payment-method`,
        { paymentMethodId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error adding new payment intent:", error);
      throw new Error("Failed to add new payment intent");
    }
  }
);

