import { createSlice } from "@reduxjs/toolkit";
import { createVariable, getVariable } from "../actions/user";

const initialState = {
    variables: [],
    loading: false,
    error: null,
  };
  

const variableSlice = createSlice({
  name: "variables",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVariable.pending, (state) => {
        state.loading = true;
      })
      .addCase(getVariable.fulfilled, (state, action) => {
        state.loading = false;
        state.variables = action.payload; 
      })
      .addCase(getVariable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      
  },
});

export default variableSlice.reducer;
