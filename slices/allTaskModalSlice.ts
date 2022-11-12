import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AllTaskModalState {
  modal: boolean;
}

const initialState: AllTaskModalState = {
  modal: false,
};

export const allTaskModalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    changeAllTaskModalState: (state) => {
      state.modal = !state.modal;
    },
  },
});

export const { changeAllTaskModalState } = allTaskModalSlice.actions;
export default allTaskModalSlice.reducer;
