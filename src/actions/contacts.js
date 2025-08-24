import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async ({ data }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.post(
        `/contacts/createContact`,
        { data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating client:", error);
      if (error.response.status === 501) logout();
    }
  }
);

export const createContacts = createAsyncThunk(
  "contacts/createContacts",
  async ({ userId, contactsData }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/contacts/createContacts`, 
        { userId, contactsData },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (!res.data) {
        throw new Error("El servidor no devolvió datos válidos.");
      }
      
      return res.data;
    } catch (error) {
      console.error("Error creating contacts:", error);

      if (error.response.status === 501) logout();

      return rejectWithValue(error.response?.data || "Error inesperado");
    }
  }
);

export const getAllContacts = createAsyncThunk(
  "contacts/getAllContacts",
  async ({ search = "", limit = 20, skip = 0,sortAlpha, statusFilter, sortQuantity, sortDate,dateOrder  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/contacts/getAllContacts?search=${search}&limit=${limit}&skip=${skip}`,
        { sortAlpha,statusFilter,sortQuantity,sortDate,dateOrder},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error fetching user automations:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, contactData }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        `/contacts/updateContact/${id}`,
        { id, contactData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating client:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);

export const getOneContact = createAsyncThunk(
  "/getContact/contacts",
  async ({ userId, clientId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.get(
        `/contacts/getContact/${clientId}/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error get client:", error);

      if (error.response?.status === 501) logout();
      throw error;
    }
  }
);
export const getContactsStatusViewed = createAsyncThunk(
  "/getContactsStatusViewed/contacts",
  async ({}) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.get(
        `/contacts/get-contacts-status-viewed`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error get client:", error);

      if (error.response?.status === 501) logout();
      throw error;
    }
  }
);
export const markContactAsSeen = createAsyncThunk(
  "/markContactAsSeen/contacts",
  async ({id}) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.get(
        `/contacts/mark-contact-as-seen/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error get client:", error);

      if (error.response?.status === 501) logout();
      throw error;
    }
  }
);
export const deleteContacts = createAsyncThunk(
  "contacts/deleteContacts",
  async ({ contactsSelected }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(
        `/contacts/deleteContacts`,
        {  
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data:{contactsSelected}
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating client:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);
export const deleteAllContacts = createAsyncThunk(
  "contacts/deleteAllContacts",
  async ({  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(
        `/contacts/deleteAllContacts`,
        {  
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating client:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);


export const getContactImage = createAsyncThunk(
  "/getContact/contacts",
  async ({  contactId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const response = await apiBackend.get(
        `/contacts/getContactImage/${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data
    } catch (error) {
      console.error("Error get client:", error);

      if (error.response?.status === 501) logout();
      throw error;
    }
  }
);