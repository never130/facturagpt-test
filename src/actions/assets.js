import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllAssets = createAsyncThunk(
    "assets/getAllAssets",
    async ({ search = "", limit = 20, skip = 0,sortAlpha, statusFilter, sortQuantity,sortDate,dateOrder }, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(
          `/assets/getAllAssets?search=${search}&limit=${limit}&skip=${skip}`,
          { sortAlpha,statusFilter,sortQuantity,sortDate,dateOrder},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        return res.data; 
        
      } catch (error) {
        console.error("Error deleting docs:", error);
  
        if (error.response.status === 501) logout()
  

      }
    }
  );

  export const getAsset = createAsyncThunk(
    "assets/getAsset",
    async ({ id}, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(
          `/assets/getAsset`,
          { assetId:id},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
  
        return res.data; 
      } catch (error) {
        console.error("Error action get asset:", error);
  
        if (error.response.status === 501) logout()
  

      }
    }
  );
  
  

 export const updateAsset = createAsyncThunk(
    "assets/updateAsset",
    async ({ id, assetData }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;

        const res = await apiBackend.put(
          `/assets/updateAsset/${id}`,
          { assetData },
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
  

 export const setDocIdInAsset = createAsyncThunk(
    "assets/setDocIdInAsset",
    async ({ id, docId }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;

        const res = await apiBackend.put(
          `/assets/setDocIdInAsset/${id}`,
          { docId },
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


  export const createAsset = createAsyncThunk(
    "assets/createAsset",
    async ({ assetData }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;

        const res = await apiBackend.post(
          `/assets/createAsset`,
          { assetData },
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
  export const getAssetsByTags = createAsyncThunk(
    "assets/getAssetsByTags",
    async ({ tags }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;

        const res = await apiBackend.post(
          `/assets/getAssetsByTags`,
          { tags },
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




  
 export const deleteAssets = createAsyncThunk(
  "assets/deleteAsset",
  async ({ clientSelected }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(
        `/assets/deleteAsset`,
        {  
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data:{clientSelected}
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
  
 export const deleteAllAssets = createAsyncThunk(
  "assets/deleteAllAssets",
  async ({  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(
        `/assets/deleteAllAssets`,
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


export const getAssetsStatusViewed = createAsyncThunk(
  "/getAssetsStatusViewed/assets",
  async ({}) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.get(
        `/assets/get-assets-status-viewed`,

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
export const markAssetAsSeen = createAsyncThunk(
  "/markAssetAsSeen/assets",
  async ({id}) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.get(
        `/assets/mark-asset-as-seen/${id}`,

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