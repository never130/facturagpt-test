import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const promptAutomate = createAsyncThunk(
  "automate/promptAutomate",
  async ({ prompt }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.post("/automate/promptAutomate",
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        });
      return res.data;
    } catch (error) {
      console.error("Error in importData action:", error);
      return rejectWithValue(error.response?.data || "Failed to import data");
    }
  }
)



export const importData = createAsyncThunk(
  "automate/importData",
  async ({ data }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.post("/automate/importData", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      console.error("Error in importData action:", error);
      return rejectWithValue(error.response?.data || "Failed to import data");
    }
  }
)


export const getStatsPolling = createAsyncThunk(
  "automate/getStatsPolling",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get("/automate/status/polling", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      console.error("Error getting stats polling:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch stats polling");
    }
  }
);

export const createAutomation = createAsyncThunk(
  "automate/createAutomation",
  async ({ userId, email, automationData }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/automate/createAutomation`,
        { userId, email, automationData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating automation:", error);

      if (error.response.status === 501) logout();
    }
  }
);
export const getSelectedAutomationsAction = createAsyncThunk(
  "automate/getSelectedAutomations",
  async ({ ids }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/automate/getSelectedAutomations`,
        { ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error creating automation:", error);

      if (error.response.status === 501) logout();
    }
  }
);

export const getAllUserAutomations = createAsyncThunk(
  "automate/getAllUserAutomations",
  async ({ userId, token }) => {
    try {
      const res = await apiBackend.get(
        `/automate/getAllUserAutomations/${userId}`,
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

export const getAllUserAutomationsWithFilter = createAsyncThunk(
  "automate/getAllUserAutomationsWithFilter",
  async ({
    search = "",
    limit = 20,
    skip = 0,
    sortAlpha,
    statusFilter,
    sortQuantity,
    userId,
  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/automate/getAllUserAutomationsWithFilter/${userId}?search=${search}&limit=${limit}&skip=${skip}`,
        { sortAlpha, statusFilter, sortQuantity },
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

export const updateAutomation = createAsyncThunk(
  "automate/updateAutomation",
  async ({ automationId, toUpdate, userId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        `/automate/updateAutomation/${automationId}`,
        { ...toUpdate, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error updating automation:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);

export const deleteAutomation = createAsyncThunk(
  "automate/deleteAutomation",
  async ({ automationId, userId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(
        `/automate/deleteAutomation/${automationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { userId },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error deleting automation:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);

export const addAuth = createAsyncThunk("automate/addAuth", async (data) => {
  try {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    const res = await apiBackend.post(`/automate/addAuth`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error creating automation:", error?.response);

    if (error.response.data) {
      return [error.response.data];
    }
    if (error.response.status === 501) logout();
    return ["Error on addAuthController"];
  }
});

export const getAuth = createAsyncThunk("automate/getAuth", async (type) => {
  try {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    const res = await apiBackend.get(`/automate/getAuth/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching user automations:", error);

    if (error.response.status === 501) logout();

    throw error;
  }
});

export const deleteAuth = createAsyncThunk(
  "automate/deleteAuth",
  async (authId) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.delete(`/automate/deleteAuth/${authId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error deleting automation:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);



export const getAutomatesByIds = createAsyncThunk(
  "automate/getAutomatesByIds",
  async ({ ids }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;


      const res = await apiBackend.post(
        "/automate/getAutomatesByIds",
        { ids },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

export const getUserAutomatiosByInputSearch = createAsyncThunk(
  "automate/getUserAutomatiosByInputSearch",
  async ({ userId, inputValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const userIdAndInputValue = { userId, inputValue, token };

      const res = await apiBackend.post(
        "/automate/getAllUserAutomations/",
        userIdAndInputValue,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

export const addConnectionAutomationsByGmail = createAsyncThunk(
  "automate/addConnectionAutomationsByGmail",
  async ({ userId, password, email }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const userIdAndInputValue = { userId, password, token, email };

      const res = await apiBackend.post(
        "/emailManager/addConnectionByGmail",
        userIdAndInputValue,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      return data.message;
    } catch (error) {
      console.error("error al obener conexion", error.response.data.message);
      if (error.response.data.message) {
        return error.response.data.message;
      } else {
        return "Error server";
      }
    }
  }
);

export const getWhatssapQr = createAsyncThunk(
  "automate/getWhatssapQr",
  async ({ userId, deviceName }) => {
    const id = userId.split("@")[0];
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/whatsappToken/createWhatsappToken",
        { userId: id, deviceId: deviceName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      return data.qr;
    } catch (error) {
      console.error("error al obener qr", error.response.data.message);
      if (error.response.data.message) {
        return error.response.data.message;
      } else {
        return "Error server";
      }
    }
  }
);

export const getUserDevices = createAsyncThunk(
  "automate/getUserDevices",
  async (userId) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/whatsappToken/user/devices/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error getUserDevices:", error?.response);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on getUserDevices"];
    }
  }
);

export const whatsappFiles = createAsyncThunk(
  "automate/whatsappFiles",
  async ({ id }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/whatsappToken/users/chats",
        { automationId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error whatsappFiles:", error?.response);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on whatsappFiles"];
    }
  }
);

export const createLabelTitleDescription = createAsyncThunk(
  "automate/createLabelTitleDescription",
  async (pormpAndTokenGpt) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/automate/filtergpt",
        pormpAndTokenGpt,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error creating label title description:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);




export const filterImageGpt = createAsyncThunk(
  "automate/filterImageGpt",
  async ({
    file,
  }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const formData = new FormData();

      if (file) {
        formData.append("file", file);
      }

      const res = await apiBackend.post("/automate/filterImageGpt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });


      return res.data;
    } catch (error) {
      console.error("Error in getEmailsByQuery action:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch emails");
    }
  }
);

export const tryConnectionAutomate = createAsyncThunk(
  "automate/tryConnectionAutomate",
  async ({ id }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/automate/tryConnectionAutomate",
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error tryConnectionAutomate:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);

export const importConnectionAttachment = createAsyncThunk(
  "automate/importConnectionAttachment",
  async ({ attachmentId, automationId, emailId, name }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/automate/importConnectionAttachment",
        { attachmentId, automationId, emailId, name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error importConnectionAttachment:", error);

      if (error.response.status === 501) logout();
      throw error;
    }
  }
);


export const outlookIsAuthenticated = createAsyncThunk(
  "automate/outlookIsAuthenticated",
  async () => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get("/automate/outlookIsAuthenticated", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      return res.data;
    } catch (error) {
      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on addAuthOutlookController"];
    }
  }
);

export const outlookEmails = createAsyncThunk(
  "automate/outlookEmails",
  async ({ automationId }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/automate/outlookEmails",
        { automationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error outlookEmails:", error?.response);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on outlookEmails"];
    }
  }
);

export const driveIsAuthenticated = createAsyncThunk(
  "automate/driveIsAuthenticated",
  async () => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get("/automate/driveIsAuthenticated", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("Error driveIsAuthenticated:", error);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on driveIsAuthenticated"];
    }
  }
);

export const driveFiles = createAsyncThunk(
  "automate/driveFiles",
  async ({ id }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/automate/driveFiles",
        { automationId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error driveFiles:", error?.response);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on driveFiles"];
    }
  }
);

export const oneDriveIsAuthenticated = createAsyncThunk(
  "automate/oneDriveIsAuthenticated",
  async () => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get("/automate/oneDriveIsAuthenticated", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      return res.data;
    } catch (error) {
      console.error("Error addAuthOneDriveController.response", error?.response);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on addAuthOneDriveController"];
    }
  }
);

export const oneDriveFiles = createAsyncThunk(
  "automate/oneDriveFiles",
  async ({ id }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        "/automate/oneDriveFiles",
        { automationId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      return res.data;
    } catch (error) {
      console.error("Error oneDriveFiles:", error);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on oneDriveFiles"];
    }
  }
);

export const sendEmailNotify = createAsyncThunk(
  "user/emailNotify",
  async (formData, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {
      const res = await apiBackend.post("/user/emailNotify", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error(
        "Error enviando correo:",
        error.response?.data || error.message
      );

    }
  }
);



export const imageToHtml = createAsyncThunk(
  "automate/imageToHtml",
  async (formData, { rejectWithValue }) => {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    try {
      const res = await apiBackend.post("/automate/imageToHtml", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error(
        "Error enviando correo:",
        error.response?.data || error.message
      );

    }
  }
);



export const getTelematelToken = createAsyncThunk(
  "automate/getTelematelToken",
  async (data) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post("/automate/getTelematelToken", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      return res.data;
    } catch (error) {
      console.error("Error getTelematelToken:", error);

      if (error.response.data) {
        return error.response.data;
      }
      if (error.response.status === 501) logout();
      return ["Error on getTelematelToken"];
    }
  }
);

export const telematelIsAuthenticated = createAsyncThunk(
  "automate/telematelIsAuthenticated",
  async () => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get("/automate/telematelIsAuthenticated", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      return res.data;
    } catch (error) {
      console.error("Error telematelIsAuthenticated:", error);

      if (error.response.data) {
        return [error.response.data];
      }
      if (error.response.status === 501) logout();
      return ["Error on telematelIsAuthenticated"];
    }
  }
);

export const telematelFiles = createAsyncThunk("automate/telematelFiles", async ({ ids }) => {
  try {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    const res = await apiBackend.post("/automate/telematelFiles", { automationIds: ids }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    return res.data;
  } catch (error) {
    console.error("Error telematelFiles:", error);

    if (error.response.data) {
      return [error.response.data];
    }
    if (error.response.status === 501) logout();
    return ["Error on telematelFiles"];
  }
});


export const scrapApi = 
createAsyncThunk("automate/scrapApi", async (data, { rejectWithValue }) => {
  try {
    const user = localStorage.getItem("user");
    const userJson = JSON.parse(user);
    const token = userJson.accessToken;

    const res = await apiBackend.post("/automate/api/scrap", 
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });


    return res.data;
  } catch (error) {
    console.error("Error telematelFiles:", error);

    if (error.response.data) {
      return [error.response.data];
    }
    if (error.response.status === 501) logout();
    return ["Error on telematelFiles"];
  }
});
