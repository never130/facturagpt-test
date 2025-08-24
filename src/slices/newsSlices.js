import { createSlice } from '@reduxjs/toolkit';
import { syncNews } from '../actions/news';

const newsSlice = createSlice({
    name: 'news',
    initialState: {
        news: []
    },
    reducers: {
        setNews: (state, action) => {
            state.news = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(syncNews.fulfilled, (state, action) => {
            state.news = action.payload;
        });
    }
});

export const { setNews } = newsSlice.actions;

export default newsSlice.reducer;
