
import { createSlice } from '@reduxjs/toolkit';
import { 
  getAgents,
  getAgentsByIds
} from '../actions/agents';

const agentsSlice = createSlice({
  name: 'agents',
  initialState: {
    agents: [],
    loading: false,
    error: null,
    fatherNewAgent:'',
    idFatherNewAgent:'',
    selectedAgentSlice:''
  },
  reducers: {
    setFatherNewAgent: (state, action) => {
        state.fatherNewAgent = action.payload;
      },
      setIdFatherNewAgent: (state, action) => {
        state.idFatherNewAgent = action.payload;
      },
      setSelectedAgentSlice: (state, action) => {
        state.selectedAgentSlice = action.payload;
      },
    },
  extraReducers: (builder) => {
    builder
      .addCase(getAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload; 
      })
      .addCase(getAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })

      .addCase(getAgentsByIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAgentsByIds.fulfilled, (state, action) => {
        state.loading = false;
        const currentAgents = Array.isArray(state.agents) ? state.agents : [];
        const newAgents = Array.isArray(action.payload) ? action.payload : [];

      })
      .addCase(getAgentsByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
  },
});

export const { setFatherNewAgent,setSelectedAgentSlice,setIdFatherNewAgent } = agentsSlice.actions;

export default agentsSlice.reducer;
