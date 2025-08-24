import { createSlice } from "@reduxjs/toolkit";
import {
  createContact,
  deleteContacts,
  getAllContacts,
  getContactsStatusViewed,
  getOneContact,
  markContactAsSeen,
  updateContact,
} from "../actions/contacts";

const contactsSlices = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    contact: null,
    loading: false,
    unseenCount: 0,
    error: false,
    totalContacts:0,
    sliceNewContactProp:false,
    sliceShowNewBill: false,
    fatherNewContact:'',
    fatherIdNewcontact:'',
    contactTableId:''
  },
  reducers: {
    setContact: (state, action) => {
      state.contact = action.payload;
    },
    clearContact: (state) => {
      state.contact = null;
    },
    sliceSetNewContact: (state, action) => {
      state.sliceNewContactProp = action.payload
    },
    sliceSetShowNewBill: (state, action) => {
      state.sliceShowNewBill = action.payload
    },
    setFatherNewContact: (state, action) => {
      state.fatherNewContact = action.payload;
    },
     setFatherIdNewContact: (state, action) => {
      state.fatherIdNewcontact = action.payload;
    },
    setContactTableId: (state, action) => {
      state.contactTableId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(createContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getAllContacts.pending, (state) => {
        state.error = false;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.error = false;
        state.contacts = action.payload.contacts;
        state.totalContacts = action.payload.total;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.error = true;
      })

      .addCase(updateContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContacts.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteContacts.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(getOneContact.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOneContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contact = action.payload
      })
      .addCase(getOneContact.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      

      .addCase(getContactsStatusViewed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContactsStatusViewed.fulfilled, (state, action) => {
        state.loading = false;
        state.unseenCount = action.payload.totalUnseenContacts
      })
      .addCase(getContactsStatusViewed.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(markContactAsSeen.pending, (state) => {
        state.loading = true;
      })
      .addCase(markContactAsSeen.fulfilled, (state, action) => {
        state.loading = false;
      
        const { alreadySeen } = action.payload;
      
        if (!alreadySeen && typeof state.unseenCount === "number" && state.unseenCount > 0) {
          state.unseenCount -= 1;
        }
      })
      
      
      .addCase(markContactAsSeen.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
  },
});

export const { setContact, clearContact,sliceSetNewContact,sliceSetShowNewBill,setFatherNewContact,setFatherIdNewContact,setContactTableId } = contactsSlices.actions;

export default contactsSlices.reducer;
