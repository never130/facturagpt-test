import { createSlice } from "@reduxjs/toolkit";
import {
    getAllAssets,
    getAssetsStatusViewed,
    markAssetAsSeen
} from "../actions/assets";

const assetsSlices = createSlice({
    name: "assets",
    initialState: {
        assets: [],
        asset: null,
        sliceSetShowNewContact: null,
        fatherNewAsset: '',
        unseenCount: 0,
        idFatherNewAsset:null
    },
    reducers: {
        setAsset: (state, action) => {
            state.asset = action.payload;
        },
        setSliceSetShowNewContact: (state, action) => {
            state.sliceSetShowNewContact = action.payload;
        },
        setFatherNewAsset: (state, action) => {
            state.fatherNewAsset = action.payload;
        },
        setIdFatherNewAsset: (state, action) => {
            state.idFatherNewAsset = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAssets.fulfilled, (state, action) => {
                state.assets = action.payload.assets;
                state.totalAssets = action.payload.total;
            })

            
      .addCase(getAssetsStatusViewed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssetsStatusViewed.fulfilled, (state, action) => {
        state.loading = false;
        state.unseenCount = action.payload.totalUnseenAssets
      })
      .addCase(getAssetsStatusViewed.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(markAssetAsSeen.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAssetAsSeen.fulfilled, (state, action) => {
        state.loading = false;
      
        const { alreadySeen } = action.payload;
      
        if (!alreadySeen && typeof state.unseenCount === "number" && state.unseenCount > 0) {
          state.unseenCount -= 1;
        }
      })
      
      .addCase(markAssetAsSeen.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

    },
});

export const { setDoc, clearDoc, setAsset, setSliceSetShowNewContact, setFatherNewAsset,setIdFatherNewAsset } = assetsSlices.actions;

export default assetsSlices.reducer;
