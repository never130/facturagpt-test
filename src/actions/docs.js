import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const addDoc = createAsyncThunk(
  "docs/addDoc",
  async ({ doc, files }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const formData = new FormData();
      formData.append("doc", JSON.stringify(doc));

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const res = await apiBackend.post("/docs/addDocs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error saving docs:", error);

      if (error.response?.status === 501) logout();

    }
  }
);

export const updateContactId = createAsyncThunk(
  "docs/updateContactId",
  async ({ docId, contactId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        "/docs/updateContactId",
        { docId, contactId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error saving docs:", error);

      if (error.response.status === 501) logout()


    }
  }
);
export const updateDoc = createAsyncThunk(
  "docs/updateDoc",
  async ({ docId, updates }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        "/docs/updateDoc",
        { docId, updates },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error saving docs:", error);

      if (error.response.status === 501) logout()


    }
  }
);

export const getAllDocsByContact = createAsyncThunk(
  "docs/allDocsByContact",
  async ({ contactId, search = "", limit = 20, skip = 0, sortAlpha, statusFilter, sortQuantity, sortDate, dateOrder }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/docs/alldocsByContact?search=${search}&limit=${limit}&skip=${skip}`,
        { contactId, sortAlpha, statusFilter, sortQuantity, sortDate, dateOrder },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error saving docs:", error);

      if (error.response.status === 501) logout()

    }
  }
);

export const deleteDocs = createAsyncThunk(
  "docs/deleteDocs",
  async ({ docsIds }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/docs/deleteDocs",
        { docsIds },
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


export const getOneDocsById = createAsyncThunk(
  "docs/getOneDocs",
  async ({ docId }, { rejectWithValue }) => {

    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/docs/getOneDocs/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error('error dbd', error)
      if (error.response.status === 501) logout()
    }
  }
);


export const deleteAssetFromDocs = createAsyncThunk(
  "docs/deleteAssetFromDocs",
  async ({ docId, productRef }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/docs/deleteProductFromDocs",
        { docId, productRef },
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



export const saveQRConfigToDb = createAsyncThunk(
  'docs/saveQRConfig',
  async ({ config }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.accessToken;

      const res = await apiBackend.put(
        '/qrCode/saveConfig',
        { config },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error('Error saving QR config:', error);

    }
  }
);

export const saveSelectedQRConfigToDoc = createAsyncThunk(
  "docs/saveSelectedQRConfig",
  async ({ docId, config }, { rejectWithValue }) => {

    if (!docId) {
      return rejectWithValue("Document ID is required");
    }

    if (!config) {
      return rejectWithValue("QR configuration is required");
    }

    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        "/docs/updateDoc",
        {
          docId,
          updates: {
            qrConfig: config,
            updatedAt: new Date().toISOString()
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error saving selected QR config:", error);

    }
  }
);



export const fetchQRConfigurations = createAsyncThunk(
  "docs/fetchQRConfigurations",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        "/qrCode/getAllConfigs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.configurations || [];
    } catch (error) {
      console.error("Error fetching QR configurations:", error);

    }
  }
);



export const getDocsBGColor = createAsyncThunk(
  "docs/getDocsBGColor",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        "/docs/getDocsBGColor",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data || [];
    } catch (error) {
      console.error("Error fetching QR configurations:", error);

    }
  }
);


export const updateDocBGColorAction = createAsyncThunk(
  "app/updateDocBGColor",
  async ({ bgColor, etag }, { getState, rejectWithValue }) => {
    try {

      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.put(`/docs/updateDocBGColor`, {
      bgColor,etag
      }, {
        headers: { Authorization: `Bearer ${token}` },
      }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



export const saveAppFiles = createAsyncThunk(
  "app/saveAppFiles",
  async ({ files, appId }, { getState, rejectWithValue }) => {
    try {

      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post('/docs/saveApp', {
        appId: appId,
        files: files,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      }
      );

      return response.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllAppFiles = createAsyncThunk(
  "app/getAllAppFiles",
  async (_, { getState, rejectWithValue }) => {
    try {
      const conf = withConf(getState());
      const response = await axios.post(BASE_URL, {
        type: "getAll",
        prompt: {},
        conf,
      });
      return response.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createAppFile = createAsyncThunk(
  "app/createAppFile",
  async ({ path, content }, { getState, rejectWithValue }) => {
    try {
      const conf = withConf(getState());
      const response = await axios.post(BASE_URL, {
        type: "createFile",
        prompt: { path, content },
        conf,
      });
      return response.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const editAppFile = createAsyncThunk(
  "app/editAppFile",
  async ({ path, content }, { getState, rejectWithValue }) => {
    try {
      const conf = withConf(getState());
      const response = await axios.post(BASE_URL, {
        type: "editFile",
        prompt: { path, content },
        conf,
      });
      return response.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteAppFile = createAsyncThunk(
  "app/deleteAppFile",
  async ({ path }, { getState, rejectWithValue }) => {
    try {
      const conf = withConf(getState());
      const response = await axios.post(BASE_URL, {
        type: "deleteFile",
        prompt: { path },
        conf,
      });
      return response.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const renameAppFile = createAsyncThunk(
  "app/renameAppFile",
  async ({ oldPath, newPath }, { getState, rejectWithValue }) => {
    try {
      const conf = withConf(getState());
      const response = await axios.post(BASE_URL, {
        type: "renameFile",
        prompt: { oldPath, newPath },
        conf,
      });
      return response.data.files;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);