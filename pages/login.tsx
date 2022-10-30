/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Login = () => {
  return (
    <div className="flex justify-between font-open-sans h-screen   items-center flex-col">
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
          <p className="text-gray-600 font-semibold text-xl py-4 w-[80%] mx-auto">
            Automate task priority,centralize your calendars, and unlock time to
            work on your ambitious projects.
          </p>
          <div className="flex flex-col justify-center items-center">
            <button
              className="bg-[#2602f3] my-4  flex items-center space-x-4 py-2 px-4 rounded-md text-white  "
              onClick={() => popupCenter("/auth/google", "Sign In With Google")}
            >
              <span className="px-2">Sign in with </span>
              <Image
                src="/google-icon.svg"
                height={20}
                width={20}
                alt="google-logo"
              />
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
