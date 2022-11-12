import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Login from "../../pages/welcome";
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
import { useQuery } from "@tanstack/react-query";
import Loading from "../../pages/loading";
import { changeAllTaskModalState } from "../../slices/allTaskModalSlice";

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
    // const userId = userData?.id;
    // if (!userId) return;
    const response = await fetch("/api/matrix/notImpUrgent", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId: userData.id, take: 3, completed: false }),
    });
    return response.json();
  };
  const fetchAllNotUrgentImp = async () => {
    // const userId = userData?.id;
    // if (!userId) return;
    const response = await fetch("/api/matrix/notUrgentImp", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId: userData.id, take: 3, completed: false }),
    });
    return response.json();
  };

  const fetchAllUrgentAndImportant = async () => {
    // const userId = userData?.id;
    // if (!userId) return;
    const response = await fetch("/api/matrix/urgentAndImp", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId: userData.id, take: 3, completed: false }),
    });
    return response.json();
  };

  const { data: notImpUrgentTodo, isLoading } = useQuery(
    ["todos-urgent-not-important"],
    fetchAllUrgentNotImp,
    { refetchInterval: 6000, enabled: !!userData?.id }
  );

  const { data: notUrgentImpTodo, isLoading: notUrgentImpTodoLoading } =
    useQuery(["todos-not-urgent-important"], fetchAllNotUrgentImp, {
      refetchInterval: 6000,
      enabled: !!userData?.id,
    });

  const { data: urgentAndImpTodo, isLoading: urgentAndImpTodoLoading } =
    useQuery(
      ["todos-urgent-important"],
      fetchAllUrgentAndImportant,

      { refetchInterval: 6000, enabled: !!userData?.id }
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

    if (draggableEl1 && !draggableInitialized && urgentAndImpTodo?.length > 0) {
      setDraggableInitialized(true);
      let draggable = new Draggable(draggableEl1, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let description = eventEl.getAttribute("description");
          let importance = eventEl.getAttribute("importance");
          let id = eventEl.getAttribute("id");
          let colorId = eventEl.getAttribute("colorId");
          return {
            title: title,
            description: description,
            importance: importance,
            id: id,
            colorId: colorId,
          };
        },
      });
    } else if (
      draggableEl2 &&
      !draggableInitialized2 &&
      notImpUrgentTodo?.length > 0
    ) {
      setDraggableInitialized2(true);
      let draggable = new Draggable(draggableEl2, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let description = eventEl.getAttribute("description");
          let importance = eventEl.getAttribute("importance");
          let id = eventEl.getAttribute("id");
          let colorId = eventEl.getAttribute("colorId");
          return {
            title: title,
            description: description,
            importance: importance,
            id: id,
            colorId: colorId,
          };
        },
      });
    } else if (
      draggableEl3 &&
      !draggableInitialized3 &&
      notUrgentImpTodo?.length > 0
    ) {
      setDraggableInitialized3(true);
      let draggable = new Draggable(draggableEl3, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let description = eventEl.getAttribute("description");
          let importance = eventEl.getAttribute("importance");
          let id = eventEl.getAttribute("id");
          let colorId = eventEl.getAttribute("colorId");

          return {
            title: title,
            description: description,
            importance: importance,
            id: id,
            colorId: colorId,
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
    <div className="h-auto min-w-[350px]">
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
            {(notUrgentImpTodoLoading ||
              notUrgentImpTodoLoading ||
              urgentAndImpTodoLoading) && <Loading />}
            <h1 className="text-[#d60000]  flex space-x-2   items-center font-bold text-xl py-2">
              <span>Do it Today ({urgentAndImpTodo?.length})</span>
            </h1>
            {urgentAndImpTodo?.length > 0 && (
              <div id="draggable-event1">
                {urgentAndImpTodo?.map((todo, index) => (
                  <div
                    className="fc-event my-1 text-white"
                    title={todo.heading}
                    description={todo.description}
                    importance={todo.importance}
                    id={todo.id}
                    colorId={11}
                    key={todo.id}
                  >
                    <div
                      className={`  flex items-center space-x-2 bg-[#d60000] cursor-pointer rounded-md p-2  group`}
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
                        className="w-full"
                        onDoubleClick={() => {
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
            <h1 className="text-[#e67c73] flex space-x-2   items-center font-bold text-xl py-2">
              <span>Schedule this week ({notImpUrgentTodo?.length})</span>
            </h1>
            {notImpUrgentTodo?.length > 0 && (
              <div>
                <div id="draggable-event2">
                  {notImpUrgentTodo?.map((todo, index) => (
                    <div
                      className="fc-event my-1 text-white"
                      title={todo.heading}
                      description={todo.description}
                      importance={todo.importance}
                      id={todo.id}
                      colorId={4}
                      key={todo.id}
                    >
                      <div
                        className={` flex items-center space-x-2 bg-[#e67c73] cursor-pointer rounded-md p-2 my-2  group`}
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
                          className="w-full"
                          onDoubleClick={() => {
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
            <h1 className="text-[#039be5] flex space-x-2   items-center font-bold text-xl py-2">
              <span>Decide or delegate ({notUrgentImpTodo?.length})</span>
            </h1>
            {notUrgentImpTodo?.length > 0 && (
              <div id="draggable-event3">
                {notUrgentImpTodo?.map((todo, index) => (
                  <div
                    className="fc-event my-1 text-white"
                    title={todo.heading}
                    description={todo.description}
                    importance={todo.importance}
                    colorId={0}
                    id={todo.id}
                    key={todo.id}
                  >
                    <div
                      className={`  flex items-center space-x-2  cursor-pointer rounded-md p-2 bg-[#039be5] group`}
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
                        className="w-full"
                        onDoubleClick={() => {
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
        <div className="w-full flex-col  flex justify-center">
          <p
            onClick={() => dispatch(changeAllTaskModalState())}
            className="my-2 underline w-max mx-auto cursor-pointer font-semibold text-gray-500 "
          >
            See all
          </p>
          <button
            onClick={() => dispatch(changeModalState())}
            className="flex space-x-2 items-center w-max mx-auto my-4 bg-transparent border border-gray-300 hover:bg-gray-100 rounded-md px-3 py-2"
          >
            <PlusIcon height={20} width={20} /> <span>New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoComponent;
