import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  eventModalState: false,
  eventModal: [],
};

export const eventModalSlice = createSlice({
  name: "eventModal",
  initialState,
  reducers: {
    changeEventModalState: (state) => {
      state.eventModalState = !state.eventModalState;
    },
    addEventDescription: (state, action) => {
      state.eventModal = action.payload;
    },
  },
});

export const { changeEventModalState, addEventDescription } =
  eventModalSlice.actions;
export default eventModalSlice.reducer;
