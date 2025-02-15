import xicon from "../.../../../../public/icons/xicon.png";
import linkedinicon from "../.../../../../public/icons/linkedin.png";
import discordicon from "../.../../../../public/icons/discord.png";
import icpbanner from "../.../../../../public/icpbanner.png";
import icpindia from "../.../../../../public/icons/icpIndiaImage.png";
import MissionCard from "../modules/Navbar/Slider";

import { FaPlus } from "react-icons/fa6";

import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
export default function TaskRedemption() {
  return (
    <div className=" sm:flex sm:flex-col md:flex-row  bg-gradient-to-b from-[#1E0F33] to-[#35245d]  text-white p-6 flex gap-6">
      <div className="w-2/3 sm:w-full">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <img
              loading="lazy"
              src={icpindia}
              alt="ICP HUB India Logo"
              className="object-contain border-4  rounded-xl border-white aspect-square w-[60px] "
            />
            <h2 className="text-3xl font-semibold">ICP HUB India</h2>
            <button className=" flex items-center border-2 ml-4 border-white gap-2 text-white  px-4 py-2 rounded-xl text-sm">
              <FaPlus size={16} /> Follow
            </button>
          </div>
          <div className="flex gap-2">
            <a
              target="_blank"
              className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[63px] w-[63px]"
            >
              <img
                src={xicon}
                alt=" twitter icon"
                className="w-[29px] h-[30px] "
              />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[63px] w-[63px]"
            >
              <img
                src={discordicon}
                alt="discord icon"
                className="w-[30px] h-[30px] "
              />
            </a>
            <a
              target="_blank"
              className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[63px] w-[63px]"
            >
              <img
                src={linkedinicon}
                alt="discord icon"
                className="w-[40px] h-[30px] "
              />
            </a>
          </div>
        </div>
        <div className="w-full my-4 border-2 border-gray-500"></div>
        <h1 className="text-3xl  font-semibold ">Do task to redeem rewards</h1>
        <p className=" rounded-xl   my-4 p-2 flex gap-4  bg-[#3722534d] text-[#9173FF]">
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.3333 1.16675V5.50008M6.66667 1.16675V5.50008M1.25 9.83342H20.75M3.41667 3.33341H18.5833C19.78 3.33341 20.75 4.30346 20.75 5.50008V20.6667C20.75 21.8634 19.78 22.8334 18.5833 22.8334H3.41667C2.22005 22.8334 1.25 21.8634 1.25 20.6667V5.50008C1.25 4.30346 2.22005 3.33341 3.41667 3.33341Z"
              stroke="#9173FF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Event Period: February 18 - February 28, 2025
        </p>

        {/* Task List */}
        <div className="m-12 space-y-4 ">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-[#1E0F33] p-1.5 rounded-lg">
                  <svg
                    width="28"
                    height="26"
                    viewBox="0 0 28 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 11.6667L13 15.6667L26.3333 2.33333M25 13V22.3333C25 23.0406 24.719 23.7189 24.219 24.219C23.7189 24.719 23.0406 25 22.3333 25H3.66667C2.95942 25 2.28115 24.719 1.78105 24.219C1.28095 23.7189 1 23.0406 1 22.3333V3.66667C1 2.95942 1.28095 2.28115 1.78105 1.78105C2.28115 1.28095 2.95942 1 3.66667 1H18.3333"
                      stroke="#9173FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="my-4 w-[3px] h-36 border-2 border-[#1E0F33]"></div>
              </div>

              <div className="bg-[#1E0F33] p-4 rounded-lg flex w-full">
                <div>
                  <span className="text-lg font-medium">Transaction</span>
                  <p className="text-[#A0A0A0] text-sm">
                    Mission description here...Lorem Ipsum is simply dummy text
                    of the printing and typesetting industry. Lorem Ipsum has
                    been the industry's standard dummy text ever since the
                    1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen bookLorem Ipsum is
                    simply dummy text of the printing and typesetting industry.
                  </p>
                  <div className="text-sm  flex items-center gap-1 mt-2 mb-4 font-semibold">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.21985 8.72C6.08737 8.86217 6.01524 9.05022 6.01867 9.24452C6.0221 9.43882 6.10081 9.62421 6.23822 9.76162C6.37564 9.89903 6.56102 9.97775 6.75532 9.98118C6.94963 9.9846 7.13767 9.91248 7.27985 9.78L12.4998 4.56V6.25C12.4998 6.44891 12.5789 6.63968 12.7195 6.78033C12.8602 6.92098 13.0509 7 13.2498 7C13.4488 7 13.6395 6.92098 13.7802 6.78033C13.9208 6.63968 13.9998 6.44891 13.9998 6.25V2.75C13.9998 2.55109 13.9208 2.36032 13.7802 2.21967C13.6395 2.07902 13.4488 2 13.2498 2H9.74985C9.55093 2 9.36017 2.07902 9.21952 2.21967C9.07886 2.36032 8.99985 2.55109 8.99985 2.75C8.99985 2.94891 9.07886 3.13968 9.21952 3.28033C9.36017 3.42098 9.55093 3.5 9.74985 3.5H11.4398L6.21985 8.72Z"
                        fill="#FAFAFA"
                      />
                      <path
                        d="M3.5 6.75C3.5 6.06 4.06 5.5 4.75 5.5H7C7.19891 5.5 7.38968 5.42098 7.53033 5.28033C7.67098 5.13968 7.75 4.94891 7.75 4.75C7.75 4.55109 7.67098 4.36032 7.53033 4.21967C7.38968 4.07902 7.19891 4 7 4H4.75C4.02065 4 3.32118 4.28973 2.80546 4.80546C2.28973 5.32118 2 6.02065 2 6.75V11.25C2 11.9793 2.28973 12.6788 2.80546 13.1945C3.32118 13.7103 4.02065 14 4.75 14H9.25C9.97935 14 10.6788 13.7103 11.1945 13.1945C11.7103 12.6788 12 11.9793 12 11.25V9C12 8.80109 11.921 8.61032 11.7803 8.46967C11.6397 8.32902 11.4489 8.25 11.25 8.25C11.0511 8.25 10.8603 8.32902 10.7197 8.46967C10.579 8.61032 10.5 8.80109 10.5 9V11.25C10.5 11.94 9.94 12.5 9.25 12.5H4.75C4.06 12.5 3.5 11.94 3.5 11.25V6.75Z"
                        fill="#FAFAFA"
                      />
                    </svg>
                    Details
                  </div>
                  <button className="bg-[#9173FF] text-white px-4 py-2 rounded-md mt-2">
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Reward Button */}
          <div className="flex gap-4">
            <div className="bg-[#1E0F33] p-1.5 rounded-lg h-10 w-10 mt-4"></div>
            <div className=" bg-[#9173FF] w-full p-4 rounded-lg flex justify-between items-center">
              <span className="text-lg text-black font-medium">Reward</span>
              <button className=" text-black  rounded-md">
                <svg
                  width="48"
                  height="40"
                  viewBox="0 0 48 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.57156 0.428711C3.85219 0.428711 0 4.28087 0 9.00022V33.0001C0 37.7185 3.85219 41.5716 8.57156 41.5716H39.4284C44.1469 41.5716 48 37.7194 48 33.0001V29.5716H30.8569C26.1384 29.5716 22.2853 25.7195 22.2853 21.0001C22.2853 16.2808 26.1375 12.4286 30.8569 12.4286H48V9.00022C48 4.28181 44.1478 0.428711 39.4284 0.428711H8.57156ZM30.8569 15.857C27.9778 15.857 25.7137 18.1211 25.7137 21.0001C25.7137 23.8792 27.9778 26.1432 30.8569 26.1432H48V15.858H30.8569V15.857ZM30.8569 19.2855C31.8038 19.2855 32.5716 20.0533 32.5716 21.0001C32.5716 21.947 31.8038 22.7148 30.8569 22.7148C29.91 22.7148 29.1422 21.947 29.1422 21.0001C29.1422 20.0533 29.91 19.2855 30.8569 19.2855Z"
                    fill="#1E0F33"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Section */}
      <div className="w-1/3  p-4 rounded-lg space-y-5">
        <div className="flex items-center justify-end mx-8 ">
          <button className=" flex items-center  text-xl justify-end gap-2 font-semibold bg-[#FFFFFF33]  border-2 ml-4 border-[#FFFFFF33]  text-white  px-4 py-1 rounded-xl">
            <FaRegArrowAltCircleLeft size={16} /> Back
          </button>
        </div>

        <MissionCard />
      </div>
    </div>
  );
}
