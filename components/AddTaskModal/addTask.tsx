import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { Dialog, Transition } from "@headlessui/react";
import { changeModalState } from "../../slices/modalSlice";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type userDataType = {
  id: string | undefined;
};

const AddTaskModal = () => {
  const [heading, setHeading] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [importance, setImportance] = useState<number>(5);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const modalState = useSelector((state: RootState) => state.modal.modal);
  const dispatch = useDispatch();
  const userData: any = useSelector((state: RootState) => state.user.user);

  const submitTask = async () => {
    const userId = userData?.id;
    const response = await fetch("/api/Task/addTask", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        heading,
        userId,
        description,
        startDate,
        endDate,
        importance,
      }),
    });
    setDateRange([null, null]);
    setDescription("");
    setHeading("");
    setImportance(5);
    dispatch(changeModalState());
  };

  return (
    <Transition appear show={modalState} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(changeModalState())}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl text-center font-bold leading-6 text-gray-900"
                >
                  Add a Task
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-md text-gray-500">
                    Fill your all details and then focus on what really matters
                    to you !!
                  </p>
                  <form className="my-4">
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
                      <label className="font-bold">
                        Importance ({importance})
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
                  </form>
                </div>
                <div className="flex space-y-2 my-2 flex-col">
                  <label className="font-bold">Deadline</label>
                  <div className="border border-gray-300 p-2 rounded-md w-max">
                    <DatePicker
                      className="outline-none"
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update: any) => {
                        setDateRange(update);
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="bg-blue-600 font-semibold hover:bg-blue-500 rounded-md text-white p-2 "
                    onClick={() => {
                      if (
                        heading !== "" &&
                        startDate != null &&
                        endDate != null
                      ) {
                        submitTask();
                      }
                    }}
                  >
                    Submit the task
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

export default AddTaskModal;
