import React from "react";

const Login = () => {
  return (
    <div
      className="min-h-screen min-w-screen flex flex-col justify-center items-center bg-center"
      style={{ backgroundImage: 'url("/wallpaper.png")' }}
    >
      <div className="w-[55%] flex flex-col   mx-auto shadow-md rounded-md bg-gray-50 min-h-[300px] ">
        <h1 className="text-center pt-[1rem] pb-[2rem]  text-4xl font-bold">
          FocusPros<span className="text-blue-500">.ai</span>
        </h1>
        <p className="w-[90%]  mx-auto  font-semibold  ">
          The objective is to test the value delivery hypothesis. “If ambitious
          neurodiverse professionals use the Eisenhower matrix combined with a
          digital calendar, they will work primarily on what matters the most.
          Therefore, limiting the time wasted on meaningless tasks”.
        </p>
        <div className="flex-1 flex items-end justify-center ">
          <button
            className="bg-blue-500 my-4 w-max   py-2 px-4 rounded-md text-white  "
            onClick={() => popupCenter("/auth/google", "Sign In With Google")}
          >
            Sign in with Google
          </button>
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
