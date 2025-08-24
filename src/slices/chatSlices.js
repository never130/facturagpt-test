import { createSlice } from "@reduxjs/toolkit";
import {
  fetchByMenu,
  fetchByChat,
  deleteChat,
  getPublicAgents,
  getAllAgentsWithCreator
} from "../actions/chat";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatList: [], 
    selectedAgent: null,  
    currentChat: {
      id: null,
      messages: [], 
    },
    messages: [],
    loading: false,
    error: null,
    searchTerm: "",
    chatAgentId: null,
    publicAgents:[],
    emptyChat:false
  },
  reducers: {
    setSelectedAgent: (state, action) => {
      state.selectedAgent = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setChatAgentId: (state, action) => {
      state.chatAgentId = action.payload;
    },
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setEmptyChat: (state, action) => {
      state.emptyChat = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addMessage: (state, action) => {
      state.currentChat.messages.push(action.payload);
    },
    clearCurrentChat: (state) => {
      state.currentChat = {
        id: null,
        messages: [],
      };
    },
    updateMessageByDocId: (state, action) => {
      const { docId, newText } = action.payload;
      if (state.currentChat.messages) {
        const messageIndex = state.currentChat.messages.findIndex(
          message => message.docId === docId
        );
        if (messageIndex !== -1) {
          state.currentChat.messages[messageIndex].text = {
            ...state.currentChat.messages[messageIndex].text,
            html: newText
          };
        }
      }
      if (state.messages) {
        const messageIndex = state.messages.findIndex(
          message => message.docId === docId
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex].text = {
            ...state.messages[messageIndex].text,
            html: newText
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchByMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.chatList = action.payload?.chats;
      })
   
      .addCase(fetchByMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchByChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByChat.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = {
          id: action.meta.arg.chatId,
          messages: action.payload?.messages || [],
          autoClear: action.payload?.autoClear || false,
          searchInWeb: action.payload?.searchInWeb || false,
        };
      })
      .addCase(fetchByChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

      })
      .addCase(getAllAgentsWithCreator.fulfilled, (state, action) => {
        state.loading = false;
        state.publicAgents = action.payload.agents
      })
      .addCase(getAllAgentsWithCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.loading = false;
       
        const chatIdToDelete = String(action.meta.arg.chatId);

  
        state.chatList = state.chatList.filter(chat => String(chat.id) !== chatIdToDelete);



        if (state.currentChat.id === action.meta.arg.chatId) {
          state.currentChat = {
            id: null,
            messages: [],
          };
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setSearchTerm, 
  addMessage, 
  clearCurrentChat,
  setSelectedAgent,
  setMessages,
  setChatAgentId,
  setChatList,
  setEmptyChat,
  updateMessageByDocId
} = chatSlice.actions;

export default chatSlice.reducer;