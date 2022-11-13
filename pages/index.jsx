import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TodoComponent from "../components/Todo/todoComponent";
import CalendarComponent from "../components/CalendarComp/calendarComponent";
import { useDispatch } from "react-redux";
import { AddUserDetails } from "../slices/userSlice";
import { Toaster } from "react-hot-toast";
import Welcome from "./welcome";
import Loading from "./loading";
import Login from "./login";
import AllTaskModal from "../components/Todo/allTaskModal/allTaskModal";

const Home = () => {
  const { data: session, status } = useSession();
  const [events, setALlEvents] = useState([]);
  const dispatch = useDispatch();

  const getAllEvents = async () => {
    const refresh_token = session?.user.refreshToken;
    const response = await fetch("/api/getEvents", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    const data = await response.json();
    setALlEvents(data);
  };
  const getUserDetails = async () => {
    const response = await fetch("/api/user/getUserByEmail", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: session?.user.email }),
    });
    const userDetails = await response.json();
    dispatch(AddUserDetails(userDetails));
  };
  useEffect(() => {
    if (session) {
      getUserDetails();
    }
  }, [session]);
  if (status === "loading") return <Loading />;
  if (!session) {
    return <Welcome />;
  }

  return (
    <div className="max-h-screen overflow-y-hidden w-full flex">
      <Head>
        <title>Focus Pro Calendar</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <Toaster />
      <AllTaskModal />
      <TodoComponent />
      <CalendarComponent />
    </div>
  );
};

export default Home;
