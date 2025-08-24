import { createSlice } from "@reduxjs/toolkit";
import {
  createAutomation,
  deleteAutomation,
  getAllUserAutomations,
  updateAutomation,
  getUserAutomatiosByInputSearch,
  addConnectionAutomationsByGmail,
  addAuth,
  getWhatssapQr,
  createLabelTitleDescription,
  filterImageGpt,
  getAuth,
  tryConnectionAutomate,
  importConnectionAttachment,
  outlookIsAuthenticated,
  outlookEmails,
  driveIsAuthenticated,
  driveFiles,
  getUserDevices,
  whatsappFiles,
  oneDriveIsAuthenticated,
  oneDriveFiles,
  getTelematelToken,
  telematelIsAuthenticated,
  telematelFiles,
} from "../actions/automate";
import { file } from "jszip";

const automationsSlices = createSlice({
  name: "automate",
  initialState: {
    userAutomations: [],
    addConnectionAutomationsByGmail: "",
    whatsappQr: "",
    labelTitleDescription: {
      title: "",
      description: "",
      value: "",
    },
    loading: false,
    automateSelectedFromDropdown: [],
    variables: {},
    authData: [],
    selectedEmailConnection: "",
    configurationData: {},
    automateSelected: {},
    variablesSelectedToRenameFiles: [],
    automateNameTitleIn: "Añade tus facturas de",
    automateNameTitleOut: "Añadir tu",
    showEndPointVariables: false,
    variableSelectedToEnpoint: "",
    allVariablesFromEnPointUse: [],
    tryConnectionAutomate: {},
    loadingTryConnectionAutomate: false,
    importConnectionAttachment: {},
    loadingImportConnectionAttachment: false,
    authOutlook: {},
    authDrive: [],
    userDevices: [],
    loadingUserDevices: false,
    whatsappFiles: {},
    loadingWhatsAppFiles: false,
    authOneDrive: {},
    loadingOneDrive: false,
    authTelematel: {},
    loadingTelematel: false,
    filteredAutomateSelected: [],
    testConnectionFilesOut: {},
  },
  reducers: {
    setUserAutomations: (state, action) => {
      state.userAutomations = action.payload;
    },
    setAddConnectionAutomationsByGmail: (state) => {
      state.addConnectionAutomationsByGmail = "";
    },
    setLabelTitleDescription: (state) => {
      state.labelTitleDescription = {
        title: "",
        description: "",
        value: "",
      };
    },
    setAutomateSelectedFromDropdown: (state, action) => {
      state.automateSelectedFromDropdown = action.payload;
    },
    setVariables: (state, action) => {
      state.variables = action.payload;
    },
    setDeleteAuthData: (state, action) => {
      const newAuthData = state.authData.filter(
        (auth) => (auth._id || auth.id) !== action.payload
      );
      state.authData = [...newAuthData];
    },
    setDeleteAuthDrive: (state, action) => {
      state.authDrive.data = state.authDrive.data.filter(
        (auth) => auth._id !== action.payload
      );
    },
    setSelectedEmailConnection: (state, action) => {
      state.selectedEmailConnection = action.payload;
    },
    setConfigurationData: (state, action) => {
      function clearObject(obj) {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, clearObject(value)])
        );
      }
      const newConfigurationData = clearObject(action.payload);
      delete newConfigurationData._rev;
      delete newConfigurationData._id;
      delete newConfigurationData.id;
      delete newConfigurationData.userId;
      delete newConfigurationData.email;
      state.userAutomations = [newConfigurationData];
    },
    setAutomateSelected: (state, action) => {
      const type = action?.payload?.type;
      if(type){
      function clearObject(obj) {
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
          return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, clearObject(value)])
          );
        }
        return "";
      }
      const newConfigurationData = clearObject(action.payload);
      newConfigurationData.type = type;
      newConfigurationData.automateSelected = [];
      newConfigurationData.labels = [];
      delete newConfigurationData._rev;
      delete newConfigurationData._id;
      delete newConfigurationData.id;
      delete newConfigurationData.userId;
      delete newConfigurationData.email;
      state.automateSelected = newConfigurationData;
    }
    },
    setVariablesSelectedToRenameFiles: (state, action) => {
      const newVariables = state.variablesSelectedToRenameFiles.find(
        (variable) => {
          return variable.title === action.payload.title;
        }
      );
      if (newVariables) {
        const filterVariables = state.variablesSelectedToRenameFiles.filter(
          (variable) => {
            return variable.title !== action.payload.title;
          }
        );
        state.variablesSelectedToRenameFiles = filterVariables;
      } else {
        state.variablesSelectedToRenameFiles = [
          ...state.variablesSelectedToRenameFiles,
          action.payload,
        ];
      }
    },
    setAutomateNameTitleIn: (state, action) => {
      state.automateNameTitleIn = action.payload;
    },
    setAutomateNameTitleOut: (state, action) => {
      state.automateNameTitleOut = action.payload;
    },
    setShowEndPointVariables: (state, action) => {
      state.showEndPointVariables = action.payload;
    },
    setVariableSelectedToEnpoint: (state, action) => {
      state.variableSelectedToEnpoint = action.payload;
    },
    setAllVariablesFromEnPointUse: (state, action) => {
      state.allVariablesFromEnPointUse = [
        ...state.allVariablesFromEnPointUse,
        ...action.payload,
      ];
    },
    setTryConnectionAutomate: (state, action) => {
      if (state.tryConnectionAutomate?.data) {
        state.tryConnectionAutomate.data = state.tryConnectionAutomate.data.map(
          (item) => {
            if (item.emailId === action.payload) {
              return { ...item, wasImported: true };
            } else if (item.id === action.payload) {
              return { ...item, wasImported: true };
            }
            return item;
          }
        );
      }
    },
    cleanTryConnectionAutomate: (state) => {
      state.tryConnectionAutomate = {};
    },
    setWhatsappQr: (state) => {
      state.whatsappQr = "";
    },
    setFilteredAutomateSelected: (state, action) => {
      state.filteredAutomateSelected = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAutomation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAutomation.fulfilled, (state, action) => {
        state.loading = false;
        const variables = [];
        try {
          action.payload.forEach((automate) => {
            if (automate.labels) {
              automate?.labels.forEach((label) => {
                label.conditions.forEach((condition) => {
                  variables.push(condition);
                });
              });
            }
          });
        } catch (error) {
          console.error(error);
          
        }
        state.allVariablesFromEnPointUse = variables;
        state.userAutomations = action.payload;
      })
      .addCase(createAutomation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getAllUserAutomations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUserAutomations.fulfilled, (state, action) => {
        state.loading = false;
        const variables = [];
        try {
          action.payload.forEach((automate) => {
            if (automate.labels) {
              automate?.labels.forEach((label) => {
                label.conditions.forEach((condition) => {
                  variables.push(condition);
                });
              });
            }
          });
        } catch (error) {
          console.error(error);
          
        }
        state.allVariablesFromEnPointUse = variables;
        state.userAutomations = action.payload;
      })
      .addCase(getAllUserAutomations.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getUserAutomatiosByInputSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserAutomatiosByInputSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.userAutomations = action.payload;
      })
      .addCase(getUserAutomatiosByInputSearch.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateAutomation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAutomation.fulfilled, (state, action) => {
        state.loading = false;
        const variables = [];
        try {
          action.payload.forEach((automate) => {
            if (automate.labels) {
              automate?.labels.forEach((label) => {
                label.conditions.forEach((condition) => {
                  variables.push(condition);
                });
              });
            }
          });
        } catch (error) {
          console.error(error);
          
        }
        state.allVariablesFromEnPointUse = variables;
        state.userAutomations = action.payload;
      })
      .addCase(updateAutomation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteAutomation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAutomation.fulfilled, (state, action) => {
        state.loading = false;
        const variables = [];
        try {
          action.payload.forEach((automate) => {
            if (automate.labels) {
              automate?.labels.forEach((label) => {
                label.conditions.forEach((condition) => {
                  variables.push(condition);
                });
              });
            }
          });
        } catch (error) {
          console.error(error);
          
        }
        state.allVariablesFromEnPointUse = variables;
        state.userAutomations = action.payload;
      })
      .addCase(deleteAutomation.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(addAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAuth.fulfilled, (state, action) => {
        state.loading = false;

        state.addConnectionAutomationsByGmail = action.payload[0];
        if (typeof action.payload[0] !== "string") {
          const stateAuthData = [...state.authData, action.payload[0]];
          state.authData = stateAuthData;
        }
      })
      .addCase(addAuth.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getWhatssapQr.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWhatssapQr.fulfilled, (state, action) => {
        state.loading = false;
        state.whatsappQr = action.payload;
      })
      .addCase(getWhatssapQr.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getUserDevices.pending, (state) => {
        state.loadingUserDevices = true;
      })
      .addCase(getUserDevices.fulfilled, (state, action) => {
        state.loadingUserDevices = false;
        state.userDevices = action.payload;
      })
      .addCase(getUserDevices.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingUserDevices = false;
      })

      .addCase(whatsappFiles.pending, (state) => {
        state.loadingTryConnectionAutomate = true;
      })
      .addCase(whatsappFiles.fulfilled, (state, action) => {
        state.loadingTryConnectionAutomate = false;
        state.whatsappFiles = action.payload;
        const data = [];
        try {
          action.payload.results?.forEach((userOrGroupChats) => {
            userOrGroupChats.messages.forEach((message) => {
              data.push({
                attachments: [
                  {
                    mimeType: message._data.mimetype,
                    filename:
                      message.body.length > 0
                        ? message.body
                        : `${message.id.id}${message._data.mimetype.split("/")[1]}`,
                  },
                ],
                emailId: message.id,
                attrs: { date: message.timestamp },
                wasImported: false,
              });
            });
          });
        } catch (error) {
          console.error(error);
          
        }

        state.tryConnectionAutomate = { success: true, data };
      })
      .addCase(whatsappFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingTryConnectionAutomate = false;
      })

      .addCase(filterImageGpt.pending, (state) => {
        state.loading = true;
      })
      .addCase(filterImageGpt.fulfilled, (state, action) => {
        state.loading = false;
        state.labelTitleDescription = action.payload;
      })
      .addCase(filterImageGpt.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(createLabelTitleDescription.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLabelTitleDescription.fulfilled, (state, action) => {
        state.loading = false;
        state.labelTitleDescription = action.payload;
      })
      .addCase(createLabelTitleDescription.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
      })
      .addCase(getAuth.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(tryConnectionAutomate.pending, (state) => {
        state.loadingTryConnectionAutomate = true;
      })
      .addCase(tryConnectionAutomate.fulfilled, (state, action) => {
        state.loadingTryConnectionAutomate = false;
        state.tryConnectionAutomate = action.payload;
      })
      .addCase(tryConnectionAutomate.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingTryConnectionAutomate = false;
      })

      .addCase(importConnectionAttachment.pending, (state) => {
        state.loadingImportConnectionAttachment = true;
      })
      .addCase(importConnectionAttachment.fulfilled, (state, action) => {
        state.loadingImportConnectionAttachment = false;
        state.importConnectionAttachment = action.payload;
      })
      .addCase(importConnectionAttachment.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingImportConnectionAttachment = false;
      })

      .addCase(outlookIsAuthenticated.pending, (state) => {
        state.loading = true;
      })
      .addCase(outlookIsAuthenticated.fulfilled, (state, action) => {
        state.loading = false;
        state.authOutlook = action.payload;
      })
      .addCase(outlookIsAuthenticated.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(outlookEmails.pending, (state) => {
        state.loadingImportConnectionAttachment = true;
        state.loadingTryConnectionAutomate = true;
      })
      .addCase(outlookEmails.fulfilled, (state, action) => {
        state.loadingImportConnectionAttachment = false;
        state.importConnectionAttachment = action.payload;
        state.tryConnectionAutomate = action.payload;
        state.loadingTryConnectionAutomate = false;
      })
      .addCase(outlookEmails.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingImportConnectionAttachment = false;
        state.loadingTryConnectionAutomate = false;
      })

      .addCase(driveIsAuthenticated.pending, (state) => {
        state.loading = true;
      })
      .addCase(driveIsAuthenticated.fulfilled, (state, action) => {
        state.loading = false;
        state.authDrive = action.payload;
      })
      .addCase(driveIsAuthenticated.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(driveFiles.pending, (state) => {
        state.loading = true;
        state.loadingImportConnectionAttachment = true;
        state.loadingTryConnectionAutomate = true;
      })
      .addCase(driveFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingImportConnectionAttachment = false;
        state.loadingTryConnectionAutomate = false;
        state.importConnectionAttachment = action.payload;
        state.tryConnectionAutomate = action.payload;
      })
      .addCase(driveFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.loadingImportConnectionAttachment = false;
      })

      .addCase(oneDriveIsAuthenticated.pending, (state) => {
        state.loadingOneDrive = true;
      })
      .addCase(oneDriveIsAuthenticated.fulfilled, (state, action) => {
        state.authOneDrive = action.payload;
        state.loadingOneDrive = false;
      })
      .addCase(oneDriveIsAuthenticated.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingOneDrive = false;
      })

      .addCase(oneDriveFiles.pending, (state) => {
        state.loading = true;
        state.loadingImportConnectionAttachment = true;
        state.loadingTryConnectionAutomate = true;
      })
      .addCase(oneDriveFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingImportConnectionAttachment = false;
        state.importConnectionAttachment = action.payload;
        const data = [];

        try {
          action.payload.data.forEach((fileOrFolder) => {
            if (fileOrFolder.file) {
              data.push({
                attachments: [
                  {
                    mimeType: fileOrFolder.file.mimeType,
                    filename: fileOrFolder.name,
                  },
                ],
                emailId: fileOrFolder.id,
                attrs: { date: fileOrFolder.lastModifiedDateTime },
                wasImported: fileOrFolder.wasImported,
              });
            }
          });
        } catch (error) {
          console.error(error);
          
        }
        state.tryConnectionAutomate = { data, success: true };
        state.loadingTryConnectionAutomate = false;
      })
      .addCase(oneDriveFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.loadingImportConnectionAttachment = false;
        state.loadingTryConnectionAutomate = false;
      })


      .addCase(getTelematelToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTelematelToken.fulfilled, (state, action) => {
        state.loading = false;
        state.authTelematel = action.payload;
      })
      .addCase(getTelematelToken.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })


      .addCase(telematelIsAuthenticated.pending, (state) => {
        state.loading = true;
      })
      .addCase(telematelIsAuthenticated.fulfilled, (state, action) => {
        state.loading = false;
        state.authTelematel = action.payload;
      })
      .addCase(telematelIsAuthenticated.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      
      .addCase(telematelFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(telematelFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.testConnectionFilesOut = action.payload;
      })
      .addCase(telematelFiles.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
});

export const {
  setUserAutomations,
  setAddConnectionAutomationsByGmail,
  setLabelTitleDescription,
  setAutomateSelectedFromDropdown,
  setVariables,
  setDeleteAuthData,
  setDeleteAuthDrive,
  setSelectedEmailConnection,
  setConfigurationData,
  setAutomateSelected,
  setVariablesSelectedToRenameFiles,
  setAutomateNameTitleIn,
  setAutomateNameTitleOut,
  setShowEndPointVariables,
  setVariableSelectedToEnpoint,
  setAllVariablesFromEnPointUse,
  setTryConnectionAutomate,
  cleanTryConnectionAutomate,
  setWhatsappQr,
  setFilteredAutomateSelected,
} = automationsSlices.actions;

export default automationsSlices.reducer;
