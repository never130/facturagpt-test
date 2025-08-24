import apiBackend, { axiosMonitor } from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// import { getNotificationsViewed } from "../utils/notification";


export const getBackup = createAsyncThunk(
  "user/getBackup",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiBackend.get(`/user/db/backup`);
      return response.data;

    } catch (error) {
      console.error("Error getting backup:", error);
      throw error;
    }
  }
);

export const uploadBackup = createAsyncThunk(
  "user/uploadBackup",
  async (fileContent, { rejectWithValue }) => {
    try {
      const response = await apiBackend.post(`/user/uploadBackup`, {
        file: fileContent
      });
      return response.data;

    } catch (error) {
      console.error("Error uploading backup:", error);
      throw error;
    }
  }
);

export const processBackupImport = createAsyncThunk(
  "user/processBackupImport",
  async (backupData, { rejectWithValue }) => {
    try {
      const response = await apiBackend.post(`/user/processBackupImport`, {
        backupData
      });
      return response.data;

    } catch (error) {
      console.error("Error processing backup import:", error);
      throw error;
    }
  }
);

export const setNotification = createAsyncThunk(
  "user/setNotification",
  async (data, { dispatch }) => {
    try {

      console.log('data', data)

      dispatch(_setNotification(data));
    } catch (error) {
      console.error(error, 'Error setting notification');
      throw error;
    }
  }
);

export const sendEmail = createAsyncThunk(
  "user/sendEmail",
  async ({ email, data, template }, { dispatch }) => {
    try {

      const resp = await apiBackend.post(
        `/user/send-email`,
        { email, data, template },
        {
          headers: {
          },
        }
      );

      return resp.data;
    } catch (error) {
      throw error;
    }
  }
);

export const createAccount = createAsyncThunk(
  "user/createAccount",
  async (clientData) => {
    try {

      const res = await apiBackend.post(
        `/user/createAccount`,
        { ...clientData },
        {
          headers: {
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }
);

export const loginToManager = createAsyncThunk(
  "user/loginToManager",
  async ({ email, password, accessToken }) => {
    try {
      const res = await apiBackend.post(
        `/user/loginToManager`,
        { email, password, accessToken },
        {
          headers: {
          },
        }
      );
      return res.data;
    } catch (error) {
      if (error.response.status === 502) {
        try {
          const res = await axiosMonitor.get(`/`)
          return 'Please log in again in a few minutes';
        } catch (error) {
          console.error('error monitor', error);
        }
      } else if (error.response.status === 401) {
        logout();
        return error.response.data;
      } else if (error.response.status === 402) {
        return error.response.data;
      } else if (error.response.status === 403) {
        return error.response.data;
      }
      return 'Backend is not working, please try again later';
    }
  }
);
export const validateSecondFactorAuth = createAsyncThunk(
  "user/validateSecondFactorAuth",
  async ({ email, password, accessToken }) => {
    try {
      const res = await apiBackend.post(
        `/user/validateSecondFactorAuth`,
        { email, password, accessToken },
        {
          headers: {
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error during login:", error.response.data);
      return error.response.data;
    }
  }
);

export const getAllAccounts = createAsyncThunk(
  "user/getAllAccounts",
  async ({
    search = "",
    limit = 20,
    skip = 0,
    sortAlpha,
    sortStatusLastInvoice,
    sortTokenPaid,
    lastSelectedOption
  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/getAllAccounts?search=${search}&limit=${limit}&skip=${skip}`,
        {
          sortAlpha,
          sortStatusLastInvoice,
          sortTokenPaid,
          lastSelectedOption
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw new Error("Failed to fetch accounts");
    }
  }
);
export const getImageAccunt = createAsyncThunk(
  "user/getImageAccounts",
  async ({
    id
  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.post(
        `/user/getImageAccount/${id}/avatar`,
        {

        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw new Error("Failed to fetch accounts");
    }
  }
);


export const updateAccount = createAsyncThunk(
  "user/updateAccount",
  async ({
    data
  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.put(
        `/user/updateAccount`,
        {
          data
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating account:", error);
      if (error.response.status === 501) logout();

      throw new Error("Failed to update account");
    }
  }
);
export const selectedWorkspaceUserId = createAsyncThunk(
  "user/selectedWorkspace",
  async ({
    workspaceId
  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.put(
        `/user/selectedWorkspace`,
        {
          workspaceId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating account:", error);
      if (error.response.status === 501) logout();

      throw new Error("Failed to update account");
    }
  }
);

export const updateTokens = createAsyncThunk(
  "user/updateTokens",
  async ({
    data, id
  }) => {
    try {

      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;
      const res = await apiBackend.put(
        `/user/updateTokens`,
        {
          data, id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating account:", error);
      if (error.response.status === 501) logout();

      throw new Error("Failed to update account");
    }
  }
);

export const getTokens = createAsyncThunk(
  "user/getTokens",
  async ({ id }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/getTokens?`,
        { id },
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

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async ({ id }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/deleteAccount`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error updating account:", error);

      if (error.response.status === 501) logout();

      throw new Error("Failed to update account");
    }
  }
);
export const deleteBillingDetail = createAsyncThunk(
  "user/deleteBillingDetail",
  async ({ email, billingDetailId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(
        `/user/deleteBillingDetail/${email}/${billingDetailId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error updating account:", error);

      if (error.response.status === 501) logout();

      throw new Error("Failed to update account");
    }
  }
);

export const updateAccountPassword = createAsyncThunk(
  "user/updateAccountPassword",
  async ({ email, newPassword }) => {
    try {
      const res = await apiBackend.post(`/user/updateAccountPassword`, {
        email,
        newPassword,
      });
      return res.data;
    } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error("Failed to update user password");
    }
  }
);

export const sendOTP = createAsyncThunk(
  "user/send-otp",
  async ({ nombre, email, language }, { rejectWithValue }) => {
    try {
      console.log('ei4urhji')
      const res = await apiBackend.post(`/user/send-otp`, {
        nombre,
        email,
        language,
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error sending OTP:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to send OTP");
    }
  }
);
export const send2FACode = createAsyncThunk(
  "user/send-code",
  async ({ nombre, email, language, code }, { rejectWithValue }) => {
    try {
      const res = await apiBackend.post(`/user/send-code`, {
        nombre,
        email,
        language,
        code
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error sending 2Fa code:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to send 2Fa code");
    }
  }
);
export const testEmails = createAsyncThunk(
  "user/testEmails",
  async ({ nombre, email, language, type }, { rejectWithValue }) => {
    try {
      const res = await apiBackend.post(`/user/testEmails`, {
        nombre,
        email,
        language,
        type
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error sending 2Fa code:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to send 2Fa code");
    }
  }
);


export const logicalDeletedAccount = createAsyncThunk(
  "user/logical-deleted-account",
  async ({ id }) => {
    try {
      const res = await apiBackend.put(
        `/user/logical-deleted-account`,
        { id },
        {
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error updating account:", error);

      if (error.response.status === 501) logout();

      throw new Error("Failed to update account");
    }
  }
);
export const getTotalContactsAssetsDocuments = createAsyncThunk(
  "user/get-total-contactsAssetsDocuments",
  async ({ type }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/get-total-contactsAssetsDocuments`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error updating account:", error);

      if (error.response.status === 501) logout();

      throw new Error("Failed to update account");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "user/verify-otp",
  async ({ nombre, email, otp }, { rejectWithValue }) => {
    try {
      const res = await apiBackend.post(`/user/verify-otp`, {
        nombre,
        email,
        otp,
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error verifying OTP:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to verify OTP");
    }
  }
);

export const sendRecoveryCode = createAsyncThunk(
  "user/send-recovery-code",
  async ({ email, language, name }, { rejectWithValue }) => {
    try {

      const res = await apiBackend.post(`/user/send-recovery-code`, {
        email,
        language,
        name,
      }, {
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error sending recovery code:",
        error.response?.data || error.message
      );

    }
  }
);

export const verifyRecoveryCode = createAsyncThunk(
  "user/verify-recovery-code",
  async ({ email, recoveryCode }, { rejectWithValue }) => {
    try {
      const res = await apiBackend.post(`/user/verify-recovery-code`, {
        email,
        recoveryCode,
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error verifying recovery code:",
        error.response?.data || error.message
      );

    }
  }
);

export const sendEmailNewsletter = createAsyncThunk(
  "user/newsletter",
  async ({ name, email, message }, { rejectWithValue }) => {
    try {
      const res = await apiBackend.post(`/user/newsletter`, {
        name,
        email,
        message,
      });
      return res.data;
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response?.data || error.message
      );

      return rejectWithValue(error.response?.data || "Failed to send email");
    }
  }
);

export const logout = async (_) => {
  try {
    return { success: true };

    localStorage.removeItem("user");
    localStorage.removeItem("lastPath");
    localStorage.removeItem("token");

    window.location.href = "/login";
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
  }
};











export const finishTutorial = createAsyncThunk(
  "user/finishTutorial",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        `/user/finishTutorial`,
        _,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error deleting notification:", error);

    }
  }
);

export const getResumeAccount = createAsyncThunk(
  "user/getResumeAccount",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/resume/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error getting resume account:", error);
    }
  }
);

export const createVariable = createAsyncThunk(
  "variables/createVariable",
  async ({ variableData }) => {
    // console.log("entra en el createVariable")
    // console.log("variableData", variableData)
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/create-variable`,
        { variableData },
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

export const getVariable = createAsyncThunk(
  "variables/getVariable",
  async ({ type,search }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(`/user/get-variable/${type}`,
        {search},
         {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating client:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);

export const updateSelectedVariable = createAsyncThunk(
  "variables/update-selectedVariable",
  async ({ variableId, selected }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        `/user/update-selectedVariable/${variableId}`,
        { selected },
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

export const deleteVariable = createAsyncThunk(
  "variables/delete-variable",
  async ({ variableId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(
        `/user/delete-variable/${variableId}`,
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



export const addRandom = createAsyncThunk(
  "user/addRandom",
  async ({ count }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/addRandom`,
        { count },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error adding notification:", error);

    }
  }
);

export const deleteRandom = createAsyncThunk(
  "user/deleteRandom",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/addRandom`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error adding notification:", error);

    }
  }
);

export const updateSecondFactorAuth = createAsyncThunk(
  "user/setFactorAuth",
  async ({ id, secondFactorAuth }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        `/user/setFactorAuth`,
        {
          id, secondFactorAuth
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error setting Factor Auth:", error);
 
    }
  }
);








export const upgradeNote = createAsyncThunk(
  "user/upgradeNote",
  async (data, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/user/upgradeNote`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error deleting notification:", error);

    }
  }
);

export const getUpgradeNotes = createAsyncThunk(
  "user/getUpgradeNotes",
  async ({lan, category, search }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.get(`/user/getUpgradeNotes`, {
        params: {
          lan: lan,
          category: category,
          search: search,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;

    } catch (error) {
      console.error("Error getting backup:", error);
      throw error;
    }
  }
);


export const deleteCategoryNote = createAsyncThunk(
  "user/deleteCategoryNote",
  async ({ id, lan }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/deleteCategoryNote`, {
        id,
        lan
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error deleting notification:", error);

    }
  }
);

export const deleteUpgradeNote = createAsyncThunk(
  "user/deleteUpgradeNote",
  async ({ id, lan }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/deleteUpgradeNote`, {
        id,
        lan
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;

    } catch (error) {
      console.error("Error deleting notification:", error);
 
    }
  }
);

export const getAllInvoices = createAsyncThunk(
  "user/get-all-invoices",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.get(`/user/get-all-invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);
export const getAllInvoicesById = createAsyncThunk(
  "user/get-all-invoices-by-id/:id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.get(`/user/get-all-invoices-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);
export const getInvoicePdf = createAsyncThunk(
  "user/get-invoice-pdf",
  async ({ invoiceId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.get(`/user/get-invoice-pdf/${invoiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
   
    }
  }
);

export const exportTable = createAsyncThunk(
  "user/export-table",
  async (table, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/export-table`, {
        id: table.tableId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      // Si el backend devuelve base64, disparamos descarga inmediata
      if (data?.success && data?.format === 'xlsx-base64' && data?.base64) {
        try {
          const byteCharacters = atob(data.base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: data.mimeType || 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = data.fileName || `${table.name || 'tabla'}.json`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } catch (e) {
          console.error('Error al descargar el archivo exportado:', e);
        }
      }

      return data;

    } catch (error) {
      console.error("Error reorderedTable:", error);

    }
  }
);

export const reorderedTable = createAsyncThunk(
  "user/create-table",
  async (table, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/reordered-table`, {
       table
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error reorderedTable:", error);

    }
  }
);
export const createTable = createAsyncThunk(
  "user/create-table",
  async ({ headers, name, type, color, selectedTags, userEmail, activateAlerts, accessPermitType, selectedColumnOption, tags }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/create-table`, {
        headers, name, type, color, selectedTags, userEmail, activateAlerts, accessPermitType, selectedColumnOption, tags
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);
export const createTableData = createAsyncThunk(
  "user/create-table-data",
  async ({ tableId, headers, data, type }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/create-table-data`, {
        tableId, headers, data, type
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
    }
  }
);

export const updateTableData = createAsyncThunk(
  "user/update-table-data",
  async ({ tableId, data }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.put(`/user/update-table-data`, {
        tableId, data
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
    }
  }
);


export const createTableWithInitialData = createAsyncThunk(
  "user/create-table-with-initial-data",
  async ({ headers, name, type, initialData }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/create-table-with-initial-data`, {
        headers, name, type, initialData
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
    }
  }
);
export const updateTableName = createAsyncThunk(
  "user/update-table-name",
  async ({ tableId, newName }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.put(`/user/update-table-name`, {
        tableId, newName
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);

export const deleteRowTable = createAsyncThunk(
  "user/delete-row-table",
  async ({ tableId, rowId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.put(`/user/delete-row-table`, {
        tableId, rowId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);
export const getTables = createAsyncThunk(
  "user/get-tables",
  async (params = {}, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const requestParams = {};
      if (params.search) {
        console.log('entra en el if de search', params.search)
        requestParams.search = params.search;
      }

      const response = await apiBackend.get(`/user/get-tables`, {
        params: requestParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
      if (error.response?.status === 501 || error.response?.status === 502) logout();
    }
  }
);
export const getTableById = createAsyncThunk(
  "user/get-table-by-id/:tableId",
  async ({ tableId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.get(`/user/get-table-by-id/${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);
export const getTablesWithCounts = createAsyncThunk(
  "user/get-tables-with-counts",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.get(`/user/get-tables-with-counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);


export const getTableData = createAsyncThunk(
  "user/get-table-data",
  async (tableId, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.accessToken;

      const response = await apiBackend.get(`/user/get-table-data/${tableId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        tableId,
        data: response.data.rows
      };
    } catch (error) {
    }
  }
);

export const getTableDataById = createAsyncThunk(
  "user/get-table-data",
  async ({tableId, rowId}, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.accessToken;

      const response = await apiBackend.get(`/user/get-table-data/${tableId}/${rowId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return {
        tableId,
        data: response.data.rows 
      };
    } catch (error) {
    }
  }
);


export const getTableDataFiltered = createAsyncThunk(
  "user/get-table-data-filtered",
  async ({tableId, search = "", limit = 20, skip = 0, sortAlpha, statusFilter, sortQuantity, sortDate, dateOrder} , { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.accessToken;
      const response = await apiBackend.post(`/user/get-table-data-filtered?search=${search}&limit=${limit}&skip=${skip}`, 
        { sortAlpha,statusFilter,sortQuantity,sortDate,dateOrder,tableId}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return {
        tableId,
        total: response.data.total,
        data: response.data.row 
      };
    } catch (error) {
       return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTableType = createAsyncThunk(
  "user/update-table-type",
  async ({ tableId, type, newHeaders, color, accessPermitType, tags, selectedTags, name, category }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/update-table-type`, {
        tableId, type, newHeaders, color, accessPermitType, tags, selectedTags, name, category
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
  
    }
  }
);

export const refreshTableInfo = createAsyncThunk(
  "user/refresh-table-info",
  async ({ tableId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/refresh-table-info`, {
        tableId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);
export const deleteTable = createAsyncThunk(
  "user/delete-table",
  async ({ tableId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/delete-table`, {
        tableId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);

export const deleteAllTables = createAsyncThunk(
  "user/delete-all-tables",
  async ({}, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.post(`/user/delete-all-tables`,
        {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);
export const getLastPayment = createAsyncThunk(
  "user/get-lastPayment",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.get(`/user/get-lastPayment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);

    }
  }
);

export const updateVariableTableData = createAsyncThunk(
  "user/update-variable-table-data",
  async ({ tableId, mainId, data }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.put(`/user/update-variable-table-data`, {
        tableId, mainId, data
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
    }
  }
);

export const createVariableTableData = createAsyncThunk(
  "user/create-variable-table-data",
  async ({ tableId,mainId, parameter }, { rejectWithValue }) => {
    try {
      console.log('entra en la funcion createVariableTableData')
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const response = await apiBackend.put(`/user/create-variable-table-data`, {
        tableId, mainId, parameter
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;

    } catch (error) {
      console.error("Error getAllInvoices:", error);
    }
  }
);

export const saveSearchHistory = createAsyncThunk(
  "user/saveSearchHistory",
  async (data, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;    

      const response = await apiBackend.post(
        `/user/saveSearchHistory`,
        {
          data, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al guardar el historial:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const SearchHistoryInput = createAsyncThunk(
  "user/SearchHistoryInput",
  async (_, { rejectWithValue }) => {
    try {
         const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const response = await apiBackend.get(`/user/SearchHistoryInput`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error al cargar el historial de búsqueda:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const deleteVariableTableData = createAsyncThunk(
  "user/delete-variable-table-data",
  async ({ tableId, mainId, data }, { rejectWithValue }) => {
    try {
      console.log('entra en la funcion deleteVariableTableData')
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

    await apiBackend.put(`/user/delete-variable-table-data`, {
        tableId, mainId, data
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    

    } catch (error) {
      console.error("Error getAllInvoices:", error);
    }
  }
);