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
import toast from "react-hot-toast";
import { ICP_Ambassador_Program_backend } from "../../../../declarations/ICP_Ambassador_Program_backend";

// get_user_data
const Setting = () => {
  const [userId, setUserId] = useState();
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

  const handleConnect = async (platform) => {
    try {
      if (url[platform].trim() !== "") {
        setUrlState((prev) => ({ ...prev, [platform]: true }));
      }

      let username = url[platform];
      let category = platform === "xUrl" ? "twitter" : "telegram";

      console.log("category : ", category, username);

      const resp = await ICP_Ambassador_Program_backend.update_user_profile(userId, username, category);
      console.log("resp : ", resp);

      setTimeout(() => {
        get_user_data(userId);
      }, 4000);
    } catch (error) {
      console.log(error);
    }

  };


  const handleRemove = async (platform) => {
    try {
      if (platform === "discordUrl") {
        toast.error("Discord username cannot be removed");
        return;
      }

      setUrlState((prev) => ({ ...prev, [platform]: false }));
      setUrl((prev) => ({ ...prev, [platform]: "" }));

      let username = "";
      let category;


      if (platform === "xUrl") {
        category = "twitter";
      }
      else if (platform === "telegramUrl") {
        category = "telegram";
      }

      const resp = await ICP_Ambassador_Program_backend.update_user_profile(userId, username, category);
      console.log("delete resp : ", resp);

      setTimeout(() => {
        get_user_data(userId);
      }, 4000);


    } catch (error) {
      console.log(error);
    }
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

  const get_user_data = async (id) => {
    try {
      const resp = await ICP_Ambassador_Program_backend.get_user_data(id);
      console.log("User data :", resp[0].twitter_username.length);

      setUrl((prev) => ({
        ...prev,
        xUrl: resp[0].twitter_username,
        telegramUrl: resp[0].telegram_username,
      }));

      if (resp[0].twitter_username.length > 0) {
        setUrlState((prev) => ({
          ...prev,
          xUrl: true,
        }));
      }

      if (resp[0].telegram_username.length > 0) {
        setUrlState((prev) => ({
          ...prev,
          telegramUrl: true,
        }));
      }

    }
    catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const discordUser = getCookie("discord_user");

    if (discordUser) {
      try {
        const user = JSON.parse(discordUser);
        console.log("Discord Username:", user.id);
        setUserId(user.id);
        setuserName(user.username);
        setUrl((prev) => ({
          ...prev, discordUrl: user.username,
        }));
        setUrlState((prev) => ({
          ...prev,
          discordUrl: true,
        }));

        get_user_data(user.id);


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
        <div className="md:w-[90%] dlg:w-[93%] mt-1 mb-5  pb-4 rounded-2xl bg-gradient-to-b from-[#1E0F33] to-[#9173FF]/50">
          <h2 className="text-3xl py-10 text-white pl-[5%] font-semibold">
            Setting
          </h2>
          <div className="flex  w-full  pl-[5%] gap-2 justify-between">
            <div className=" w-[40%] flex flex-col gap-2 items-center">
              <div className="rounded-xl md:w-full md:h-[200px]  dlg:h-[300px] flex flex-col items-center bg-gradient-to-b from-[#9173FF]/30 to-[#574599]/0">
                <div className="mt-10 relative">
                  <div className="rounded-full bg-gradient-to-t from-[#9173FF] to-[#1E0F33] md:w-[190px] md:h-[180px] dlg:w-[260px] dlg:h-[256px] flex items-center justify-center">
                    <img src={settingProfile} alt="profile" />
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-center text-xs">
                Image size <br /> at least 300 × 300
              </p>
              <div className="text-white rounded-xl px-4 py-3 bg-[#9173FF]/40 flex items-center justify-center mb-8 w-[80%]">
                <p className="mr-5 md:font-medium lg:font-semibold md:text-base lg:text-lg">
                  @{userName}{" "}
                </p>
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
                icon={
                  <BsTwitterX className="text-white md:text-3xl dlg:text-5xl" />
                }
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
    <div className="flex gap-6 items-center w-[60%]">
      <div className="flex justify-center items-center bg-[#9173FF]/30 md:w-[40px] md:h-[40px] dlg:w-[70px] dlg:h-[70px] rounded-md">
        {icon}
      </div>
      {urlState[platform] ? (
        <div className="flex text-white text-lg font-medium bg-[#D9D9D9]/10  max-w-[22rem] md:w-[45%] md2:w-[55%] md:h-[30px] dlg:h-[40px] pl-4 justify-start  items-center rounded-lg">
          <p className="line-clamp-1 break-all">@{url[platform]}</p>
        </div>
      ) : (
        <input
          onChange={(e) => handleChange(platform, e.target.value)}
          type="text"
          placeholder={placeholder}
          className="pl-4 text-lg font-medium max-w-[22rem] md:w-[45%] md2:w-[55%] md:h-[30px] dlg:h-[40px] rounded-lg bg-[#D9D9D9]/10 text-white"
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
