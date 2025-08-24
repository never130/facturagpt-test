const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("../middlewares/auth/auth");

const multer = require("multer");
const { createWorkspaceController, getWorkspacesByMemberController, inviteUsersToWorkspaceController, getMembersSelectedWorkspacesController, updateMemberStatusController, updateWorkspaceController, deleteWorkspaceController, getSelectedWorkspaceController, updateMemberRoleController,  removeMemberFromWorkspaceController } = require("../controllers/workspaces");


const workspacesManagerRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });


workspacesManagerRouter
  .post("/create-workspace",authenticateToken, createWorkspaceController)
  .put("/update-workspace",authenticateToken, updateWorkspaceController)
  .get("/get-workspace-by-id/:userId",authenticateToken, getWorkspacesByMemberController)
  .post("/invite-members-to-workspace",authenticateToken, inviteUsersToWorkspaceController)
  .get("/get-members-selected-workspaces",authenticateToken, getMembersSelectedWorkspacesController)
  .post("/update-member-status",authenticateToken, updateMemberStatusController)
  .delete("/delete-workspace/:workspaceId",authenticateToken, deleteWorkspaceController)
  .get("/get-selected-workspace",authenticateToken, getSelectedWorkspaceController)
  .post("/update-member-role/:workspaceId/:memberId",authenticateToken, updateMemberRoleController)
  .delete("/remove-member-workspace/:workspaceId/:memberId",authenticateToken, removeMemberFromWorkspaceController)

module.exports = workspacesManagerRouter;
