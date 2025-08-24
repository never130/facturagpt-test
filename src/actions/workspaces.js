import apiBackend from "@src/apiBackend.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createWorkspacesAction = createAsyncThunk(
  "workspace/createWorkspacesAction",
  async ({ workspace, createdBy,owner }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/workspace/create-workspace`,
        { workspace, createdBy,owner },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response?.status === 501 || error.response?.status === 502)
        logout();
    }
  }
);
export const updateWorkspaceAction = createAsyncThunk(
  "workspace/update-workspace",
  async ({  workspace,workspaceId }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.put(
        `/workspace/update-workspace`,
        {  workspace,workspaceId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response?.status === 501 || error.response?.status === 502)
        logout();
    }
  }
);
export const getWorkspacesByIdAction = createAsyncThunk(
  "workspace/getWorkspacesByIdAction",
  async ({ userId,searchTerm }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/workspace/get-workspace-by-id/${userId}`,

        {
          params: { search: searchTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);

    }
  }
);
export const getSelectedWorkspace = createAsyncThunk(
  "workspace/get-selected-workspace",
  async (_, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/workspace/get-selected-workspace`,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);

    }
  }
);

export const inviteMembersToWorkspaceAction = createAsyncThunk(
  "workspace/invite-members-to-workspace",
  async ({ emails, workspaceId, role }, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.post(
        `/workspace/invite-members-to-workspace`,
        { emails, workspaceId, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data ;
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response?.status === 501 || error.response?.status === 502)
        logout();
    }
  }
);
export const getMembersSelectedWorkspacesAction = createAsyncThunk(
  "workspace/get-members-selected-workspaces",
  async ({searchTerm}, { rejectWithValue }) => {
    try {
      const user = localStorage.getItem("user");
      const userJson = JSON.parse(user);
      const token = userJson.accessToken;

      const res = await apiBackend.get(
        `/workspace/get-members-selected-workspaces`,
        {
          params: { search: searchTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);

      if (error.response?.status === 501 || error.response?.status === 502)
        logout();
    }
  }
);

  export const updateMemberStatusAction = createAsyncThunk(
    "workspace/update-member-status",
    async ({userId, workspaceId, type}, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.post(
          `/workspace/update-member-status`,
          {userId, workspaceId, type},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        return res.data;
      } catch (error) {
        console.error("Error sending message:", error);
  
        if (error.response?.status === 501 || error.response?.status === 502)
          logout();
      }
    }
  );
  export const deleteWorkspace = createAsyncThunk(
    "workspace/delete-workspace",
    async ({workspaceId }, { rejectWithValue }) => {
      try {
        const user = localStorage.getItem("user");
        const userJson = JSON.parse(user);
        const token = userJson.accessToken;
  
        const res = await apiBackend.delete(
          `/workspace/delete-workspace/${workspaceId}`,
          
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        return res.data;
      } catch (error) {
        console.error("Error sending message:", error);
  
        if (error.response?.status === 501 || error.response?.status === 502)
          logout();
      }
    }
  );
    export const updateMemberRole = createAsyncThunk(
      "workspace/update-member-role",
      async ({workspaceId, memberId,role}, { rejectWithValue }) => {
        try {
          console.log('role',role)
          const user = localStorage.getItem("user");
          const userJson = JSON.parse(user);
          const token = userJson.accessToken;
    
          const res = await apiBackend.post(
            `/workspace/update-member-role/${workspaceId}/${memberId}`,
            {role},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
    
          return res.data;
        } catch (error) {
          console.error("Error sending message:", error);
    
      
        }
      }
    );
    export const removeMemberWorkspace = createAsyncThunk(
      "workspace/remove-member-workspace",
      async ({workspaceId, memberId}, { rejectWithValue }) => {
        try {
          const user = localStorage.getItem("user");
          const userJson = JSON.parse(user);
          const token = userJson.accessToken;
    
          const res = await apiBackend.delete(
            `/workspace/remove-member-workspace/${workspaceId}/${memberId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
    
          return res.data;
        } catch (error) {
          console.error("Error sending message:", error);
    
      
        }
      }
    );