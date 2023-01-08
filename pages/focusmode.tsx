import { useSession } from "next-auth/react";
import React from "react";
import MiniCalendarComponent from "../components/MiniCalendarComponent/MiniCalendar";
import TaskNoteComponent from "../components/TaskNoteComponent/TaskNote";
import Login from "./login";

const Focusmode = () => {
  const { data: session } = useSession();
  if (!session) {
    return <Login />;
  }
  return (
    <div className="max-h-screen  w-full flex">
      <MiniCalendarComponent />
      <TaskNoteComponent />
    </div>
  );
};

export default Focusmode;
