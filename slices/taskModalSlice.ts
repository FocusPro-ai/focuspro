import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface taskModalType {
  title: string;
  importance: number;
  start: any;
  end: any;
  id: string;
  description: string;
}

export interface TaskModalSlice {
  modal: boolean;
  taskModal: taskModalType;
}

const initialState: TaskModalSlice = {
  modal: false,
  taskModal: {
    title: "",
    id: "",
    importance: 0,
    description: "",
    start: undefined,
    end: undefined,
  },
};

export const taskModal = createSlice({
  name: "taskModal",
  initialState,
  reducers: {
    changeTaskModalSlice: (state) => {
      state.modal = !state.modal;
    },
    addTaskDescription: (state, action) => {
      state.taskModal = action.payload;
    },
  },
});

export const { changeTaskModalSlice, addTaskDescription } = taskModal.actions;
export default taskModal.reducer;
