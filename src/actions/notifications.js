import apiBackend, { axiosMonitor } from "@src/apiBackend.js";

import { createAsyncThunk } from "@reduxjs/toolkit";


import { setNotification as _setNotification, setNotificationNotViewed } from "../slices/notificationsSlices";

export const sendNotification = createAsyncThunk(
  "notifications/sendNotification",
  async (data, { dispatch }) => {
    try {
      const res = await axios.post("/api/notifications/send-notification", data);
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
  }
);



export const seenNotification = createAsyncThunk(
    "notifications/seenNotification",
    async ({ idNotification }, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.put(
          `/user/seen-Notification`,
          {
            idNotification
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
  


export const getAllNotifications = createAsyncThunk(
    "user/getAllNotifications",
    async (
      {
        search = "",
        limit = 20,
        skip = 0,
        sortDate,
        sortAlpha,
        sortType
      },
      { rejectWithValue }
    ) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        if(!userJson) {
          logout();
  
          return {
            success: false,
            error: true,
            message: 'User not authenticated'
          }
        }
  
  
        const token = userJson.accessToken;
        const res = await apiBackend.post(
          `/user/getAllNotifications?search=${search}&limit=${limit}&skip=${skip}`,
          { sortDate, sortAlpha, sortType },
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


  export const getAllNotificationsNotViewed = createAsyncThunk(
    "user/getAllNotificationsNotViewed",
    async (
      _,
      { rejectWithValue, dispatch }
    ) => {
      try {
        // const res = await getNotificationsViewed()
        // dispatch(setNotificationNotViewed(res?.data?.docs?.length || 0))
        return {
          success: true,
        };
      } catch (error) {
        console.error("Error fetching user automations:", error);
  
      }
    }
  );



  
export const deleteNotification = createAsyncThunk(
    "user/deleteNotification",
    async ({ notification, type = "all" }, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(
          `/user/deleteNotification`,
          {
            notification,
            type
          },
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





  export const addNotification = createAsyncThunk(
    "user/addNotification",
    async (notification, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(`/user/addNotification`, notification, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return res.data;
      } catch (error) {
        console.error("Error adding notification:", error);
  
      }
    }
  );
  


  export const addSubscription = createAsyncThunk(
    "user/addSubscription",
    async (data, { rejectWithValue, dispatch }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(`/notifications/addSubscription`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        return res.data;
      } catch (error) {
        console.error("Error adding subscription:", error);
  
      }
    }
  );
  




  export const deleteSubscription = createAsyncThunk(
    "user/deleteSubscription",
    async (endpoint, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(`/notifications/delete-subscription`, { endpoint }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return res.data;
  
      } catch (error) {
        console.error("Error deleting subscription:", error);
  
      }
    }
  );




  
export const updateSubscription = createAsyncThunk(
    "user/updateSubscription",
    async (subscription, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const response = await apiBackend.post(`/notifications/update-subscription`,
          subscription, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return response.data;
  
      } catch (error) {
        console.error("Error uploading backup:", error);
        throw error;
      }
    }
  );






  export const deleteResume = createAsyncThunk(
    "user/deleteResume",
    async (_, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(
          `/user/deleteResume`,
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
  
  
  
  
  
  