/* eslint-disable react/no-unescaped-entities */
import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery } from "@tanstack/react-query";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { RootState } from "../../app/store";
import { hideVideoSlice } from "../../slices/videoSlice";
import Script from "next/script";

const VideoModal = () => {
  const modalState = useSelector((state) => state.videoSlice.modal);
  const dispatch = useDispatch();
  <>
    <Script src="https://fast.wistia.com/embed/medias/b94qjnwxek.jsonp" async />
    <Script
      src="https://fast.wistia.com/assets/external/E-v1.js"
      async
    ></Script>
  </>;

  return (
    <Transition appear show={modalState} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          dispatch(hideVideoSlice());
        }}
      >
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
              <Dialog.Panel className="w-full max-w-[1190px] min-h-[700px] overflow-y-scroll hide-scrollbar transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl my-4 flex justify-between items-center font-bold leading-6 text-gray-900"
                >
                  <h1>Intro to Focuspro.ai</h1>
                  <XMarkIcon
                    height={40}
                    width={40}
                    className="hover:bg-gray-200 p-2 rounded-full "
                    onClick={() => {
                      dispatch(hideVideoSlice());
                    }}
                  />
                </Dialog.Title>
                <div className=" h-[650px]">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/2iJ_RNlGoEQ"
                    title="2 min Onboarding | FocusPro.ai | Boost Your Productivity"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                  ></iframe>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VideoModal;
