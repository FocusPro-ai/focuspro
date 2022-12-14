import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TodoComponent from "../components/Todo/todoComponent";
import CalendarComponent from "../components/CalendarComp/calendarComponent";
import { useDispatch, useSelector } from "react-redux";
import { AddUserDetails } from "../slices/userSlice";
import { Toaster } from "react-hot-toast";
import Welcome from "./welcome";
import Loading from "./loading";
import Login from "./login";
import AllTaskModal from "../components/Todo/allTaskModal/allTaskModal";
import Analytics from "@june-so/analytics-node";
import Script from "next/script";
import { changeVideoSlice, showVideoSlice } from "../slices/videoSlice";
import VideoModal from "../components/videoModal/videoModal";
import SettingModal from "../components/settingComp/settingModal";

const Home = () => {
  const { data: session, status } = useSession();
  const [events, setALlEvents] = useState([]);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.user);

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
  const handleFirstTime = async () => {
    const response = await fetch("/api/user/sendFirstTime", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: session?.user.email }),
    });
    const data = await response.json();
  };
  useEffect(() => {
    const client = new Analytics("Kh1nkoO8kX6bKr2v");
    if (session) {
      getUserDetails();
    }
  }, [session]);
  useEffect(() => {
    const client = new Analytics("Kh1nkoO8kX6bKr2v");
    if (session && userData) {
      client.identify({
        userId: userData?.id,
        traits: {
          name: userData?.name,
          email: userData?.email,
        },
      });
      client.track({
        userId: userData?.id,
        event: "Signed In",
      });
    }
  }, [session, userData]);
  useEffect(() => {
    if (session && userData?.firstime) {
      console.log("hello world");
      setTimeout(() => {
        console.log("Timeout runs ");
        dispatch(showVideoSlice());
      }, 3000);
      handleFirstTime();
    }
  }, [session, userData]);

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
      <VideoModal />
      <TodoComponent />
      <SettingModal />
      <CalendarComponent />
    </div>
  );
};

export default Home;
