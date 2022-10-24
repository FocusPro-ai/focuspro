import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../slices/modalSlice";
import userReducer from "../slices/userSlice";
import eventModalReducer from "../slices/eventModalSlice";
import taskModalReducer from "../slices/taskModalSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    eventModal: eventModalReducer,
    taskModal: taskModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
