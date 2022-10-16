import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserSlice {
  user: [];
}

const initialState: UserSlice = {
  user: [],
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
