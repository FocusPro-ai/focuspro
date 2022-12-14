import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Popover, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { changeTaskModalSlice } from "../../../slices/taskModalSlice";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { Dayjs } from "dayjs";

const UpdateTaskModal = () => {
  const taskModalState = useSelector(
    (state: RootState) => state.taskModal.modal
  );
  const taskModalInfo = useSelector(
    (state: RootState) => state.taskModal.taskModal
  );
  const dispatch = useDispatch();

  const [importance, setImportance] = useState<number>(5);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Dayjs | null>(null);

  const deleteTask = async () => {
    const id = taskModalInfo.id;
    const response = await fetch("api/Task/deleteTask", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id }),
    }).then((data) => {
      toast.success("Successfully Task Deleted.", {
        icon: "🗑",
        duration: 3000,
      });
      dispatch(changeTaskModalSlice());
    });
  };

  const updateTask = async () => {
    const update_prop = {
      id: taskModalInfo.id,
      heading,
      description,
      importance,
      deadline,
    };

    const response = await fetch("/api/Task/updateTask", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(update_prop),
    }).then((data) => {
      toast.success("Task updated.", { duration: 3000 });
      dispatch(changeTaskModalSlice());
    });
  };
  useEffect(() => {
    setHeading(taskModalInfo.title);
    setImportance(taskModalInfo.importance);
    setDescription(taskModalInfo.description);
    setDeadline(taskModalInfo.deadline);
  }, [taskModalInfo, taskModalState]);

  return (
    <Popover>
      <Transition
        show={taskModalState}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-[40%] 2xl:left-[30%] z-[999]   w-[450px]  mt-3  -translate-x-1/2 transform px-4 sm:px-0">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative flex flex-col h-[500px]  bg-white pt-1 z-50 w-[450px]">
              <div className="flex justify-between items-center m-1 mx-3">
                <span className="text-[12px] text-gray-400 cursor-default  ">
                  Schedule task by Dragging it to the Calendar
                </span>
                <CheckIcon
                  height={35}
                  width={35}
                  className="text-gray-500 cursor-pointer p-2 hover:bg-gray-200 hover:text-blue-600 rounded-full"
                />
              </div>
              <div className="m-4 my-0">
                <div className="flex space-y-2 my-2 flex-col">
                  <label htmlFor="Task-title" className="font-bold">
                    Task
                  </label>
                  <input
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    type="text"
                    className="bg-gray-50 py-2 px-1 border outline-none border-gray-300 rounded-md w-full"
                    placeholder="Task headline"
                  />
                </div>
                <div className="flex space-y-2 my-2 flex-col">
                  <label htmlFor="Task-title" className="font-bold">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-50 resize-none h-[100px] py-2 px-1 border outline-none border-gray-300 rounded-md w-full"
                    placeholder="Description of task"
                  />
                </div>
                <div className="flex space-y-2 my-2 flex-col">
                  <label className="font-bold flex space-y-1 flex-col">
                    Importance ({importance})
                    <span className="text-[13px] text-gray-500">
                      How important is this task to reach your goal?
                    </span>
                  </label>
                  <input
                    type="range"
                    value={importance}
                    onChange={(e) => setImportance(Number(e.target.value))}
                    min={1}
                    max={10}
                    defaultValue={9}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-300"
                  />
                </div>
                <div className="flex space-y-2 my-2 flex-col">
                  <label className="font-bold">Deadline</label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={deadline}
                      onChange={(newValue) => {
                        setDeadline(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div className="mx-4 mb-0 justify-between flex items-center">
                <TrashIcon
                  onClick={() => deleteTask()}
                  height={35}
                  width={35}
                  className="hover:bg-gray-200 hover:text-red-500 cursor-pointer rounded-full p-2 "
                />
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dispatch(changeTaskModalSlice())}
                    className="hover:bg-gray-50 p-1  rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateTask()}
                    className="bg-blue-600 hover:bg-blue-500  text-white rounded-md py-1 px-4"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default UpdateTaskModal;
