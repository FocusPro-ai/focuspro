import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { Dialog, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { changeEventModalState } from "../../slices/eventModalSlice";

type userDataType = {
  id: string | undefined;
};

const EventModalComponent = () => {
  const eventModalState = useSelector(
    (state: RootState) => state.eventModal.eventModalState
  );
  const eventModalInfo: any = useSelector(
    (state: RootState) => state.eventModal.eventModal
  );
  const dispatch = useDispatch();
  const startDate = new Date(eventModalInfo?.start);
  const endDate = new Date(eventModalInfo?.end);

  const startDateFormat = startDate.toDateString();
  const endDateFormat = endDate.toDateString();
  console.log(eventModalInfo.extendedProps.description);

  return (
    <Transition appear show={eventModalState} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => dispatch(changeEventModalState())}
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
              <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-3xl  text-center font-bold  text-gray-900"
                >
                  {eventModalInfo?.title}
                </Dialog.Title>
                <div className="my-4 flex flex-col space-y-1">
                  <p className="text-[15px] text-gray-500 font-semibold">
                    Starts : <span>{startDateFormat}</span>
                  </p>
                  <p className="text-[15px] text-gray-500 font-semibold">
                    Ends : <span>{endDateFormat}</span>
                  </p>
                </div>
                <p className="text-gray-600 w-[95%] mx-auto text-[16px]">
                  {eventModalInfo?.extendedProps?.description}
                </p>
                <div className="mt-4 w-max mx-auto">
                  <button
                    type="button"
                    onClick={() => dispatch(changeEventModalState())}
                    className="bg-blue-600 font-semibold hover:bg-blue-500 rounded-md text-white p-2 "
                  >
                    Go back
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

export default EventModalComponent;
