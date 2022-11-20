import { useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  Cog8ToothIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  ChatBubbleBottomCenterIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline";
import { InboxIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showVideoSlice } from "../../../slices/videoSlice";

const DropDownProfile = () => {
  const [show, setShow] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const profilePhoto = session?.user?.image;
  const userName = session?.user?.name;
  const email = session?.user?.email;

  return (
    <div className="relative mr-4 ">
      <div className="relative h-[30px] w-[30px]">
        {profilePhoto && (
          <Image
            id="avatarButton"
            onClick={() => setShow(!show)}
            data-dropdown-toggle="userDropdown"
            data-dropdown-placement="bottom-start"
            className="h-[30px] w-[30px]  rounded-full cursor-pointer"
            src={profilePhoto}
            alt="User dropdown"
            layout="fill"
          />
        )}
      </div>

      <div
        id="userDropdown"
        className={`${
          show ? "!absolute" : "hidden"
        }  left-[0] mr-4 z-10 w-44 mt-2 bg-white  rounded divide-y  shadow `}
      >
        <div className="py-3 px-4 text-sm text-gray-900 ">
          <div className="capitalize font-semibold">{userName}</div>
          <div className="font-medium truncate">{email}</div>
        </div>
        <ul className="py-1 text-sm  " aria-labelledby="avatarButton">
          <li>
            <div
              onClick={() =>
                toast.success("Coming soon...", {
                  icon: "🏃‍♂️🏃‍♂️",
                  duration: 4000,
                })
              }
              className="flex items-center cursor-pointer space-x-2 py-2 px-4 hover:bg-gray-100  "
            >
              {/* <InboxIcon className="h-5 w-5" /> */}
              <div className="text-[17px]">📥</div>
              <span>Archive</span>
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                toast.success("Coming soon...", {
                  icon: "🏃‍♂️🏃‍♂️",
                  duration: 4000,
                })
              }
              className="flex items-center cursor-pointer space-x-2 py-2 px-4 hover:bg-gray-100  "
            >
              <Cog8ToothIcon className="h-5 w-5" />
              <span> Settings</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => dispatch(showVideoSlice())}
              className="flex items-center cursor-pointer space-x-2 py-2 px-4 hover:bg-gray-100  "
            >
              <div className="">📺</div>
              <span>Tutorial</span>
            </div>
          </li>
          <li>
            <Link href={"https://tally.so/r/wdWJdz"}>
              <div className="flex items-center cursor-pointer space-x-2 py-2 px-4 hover:bg-gray-100  ">
                {/* <ChatBubbleBottomCenterIcon className="h-5 w-5" /> */}
                <div className="">🙉</div>
                <span>Feeback</span>
              </div>
            </Link>
          </li>
        </ul>
        <div className="py-1">
          <div
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
            className="flex items-center cursor-pointer space-x-2 py-2 px-4 text-sm  hover:bg-gray-100  "
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />

            <span> Sign out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDownProfile;
