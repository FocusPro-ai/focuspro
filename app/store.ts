import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../slices/modalSlice";
import userReducer from "../slices/userSlice";
import eventModalReducer from "../slices/eventModalSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    user: userReducer,
    eventModal: eventModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
