import Head from "next/head";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Login from "./login";
import { useEffect, useState } from "react";
import TodoComponent from "../components/Todo/todoComponent";
import CalendarComponent from "../components/CalendarComp/calendarComponent";
import { useDispatch } from "react-redux";
import { AddUserDetails } from "../slices/userSlice";
import { Toaster } from "react-hot-toast";

const Home = () => {
  const { data: session } = useSession();
  const [events, setALlEvents] = useState([]);
  const dispatch = useDispatch();

  const getAllEvents = async () => {
    const refresh_token = session?.user.refreshToken;
    // const refresh_token =
    //   "1//0gDTVlDhl_jl6CgYIARAAGBASNwF-L9Ir4-7sotvXByzIvp_rQ5kysL3ihacyRMP-7u_GqH1pQ0eli4m3OMe1sCS4_f0btpqtHl4";
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
      body: JSON.stringify({ email: session.user.email }),
    });
    const userDetails = await response.json();
    dispatch(AddUserDetails(userDetails));
  };
  useEffect(() => {
    if (session) {
      getUserDetails();
    }
  }, [session]);
  if (!session) {
    return <Login />;
  }
  return (
    <div className="max-h-screen overflow-y-hidden w-full flex">
      <Head>
        <title>Focus Pro Calendar</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <Toaster />
      <TodoComponent />
      <CalendarComponent />
    </div>
  );
};

export default Home;
