import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParticipantsState } from './store.js';


interface AddParticipantPayload {
  planId: string;
  nickname: string;
}
interface RemoveParticipantPayload {
  planId: string;
  index: number; 
}

const STORAGE_KEY = "participants";

const savedParticipants = localStorage.getItem(STORAGE_KEY);
const initialState: ParticipantsState = savedParticipants
  ? JSON.parse(savedParticipants)
  : {};

  const participantSlice = createSlice({
    name: "participants",
    initialState,
    reducers: {
      addParticipant: (state, action: PayloadAction<AddParticipantPayload>) => {
        const { planId, nickname } = action.payload;
        if (!state[planId]) {
          state[planId] = [];
        }
        state[planId].push(nickname);
        // Save to localStorage after adding
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      },
      removeParticipant: (state, action: PayloadAction<RemoveParticipantPayload>) => {
        const { planId, index } = action.payload;
        if (state[planId]) {
          state[planId].splice(index, 1);
          // Save to localStorage after removing
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }
      },
    },
  });

export const { addParticipant, removeParticipant } = participantSlice.actions;
export default participantSlice.reducer;
