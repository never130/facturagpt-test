import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    tab:""
  },
  reducers: {
    setTab: (state, action) => {
        state.tab = action.payload;
      },
    },
});

export const { setTab } = dashboardSlice.actions;

export default dashboardSlice.reducer;
