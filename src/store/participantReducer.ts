import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ParticipantsState } from './store';


interface AddParticipantPayload {
  planId: string;
  nickname: string;
}
interface RemoveParticipantPayload {
  planId: string;
  index: number; 
}


const savedParticipants = localStorage.getItem("participants");
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
    },
    removeParticipant: (state, action: PayloadAction<RemoveParticipantPayload>) => {
      const { planId, index } = action.payload;
      if (state[planId]) {
        state[planId].splice(index, 1);
      }
    },
  },
});

export const { addParticipant, removeParticipant } = participantSlice.actions;
export default participantSlice.reducer;
