import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import Login from "../../pages/login";
import { HomeIcon, PlusIcon } from "@heroicons/react/24/outline";
import AddTaskModal from "../AddTaskModal/addTask";
import { useDispatch } from "react-redux";
import { changeModalState } from "../../slices/modalSlice";

const TodoComponent = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  return (
    <>
      <AddTaskModal />

      <div className="shadow-lg h-auto min-w-[350px]">
        <div className="flex  justify-between items-center w-[90%] mx-auto my-2">
          <h1 className="text-2xl font-bold">
            Focus<span className="text-purple-600">Pro</span>.ai
          </h1>
          {session?.user?.image && (
            <Image
              onClick={() => signOut()}
              src={session?.user?.image}
              height={35}
              width={35}
              className="rounded-full cursor-pointer"
              alt="user-photo"
            />
          )}
        </div>
        <div className="my-2 mt-[2rem] h-[150vh] overflow-y-auto  w-[90%] mx-auto">
          <h1 className="text-gray-500 flex space-x-2   items-center font-semibold text-lg">
            <HomeIcon height={20} width={20} /> <span>All Task (0)</span>
          </h1>
          <div className="w-full mt-[2rem] flex justify-center">
            <button
              onClick={() => dispatch(changeModalState())}
              className="flex space-x-2 items-center my-4 bg-transparent border border-gray-300 hover:bg-gray-100 rounded-md px-3 py-2"
            >
              <PlusIcon height={20} width={20} /> <span>New Task</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TodoComponent;