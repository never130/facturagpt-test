import { createSlice } from '@reduxjs/toolkit';
import { saveQRConfigToDb, fetchQRConfigurations } from '@src/actions/docs';

const initialState = {
  savedConfigs: [],
  selectedConfig: null,
  loading: false,
  error: null
};

const qrCodeSlice = createSlice({
  name: 'qrCode',
  initialState,
  reducers: {
    saveQRConfig: (state, action) => {
      const config = action.payload;
      const existingIndex = state.savedConfigs.findIndex(
        (saved) => saved.id === config.id
      );

      if (existingIndex !== -1) {
        state.savedConfigs[existingIndex] = config;
      } else {
        state.savedConfigs.push({
          ...config,
          id: `qr-${Date.now()}`,
        });
      }
    },
    selectQRConfig: (state, action) => {
      state.selectedConfig = action.payload;
    },
    deleteQRConfig: (state, action) => {
      state.savedConfigs = state.savedConfigs.filter(
        (config) => config.id !== action.payload
      );
      if (state.selectedConfig?.id === action.payload) {
        state.selectedConfig = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveQRConfigToDb.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveQRConfigToDb.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(saveQRConfigToDb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      
      .addCase(fetchQRConfigurations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQRConfigurations.fulfilled, (state, action) => {
        state.loading = false;
        state.savedConfigs = action.payload;
      })
      .addCase(fetchQRConfigurations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

export const { saveQRConfig, selectQRConfig, deleteQRConfig } =
  qrCodeSlice.actions;

export default qrCodeSlice.reducer;
