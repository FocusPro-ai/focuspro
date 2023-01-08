import { BookmarkIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import React, { useState } from "react";
import DropDownProfile from "../Todo/profile/DropDownProfile";

const TaskNoteComponent = () => {
  const router = useRouter();
  const [taskHeading, setTaskHeading] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  return (
    <div className="w-full shadow-xl min-h-[100vh]">
      <div className="w-full flex items-center justify-between p-4">
        {/* <DropDownProfile /> */}
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 border-none flex items-center rounded-md p-2 hover:bg-blue-600 text-white"
        >
          <ChevronLeftIcon height={25} width={25} />
          <span>Go back</span>
        </button>
        <div className="flex space-x-2 items-center">
          <div className="bg-red-600 animate-pulse rounded-full h-[30px] w-[30px]"></div>
          <h1 className="font-bold text-2xl">
            {taskHeading == "" ? "Focus Mode [25:00]" : taskHeading}
          </h1>
        </div>
        <button className="bg-[#2602f3] border-none flex items-center rounded-md p-2 hover:bg-[#3b1bf6]  text-white">
          <span>Save Notes</span>
        </button>
      </div>
      <div className="mx-[1rem] flex flex-col space-y-2">
        {/* Task Name */}
        <div>
          <input
            type="text"
            value={taskHeading}
            onChange={(e) => setTaskHeading(e.target.value)}
            className="text-5xl font-bold px-3 text-gray-800 outline-none w-full"
            placeholder="Task Heading"
          />
        </div>
        {/* Task Description */}
        <div className="shadow-lg rounded-md">
          <textarea
            cols={100}
            placeholder="Add a description for the task"
            className="w-full  resize-none text-gray-800 rounded-sm outline-none py-2 px-4 h-[450px]"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskNoteComponent;
