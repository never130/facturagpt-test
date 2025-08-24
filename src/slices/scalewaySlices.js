import { createSlice } from "@reduxjs/toolkit";
import { changeLocation, createFolder, duplicateFolderFiles, getUserFiles, uploadFiles } from "../actions/scaleway";

const scalewaySlices = createSlice({
  name: "scaleway",
  initialState: {
    getFilesLoading: false,
    uploadingFilesLoading: false,
    createFolderLoading: false,
    userFiles: [],
    homeUserFiles:[],
    currentPath: null,
    fromHome:false
  },
  reducers: {
    setUserFiles: (state, action) => {
      if(state.fromHome) state.homeUserFiles = action.payload;
      else state.userFiles = action.payload;
    },
    setCurrentPath: (state, action) => {
      state.currentPath = action.payload;
    },
    setFromHome: (state, action) => {
      state.fromHome = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(uploadFiles.pending, (state) => {
        state.uploadingFilesLoading = true;
      })
      .addCase(uploadFiles.fulfilled, (state, action) => {
        const newFiles = action.payload;
        newFiles.forEach((file) => {
          const exists = state.userFiles?.some(
            (existingFile) => existingFile.Key === file.Key
          );
          if (!exists) {
            state.userFiles.push(file);
          }
        });
        state.uploadingFilesLoading = false;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.uploadingFilesLoading = false;
      })
     

      .addCase(getUserFiles.pending, (state) => {
        state.getFilesLoading = true;
      })
      .addCase(changeLocation.pending, (state) => {
        state.getFilesLoading = true;
      })
      .addCase(getUserFiles.fulfilled, (state, action) => {
        state.getFilesLoading = false;
        if(state.fromHome)  state.homeUserFiles = action.payload;
       else  state.userFiles = action.payload;
      })
      .addCase(changeLocation.fulfilled, (state, action) => {
        state.getFilesLoading = false;
      })
      .addCase(getUserFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.getFilesLoading = false;
      })

      .addCase(createFolder.pending, (state) => {
        state.createFolderLoading = true;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        // const newFiles = action.payload;
        // newFiles.forEach((file) => {
        //   const exists = state?.userFiles.some(
        //     (existingFile) => existingFile.Key === file.Key
        //   );
        //   if (!exists) {
        //     state.userFiles.push(file);
        //     state.homeUserFiles.push(file);
        //   }
        // });
        // state.createFolderLoading = false;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.error = action.payload;
        state.createFolderLoading = false;
      });
  },
});

export const { setUserFiles, setCurrentPath,setFromHome } = scalewaySlices.actions;

export default scalewaySlices.reducer;
