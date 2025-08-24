
import { createSlice } from '@reduxjs/toolkit';

export const defaultColor = "rgba(16, 163, 127, 1)"; // only using rgba format for consistency
const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: 'light', 
    themeColor: defaultColor, 
  },
  reducers: {
    setTheme: (state,action) => {
        state.theme = action.payload; 
      },
    setThemeColor: (state, action) => {
        state.themeColor = action.payload; 
      },
    },
});

export const { setTheme,setThemeColor } = themeSlice.actions;

export default themeSlice.reducer;
