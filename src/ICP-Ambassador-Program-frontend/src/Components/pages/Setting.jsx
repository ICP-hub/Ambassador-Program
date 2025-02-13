import React from "react";
import settingProfile from "../../../public/icons/settingProfile.png";
import editpen from "../../../public/icons/editPen.png";
import edit from "../../../public/icons/Edit.png";
import discord from "../../../public/icons/discord.png";
import xicon from "../../../public/icons/xicon.png";
import telegram from "../../../public/icons/telegram.png";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { LiaTelegram } from "react-icons/lia";
import { FiEdit2 } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";

const Setting = () => {
  return (
    <div className=" mx-12 pb-4 rounded-xl bg-gradient-to-b from-[#1E0F33] to-[#9173FF] ">
      <h2 className="text-3xl py-12 text-white pl-16 font-bold">Setting </h2>
      <div className="mx-16 flex gap-4 justify-between items-center ">
        <div className=" mt-6 rounded-xl w-[424px] h-[461px] flex flex-col items-center bg-gradient-to-b from-[#9173FF]/30 to-[#574599]/0 ">
          <div className="mt-10 relative">
            <div className="rounded-full bg-gradient-to-t from-[#9173FF] to-[#1E0F33] w-[260px] h-[256px] flex items-center justify-center">
              <img src={settingProfile} alt="profile" className="" />
            </div>
            <div className="absolute w-[50px] h-[50px] bg-gray-300 rounded-full flex items-center justify-center bottom-14 -right-4">
              {/* <img src={editpen} alt="edit" className="w-[30px] h-[30px] " /> */}
              <FiEdit2 style={{ fontSize: "30px" }} />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-400 text-center text-xs">
              image size <br /> at least 300 * 300
            </p>
          </div>
          <div className="text-white rounded-xl px-4 py-3 bg-[#9173FF]/40 flex items-center justify-center  mb-6 w-[280px] mt-4">
            <p className="mr-5 font-semibold text-xl">@ username</p>
            {/* <img src={edit} alt="profile" className="w-6 h-6" /> */}
            <LiaEdit style={{ fontSize: "32px" }} />
          </div>
        </div>
        <div className="flex gap-6 flex-col w-[640px] h-[362px]">
          <div className="flex gap-6 items-center">
            <div className="flex justify-center items-center bg-[#9173FF]/30 w-[80px] h-[80px] rounded-md">
              <FaDiscord style={{ fontSize: "60px", color: "white" }} />
            </div>
            <div className="flex text-white text-lg font-medium bg-[#D9D9D9]/10 w-[360px] h-[50px] justify-center items-center rounded-md">
              <p className="">@vijaykumar</p>
            </div>
            <button className="py-1 border-[#9173FF] border-2 px-2 text-[#9173FF] text-lg font-medium rounded-md ">
              remove
            </button>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex justify-center items-center bg-[#9173FF]/30 w-[80px] h-[80px] rounded-md">
              <BsTwitterX style={{ fontSize: "50px", color: "white" }} />
            </div>
            <div className="flex text-white text-lg font-medium bg-[#D9D9D9]/10 w-[360px] h-[50px] justify-center items-center rounded-md">
              <p className="">@vijaykumar</p>
            </div>
            <button className="py-1 border-[#9173FF] border-2 px-2 text-[#9173FF] text-lg font-medium rounded-md ">
              remove
            </button>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex justify-center items-center bg-[#9173FF]/30 w-[80px] h-[80px] rounded-md">
              <LiaTelegram style={{ fontSize: "60px", color: "white" }} />
            </div>
            <div className="flex text-white text-lg font-medium bg-[#D9D9D9]/10 w-[360px] h-[50px] justify-center items-center rounded-md">
              <p className="">@vijaykumar</p>
            </div>
            <button className="py-1 border-[#9173FF] border-2 px-2 text-[#9173FF] text-lg font-medium rounded-md ">
              remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
