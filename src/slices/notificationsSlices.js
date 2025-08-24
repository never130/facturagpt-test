  
import { createSlice } from "@reduxjs/toolkit";
import { 
  deleteNotification, 
  getAllNotifications, 
  seenNotification 
} from "../actions/notifications";
const countUnseen = (notifications) => {
  let count = 0;
  for (const n of notifications) {
    if (!n.seen) {
      count++;
      if (count >= 100) return 100; 
    }
  }
  return count;
};


const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    totalNotifications: 0,
    unseenCount: 0,
    loading: false,
    error: null,

    showNotification: {},
    countNotificationNoViewed: 0,
    totalNotification: 0,
  },
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.totalNotifications = 0;
    },
    setNotification: (state, action) => {
      state.showNotification = action.payload;
    },
    setNotificationNotViewed: (state, action) => {
      state.countNotificationNoViewed = action.payload;
    },
    setTotalNotification: (state, action) => {
      state.totalNotification = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload.notification;
        state.totalNotifications = action.payload.total;
        state.unseenCount = action.payload.unseenCount;
        state.loading = false;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load notifications";
    
      })    

      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedIds = action.payload.deleted.map((item) => item.id);
      
        const unseenDeletedCount = state.notifications.filter(
          (noti) => deletedIds.includes(noti._id) && !noti.seen
        ).length;
      
        const remainingNotifications = state.notifications.filter(
          (noti) => !deletedIds.includes(noti._id)
        );
      
        state.notifications = remainingNotifications;
        state.unseenCount = Math.max(0, state.unseenCount - unseenDeletedCount);
        state.totalNotifications = Math.max(
          0,
          state.totalNotifications - deletedIds.length
        );
      })
      

      .addCase(seenNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seenNotification.fulfilled, (state, action) => {
        const updated = action.payload.notification;
        const prevNotification = state.notifications.find(n => n._id === updated._id);
        
        state.notifications = state.notifications.map((noti) =>
          noti._id === updated._id ? updated : noti
        );
        
        if (prevNotification && !prevNotification.seen && updated.seen) {
          state.unseenCount = Math.max(0, state.unseenCount - 1);
        } else if (prevNotification && prevNotification.seen && !updated.seen) {
          state.unseenCount = Math.min(100, state.unseenCount + 1);
        }
        
        state.loading = false;
      })
      .addCase(seenNotification.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || "Failed to update notification status";
      });
  },
});

export const { 
  setNotificationNotViewed,
  clearNotifications,
  setTotalNotification,
  setNotification,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
