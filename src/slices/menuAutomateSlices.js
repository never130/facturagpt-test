import { createSlice } from "@reduxjs/toolkit";

const menuAutomateSlices = createSlice({
  name: "menuAutomate",
  initialState: {
    showAutomate: "",
  },
  reducers: {
    setShowAutomate: (state, action) => {
      state.showAutomate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export const { setShowAutomate } = menuAutomateSlices.actions;

export default menuAutomateSlices.reducer;
