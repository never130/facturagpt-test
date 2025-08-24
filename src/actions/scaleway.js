import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./user.js";

export const checkOrCreateUserBucket = createAsyncThunk(
  "scaleway/checkOrCreateUserBucket",
  async ({ userId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/scaleway/check-user-bucket/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error checking or creating user bucket:", error);
    }
  }
);

export const getUserFiles = createAsyncThunk(
  "scaleway/getUserFiles",
  async ({ userId,token,filters,currentPath }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);

      const res = await apiBackend.post(`/scaleway/get-user-files/${userId}`,{
        filters,currentPath
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error getting user files:", error);
      if (error.response?.status === 501 || error.response?.status === 502) logout();
    }
  }
);

export const uploadFiles = createAsyncThunk(
  "scaleway/uploadFiles",
  async ({ files, currentPath }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("path", currentPath);

      const response = await apiBackend.post(
        "/scaleway/upload-files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const createFolder = createAsyncThunk(
  "scaleway/createFolder",
  async ({ folderPath }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/scaleway/create-folder",
        { folderPath },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const changeLocation = createAsyncThunk(
  "scaleway/changelocationobject",
  async ({ oldKey, newKey }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        "/scaleway/change-location-object",
        { oldKey, newKey },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateNameFolderS3 = createAsyncThunk(
  "scaleway/updatenamefile",
  async ({ userId,oldFolder, newFolder}, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.put(
        `/scaleway/update-name-folder/${userId}`,
        { oldFolder, newFolder},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const updateNameFileS3 = createAsyncThunk(
  "scaleway/updatenamefile",
  async ({ newName, path, oldKey  }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.put(
        "/scaleway/update-name-file",
        { newName, path, oldKey  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const moveObject = createAsyncThunk(
  "scaleway/moveObject",
  async ({ sourceKey, destinationKey, isFolder }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/scaleway/move-object",
        { sourceKey, destinationKey, isFolder },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error moving object:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const emptyFolder = createAsyncThunk(
  "scaleway/emptyFolder",
  async ({ key }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/scaleway/empty-folder",
        { key },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting object:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteObject = createAsyncThunk(
  "scaleway/deleteObject",
  async ({ key, isFolder }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/scaleway/empty-folder",
        { key, isFolder },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting object:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const duplicateFolderFiles = createAsyncThunk(
  "scaleway/duplicateFolderFiles",
  async ({userId,sourceFolder, destinationFolder, files,newText }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.post(
        `/scaleway/duplicate-folder-files/${userId}`,
        {sourceFolder, destinationFolder, files,newText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting object:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const duplicateFiles = createAsyncThunk(
  "scaleway/duplicateFiles",
  async ({sourceKey,location,docId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.post(
        `/scaleway/duplicate-file`,
        {sourceKey,location,docId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting object:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
