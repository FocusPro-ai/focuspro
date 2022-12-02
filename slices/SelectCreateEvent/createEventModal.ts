import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EventModalType {
  start: any;
  end: any;
  title: string;
  description: string;
}

export interface EventModalSlice {
  eventModalSlice: boolean;
  eventModal: EventModalType;
}

const initialState: EventModalSlice = {
  eventModalSlice: false,
  eventModal: {
    title: "",
    description: "",
    start: "",
    end: "",
  },
};

export const createEventModal = createSlice({
  name: "createEventModal",
  initialState,
  reducers: {
    changeEventModalSlice: (state) => {
      state.eventModalSlice = !state.eventModalSlice;
    },
    addEventModal: (state, action) => {
      state.eventModal = action.payload;
    },
  },
});

export const { changeEventModalSlice, addEventModal } =
  createEventModal.actions;
export default createEventModal.reducer;
