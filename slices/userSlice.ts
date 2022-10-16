import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: undefined,
};

export const modalSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    AddUserDetails: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { AddUserDetails } = modalSlice.actions;
export default modalSlice.reducer;
