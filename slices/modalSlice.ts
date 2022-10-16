import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ModalState {
  modal: boolean;
}

const initialState: ModalState = {
  modal: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    changeModalState: (state) => {
      state.modal = !state.modal;
    },
  },
});

export const { changeModalState } = modalSlice.actions;
export default modalSlice.reducer;
