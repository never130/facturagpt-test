import { createSlice } from "@reduxjs/toolkit";
import {
  deleteAssetFromDocs,
  deleteDocs,
  getAllDocsByContact,
  getOneDocsById,
  saveAppFiles,
} from "../actions/docs";

const docsSlices = createSlice({
  name: "docs",
  initialState: {
    docsByContact: [],
    docByContact: {},
    loading: false,
    error: false,
    products: [],
    doc: {
      show: false,
      data: "",
      docId: null, 
      status: "minimized", 
      createdAt: null,
      updatedAt: null,
      selectedSectionId: null, 
      position: {
        x: window.innerWidth - 320,
        y: 20
      },
      size: {
        width: 300,
        height: 400
      }
    },

    app: {
      loading: false,
      files: {},               
      selectedFile: null,      
      selectedLines: null,     
      status: "minimized",     
      position: {
        x: window.innerWidth - 500,
        y: 20
      },
      size: {
        width: 600,
        height: 600
      }
    }
  },
  reducers: {
    setDoc: (state, action) => {
      state.docByContact = action.payload;
    },
    clearDoc: (state) => {
      state.docByContact = {};
    },
    setMessageDocsShow: (state, action) => {
      state.doc.show = action.payload;
    },
    setMessageDocsData: (state, action) => {
      state.doc.data = action.payload;
      state.doc.updatedAt = new Date().toISOString();
      if (!state.doc.data && action.payload) {
        state.doc.createdAt = new Date().toISOString();
      }
    },
    setMessageDocsDocId: (state, action) => {
      state.doc.docId = action.payload;
    },
    setMessageDocsStatus: (state, action) => {
      state.doc.status = action.payload;
    },
    setMessageDocsPosition: (state, action) => {
      state.doc.position = action.payload;
    },
    setMessageDocsSize: (state, action) => {
      state.doc.size = action.payload;
    },
    setMessageDocsSelectedSection: (state, action) => {
      state.doc.selectedSectionId = action.payload;
    },
    resetMessageDocs: (state) => {
      state.doc.data = "";
      state.doc.docId = null;
      state.doc.createdAt = null;
      state.doc.updatedAt = null;
      state.doc.selectedSectionId = null;
    },
    clearMessageDocs: (state) => {
      state.doc.show = false;
      state.doc.data = "";
      state.doc.docId = null;
      state.doc.status = "minimized";
      state.doc.createdAt = null;
      state.doc.updatedAt = null;
      state.doc.selectedSectionId = null;
      state.doc.position = {
        x: window.innerWidth - 320,
        y: 20
      };
      state.doc.size = {
        width: 300,
        height: 400
      };
    },



    setAppFiles: (state, action) => {
      state.app.files = action.payload; 
    
    },
    setAppFileContent: (state, action) => {
      const { path, content } = action.payload;
      state.app.files[path] = content;
    },
    renameAppFile: (state, action) => {
      const { oldPath, newPath } = action.payload;
      if (state.app.files[oldPath]) {
        state.app.files[newPath] = state.app.files[oldPath];
        delete state.app.files[oldPath];
        if (state.app.selectedFile === oldPath) {
          state.app.selectedFile = newPath;
        }
      }
    },
    deleteAppFile: (state, action) => {
      const path = action.payload;
      delete state.app.files[path];
      if (state.app.selectedFile === path) {
        state.app.selectedFile = null;
      }
    },
    createAppFile: (state, action) => {
      const { path, content = "" } = action.payload;
      if (!state.app.files[path]) {
        state.app.files[path] = content;
        state.app.selectedFile = path;
      }
    },
    setAppSelectedFile: (state, action) => {
      state.app.selectedFile = action.payload;
    },
    setAppSelectedLines: (state, action) => {
      state.app.selectedLines = action.payload;
    },
    setAppStatus: (state, action) => {
      state.app.status = action.payload;
    },
    setAppPosition: (state, action) => {
      state.app.position = action.payload;
    },
    setAppSize: (state, action) => {
      state.app.size = action.payload;
    },
    clearApp: (state) => {
      state.app = {
        files: {},
        selectedFile: null,
        selectedLines: null,
        status: "minimized",
        position: {
          x: window.innerWidth - 500,
          y: 20
        },
        size: {
          width: 600,
          height: 600
        }
      };
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllDocsByContact.pending, (state) => {
      })
      .addCase(getAllDocsByContact.fulfilled, (state, action) => {
        state.docsByContact =
          action.payload?.docs;
      })
      .addCase(getAllDocsByContact.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteDocs.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDocs.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteDocs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteAssetFromDocs.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAssetFromDocs.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteAssetFromDocs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      .addCase(getOneDocsById.pending, (state) => {})
      .addCase(getOneDocsById.fulfilled, (state, action) => {
      })
      .addCase(getOneDocsById.rejected, (state, action) => {
        state.error = action.payload;
      })


      .addCase(saveAppFiles.pending, (state) => {
        state.app.loading = true;
      })
      .addCase(saveAppFiles.fulfilled, (state, action) => {
        state.app.loading = false;
      })
  },
});

export const { 
  setDoc, 
  clearDoc, 
  setMessageDocsShow, 
  setMessageDocsData, 
  setMessageDocsDocId, 
  setMessageDocsStatus, 
  setMessageDocsPosition, 
  setMessageDocsSize, 
  setMessageDocsSelectedSection,
  resetMessageDocs,
  clearMessageDocs,



   setAppFiles,
   setAppFileContent,
   renameAppFile,
   deleteAppFile,
   createAppFile,
   setAppSelectedFile,
   setAppSelectedLines,
   setAppStatus,
   setAppPosition,
   setAppSize,
   clearApp
} = docsSlices.actions;

export default docsSlices.reducer;
