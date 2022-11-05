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
  const [draggableInitialized2, setDraggableInitialized2] = useState(false);
  const [draggableInitialized3, setDraggableInitialized3] = useState(false);
  const [checkValue, setCheckValue] = useState(false);
  const [checkedId, setCheckedId] = useState();
  const fetchAllUrgentNotImp = async () => {
    const userId = userData.id;
    const response = await fetch("/api/matrix/notImpUrgent", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  };
  const fetchAllNotUrgentImp = async () => {
    const userId = userData.id;
    const response = await fetch("/api/matrix/notUrgentImp", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  };

  const fetchAllUrgentAndImportant = async () => {
    const userId = userData.id;
    const response = await fetch("/api/matrix/urgentAndImp", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  };

  const { data: notImpUrgentTodo } = useSWR(
    "todos-urgent-not-important",
    fetchAllUrgentNotImp,
    {
      refreshInterval: 200,
    }
  );
  const { data: notUrgentImpTodo } = useSWR(
    "todos-not-urgent-important",
    fetchAllNotUrgentImp,
    {
      refreshInterval: 200,
    }
  );

  const { data: urgentAndImpTodo } = useSWR(
    "todos-urgent-important",
    fetchAllUrgentAndImportant,
    {
      refreshInterval: 200,
    }
  );

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
    let draggableEl1 = document.getElementById("draggable-event1");
    let draggableEl2 = document.getElementById("draggable-event2");
    let draggableEl3 = document.getElementById("draggable-event3");

    if (draggableEl1 && !draggableInitialized && notImpUrgentTodo?.length > 0) {
      setDraggableInitialized(true);
      let draggable = new Draggable(draggableEl1, {
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
    } else if (
      draggableEl2 &&
      !draggableInitialized2 &&
      notUrgentImpTodo?.length > 0
    ) {
      setDraggableInitialized2(true);
      let draggable = new Draggable(draggableEl2, {
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
    } else if (
      draggableEl3 &&
      !draggableInitialized3 &&
      urgentAndImpTodo?.length > 0
    ) {
      setDraggableInitialized3(true);
      let draggable = new Draggable(draggableEl3, {
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
  }, [
    draggableInitialized2,
    draggableInitialized3,
    notImpUrgentTodo,
    urgentAndImpTodo,
    notUrgentImpTodo,
    draggableInitialized,
  ]);
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
          <div className=" flex   flex-1 py-2 overflow-y-scroll  !h-[600px] hide-scrollbar flex-col space-y-2 my-4">
            <UpdateTaskModal />
            {urgentAndImpTodo && (
              <div id="draggable-event1">
                <h1 className="text-red-500 flex space-x-2   items-center font-bold text-xl py-2">
                  <span>Must do ({urgentAndImpTodo?.length})</span>
                </h1>
                {urgentAndImpTodo?.map((todo, index) => (
                  <div
                    className="fc-event my-1"
                    title={todo.heading}
                    description={todo.description}
                    importance={todo.importance}
                    id={todo.id}
                    key={todo.id}
                  >
                    <div
                      className={`  flex items-center space-x-2 bg-red-400 cursor-pointer rounded-md p-2 hover:bg-red-300 group`}
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
            )}
            {notImpUrgentTodo && (
              <div>
                <h1 className="text-orange-500 flex space-x-2   items-center font-bold text-xl py-2">
                  <span>Should do ({notImpUrgentTodo?.length})</span>
                </h1>
                <div id="draggable-event2">
                  {notImpUrgentTodo?.map((todo, index) => (
                    <div
                      className="fc-event my-1"
                      title={todo.heading}
                      description={todo.description}
                      importance={todo.importance}
                      id={todo.id}
                      key={todo.id}
                    >
                      <div
                        className={` flex items-center space-x-2 bg-orange-400 cursor-pointer rounded-md p-2 my-2 hover:bg-orange-300 group`}
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
            {notUrgentImpTodo && (
              <div id="draggable-event3">
                <h1 className="text-gray-500 flex space-x-2   items-center font-bold text-xl py-2">
                  <span>Could do ({notUrgentImpTodo?.length})</span>
                </h1>
                {notUrgentImpTodo?.map((todo, index) => (
                  <div
                    className="fc-event my-1"
                    title={todo.heading}
                    description={todo.description}
                    importance={todo.importance}
                    id={todo.id}
                    key={todo.id}
                  >
                    <div
                      className={`  flex items-center space-x-2 bg-blue-400 cursor-pointer rounded-md p-2 hover:bg-blue-300 group`}
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
            )}
          </div>
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
