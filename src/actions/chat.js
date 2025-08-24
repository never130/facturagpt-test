import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./user.js";

export const fetchByMenu = createAsyncThunk(
  "chat/fetchByMenu",
  async ({ query = "" }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/chat/list?search=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      if (error.response?.status === 501 || error.response?.status === 502) logout();

      console.error("Error fetching chats:", error);

    }
  }
);

export const fetchByChat = createAsyncThunk(
  "chat/fetchByChat",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(`/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);

      if (error.response?.status === 501 || error.response?.status === 502) logout();
    }
  }
);
export const getChatAgents = createAsyncThunk(
  "chat/getChatAgents",
  async ({ agentName, type }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/chat/${agentName}/agentChat/messages/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error fetching chat messages:", error);

      if (error.response?.status === 501 || error.response?.status === 502) logout();


    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(`/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      console.error("Error deleting chat:", error);

      if (error.response?.status === 501 || error.response?.status === 502) logout();

    }
  }
);

export const emptyChat = createAsyncThunk(
  "chat/emptyChat",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      if (!token) {
      console.error("Token no disponible, evitando la petición");
      return rejectWithValue("Token no disponible");
    }

      const res = await apiBackend.delete(`/chat/empty/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      console.error("Error deleting chat:", error);

      if (error.response?.status === 501 || error.response?.status === 502) logout();

    }
  }
);

export const restartLastMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/chat/${chatId}/restart-messages`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data


    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response?.status === 501 || error.response?.status === 502) logout();

    }
  }
);

export const searchInWebAction = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/chat/${chatId}/search-in-web`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data


    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response?.status === 501 || error.response?.status === 502) logout();


    }
  }
);

export const validateTokenGPT = createAsyncThunk(
  "chat/validateTokenGPT",
  async (id, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/chat/validate-token`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return {
        ...res.data,
      };
    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response?.status === 501 || error.response?.status === 502) logout();

    }
  }
);

export const createAgent = createAsyncThunk(
  "/chat/createAgent",
  async ({ userData }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;
    try {
      const res = await apiBackend.post(
        `/chat/create-agent`,
        { agent: userData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(
        "Error Creating Agent:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to create Agent");
    }
  }
);


export const getPublicAgents = createAsyncThunk(
  "/chat/getPublicAgents",
  async ({ searchTerm, workspaceId }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;
    try {
      const res = await apiBackend.post(`/chat/get-public-agents`, {
        searchTerm,
        workspaceId
      }, {
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

export const updateAgent = createAsyncThunk(
  "/chat/updateAgent",
  async ({ agentId, agentData }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    if (!token) {
      console.error("Token no disponible, evitando la petición");
      return rejectWithValue("Token no disponible");
    }

    try {
      const res = await apiBackend.put(
        `/chat/update-agent/${agentId}`,
        { agent: agentData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error en la petición PUT:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);


export const updateLikePinMessage = createAsyncThunk(
  "/chat/updateLikePinMessage",
  async ({ chatId, timestamp, field }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    if (!token) {
      console.error("Token no disponible, evitando la petición");
      return rejectWithValue("Token no disponible");
    }

    try {
      const res = await apiBackend.put(
        `/chat/${chatId}/messages/pin-like`,
        { timestamp, field },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error en la petición PUT:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);


export const deleteMessage = createAsyncThunk(
  "/chat/deleteMessage",
  async ({ chatId, timestamp }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    if (!token) {
      console.error("Token no disponible, evitando la petición");
      return rejectWithValue("Token no disponible");
    }

    try {
      const res = await apiBackend.put(
        `/chat/${chatId}/messages/delete`,
        { timestamp },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error en la petición PUT:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);

export const getAgentById = createAsyncThunk(
  "chat/searchAgent",
  async ({ idSelectedAgent }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      if (idSelectedAgent === "undefined") {
        return 404
      }

      const res = await apiBackend.get(
        `/chat/search-agent/${idSelectedAgent}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error fetching user automations:", error);
      if (error.response?.status === 501 || error.response?.status === 502) logout();
      throw error;
    }
  }
);

export const deleteAgent = createAsyncThunk(
  "/chat/deleteAgent",
  async ({ agentId, agentName }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    if (!token) {
      console.error("Token no disponible, evitando la petición");
      return rejectWithValue("Token no disponible");
    }

    try {
      const res = await apiBackend.post(`/chat/delete-agent/${agentId}`,
        { agentName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

      return res.data;
    } catch (error) {
      console.error("Error en la petición PUT:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);

export const deleteChatAgent = createAsyncThunk(
  "/chat/deleteChatAgent",
  async ({ name }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {
      const res = await apiBackend.delete(`/chat/delete-chat-agent/${name}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error en la petición:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);

export const deleteAllChatsAgent = createAsyncThunk(
  "/chat/deleteChatAgent",
  async ({ type }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {

      const res = await apiBackend.delete(`/chat/delete-all-chats-agents/${type}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error en la petición:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);

export const getImagesAgents = createAsyncThunk(
  "/chat/getImagesAgents",
  async ({ agentIds }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {

      const res = await apiBackend.post(`/chat/get-images-agents`,
        { agentIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

      return res.data;
    } catch (error) {
      console.error("Error en la petición:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);

export const getAllAgentsWithCreator = createAsyncThunk(
  "/chat/get-public-agents-with-creator",
  async ({ search }, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {

      const res = await apiBackend.post(`/chat/get-public-agents-with-creator`,
        { search },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

      return res.data;
    } catch (error) {
      console.error("Error en la petición:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);



export const templateSave = createAsyncThunk(
  "/chat/templateSave",
  async ({ template }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(`/chat/template-save`,
        { template },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

    } catch (error) {
      console.error("Error en la petición:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to update agent");
    }
  }
);