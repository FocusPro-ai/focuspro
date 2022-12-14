import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { RootState } from "../../app/store";
import { Toaster } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { changeSettingSlice } from "../../slices/settingSlice";
import Image from "next/image";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../outlook-integration/authConfig";
import { useIsAuthenticated } from "@azure/msal-react";

const SettingModal = () => {
  const settingModalState = useSelector(
    (state: RootState) => state.settingSlice.setting
  );
  const dispatch = useDispatch();
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const HandleIntegration = (loginType: string) => {
    if (loginType == "popup") {
      instance.loginPopup(loginRequest).catch((e) => {
        console.log(e);
      });
    }
  };
  const RemoveIntegration = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/",
    });
  };
  return (
    <Transition appear show={settingModalState} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-[1200px] h-[700px] overflow-y-scroll hide-scrollbar transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-3xl my-4 flex justify-between items-center font-bold leading-6 text-gray-900"
                >
                  <XMarkIcon
                    height={35}
                    width={35}
                    className="cursor-pointer ml-auto hover:bg-gray-200 p-2 rounded-full"
                    onClick={() => dispatch(changeSettingSlice())}
                  />
                </Dialog.Title>
                <div className="">
                  <div>
                    <div className="flex border border-gray-200 shadow-lg p-2 rounded-md space-x-4 items-center mt-[2rem]">
                      <Image
                        src="/outlook.webp"
                        alt="Outlook-calendar"
                        height="150px"
                        width="150px"
                      />
                      <div>
                        <h1 className="font-bold text-2xl">
                          Outlook Calendar{" "}
                          <span className="bg-gray-200 text-[12px] p-2 rounded-md">
                            Beta
                          </span>
                        </h1>
                        <p className="text-gray-700 w-[80%]">
                          Now,see your personal work or school account calendar
                          events integrated with your Calendar.
                        </p>
                        {isAuthenticated ? (
                          <>
                            <button
                              onClick={() => RemoveIntegration()}
                              className="bg-red-500 border-none outline-none p-2 rounded-md text-white mt-[1rem]"
                            >
                              Remove Account
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => HandleIntegration("popup")}
                              className="bg-blue-600 border-none outline-none p-2 rounded-md text-white mt-[1rem]"
                            >
                              Connect to Outlook
                            </button>
                          </>
                        )}
                      </div>
                    </div>
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

export default SettingModal;
