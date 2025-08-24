import { createAsyncThunk } from "@reduxjs/toolkit";
import apiBackend from "@src/apiBackend.js";
import { logout } from "./user.js";

export const updateChatsAgents = createAsyncThunk(
  "/chat/updateChatsAgents",
  async ({ automationId, userId, agents }, { rejectWithValue }) => {
    try {

      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(`/chat/update-chats-agents`,
        { automationId, userId, agents },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


      return res.data;
    } catch (error) {
      console.error("Error fetching agents:", error);

    }
  }
)



export const getAgentsByIds = createAsyncThunk(
  "/chat/getAgentsByIds",
  async (ids, { rejectWithValue }) => {
    try {

      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(`/chat/get-agents-by-ids`,
        { ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


      return res.data;
    } catch (error) {
      console.error("Error fetching agents:", error);

    }
  }
)

export const getAgents = createAsyncThunk(
  "/chat/getAgents",
  async ({ search, sortDate, dateOrder, orderByType, sortAlpha, workspaceId }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {
      let url = `/chat/get-agents?search=${search || ''}&sortDate=${sortDate || ''}&dateOrder=${dateOrder || ''}&orderByType=${orderByType || ''}&sortAlpha=${sortAlpha || ''}`;
      
      // Agregar workspaceId si está disponible
      if (workspaceId) {
        url += `&workspaceId=${workspaceId}`;
      }

      const res = await apiBackend.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; 
    } catch (error) {
      console.error("Error fetching agents:", error);
      if (error.response?.status === 501 || error.response?.status === 502) logout();
    }
  }
);

export const duplicateAgent = createAsyncThunk(
  "/chat/duplicate-agent",
  async ({agent, workspaceId},{ rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {
      const res = await apiBackend.post(`/chat/duplicate-agent`,
        { agent, workspaceId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; 
    } catch (error) {
      console.error("Error fetching agents:", error);

    }
  }
);


export const getDefaultAutomateAgent = createAsyncThunk(
  "/chat/default-automate-agent",
  async (_,{ rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {
      const res = await apiBackend.get(`/chat/default-automate-agent`,
         {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data; 
    } catch (error) {
      console.error("Error fetching agents:", error);

    }
  }
);

