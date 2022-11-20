/* eslint-disable react/no-unescaped-entities */
import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { RootState } from "../../../app/store";
import { changeAllTaskModalState } from "../../../slices/allTaskModalSlice";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../pages/loading";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  addTaskDescription,
  changeTaskModalSlice,
} from "../../../slices/taskModalSlice";
import UpdateTaskModal from "../updateTaskModal/updateTask";

type userDataType = {
  id: string | undefined;
};

const AllTaskModal = () => {
  const [heading, setHeading] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [importance, setImportance] = useState<number>(5);
  const [deadline, setDeadline] = useState<Dayjs | null>(null);

  const modalState = useSelector(
    (state: RootState) => state.allTaskModal.modal
  );
  const dispatch = useDispatch();
  const userData: any = useSelector((state: RootState) => state.user.user);
  const handleDeleteOfTask = async (id: string) => {
    const response = await fetch("/api/Task/deleteTask", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-type": "application/json",
      },
    }).then((data) => {
      toast.success("Task Deleted Succesfully", {
        icon: "🧹",
        duration: 3000,
      });
    });
  };
  const showUrgentImpTodo = async () => {
    const response = await fetch("/api/matrix/urgentAndImp", {
      method: "POST",
      body: JSON.stringify({ userId: userData.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const showUrgentNotImpTodo = async () => {
    const response = await fetch("/api/matrix/notImpUrgent", {
      method: "POST",
      body: JSON.stringify({ userId: userData.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const showNotUrgentImpTodo = async () => {
    const response = await fetch("/api/matrix/notUrgentImp", {
      method: "POST",
      body: JSON.stringify({ userId: userData.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const showNotUrgentNotImpTodo = async () => {
    const response = await fetch("/api/matrix/notImpnotUrgent", {
      method: "POST",
      body: JSON.stringify({ userId: userData.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const showLeftBehindTask = async () => {
    const response = await fetch("/api/matrix/somethingLeft", {
      method: "POST",
      body: JSON.stringify({ userId: userData.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const showNotToWorry = async () => {
    const response = await fetch("/api/matrix/notToWorry", {
      method: "POST",
      body: JSON.stringify({ userId: userData.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const { data: allUrgentImpTodo, isLoading: taskLoading } = useQuery(
    ["urgent-imp-task"],
    showUrgentImpTodo,
    {
      refetchInterval: 6000,

      enabled: !!userData?.id,
    }
  );
  const { data: allNotUrgImpTodo, isLoading: allNotUrgImpLoading } = useQuery(
    ["not-urgent-imp-task"],
    showNotUrgentImpTodo,
    {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    }
  );
  const { data: allNotImpUrgTodo, isLoading: allNotImpUrgLoading } = useQuery(
    ["urgent-not-imp-task"],
    showUrgentNotImpTodo,
    {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    }
  );
  const { data: allNotUrgNotImpTodo, isLoading: allNotUrgNotImpLoading } =
    useQuery(["not-urgent-not-imp-task"], showNotUrgentNotImpTodo, {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    });
  const { data: allLeftBehind, isLoading: allLeftBehindLoading } = useQuery(
    ["left-behind-task"],
    showLeftBehindTask,
    {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    }
  );
  const { data: notToWorry, isLoading: notToWorryLoading } = useQuery(
    ["not-to-worry"],
    showNotToWorry,
    {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    }
  );
  if (
    allLeftBehindLoading ||
    notToWorryLoading ||
    allNotImpUrgLoading ||
    allNotUrgNotImpLoading ||
    taskLoading ||
    allNotUrgNotImpLoading
  )
    <Loading />;
  return (
    <Transition appear show={modalState} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Toaster />

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto hide-scrollbar">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[900px] max-h-[700px] overflow-y-scroll hide-scrollbar transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl my-4 flex justify-between items-center font-bold leading-6 text-gray-900"
                >
                  <h1>All task</h1>
                  <XMarkIcon
                    height={35}
                    width={35}
                    className="cursor-pointer hover:bg-gray-200 p-2 rounded-full"
                    onClick={() => dispatch(changeAllTaskModalState())}
                  />
                </Dialog.Title>

                <div className="">
                  <h1 className="text-gray-400  flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Something Left Behind ({allLeftBehind?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <table width="100%" border={1}>
                      {allLeftBehind?.map((task: any) => (
                        <tr key={task.id}>
                          <div
                            onDoubleClick={() => {
                              dispatch(changeTaskModalSlice());
                              const task_prop = {
                                title: task.heading,
                                importance: task.importance,
                                deadline: task.deadline,
                                description: task.description,

                                id: task.id,
                              };
                              dispatch(addTaskDescription(task_prop));
                            }}
                            className="my-2 flex space-x-[2rem] group hover:bg-gray-100 py-1  justify-between"
                          >
                            <div className="w-[60%]   px-1 flex items-center">
                              <h1 className="flex-1 truncate">
                                {task.heading}
                              </h1>{" "}
                              <span
                                onClick={() => handleDeleteOfTask(task.id)}
                                className="hidden group-hover:block"
                              >
                                <TrashIcon
                                  className="hover:text-red-500 cursor-pointer"
                                  height={20}
                                  width={20}
                                />
                              </span>
                            </div>
                            <p className="w-[20%] text-center">
                              {task.importance}
                            </p>
                            <p className="w-[10%] text-center">
                              {task.completed ? "📆" : "❔"}
                            </p>
                            <span className="w-[20%]">
                              {new Date(task.deadline).toDateString()}
                            </span>
                          </div>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
                <div className="">
                  <h1 className="text-[#d60000]  flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Do it Today ({allUrgentImpTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <table width="100%">
                      {allUrgentImpTodo?.map((task: any) => (
                        <tr key={task.id}>
                          <div
                            key={task.id}
                            onDoubleClick={() => {
                              dispatch(changeTaskModalSlice());
                              const task_prop = {
                                title: task.heading,
                                importance: task.importance,
                                deadline: task.deadline,
                                description: task.description,

                                id: task.id,
                              };
                              dispatch(addTaskDescription(task_prop));
                            }}
                            className="my-2 flex space-x-[2rem] group hover:bg-gray-100 py-1  justify-between"
                          >
                            <div className="w-[60%]   px-1 flex items-center">
                              <h1 className="flex-1 truncate">
                                {task.heading}
                              </h1>{" "}
                              <span
                                onClick={() => handleDeleteOfTask(task.id)}
                                className="hidden group-hover:block group"
                              >
                                <TrashIcon
                                  className="hover:text-red-500 cursor-pointer"
                                  height={20}
                                  width={20}
                                />
                              </span>
                            </div>
                            <p className="w-[20%] text-center">
                              {task.importance}
                            </p>
                            <p className="w-[10%] text-center">
                              {task.completed ? "📆" : "❔"}
                            </p>
                            <span className="w-[20%]">
                              {new Date(task.deadline).toDateString()}
                            </span>
                          </div>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
                <div className="">
                  <h1 className="text-[#f5511d]   flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Schedule this Week ({allNotUrgImpTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <table width="100%">
                      {allNotUrgImpTodo?.map((task: any) => (
                        <tr key={task.id}>
                          <div
                            key={task.id}
                            onDoubleClick={() => {
                              dispatch(changeTaskModalSlice());
                              const task_prop = {
                                title: task.heading,
                                importance: task.importance,
                                deadline: task.deadline,
                                description: task.description,

                                id: task.id,
                              };
                              dispatch(addTaskDescription(task_prop));
                            }}
                            className="my-2 flex space-x-[2rem] group hover:bg-gray-100 py-1  justify-between"
                          >
                            <div className="w-[60%]   px-1 flex items-center">
                              <h1 className="flex-1 truncate">
                                {task.heading}
                              </h1>{" "}
                              <span
                                onClick={() => handleDeleteOfTask(task.id)}
                                className="hidden group-hover:block"
                              >
                                <TrashIcon
                                  className="hover:text-red-500 cursor-pointer"
                                  height={20}
                                  width={20}
                                />
                              </span>
                            </div>
                            <p className="w-[20%] text-center">
                              {task.importance}
                            </p>
                            <p className="w-[10%] text-center">
                              {task.completed ? "📆" : "❔"}
                            </p>
                            <span className="w-[20%]">
                              {new Date(task.deadline).toDateString()}
                            </span>
                          </div>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
                <div className="">
                  <h1 className="text-[#039be5] flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Decide or Delegate ({allNotImpUrgTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <table width="100%">
                      {allNotImpUrgTodo?.map((task: any) => (
                        <tr key={task.id}>
                          <div
                            key={task.id}
                            onDoubleClick={() => {
                              dispatch(changeTaskModalSlice());
                              const task_prop = {
                                title: task.heading,
                                importance: task.importance,
                                deadline: task.deadline,
                                description: task.description,

                                id: task.id,
                              };
                              dispatch(addTaskDescription(task_prop));
                            }}
                            className="my-2 flex space-x-[2rem] group hover:bg-gray-100 py-1  justify-between"
                          >
                            <div className="w-[60%]   px-1 flex items-center">
                              <h1 className="flex-1 truncate">
                                {task.heading}
                              </h1>{" "}
                              <span
                                onClick={() => handleDeleteOfTask(task.id)}
                                className="hidden group-hover:block"
                              >
                                <TrashIcon
                                  className="hover:text-red-500 cursor-pointer"
                                  height={20}
                                  width={20}
                                />
                              </span>
                            </div>
                            <p className="w-[20%] text-center">
                              {task.importance}
                            </p>
                            <p className="w-[10%] text-center">
                              {task.completed ? "📆" : "❔"}
                            </p>
                            <span className="w-[20%]">
                              {new Date(task.deadline).toDateString()}
                            </span>
                          </div>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
                <div className="">
                  <h1 className="text-black  flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Eliminate ({allNotUrgNotImpTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <table width="100%">
                      {allNotUrgNotImpTodo?.map((task: any) => (
                        <tr
                          onDoubleClick={() => {
                            dispatch(changeTaskModalSlice());
                            const task_prop = {
                              title: task.heading,
                              importance: task.importance,
                              deadline: task.deadline,
                              description: task.description,

                              id: task.id,
                            };
                            dispatch(addTaskDescription(task_prop));
                          }}
                          key={task.id}
                          className="my-2 flex space-x-[2rem] group hover:bg-gray-100 py-1  justify-between"
                        >
                          <div className="w-[60%]   px-1 flex items-center">
                            <h1 className="flex-1 truncate">{task.heading}</h1>{" "}
                            <span
                              onClick={() => handleDeleteOfTask(task.id)}
                              className="hidden group-hover:block"
                            >
                              <TrashIcon
                                className="hover:text-red-500 cursor-pointer"
                                height={20}
                                width={20}
                              />
                            </span>
                          </div>
                          <p className="w-[20%] text-center">
                            {task.importance}
                          </p>
                          <p className="w-[10%] text-center">
                            {task.completed ? "📆" : "❔"}
                          </p>
                          <span className="w-[20%]">
                            {new Date(task.deadline).toDateString()}
                          </span>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
                <div className="">
                  <h1 className="text-[#939DA8]  flex space-x-2   items-center font-bold text-xl py-2">
                    <span>
                      Don't worry about this yet... ({notToWorry?.length})
                    </span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <table width="100%">
                      {notToWorry?.map((task: any) => (
                        <tr
                          onDoubleClick={() => {
                            dispatch(changeTaskModalSlice());
                            const task_prop = {
                              title: task.heading,
                              importance: task.importance,
                              deadline: task.deadline,
                              description: task.description,

                              id: task.id,
                            };
                            dispatch(addTaskDescription(task_prop));
                          }}
                          key={task.id}
                          className="my-2 flex space-x-[2rem] group hover:bg-gray-100 py-1  justify-between"
                        >
                          <div className="w-[60%]   px-1 flex items-center">
                            <h1 className="flex-1 truncate">{task.heading}</h1>{" "}
                            <span
                              onClick={() => handleDeleteOfTask(task.id)}
                              className="hidden group-hover:block"
                            >
                              <TrashIcon
                                className="hover:text-red-500 cursor-pointer"
                                height={20}
                                width={20}
                              />
                            </span>
                          </div>
                          <p className="w-[20%] text-center">
                            {task.importance}
                          </p>
                          <p className="w-[10%] text-center">
                            {task.completed ? "📆" : "❔"}
                          </p>
                          <span className="w-[20%]">
                            {new Date(task.deadline).toDateString()}
                          </span>
                        </tr>
                      ))}
                    </table>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AllTaskModal;
