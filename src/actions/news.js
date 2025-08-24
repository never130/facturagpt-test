
import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const syncNews = createAsyncThunk(
    "news/syncNews",
    async (data, { dispatch }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
        
        const response = await apiBackend.get(`/news/sync`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  );
  