import { createSlice } from "@reduxjs/toolkit";

const paginationSlices = createSlice({
    name: "pagination",
    initialState: {
        pageSlice: '',
        limitSlice: '',
        contactLimitSlice:'',
        contactPageSlice:''
    },
    reducers: {
        setPaginationSlice: (state, action) => {
            state.limitSlice = action.payload.limitSlice;
            state.pageSlice = action.payload.pageSlice
            state.contactLimitSlice = action.payload.contactLimitSlice;
            state.contactPageSlice = action.payload.contactPageSlice
          },         
    },
});

export const { setPaginationSlice, } = paginationSlices.actions;

export default paginationSlices.reducer;
