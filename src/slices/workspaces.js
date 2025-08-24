import { createSlice } from "@reduxjs/toolkit";
import { getMembersSelectedWorkspacesAction, getSelectedWorkspace, getWorkspacesByIdAction } from "../actions/workspaces";

const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    workspaces: [],
    workspaceSelected: {},
    loading: false,
    error: null,
    selectedWorkspaceId:null,
    membersWorkspaceSelected:[],
    accountInfoInSelectedWorkspace:null
  },
  reducers: {

    setSelectedWorkspaceId: (state, action) => {
      state.selectedWorkspaceId = action.payload; 
    },
    setSelectWorkspace: (state, action) => {
      console.log('guardando toda la informacion del workspace:',action.payload)
      state.workspaceSelected = action.payload; 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWorkspacesByIdAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkspacesByIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload?.workspaces || [];
      })
      .addCase(getWorkspacesByIdAction.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getMembersSelectedWorkspacesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembersSelectedWorkspacesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.membersWorkspaceSelected = action.payload?.members || [];
        state.accountInfoInSelectedWorkspace = action.payload?.accountInfo || null;
      })
      .addCase(getMembersSelectedWorkspacesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error loading workspaces";
      })
      .addCase(getSelectedWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSelectedWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        console.log('action.payloadaction.payload',action?.payload?.workspace        )
        state.workspaceSelected = action.payload?.workspace;
      })
      .addCase(getSelectedWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error loading workspaces";
      });
  },
});

export const { clearWorkspaces,setSelectedWorkspaceId,setSelectWorkspace  } = workspaceSlice.actions;

export default workspaceSlice.reducer;
