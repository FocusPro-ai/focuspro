/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Welcome = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleWaitlistSubmit = async () => {
    if (loading || email === "") return;
    setLoading(true);
    await fetch("/api/user/joinWaitlist", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email }),
    }).then((data) => {
      toast.success("Email Added to waitlist.", { icon: "🎉" });
      setLoading(false);
      setEmail("");
    });
  };
  return (
    <div className="font-open-sans h-screen">
      <Head>
        <title>FocusPro | Welcome</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />

        <meta
          name="google-site-verification"
          content="vPUCxIZjnbYP--FUX0-WtP_y41HpjPhRy0giwRzIKko"
        />
      </Head>
      <Toaster />
      <div className="container-parent">
        <div className="mt-[1rem]  one container-child flex  flex-col items-center max-w-screen">
          <div className="flex-1">
            <div className="text-center">
              <h1 className="text-4xl font-bold">
                Focus<span className="text-[#2602f3]">Pro</span>.ai
              </h1>
              <p className="py-2 font-semibold text-xl text-gray-500">
                Neurodiversity's first productivity tool
              </p>
            </div>
            <div className="mt-[2rem] text-center">
              <h1 className="text-5xl font-bold">
                Work on what really matters, today.
              </h1>
              <p className="text-gray-600 font-semibold text-xl py-4 w-[90%] mx-auto">
                Automate task priority,centralize your calendars, and unlock
                time to work on your ambitious projects.
              </p>
              <div className="flex flex-col w-full justify-center items-center">
                <span className="text-[13px] text-gray-500 font-semibold pb-1">
                  Join the Waitlist for early access.
                </span>
                <div className="flex space-x-2 w-[45%] xl:my-4 items-center">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className={`bg-gray-50 p-2 rounded-md border border-gray-200 flex-1 outline-none ${
                      loading && "bg-gray-500"
                    }`}
                  />
                  <button
                    onClick={() => handleWaitlistSubmit()}
                    className="bg-[#2602f3] my-2  flex items-center space-x-4 py-2 px-4 rounded-md text-white  "
                  >
                    Join Waitlist
                  </button>
                </div>

                <div className="flex space-x-2 items-center">
                  <span className="text-[13px] text-gray-500">
                    <Link href="/terms">Terms & conditions</Link>
                  </span>
                  <span className="text-gray-500">|</span>
                  <span className="text-[13px] text-gray-500">
                    <Link href="/privacy">Privacy Policy</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative  w-full min-h-[400px]">
            <Image
              src={"/background.png"}
              alt="background-image"
              layout="fill"
              className="object-contain "
            />
          </div>
        </div>
        <div className="container-child w-[90%] mx-auto flex  space-x-[3rem] justify-between items-center">
          <div className="">
            <h1 className="text-[#2602f3] font-bold text-5xl mb-[3rem] ">
              Automate your tasks
            </h1>
            <div className="flex flex-1 flex-col space-y-[2rem]">
              <div className="flex flex-col space-y-2">
                <h2 className="text-4xl font-semibold">
                  <span className="text-[#2602f3] mr-1">1.</span>Name your task
                </h2>
                <p className="text-gray-500 ml-[2rem]">
                  for example, prepare presentation
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h2 className="text-4xl font-semibold">
                  <span className="text-[#2602f3] mr-1">2.</span>Choose
                  Importance
                </h2>
                <p className="text-gray-500 ml-[2rem]">
                  On the scale of 1-10 choose importance.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <h2 className="text-4xl font-semibold">
                  <span className="text-[#2602f3] mr-1">3.</span>Select your
                  deadline
                </h2>
                <p className="text-gray-500 ml-[2rem]">
                  Select a deadline for completing the task.
                </p>
              </div>
              <h3 className="font-semibold text-2xl mt-[4rem] text-gray-600">
                See an automated list of task generated for you 🎉
              </h3>
            </div>
          </div>
          <div className="relative  w-[44%] min-h-[550px]">
            <Image
              src={"/add-task.png"}
              alt="background-image"
              layout="fill"
              className="object-contain rounded-md "
            />
          </div>
        </div>
        <div className="container-child flex items-center space-x-[3rem]">
          <div className="relative  w-[44%] min-h-[550px]">
            <Image
              src={"/background.png"}
              alt="background-image"
              layout="fill"
              className="object-contain rounded-md "
            />
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-bold my-[2rem]">
              Visualize your work
            </h1>
            <p className="font-semibold text-gray-500 text-2xl">
              Plan your day with an integrated calendar like{" "}
              <span className="text-[#2602f3]">Google Calendar. </span>Then
              choose from the automated list what you will be working on today
              with simple drag and drop.
            </p>
          </div>
        </div>
        <div className="container-child w-[80%] mx-auto flex flex-col  items-center">
          <div className="relative mt-[2rem]  w-[44%] min-h-[300px]">
            <Image
              src={"/privacy.png"}
              alt="background-image"
              layout="fill"
              className="object-contain rounded-md "
            />
          </div>
          <h1 className="font-bold text-5xl w-[80%] text-center my-[2rem]">
            We're committed to protecting{" "}
            <span className="underline cursor-pointer">your privacy</span>
          </h1>
          <div className="text-center  w-[80%] mx-auto">
            <p className="font-semibold text-2xl text-gray-500 text-center">
              We use "OAuth", an Open protocol for authorization to integrate
              your Google account without exposing your passwords to
              third-party-service.
            </p>
            <button
              onClick={() => router.push("/terms")}
              className="p-2 px-4 mt-[2rem] rounded-md bg-[#2602f3] text-white my-4"
            >
              Learn more
            </button>
            <div className="flex space-x-2 justify-center items-center">
              <span className="text-[13px] text-gray-500">
                <Link href="/terms">Terms & conditions</Link>
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-[13px] text-gray-500">
                <Link href="/privacy">Privacy Policy</Link>
              </span>
            </div>
          </div>
        </div>
        <div className="container-child w-[80%] mx-auto flex flex-col justify-center items-center ">
          <div className="relative w-[44%] min-h-[300px]">
            <Image
              src={"/background.png"}
              alt="background-image"
              layout="fill"
              className="object-contain rounded-md "
            />
          </div>
          <h1 className="font-bold text-5xl w-[90%] text-center my-[2rem]">
            Unlock time <span className="text-[#2602f3]">,</span>work on what
            matters.
          </h1>
          <div className="text-center  w-[90%] mx-auto">
            <p className="font-semibold text-2xl text-gray-500 text-center">
              As a Neurodiverse say no to distractions, work only on tasks that
              will take you closer to your professional and personal goals.
            </p>
            <button
              onClick={() => router.push("/terms")}
              className="p-2 px-4 mt-[2rem] rounded-md bg-[#2602f3] text-white my-4"
            >
              Learn more
            </button>
            <div className="flex space-x-2 justify-center items-center">
              <span className="text-[13px] text-gray-500">
                <Link href="/terms">Terms & conditions</Link>
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-[13px] text-gray-500">
                <Link href="/privacy">Privacy Policy</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
