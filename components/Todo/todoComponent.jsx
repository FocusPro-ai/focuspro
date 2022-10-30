import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Login from "../../pages/login";
import { HomeIcon, PlusIcon } from "@heroicons/react/24/outline";
import AddTaskModal from "../AddTaskModal/addTask";
import { useDispatch, useSelector } from "react-redux";
import { changeModalState } from "../../slices/modalSlice";
import useSWR from "swr";
import UserTodoComponent from "./userTodo";
import FullCalendar from "@fullcalendar/react";
import { Draggable } from "@fullcalendar/interaction";
import {
  addTaskDescription,
  changeTaskModalSlice,
} from "../../slices/taskModalSlice";
import UpdateTaskModal from "./updateTaskModal/updateTask";
import { Popover } from "@headlessui/react";

const TodoComponent = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const [draggableInitialized, setDraggableInitialized] = useState(false);
  const [checkValue, setCheckValue] = useState(false);
  const [checkedId, setCheckedId] = useState();
  const fetchAllTodoByUserId = async () => {
    const userId = userData.id;
    const response = await fetch("/api/Task/showTask", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  };
  const { data: userTodo } = useSWR("todos", fetchAllTodoByUserId, {
    refreshInterval: 500,
  });

  const handleCompleteTask = async (taskId) => {
    const response = await fetch("/api/Task/doneTask", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });
    const data = await response.json();
  };
  useEffect(() => {
    let draggableEl = document.getElementById("draggable-event");
    if (draggableEl && userTodo.length > 0 && !draggableInitialized) {
      setDraggableInitialized(true);
      let draggable = new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let description = eventEl.getAttribute("description");
          let importance = eventEl.getAttribute("importance");
          let id = eventEl.getAttribute("id");
          return {
            title: title,
            description: description,
            importance: importance,
            id: id,
          };
        },
      });
    }
  }, [userTodo, draggableInitialized]);
  return (
    <div className="h-auto">
      <AddTaskModal />

      <div className="shadow-lg flex flex-col min-h-screen min-w-[350px]">
        <div className="flex h-max   justify-between items-center w-[90%] mx-auto my-2">
          <h1 className="text-2xl font-bold">
            Focus<span className="text-[#2602f3]">Pro</span>.ai
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
        <div className="mx-4 flex-1 h-max flex flex-col  ">
          {userTodo && (
            <div>
              <h1 className="text-gray-500 flex space-x-2   items-center font-semibold text-lg">
                <HomeIcon height={20} width={20} />{" "}
                <span>All Task ({userTodo?.length})</span>
              </h1>
              <div
                id="draggable-event"
                className=" flex   flex-1 py-2 overflow-y-scroll h-[600px] hide-scrollbar flex-col space-y-2 my-4"
              >
                <UpdateTaskModal />
                {userTodo.map((todo, index) => (
                  <div
                    className="fc-event"
                    title={todo.heading}
                    description={todo.description}
                    importance={todo.importance}
                    id={todo.id}
                    key={todo.id}
                  >
                    <div
                      className={` border-2 flex items-center space-x-2 ${
                        todo.importance > 8 && " border-red-500"
                      } ${todo.importance <= 7 && "border-violet-600"} ${
                        todo.importance < 4 && "border-gray-600"
                      } cursor-pointer rounded-md p-2 hover:bg-gray-200 group`}
                    >
                      <input
                        type="checkbox"
                        alt="completed-check"
                        value={checkValue}
                        onChange={(e) => {
                          setCheckValue(e.target.checked);
                          handleCompleteTask(todo.id);

                          // console.log(e.target.value);
                        }}
                      />
                      <h1
                        onClick={() => {
                          dispatch(changeTaskModalSlice());
                          const task_prop = {
                            title: todo.heading,
                            importance: todo.importance,
                            deadline: todo.deadline,
                            description: todo.description,

                            id: todo.id,
                          };
                          dispatch(addTaskDescription(task_prop));
                        }}
                      >
                        {todo.heading}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full   flex justify-center">
          <button
            onClick={() => dispatch(changeModalState())}
            className="flex space-x-2 items-center my-4 bg-transparent border border-gray-300 hover:bg-gray-100 rounded-md px-3 py-2"
          >
            <PlusIcon height={20} width={20} /> <span>New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoComponent;
