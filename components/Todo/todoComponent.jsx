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
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import DropDownProfile from "./profile/DropDownProfile";
import AddEventModalComponent from "../AddEventModal/addEventModal";
import Analytics from "@june-so/analytics-node";

const TodoComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const [draggableInitialized, setDraggableInitialized] = useState(false);
  const [draggableInitialized2, setDraggableInitialized2] = useState(false);
  const [draggableInitialized3, setDraggableInitialized3] = useState(false);
  const [draggableInitialized4, setDraggableInitialized4] = useState(false);
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
      body: JSON.stringify({ userId: userData.id, take: 2, completed: false }),
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
      body: JSON.stringify({ userId: userData.id, take: 2, completed: false }),
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
  const fetchSomethingLeftBehind = async () => {
    // const userId = userData?.id;
    // if (!userId) return;
    const response = await fetch("/api/matrix/somethingLeft", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId: userData.id, take: 2, completed: false }),
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
  const { data: somethingLeftBehind, isLoading: somethingLeftBehindLoading } =
    useQuery(
      ["something-left-behind"],
      fetchSomethingLeftBehind,

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
    toast.success("You did it! Task completed", { icon: "????", duration: 3000 });
  };
  useEffect(() => {
    let draggableEl1 = document.getElementById("draggable-event1");
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
    }
    if (userData) {
      const client = new Analytics("Kh1nkoO8kX6bKr2v");
      client.identify({
        userId: userData.id,
        traits: {
          name: userData.name,
          email: userData.email,
        },
      });
      client.track({
        userId: userData.id,
        event: "Dragged Task",
      });
    }
  }, [draggableInitialized, urgentAndImpTodo, userData]);
  useEffect(() => {
    let draggableEl4 = document.getElementById("draggable-event4");
    if (
      draggableEl4 &&
      !draggableInitialized4 &&
      somethingLeftBehind?.length > 0
    ) {
      setDraggableInitialized4(true);
      new Draggable(draggableEl4, {
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
    if (userData) {
      const client = new Analytics("Kh1nkoO8kX6bKr2v");
      client.identify({
        userId: userData.id,
        traits: {
          name: userData.name,
          email: userData.email,
        },
      });
      client.track({
        userId: userData.id,
        event: "Dragged Task",
      });
    }
  }, [draggableInitialized4, somethingLeftBehind, userData]);
  useEffect(() => {
    let draggableEl2 = document.getElementById("draggable-event2");
    if (
      draggableEl2 &&
      !draggableInitialized2 &&
      notUrgentImpTodo?.length > 0
    ) {
      console.log("Hello world");
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
    }
    if (userData) {
      const client = new Analytics("Kh1nkoO8kX6bKr2v");
      client.identify({
        userId: userData.id,
        traits: {
          name: userData.name,
          email: userData.email,
        },
      });
      client.track({
        userId: userData.id,
        event: "Dragged Task",
      });
    }
  }, [draggableInitialized2, notUrgentImpTodo, userData]);

  useEffect(() => {
    let draggableEl3 = document.getElementById("draggable-event3");
    if (
      draggableEl3 &&
      !draggableInitialized3 &&
      notImpUrgentTodo?.length > 0
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
    if (userData) {
      const client = new Analytics("Kh1nkoO8kX6bKr2v");
      client.identify({
        userId: userData.id,
        traits: {
          name: userData.name,
          email: userData.email,
        },
      });
      client.track({
        userId: userData.id,
        event: "Dragged Task",
      });
    }
  }, [draggableInitialized3, notImpUrgentTodo, userData]);
  return (
    <div className="h-auto min-w-[350px]">
      <AddTaskModal />
      <AddEventModalComponent />
      <div className="shadow-lg flex flex-col min-h-screen min-w-[350px]">
        <div className="flex h-max   justify-between items-center w-[90%] mx-auto mt-[10px]">
          <h1 className="text-2xl font-bold">
            Focus<span className="text-[#2602f3]">Pro</span>.ai
          </h1>
          {/* {session?.user?.image && (
            <Image
              onClick={() => {
                signOut({ callbackUrl: "/login" });
              }}
              src={session?.user?.image}
              height={35}
              width={35}
              className="rounded-full cursor-pointer"
              alt="user-photo"
            />
          )} */}
          <DropDownProfile />
        </div>
        <div className="mx-4 flex-1 max-h-[80%]  h-max flex flex-col  ">
          <div className=" flex   flex-1 py-2    flex-col space-y-[5px] my-[12px] mt-1">
            <UpdateTaskModal />
            {(notUrgentImpTodoLoading ||
              notUrgentImpTodoLoading ||
              urgentAndImpTodoLoading ||
              somethingLeftBehindLoading) && <Loading />}
            {somethingLeftBehind?.length > 0 && (
              <div id="draggable-event4">
                <h1 className="text-gray-400  flex space-x-2   items-center font-bold text-xl py-2">
                  <span>
                    ({urgentAndImpTodo?.length}) Something left behind{" "}
                  </span>
                </h1>
                <div>
                  {somethingLeftBehind?.map((todo, index) => (
                    <div
                      className="fc-event my-1 text-white"
                      title={todo.heading}
                      description={todo.description}
                      importance={todo.importance}
                      id={todo.id}
                      colorId={8}
                      key={todo.id}
                    >
                      <div
                        className={`  flex items-center space-x-2 bg-gray-400 cursor-pointer rounded-md p-2  group`}
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
                          className="w-full font-bold"
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
            <h1 className="text-[#d60000]  flex space-x-2   items-center font-bold text-xl py-2">
              <span>({urgentAndImpTodo?.length}) Do it Today </span>
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
                        className="w-full font-bold"
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
            <h1 className="text-[#f5511d] flex space-x-2   items-center font-bold text-xl py-2">
              <span>({notUrgentImpTodo?.length}) Schedule this week </span>
            </h1>
            {notUrgentImpTodo?.length > 0 && (
              <div>
                <div id="draggable-event2">
                  {notUrgentImpTodo?.map((todo, index) => (
                    <div
                      className="fc-event my-1 text-white"
                      title={todo.heading}
                      description={todo.description}
                      importance={todo.importance}
                      id={todo.id}
                      colorId={6}
                      key={todo.id}
                    >
                      <div
                        className={` flex items-center space-x-2 bg-[#f5511d] cursor-pointer rounded-md p-2 my-2  group`}
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
                          className="w-full font-bold"
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
              <span>({notImpUrgentTodo?.length}) Decide or delegate </span>
            </h1>
            {notImpUrgentTodo?.length > 0 && (
              <div id="draggable-event3">
                {notImpUrgentTodo?.map((todo, index) => (
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
                        className="w-full font-bold"
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
            className="py-1 border border-gray-500 rounded-md px-4  w-max mx-auto cursor-pointer font-semibold text-[1rem] text-gray-500 "
          >
            See all
          </p>
          <button
            onClick={() => dispatch(changeModalState())}
            className="flex space-x-2 items-center w-max mx-auto my-4 font-bold bg-transparent border border-gray-300 hover:bg-gray-100 rounded-md px-3 py-2"
          >
            <PlusIcon height={20} width={20} /> <span>New Task</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoComponent;
