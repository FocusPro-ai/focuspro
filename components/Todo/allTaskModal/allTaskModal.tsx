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

  const showUrgentImpTodo = async () => {
    const response = await fetch("/api/matrix/urgentAndImp", {
      method: "POST",
      body: JSON.stringify({ userId: userData?.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const showUrgentNotImpTodo = async () => {
    const response = await fetch("/api/matrix/notImpUrgent", {
      method: "POST",
      body: JSON.stringify({ userId: userData?.id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.json();
  };
  const showNotUrgentImpTodo = async () => {
    const response = await fetch("/api/matrix/notUrgentImp", {
      method: "POST",
      body: JSON.stringify({ userId: userData?.id }),
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
  const { data: allNotUrgImpTodo, isLoading } = useQuery(
    ["not-urgent-imp-task"],
    showNotUrgentImpTodo,
    {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    }
  );
  const { data: allNotImpUrgTodo } = useQuery(
    ["urgent-not-imp-task"],
    showUrgentNotImpTodo,
    {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    }
  );
  return (
    <Transition appear show={modalState} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(changeAllTaskModalState())}
      >
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

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-[900px] max-h-[700px] overflow-y-scroll transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl my-4 font-bold leading-6 text-gray-900"
                >
                  All Task
                </Dialog.Title>
                <div className="">
                  <h1 className="text-[#d60000]  flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Do it Today ({allUrgentImpTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <div className="flex space-x-[2rem] px-2 bg-gray-200 py-2 items-center justify-between">
                      <h1 className="w-[60%] font-semibold text-xl">Task</h1>

                      <h1 className="w-[20%] font-semibold text-xl">
                        Importance
                      </h1>
                      <h1 className="w-[10%] font-semibold text-xl">Status</h1>
                      <h1 className="w-[20%] font-semibold text-xl">
                        Deadline
                      </h1>
                    </div>
                    {allUrgentImpTodo?.map((task: any) => (
                      <div
                        key={task.id}
                        className="my-2 flex space-x-[2rem]  justify-between"
                      >
                        <h4 className="w-[60%]">{task.heading}</h4>
                        <p className="w-[20%] text-center">{task.importance}</p>
                        <p className="w-[10%] text-center">
                          {task.completed ? "✅" : "❌"}
                        </p>
                        <span className="w-[20%]">
                          {new Date(task.deadline).toDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="">
                  <h1 className="text-[#e67c73]   flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Schedule this Week ({allNotImpUrgTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <div className="flex space-x-[2rem] px-2 bg-gray-200 py-2 items-center justify-between">
                      <h1 className="w-[60%] font-semibold text-xl">Task</h1>

                      <h1 className="w-[20%] font-semibold text-xl">
                        Importance
                      </h1>
                      <h1 className="w-[10%] font-semibold text-xl">Status</h1>
                      <h1 className="w-[20%] font-semibold text-xl">
                        Deadline
                      </h1>
                    </div>
                    {allNotImpUrgTodo?.map((task: any) => (
                      <div
                        key={task.id}
                        className="my-2 flex space-x-[2rem]  justify-between"
                      >
                        <h4 className="w-[60%]">{task.heading}</h4>
                        <p className="w-[20%] text-center">{task.importance}</p>
                        <p className="w-[10%] text-center">
                          {task.completed ? "✅" : "❌"}
                        </p>
                        <span className="w-[20%]">
                          {new Date(task.deadline).toDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="">
                  <h1 className="text-[#039be5] flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Decide or Delegate ({allNotUrgImpTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <div className="flex space-x-[2rem] px-2 bg-gray-200 py-2 items-center justify-between">
                      <h1 className="w-[60%] font-semibold text-xl">Task</h1>

                      <h1 className="w-[20%] font-semibold text-xl">
                        Importance
                      </h1>
                      <h1 className="w-[10%] font-semibold text-xl">Status</h1>
                      <h1 className="w-[20%] font-semibold text-xl">
                        Deadline
                      </h1>
                    </div>
                    {allNotUrgImpTodo?.map((task: any) => (
                      <div
                        key={task.id}
                        className="my-2 flex space-x-[2rem]  justify-between"
                      >
                        <h4 className="w-[60%]">{task.heading}</h4>
                        <p className="w-[20%] text-center">{task.importance}</p>
                        <p className="w-[10%] text-center">
                          {task.completed ? "✅" : "❌"}
                        </p>
                        <span className="w-[20%]">
                          {new Date(task.deadline).toDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="">
                  <h1 className="text-gray-600  flex space-x-2   items-center font-bold text-xl py-2">
                    <span>Eliminate ({allUrgentImpTodo?.length})</span>
                  </h1>
                  <div className="h-[25%] hide-scrollbar  overflow-y-scroll">
                    <div className="flex space-x-[2rem] px-2 bg-gray-200 py-2 items-center justify-between">
                      <h1 className="w-[60%] font-semibold text-xl">Task</h1>

                      <h1 className="w-[20%] font-semibold text-xl">
                        Importance
                      </h1>
                      <h1 className="w-[10%] font-semibold text-xl">Status</h1>
                      <h1 className="w-[20%] font-semibold text-xl">
                        Deadline
                      </h1>
                    </div>
                    {allUrgentImpTodo?.map((task: any) => (
                      <div
                        key={task.id}
                        className="my-2 flex space-x-[2rem]  justify-between"
                      >
                        <h4 className="w-[60%]">{task.heading}</h4>
                        <p className="w-[20%] text-center">{task.importance}</p>
                        <p className="w-[10%] text-center">
                          {task.completed ? "✅" : "❌"}
                        </p>
                        <span className="w-[20%]">
                          {new Date(task.deadline).toDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-blue-600 font-semibold hover:bg-blue-500 rounded-md text-white p-2 "
                    onClick={() => dispatch(changeAllTaskModalState())}
                  >
                    Close
                  </button>
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
