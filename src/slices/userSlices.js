import { createSlice } from "@reduxjs/toolkit";
import {
  loginToManager,
  updateAccount,
  updateTokens,
  getTokens,
  getAllAccounts,
  deleteAccount,
  getVariable,
  createVariable,
  getAllInvoices,
  getTablesWithCounts,
  getTableDataFiltered,
  refreshTableInfo,
  deleteTable,
  getTableData,
  getTables,
  getTableById,
  getLastPayment,
  getUpgradeNotes,
  upgradeNote,
  deleteCategoryNote
} from "../actions/user";

const userSlices = createSlice({
  name: "user",
  initialState: {
    user: null,
    accounts: [],
    account: {},
    updatingAccountLoading: false,
    loginLoading: false,
    error: false,
    
    isWorkBackend: false,
    loading: false,
    totalAccounts: 0,
    totalAssets: 0,
    totalContacts: 0,
    totalDocs: 0,
    totalValue: 0,
    profileImage: '',
    initials: '',
    selectedDocument: null,
    tableView: [],
    contactsTableLength: 0,
    firstTimeContact: false,
    assetsTableLength: 0,
    firstTimeAssets: false,
    docsTableLength: 0,
    firstTimeDocs: false,
    category: {},
   
    showModal: false,
    paramModal: {},
    invoices: [],
    tablesSidebar: [],
    tables: [],
    contactsTable: [],
    assetsTable: [],
    docsTable: [],
    tableDataMap: {},
    tokens: [],
    lastPayment: '',
    question: '',
    fatherNewBill: "",
    fatherIdNewBill: "",
    totalPaginationTables: 0,
    notes: [],
    typeContentAutomateSlice: "",
    selectedAutomationDataSlice: "",
    roleAutomateSlice: "",
    selectedAutomateToDeleteSlice: "",
    isEditingAutomation: 'chat',
    tutorialAgain: false,
    currentTableNew: [],
    tablesFiltered: [],
    globalSearch: '',
    isAppleOS: false,
    categories: [{
      ref: "editNote",
      name: "Editar nota",
      description: "Añadir una nota",
    }]
  },
  reducers: {
    setShowModal: (state, action) => {
      if (typeof action.payload === 'object' && action.payload?.modal) {
        state.showModal = action.payload.modal;
        state.paramModal = {
          type: action.payload.type,
          variant: action.payload.variant,
          selectedOption: action.payload.selectedOption,
          idWorkspace: action.payload.idWorkspace,
          currentChat: action.payload.currentChat,
          agent: action.payload.agent,
          selectedOptionCommunity: action.payload.selectedOptionCommunity,
          action: action.payload.action

        }
      } else {
        state.showModal = action.payload;
      }
    },
    setuser: (state, action) => {
      state.user = action.payload;
      state.profileImage = action.payload.profileImage
      state.initials = action.payload.name?.split(" ").map((word) => word[0])
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },

    setShowAutomation: (state, action) => {
      state.showAutomation = action.payload;
    },

    selectDocument: (state, action) => {
      state.selectedDocument = action.payload;
    },
    setContactsTableLength: (state, action) => {
      state.contactsTableLength = action.payload;
    },
    setAssetsTableLength: (state, action) => {
      state.assetsTableLength = action.payload;
    },
    setDocsTableLength: (state, action) => {
      state.assetsTableLength = action.payload;
    },
    setFirstTimeContacts: (state, action) => {
      state.firstTimeContact = action.payload;
    },
    setFirstTimeAssets: (state, action) => {
      state.firstTimeAssets = action.payload;
    },
    setFirstTimeDocs: (state, action) => {
      state.firstTimeAssets = action.payload;
    },
    setQuestion: (state, action) => {
      state.question = action.payload;
    },
    setFatherNewBill: (state, action) => {
      state.fatherNewBill = action.payload;
    },
    setFatherIdNewBill: (state, action) => {
      state.fatherIdNewBill = action.payload;
    },
    setTypeContentAutomateSlice: (state, action) => {
      state.typeContentAutomateSlice = action.payload;
    },
    setIsEditingAutomation: (state, action) => {
      state.isEditingAutomation = action.payload;
    },
    setSelectedAutomationDataSlice: (state, action) => {
      state.selectedAutomationDataSlice = action.payload;
    },
    setRoleAutomateSlice: (state, action) => {
      state.roleAutomateSlice = action.payload;
    },
    setSelectedAutomateToDeleteSlice: (state, action) => {
      state.selectedAutomateToDeleteSlice = action.payload;
    },
    setCurrentTableNew: (state, action) => {
      state.currentTableNew = action.payload;
    },
    setTutorialAgain: (state, action) => {
      state.tutorialAgain = action.payload;
    },
    setGlobalSearch: (state, action) => {
      state.globalSearch = action.payload;
    },
    setIsAppleOS: (state, action) => {
      state.isAppleOS = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginToManager.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(loginToManager.fulfilled, (state, action) => {
        state.isWorkBackend = true
        state.loginLoading = false;
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(loginToManager.rejected, (state, action) => {
        state.error = action.payload;
        state.loginLoading = false;
      })

      .addCase(getAllAccounts.pending, (state) => {
      })
      .addCase(getAllAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload.accounts;
        state.totalAccounts = action.payload.total;
      })
      .addCase(getAllAccounts.rejected, (state, action) => {
        state.error = action.payload;
      })


      .addCase(updateAccount.pending, (state) => {
        state.updatingAccountLoading = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.updatingAccountLoading = false;
        if (action.payload?.id === state.user?.id) {
          state.user = action.payload;
        } else {
          state.accounts = state.accounts.map((account) => {
            if (account.id === action.payload.id) {
              return action.payload;
            }
            return account;
          });
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.updatingAccountLoading = false;
      })
      .addCase(updateTokens.fulfilled, (state, action) => {
        state.tokens = action.payload;
      })
      .addCase(getTokens.fulfilled, (state, action) => {
        state.tokens = action.payload;
      })


      .addCase(getTablesWithCounts.pending, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getTablesWithCounts.fulfilled, (state, action) => {
        state.tablesSidebar = action?.payload?.tables
      })
      .addCase(getTablesWithCounts.rejected, (state, action) => {
        state.error = action.payload;
      })



      .addCase(refreshTableInfo.fulfilled, (state, action) => {
        const updatedTable = action?.payload?.table;
        const index = state?.tablesSidebar?.findIndex(
          (t) => t?._id === updatedTable?._id
        );
        if (index !== -1) {
          state.tablesSidebar[index] = {
            ...state.tablesSidebar[index],
            ...updatedTable
          };
        }
      })
      .addCase(refreshTableInfo.rejected, (state, action) => {
        state.error = action.payload;
      })


      .addCase(deleteTable.fulfilled, (state, action) => {
        const deletedId = action.payload.tableId;
        state.tablesSidebar = state.tablesSidebar.filter((table) => table._id !== deletedId);

        state.tables = state.tables.filter(table => table._id !== deletedId);

        delete state.tableDataMap[deletedId];
      })
      .addCase(deleteTable.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al eliminar tabla";
      })

      .addCase(getTableData.fulfilled, (state, action) => {
        const { tableId, data } = action.payload;
        if (tableId && data) {
          state.tableDataMap[tableId] = data;
        }
      })

      .addCase(getTableDataFiltered.fulfilled, (state, action) => {
        // console.log('action.payload getTableDataFiltered', action.payload)
        const { tableId, data, total } = action.payload;
        if (total > state.totalPaginationTables) state.totalPaginationTables = total
        if (tableId && data) {
          state.tableDataMap[tableId] = data;
          if (data.length > 0) {
            data.forEach(row => {
              if (row.type === "assets") {
                if (!state.assetsTable.find(rowTable => rowTable._id === row._id)) state.assetsTable = [...state.assetsTable, row]
              }
              if (row.type === "contacts") {
                if (!state.contactsTable.find(rowTable => rowTable._id === row._id)) state.contactsTable = [...state.contactsTable, row]
              }
              if (row.type === "docs") {
                if (!state.docsTable.find(rowTable => rowTable._id === row._id)) state.docsTable = [...state.docsTable, row]
              }
            })
          }

        }
      })
      .addCase(getTableData.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al eliminar tabla";
      })

      .addCase(getTables.fulfilled, (state, action) => {
        if (action.payload?.search) state.tablesFiltered = action.payload?.tables
        else {
          state.assetsTable = []
          state.contactsTable = []
          state.docsTable = []
          const rawTables = action.payload?.tables || [];
          state.tables = rawTables.map((t) => ({
            ...t,
            headers: [...t.headers],
          }))
        }
      })
      .addCase(getTables.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al eliminar tabla";
      })

      .addCase(getTableById.fulfilled, (state, action) => {
        const table = action.payload?.table;
        if (table) {
          state.tables = [{
            ...table,
            headers: [...table.headers],
          }];
        }
      })
      .addCase(getTableById.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al eliminar tabla";
      })
      .addCase(getLastPayment.fulfilled, (state, action) => {
        state.lastPayment = action.payload?.lastPayment
      })
      .addCase(getLastPayment.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al eliminar tabla";
      })

      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(account => account.id !== action.payload.id)
      })

      .addCase(getVariable.fulfilled, (state, action) => {
        if (action.meta.arg.type === 'category') state.category = { contacts: action.payload.data[0]?.contacts, assets: action.payload.data[0]?.assets }

        else if (action.meta.arg.type === 'tableView') state.tableView = action.payload.data[0]
      })

      .addCase(upgradeNote.fulfilled, (state, action) => {
        if (action.payload.category) {
          const index = state.categories.findIndex(category => category.ref === action.payload.category.ref)
          if (index == -1) {
            state.categories.push(action.payload.category)
          }
        }

        if (action.payload.data) {
          state.notes.push(action.payload.data)
        }
      })
      .addCase(upgradeNote.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al actualizar notas";
      })
      .addCase(getUpgradeNotes.fulfilled, (state, action) => {

        const updatedCategory = [state.categories[0], ...action.payload.categories]
        state.categories = updatedCategory


        state.notes = action.payload.notes
      })
      .addCase(getUpgradeNotes.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al actualizar notas";
      })
      .addCase(deleteCategoryNote.fulfilled, (state, action) => {
        if (action.payload && action.payload.data.id) {
          const index = state.categories.findIndex(category => category._id === action.payload.data.id)
          if (index !== -1) {
            state.categories.splice(index, 1)
          }
        } else if (action.payload && action.payload.data === 'all') {
          state.categories = []
          state.notes = []
        }
      })
      .addCase(deleteCategoryNote.rejected, (state, action) => {
        state.error = action.payload?.error || "Error al actualizar notas";
      })
  },
});

export const { 
  setuser,
 
  setShowAutomation,
  selectDocument,
  setContactsTableLength,
  setFirstTimeContacts,
  setAssetsTableLength,
  setFirstTimeAssets,
  setDocsTableLength,
  setFirstTimeDocs,
  
  setShowModal,
  setQuestion,
  setFatherNewBill,
  setFatherIdNewBill,
  setTypeContentAutomateSlice,
  setSelectedAutomationDataSlice,
  setRoleAutomateSlice,
  setSelectedAutomateToDeleteSlice,
  setIsEditingAutomation,
  setCurrentTableNew,
  setTutorialAgain,
  setGlobalSearch,
  setIsAppleOS,
  setNotes,
  setCategories
} = userSlices.actions;

export default userSlices.reducer;

