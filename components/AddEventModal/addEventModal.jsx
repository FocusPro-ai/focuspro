import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { Dialog, Transition } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { changeEventModalState } from "../../slices/eventModalSlice";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { changeEventModalSlice } from "../../slices/SelectCreateEvent/createEventModal";

const AddEventModalComponent = () => {
  const eventModalState = useSelector(
    (state) => state.createEventModal.eventModalSlice
  );
  const eventModalInfo = useSelector(
    (state) => state.createEventModal.eventModal
  );
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const startDate = new Date(eventModalInfo?.start);
  const endDate = new Date(eventModalInfo?.end);

  const startDateFormat = startDate.toLocaleString();
  const endDateFormat = endDate.toLocaleString();

  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");

  const updateEvent = async () => {
    let descriptionEl = document.getElementById("description-id");
    // console.log("update events.");
    const refresh_token = session?.user?.refreshToken;
    const response = await fetch("/api/Calendar/addEvents", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        event_title: heading,
        event_description: descriptionEl.innerHTML,
        start: startDate,
        end: endDate,
        colorId: 0,
        refresh_token,
      }),
    }).then((data) => {
      console.log(data);
      toast.success("Successfully created..");
      dispatch(changeEventModalSlice());
    });
  };

  // useEffect(() => {
  //   setHeading(eventModalInfo.title);
  //   setDescription(eventModalInfo.description);
  //   let descriptionEl = document.getElementById("description-id");
  //   if (descriptionEl) {
  //     descriptionEl.innerHTML = description;
  //   }
  // }, [eventModalInfo, description]);

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
              <Dialog.Panel className="w-full flex flex-col min-h-[500px] max-w-[500px] transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                <div className="flex space-x-2 items-center">
                  <Image
                    src={session?.user?.image || ""}
                    alt="user-image"
                    height={30}
                    width={30}
                  />
                  <span className="text-gray-500 text-[12px]">
                    {session?.user?.email}
                  </span>
                </div>

                <input
                  type="text"
                  placeholder="Event Title"
                  className="text-2xl capitalize font-bold outline-none bg-gray-200 p-2 text-gray-900"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
                <div className="my-4 flex flex-col space-y-1">
                  <p className="text-[12px] text-gray-500 ">
                    <span className="font-semibold">Starts :</span>{" "}
                    <span className="text-gray-700">{startDateFormat}</span>
                  </p>
                  <p className="text-[12px] text-gray-500 ">
                    <span className="font-semibold">Ends : </span>
                    <span className="text-gray-700">{endDateFormat}</span>
                  </p>
                </div>

                <div
                  contentEditable={true}
                  id="description-id"
                  className="w-full resize-none p-2 bg-gray-200 flex-1 h-full  outline-none whitespace-pre-line"
                ></div>

                <div className="mt-4 flex justify-between w-full items-center mx-auto">
                  <TrashIcon
                    onClick={() => deleteEvent()}
                    height={35}
                    width={35}
                    className="hover:bg-gray-200 hover:text-red-500 p-2 cursor-pointer rounded-full"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => dispatch(changeEventModalSlice())}
                      className="rounded-md hover:bg-gray-200 text-gray-500 py-1 cursor-pointer px-4 "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => updateEvent()}
                      type="button"
                      className="bg-blue-600 font-semibold hover:bg-blue-500 rounded-md text-white py-1 px-4 "
                    >
                      Save
                    </button>
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

export default AddEventModalComponent;
