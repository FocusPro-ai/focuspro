import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettingSlice {
  setting: boolean;
}

const initialState: SettingSlice = {
  setting: false,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    changeSettingSlice: (state) => {
      state.setting = !state.setting;
    },
  },
});

export const { changeSettingSlice } = settingSlice.actions;
export default settingSlice.reducer;
