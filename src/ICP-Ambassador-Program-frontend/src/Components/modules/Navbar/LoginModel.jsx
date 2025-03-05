import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";
import { DISCORD_CLIENT_ID } from "../../auth/authdata";
import { BASE_URL } from "../../../../../../DevelopmentConfig";
const LoginModel = ({ isOpen, onClose, isReferred }) => {

  if (!isOpen) return null;


  const REDIRECT_URI = `${BASE_URL}/auth/discord/callback`;

  console.log("REDIRECT_URI : ", REDIRECT_URI);

  const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify+email+connections+guilds.members.read`;

  const handleDiscordLogin = () => {
    window.location.href = DISCORD_OAUTH_URL;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
      <div className="flex flex-col gap-2 flex-reverse lg:w-2/4 sm:w-5/6 lg:h-52 sm:h-52 justify-center items-center">
        <div
          className="w-full h-full  rounded-lg p-6 shadow-lg relative flex flex-col gap-4"
          style={{ backgroundColor: "#1d1d21", border: "1px solid #212125" }}
        >
          <div
            className="rounded-md hover:bg-gray-700 py-2 px-2 ml-2 self-end flex  justify-center items-center cursor-pointer"
            onClick={onClose}
          >
            <MdClose className="text-white" style={{ fontSize: "20px" }} />
          </div>
          <div className="flex flex-col justify-center sm:gap-3 items-center">
            <h2 className="lg:text-lg sm:text-sm font-semibold text-center text-white">
              {isReferred
                ? "You are being referred to the Ambassador Program"
                : "Welcome to Ambassador Program"}
            </h2>
            <p
              className="text-gray-700 font-semibold"
              style={{ fontSize: "13px" }}
            >
              Sign In using Discord
            </p>
          </div>
          <div
            className="flex justify-center items-center cursor-pointer"
            onClick={handleDiscordLogin}
          >
            <div
              className="text-white w-full h-9 flex justify-center items-center rounded-md font-bold text-md"
              style={{
                backgroundColor: "#222222",
                border: "1px solid #212125",
              }}
            >
              <FaDiscord className="mr-3 text-blue-700 text-xl" /> Discord
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModel;
