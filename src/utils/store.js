import { configureStore } from '@reduxjs/toolkit';
import userSlices from '../slices/userSlices';
import themeSlices from '../slices/themeSlices';
import workspaceSlice from '../slices/workspaces';
import scalewaySlice from '../slices/scalewaySlice';

const store = configureStore({
  reducer: {
    user: userSlices,
    workspace: workspaceSlice,
    theme: themeSlices,
    scaleway: scalewaySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
