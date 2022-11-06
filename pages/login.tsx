/* eslint-disable react/no-unescaped-entities */
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) router.push("/");
  return (
    <div className="h-screen flex flex-col w-[90%] mx-auto">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
        <title>FocusPro | Login</title>
      </Head>
      <div className="flex items-center justify-between py-4 ">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Image src="/favicon.png" alt="focus-logo" height={40} width={40} />
          <h1 className="text-3xl font-bold">
            Focus<span className="text-[#2602f3]">Pro</span>.ai
          </h1>
        </div>
        <h4>
          Seen some bugs 🐞?{" "}
          <span className="text-[#2602f3] cursor-pointer">Contact</span>
        </h4>
      </div>
      <div className="flex-1  flex justify-between">
        <div className="h-[50%] my-auto space-y-[4rem] flex flex-col justify-evenly">
          <div className="text-5xl font-bold leading-[3.5rem] ">
            <h1>
              Unlock time <span className="text-[#2602f3]">,</span>
            </h1>
            <h1>
              work on what matters <span className="text-[#2602f3]">.</span>
            </h1>
          </div>
          <div className="flex flex-col space-y-4 text-gray-500 font-semibold text-2xl">
            <p>✅ Visualize your work</p>
            <p>✅ Automate your tasks</p>
            <p>✅ Centralize your productivity</p>
            <p>✅ Drag task into your Calendar</p>
            <p>✅ Auto-sync with Google calendar</p>
          </div>
          <div>
            <p className="text-[13px] w-[70%] leading-5">
              We are testing. Enjoy every feature for free if you provide us
              with thoughtful{" "}
              <span className="text-[#2602f3] cursor-pointer">feedback</span>
            </p>
          </div>
        </div>

        {/* Login box modal */}
        <div className="w-[35%] relative h-[70%] flex flex-col items-center my-auto justify-around bg-gray-50 rounded-lg shadow-lg py-4">
          <div className="absolute bg-[#4027d0] w-full h-full -top-10 -z-20 rounded-lg -right-10"></div>
          <h1 className="text-center font-bold text-3xl">
            Full access for free
          </h1>
          <div className="mx-auto">
            <p className="text-center font-semibold text-gray-800 text-xl">
              Sign up with
            </p>
            <button
              onClick={() => popupCenter("/auth/google", "Sign in with google")}
              className="bg-[#2602f3] my-4  flex items-center space-x-4 py-2 px-4 rounded-md text-white  "
            >
              <span className="px-2">Get Started </span>
              <Image
                src="/google-icon.svg"
                alt="google-icon"
                height={30}
                width={30}
              />
            </button>
          </div>
          <div className="mx-4 text-center">
            <p>
              By signin up, you are agree to our{" "}
              <span className="text-[#2602f3] cursor-pointer">
                <Link href={"/terms"}>terms of service</Link>
              </span>{" "}
              and acknowledge our{" "}
              <span className="text-[#2602f3] cursor-pointer">
                <Link href={"/privacy"}> Privacy policy</Link>
              </span>
            </p>
          </div>
        </div>
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
