const { Router } = require("express");
const path = require("path");
const fs = require("fs");
const { authenticateToken } = require("../middlewares/auth/auth");

const multer = require("multer");

const {
  getDB,
  downloadBackup,
  uploadBackup,
  processBackupImport,

  sendEmail,
  getEmail,
  getFile,

  getAllAccountsController,
  updateAccountPasswordController,
  deleteAccountController,
  createAccountController,

  loginToManagerController,

updateTokensController,
getTokensController,
  updateAccountController,
  generateAndSendOtpController,
  verifyOTPController,
  sendNewsletter,

  addNotificationController,
  getAllNotificationsController,
  deleteNotificationController,

  getResumeAccount,
  deleteResumeAccount,

  createRandomUser,
  deleteRandomUser,

  uploadFileController,
  updateFileController,
  getUploadedFilesController,
  getUniqueFileController,
  deleteFileController,
  deleteManyFilePDFController,
  sendEmailUser,
  createVariable,
  getVariablesByType,
  updateVariableSelected,
  deleteVariable,
  getFileMetadataController,
  weighFolderController,
  moveManyFileLocallyController,
  deleteBillingDetailController,
  getProfileImageById,
  getPdfAsBase64Controller,
  getUniqueFileWithPDFBase64Controller,
  setFinishTutorialTrueController,
  updateSecondFactorAuth,
  generateAndSend2FaController,
  validateSecondFactorAuthController,
  logicalDeletedAccount,

  generateAndSendRecoveryCodeController,
  seenNotification,
  testEmails,


  upgradeNote,
  getUpgradeNotes,
  deleteUpgradeNote,
  deleteCategoryNote,
  verifyRecoveryCodeController,
  getAllInvoices,
  getAllInvoicesById,
  getInvoicePdf,
  createTableController,
  reorderedTableController,
  getTablesController,
  createTableDataController,
  updateTableDataController,
  getTableData,
  getTableDataById,
  getTableDataFiltered,
  updateTableTypeController,
  updateTableNameController,
  deleteRowTableController,
  getTablesWithCountsController,
  refreshTableInfoController,
  deleteTableController,
  getTableByIdController,
  getAccountLastPaymentController,
  saveSearchHistory,
  SearchHistoryInput,
  createTableWithInitialDataController,
  deleteAllTablesAndTableDataController,
  exportTableController,
  selectedWorkspace,
  updateVariableTableDataController,
  createVariableTableDataController,
  deleteVariableTableDataController,

} = require("../controllers/user");


const userManagerRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });


userManagerRouter
  .get("/db", getDB)
  .get("/db/backup", downloadBackup)
  .get("/db/:type", getDB)
  .post("/uploadBackup", uploadBackup)
  .post("/processBackupImport", processBackupImport)


  .post("/user/addRandom", createRandomUser)
  .post("/user/deleteRandom", deleteRandomUser)

  .post("/resume/:userId", authenticateToken, getResumeAccount)
  .post("/deleteResume", authenticateToken, deleteResumeAccount)

  .post("/addNotification", authenticateToken, addNotificationController)
  .post("/getAllNotifications", authenticateToken, getAllNotificationsController)
  .post("/deleteNotification", authenticateToken, deleteNotificationController)

  .post("/getAllAccounts", authenticateToken, getAllAccountsController)
  .post(`/getImageAccount/:id/avatar`, authenticateToken, getProfileImageById)
  .put("/updateAccount", authenticateToken, updateAccountController)
  .put("/selectedWorkspace", authenticateToken, selectedWorkspace)
  .put("/updateTokens", authenticateToken, updateTokensController)
    .post("/getTokens", authenticateToken, getTokensController)
  
  
  .put("/finishTutorial", authenticateToken, setFinishTutorialTrueController)
  .post("/deleteAccount", authenticateToken, deleteAccountController)
  .delete("/deleteBillingDetail/:email/:billingDetailId", authenticateToken, deleteBillingDetailController)

  .post("/updateAccountPassword", updateAccountPasswordController)
  .post("/loginToManager", loginToManagerController)
  .post("/validateSecondFactorAuth", validateSecondFactorAuthController)


  .post("/createAccount", createAccountController)
  .post("/send-otp", generateAndSendOtpController)
  .post("/send-code", generateAndSend2FaController)
  .post("/testEmails", testEmails)
  .post("/verify-otp", verifyOTPController)
  .post("/newsletter", sendNewsletter)
  .post("/send-email", sendEmail)
  .get("/get-email", getEmail)
  .get("/get-file/:name", getFile)

  .post("/upload", authenticateToken, upload.single("pdf"), uploadFileController)
  .post("/updateFile", authenticateToken, updateFileController)
  .post("/move-many-file-locally", authenticateToken, moveManyFileLocallyController)
  
  
  .get("/get-file-pdf/:etag", authenticateToken, getUniqueFileController)
  .get("/get-metadata-file-pdf/:etag", authenticateToken, getFileMetadataController)
  .get("/weigh-folder/:currentPath(.*)", authenticateToken, weighFolderController)
  
  .delete("/delete-file-pdf/:key", authenticateToken, deleteFileController)
  .delete("/delete-many-file-pdf/:currentPath(.*)", authenticateToken, deleteManyFilePDFController)
  .get("/getPdfBase64/:pdfId", authenticateToken, getPdfAsBase64Controller)
  .get("/getUniqueFileWithPdfBase64/:etag", authenticateToken, getUniqueFileWithPDFBase64Controller)
  


  .post("/create-variable", authenticateToken, createVariable)
  .post("/get-variable/:type", authenticateToken, getVariablesByType)
  .put("/update-selectedVariable/:variableId", authenticateToken, updateVariableSelected)
  .delete("/delete-variable/:variableId", authenticateToken, deleteVariable)

  .post("/emailNotify", authenticateToken, sendEmailUser)
  .post("/send-emailUser", upload.single("file"), sendEmailUser)
  .put("/setFactorAuth", authenticateToken, updateSecondFactorAuth)
  .put("/logical-deleted-account", logicalDeletedAccount)



  .post("/send-recovery-code",  generateAndSendRecoveryCodeController)
  .post("/verify-recovery-code",  verifyRecoveryCodeController)

  .put('/seen-Notification', authenticateToken, seenNotification)


  .post("/upgradeNote", authenticateToken, upgradeNote)
  .get("/getUpgradeNotes", getUpgradeNotes)
  .post("/deleteUpgradeNote", authenticateToken, deleteUpgradeNote)
  .post("/deleteCategoryNote", authenticateToken, deleteCategoryNote)

  .get("/get-all-invoices", authenticateToken, getAllInvoices)
  .get("/get-all-invoices-by-id/:id", authenticateToken, getAllInvoicesById)
  .get("/get-invoice-pdf/:invoiceId", authenticateToken, getInvoicePdf)
  
  
  .post("/create-table", authenticateToken, createTableController)
  .post("/reordered-table", authenticateToken, reorderedTableController)
  .put("/update-table-name", authenticateToken, updateTableNameController)
  .put("/delete-row-table", authenticateToken, deleteRowTableController)
  .get("/get-tables", authenticateToken, getTablesController)
  .get("/get-table-by-id/:tableId", authenticateToken, getTableByIdController)
  .post("/create-table-data", authenticateToken, createTableDataController)
  .put("/update-table-data", authenticateToken, updateTableDataController)
  .put("/update-variable-table-data", authenticateToken, updateVariableTableDataController)
  .put("/create-variable-table-data", authenticateToken, createVariableTableDataController)
  .put("/delete-variable-table-data", authenticateToken, deleteVariableTableDataController)
  .get("/get-table-data/:tableId/:rowId", authenticateToken, getTableDataById )
  .get("/get-table-data/:tableId", authenticateToken, getTableData )
  .post("/get-table-data-filtered", authenticateToken, getTableDataFiltered )
  
  .post("/create-table-with-initial-data", authenticateToken, createTableWithInitialDataController )
  .post("/update-table-type", authenticateToken, updateTableTypeController )
  .get("/get-tables-with-counts", authenticateToken, getTablesWithCountsController )
  .post("/refresh-table-info", authenticateToken, refreshTableInfoController )
  .post("/delete-table", authenticateToken, deleteTableController )
  .post("/delete-all-tables", authenticateToken, deleteAllTablesAndTableDataController )
  .post("/export-table", authenticateToken, exportTableController )
  
  .post("/saveSearchHistory", authenticateToken, saveSearchHistory )
  .get("/SearchHistoryInput", authenticateToken, SearchHistoryInput)
  .get("/get-lastPayment", authenticateToken, getAccountLastPaymentController )

 
module.exports = userManagerRouter;
