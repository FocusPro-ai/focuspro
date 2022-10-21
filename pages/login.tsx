/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <div className="flex  font-open-sans max-h-screen !overflow-hidden max-w-screen mt-[1rem] items-center flex-col">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Focus<span className="text-blue-600">Pro</span>.ai
        </h1>
        <p className="py-2 font-semibold text-xl text-gray-500">
          Neurodiversity's first productivity tool
        </p>
      </div>
      <div className="my-[2rem] text-center">
        <h1 className="text-5xl font-bold">
          Work on what really matters, today.
        </h1>
        <p className="text-gray-600 font-semibold text-xl py-4 w-[80%] mx-auto">
          Automate task priority,centralize your calendars, and unlock time to
          work on your ambitious projects.
        </p>
        <div className="flex flex-col justify-center items-center">
          <button
            className="bg-blue-600 my-4 w-max py-2 px-4 rounded-md text-white  "
            onClick={() => popupCenter("/auth/google", "Sign In With Google")}
          >
            Sign in with Google
          </button>
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
      <div className="relative w-full -mb-[2rem]   min-h-[400px]">
        <Image
          src={"/wallpaper.png"}
          alt="background-image"
          layout="fill"
          className="object-contain "
        />
      </div>
    </div>
  );
};

export default Login;

const popupCenter = (url: string, title: string) => {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width =
    window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

  const height =
    window.innerHeight ??
    document.documentElement.clientHeight ??
    screen.height;

  const systemZoom = width / window.screen.availWidth;

  const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
  const top = (height - 550) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    url,
    title,
    `width=${500 / systemZoom},height=${
      550 / systemZoom
    },top=${top},left=${left}`
  );

  newWindow?.focus();
};
