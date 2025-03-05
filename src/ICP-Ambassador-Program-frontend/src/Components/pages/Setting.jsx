import React, { useEffect, useState } from "react";
import settingProfile from "../../../public/icons/settingProfile.png";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { LiaTelegram } from "react-icons/lia";
import { FiEdit2 } from "react-icons/fi";
import { LiaEdit } from "react-icons/lia";
import ParentComponent from "./ParentComponent";
import Navbar from "../modules/Navbar/Navbar";
import Footer from "../footer/Footer";

const Setting = () => {
  const [userName, setuserName] = useState("");
  const [url, setUrl] = useState({
    xUrl: "",
    telegramUrl: "",
    discordUrl: "",
  });

  const [urlState, setUrlState] = useState({
    xUrl: false,
    telegramUrl: false,
    discordUrl: false,
  });

  const handleChange = (platform, value) => {
    setUrl((prev) => ({ ...prev, [platform]: value }));
  };

  const handleConnect = (platform) => {
    if (url[platform].trim() !== "") {
      setUrlState((prev) => ({ ...prev, [platform]: true }));
    }
  };

  const handleRemove = (platform) => {
    setUrlState((prev) => ({ ...prev, [platform]: false }));
    setUrl((prev) => ({ ...prev, [platform]: "" }));
  };

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  useEffect(() => {
    const discordUser = getCookie("discord_user");

    if (discordUser) {
      try {
        const user = JSON.parse(discordUser);
        console.log("Discord Username:", user.username);
        setuserName(user.username);
      } catch (error) {
        console.error("Invalid JSON in cookie:", error);
      }
    }
  }, []);

  return (
    <>
      {/* <ParentComponent> */}
      <div className="flex w-full px-2 flex-col items-center  bg-gradient-to-b from-[#1E0F33]/95 to-[#9173FF]/10">
        <Navbar />
        <div className="w-[93%] mt-1 mb-5 mx-12 pb-4 rounded-2xl bg-gradient-to-b from-[#1E0F33] to-[#9173FF]/50">
          <h2 className="text-3xl py-10 text-white pl-16 font-semibold">
            Setting
          </h2>
          <div className="flex gap-2 justify-between">
            <div className=" w-[40%] flex flex-col gap-2 items-center">
              <div className="rounded-xl w-[424px] h-[300px] flex flex-col items-center bg-gradient-to-b from-[#9173FF]/30 to-[#574599]/0">
                <div className="mt-10 relative">
                  <div className="rounded-full bg-gradient-to-t from-[#9173FF] to-[#1E0F33] w-[260px] h-[256px] flex items-center justify-center">
                    <img src={settingProfile} alt="profile" />
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-center text-xs">
                Image size <br /> at least 300 × 300
              </p>
              <div className="text-white rounded-xl px-4 py-3 bg-[#9173FF]/40 flex items-center justify-center mb-8 w-[280px]">
                <p className="mr-5 font-semibold text-lg">@{userName} </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-[60%]">
              <SocialInput
                platform="discordUrl"
                icon={<FaDiscord className="text-white text-5xl" />}
                placeholder="Enter Discord username"
                url={url}
                urlState={urlState}
                handleChange={handleChange}
                handleConnect={handleConnect}
                handleRemove={handleRemove}
              />
              <SocialInput
                platform="xUrl"
                icon={<BsTwitterX className="text-white text-5xl" />}
                placeholder="Enter X username"
                url={url}
                urlState={urlState}
                handleChange={handleChange}
                handleConnect={handleConnect}
                handleRemove={handleRemove}
              />
              <SocialInput
                platform="telegramUrl"
                icon={<LiaTelegram className="text-white text-5xl" />}
                placeholder="Enter Telegram username"
                url={url}
                urlState={urlState}
                handleChange={handleChange}
                handleConnect={handleConnect}
                handleRemove={handleRemove}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* </ParentComponent> */}
    </>
  );
};

const SocialInput = ({
  platform,
  icon,
  placeholder,
  url,
  urlState,
  handleChange,
  handleConnect,
  handleRemove,
}) => {
  return (
    <div className="flex gap-6 items-center">
      <div className="flex justify-center items-center bg-[#9173FF]/30 w-[70px] h-[70px] rounded-md">
        {icon}
      </div>
      {urlState[platform] ? (
        <div className="flex text-white text-lg font-medium bg-[#D9D9D9]/10  w-[22rem] h-[40px] pl-4 justify-start  items-center rounded-lg">
          <p className="line-clamp-1 break-all">@{url[platform]}</p>
        </div>
      ) : (
        <input
          onChange={(e) => handleChange(platform, e.target.value)}
          type="text"
          placeholder={placeholder}
          className="pl-4 text-lg font-medium w-[22rem] h-[40px] rounded-lg bg-[#D9D9D9]/10 text-white"
        />
      )}
      <button
        onClick={() =>
          urlState[platform] ? handleRemove(platform) : handleConnect(platform)
        }
        className="py-0.5 border-[#9173FF] border px-2 text-[#9173FF] text-lg font-medium rounded-lg"
      >
        {urlState[platform] ? "remove" : "connect"}
      </button>
    </div>
  );
};

export default Setting;
