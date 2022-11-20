import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface VideoSlice {
  modal: boolean;
}

const initialState: VideoSlice = {
  modal: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    showVideoSlice: (state) => {
      state.modal = true;
    },
    hideVideoSlice: (state) => {
      state.modal = false;
    },
  },
});

export const { showVideoSlice, hideVideoSlice } = videoSlice.actions;
export default videoSlice.reducer;
