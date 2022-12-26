import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface eventModalType {
  title: string;
  start: Date;
  end: Date;
  id: any;
  backgroundColor: string;
  description: string;
  colorId: any;
  meetingLink: string;
}

interface initaltype {
  eventModalState: boolean;
  eventModal: eventModalType;
}

const initialState: initaltype = {
  eventModalState: false,
  eventModal: {
    title: "",
    start: new Date(),
    end: new Date(),
    backgroundColor: "",
    description: "",
    id: undefined,
    colorId: undefined,
    meetingLink: "",
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
