import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface eventModalType {
  title: string;
  start: any;
  end: any;
  id: any;
  backgroundColor: string;
  description: string;
}

interface initaltype {
  eventModalState: boolean;
  eventModal: eventModalType;
}

const initialState: initaltype = {
  eventModalState: false,
  eventModal: {
    title: "",
    start: undefined,
    end: undefined,
    backgroundColor: "",
    description: "",
    id: undefined,
  },
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
