/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Welcome = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="flex justify-between font-open-sans h-screen overflow-hidden  items-center flex-col">
      <Head>
        <title>FocusPro | Welcome</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <Toaster />
      <div className="flex-1 mt-[1rem]">
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
            Automate task priority,centralize your calendars, and unlock time to
            work on your ambitious projects.
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
  );
};

export default Welcome;
