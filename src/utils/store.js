import { configureStore } from '@reduxjs/toolkit';
import userSlices from '../slices/userSlices';
import themeSlices from '../slices/themeSlices';
import workspaceSlice from '../slices/workspaces';

const store = configureStore({
  reducer: {
    user: userSlices,
    workspace: workspaceSlice,
    theme: themeSlices,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
