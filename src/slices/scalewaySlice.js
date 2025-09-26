import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userFiles: [],
  loading: false,
  error: null,
};

const scalewaySlice = createSlice({
  name: 'scaleway',
  initialState,
  reducers: {
    setUserFiles: (state, action) => {
      state.userFiles = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserFiles, setLoading, setError } = scalewaySlice.actions;
export default scalewaySlice.reducer;