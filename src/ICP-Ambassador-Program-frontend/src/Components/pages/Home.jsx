import React, { useState, useEffect } from "react";
import Contests from "../modules/Contests/Contests";
import { FilterProvider } from "../Context/FilterContext";
import HubConnectionModal from "../modules/Navbar/HubConnectionModel";
import Cookies from "js-cookie";
import { ICP_Ambassador_Program_backend } from "../../../../declarations/ICP_Ambassador_Program_backend";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/user/userSlice";
import ReactModal from "react-modal";
import ReferralModal from "../modules/Navbar/ReferralModal";
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import ParentComponent from "./ParentComponent";
import { LiaTelegram } from "react-icons/lia";
import defaulBanner from "../../../public/defaultBanner.jpg";
import defaultHubLogo from "../../../public/defaultHubLogo.jpeg";

const Home = () => {
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMobile, setFilterMobile] = useState(false);
  const [refModal, openRefModal] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [discordl_user, setDiscord_user] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [spaceData, setSpaceData] = useState();

  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleCloseaProfile = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (Cookies.get("discord_user")) {
      try {
        const user = JSON.parse(Cookies.get("discord_user"));
        if (user && user.id) {
          getUser_Details(user.id);
        }
      } catch (error) {
        console.error("Error parsing discord_user cookie:", error);
      }
    }
  }, []);

  const getUser_Details = async (userId) => {
    try {
      //console.log(userId)
      const details = await ICP_Ambassador_Program_backend.get_user_data(
        userId
      );
      const user = JSON.parse(Cookies.get("discord_user"));

      const updatedDetails = {
        ...details[0],
        avatar: user.avatar,
      };

      dispatch(updateUser(updatedDetails));
      setDiscord_user(updatedDetails);
      setUser(updatedDetails);
    } catch (e) {
      console.log("Error ==>", e);
    }
  };
  const [space, setSpaces] = useState("");

  const getUser = async (loggedIn) => {
    try {
      const user = JSON.parse(Cookies.get("discord_user"));
      const details = await ICP_Ambassador_Program_backend.get_user_data(
        user.id
      );
      console.log(details, "dd");
      if (details && details?.length !== 0) {
        dispatch(updateUser(details[0]));
        console.log("dispatching user");
        const spaces = await ICP_Ambassador_Program_backend.get_all_spaces();

        if (spaces?.Ok) {
          console.log("getuser spaces:", spaces);

          const space_id = Cookies.get("selectedHub");
          console.log("Space ID from cookies:", space_id);

          // Matching the ID inside spaces.Ok
          const matchedSpace = spaces.Ok.find((space) => space[0] === space_id);

          if (matchedSpace) {
            console.log("Matched Space:", matchedSpace);
            setSpaceData(matchedSpace);
            localStorage.setItem("spaceData", JSON.stringify(matchedSpace));
            // Store matched space wherever required
          } else {
            console.log("No matching space found.");
          }

          for (let i = 0; i < spaces?.Ok?.length; i++) {
            if (spaces?.Ok[i][0] == details[0]?.hub) {
              Cookies.set("selectedHub", details[0]?.hub);
              Cookies.set("selectedHubName", spaces?.Ok[i][1]?.name);
              dispatch(updateUser(details[0]));
            }
          }
        }
        // registered=true
      } else {
        if (loggedIn) {
          setIsHubModalOpen(true);
        }
        setIsHubModalOpen(true);
        //console.log("user not found")
      }
        setLoading(false);
    } catch (e) {
      console.log("Error ==>", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Cookies.get("discord_user")) {
      const user = JSON.parse(Cookies.get("discord_user"));
      //console.log("user ==>",user)
      if (user) {
        Get_All_Spaces();
      }
    } else {
      Get_All_Spaces();
    }
  }, []);

  const Get_All_Spaces = async () => {
    try {
      const spaces = await ICP_Ambassador_Program_backend.get_all_spaces();
      //console.log("Spaces ==>",spaces.Ok);
      const spacesObject = spaces.Ok.map((space) => {
        const [spaceId, details] = space;
        return {
          space_id: spaceId,
          name: details.name,
        };
      });

      setSpaces(spacesObject);
    } catch (e) {
      console.log("Error ==> ", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const cookieUser = Cookies.get("discord_user");
      setUser(cookieUser ? JSON.parse(cookieUser) : null);

      const isLoggedIn = Cookies.get("isLoggedIn");
      getUser(isLoggedIn);

      if (isLoggedIn) {
        setIsHubModalOpen(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    );
  }

  return (
    <ParentComponent>
      <div className="w-[93%] mx-12 bg-[#1E0F33] mt-1 rounded-xl pb-4">
        <div className="flex flex-col px-7 py-7  w-full justify-center   max-md:px-5 max-md:max-w-full">
          <div className="flex shrink-0 justify-center w-full rounded-3xl bg-blend-color h-[212px] max-md:mr-0.5">
            <img
              src={spaceData?.[1]?.bg_img?.[0] || defaulBanner}
              alt="icp banner"
              className="w-full rounded-3xl"
            />
          </div>
          <div className="mt-5 w-full max-md:mr-1.5 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col">
              <div className="flex flex-col w-[82%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-wrap grow gap-4 max-md:mt-10 max-md:max-w-full">
                  <div className="flex flex-col justify-center items-center px-1.5 rounded-3xl bg-zinc-300 h-[100px] w-[100px]">
                    <img
                      loading="lazy"
                      src={spaceData?.[1]?.logo?.[0] || defaultHubLogo}
                      alt="ICP HUB India Logo"
                      className="object-contain rounded-3xl aspect-square "
                    />
                  </div>
                  <div className="flex flex-col grow shrink-0 self-start mt-2.5 text-white basis-0 w-fit max-md:max-w-full">
                    <div className="self-start ml-5 text-3xl uppercase font-semibold max-md:ml-2.5 max-md:text-2xl">
                      {spaceData?.[1]?.name || "ALL ICP HUBS "}
                    </div>
                    <input
                      className="px-5 py-1.5 mt-3 text-lg font-medium rounded-xl bg-violet-500 bg-opacity-20 max-md:pr-5 max-md:max-w-full"
                      type="text"
                      placeholder="add your info..."
                      value={
                        spaceData?.[1]?.description ||
                        "Start building on #Web3 Today | #ICP #WorldComputer"
                      }
                      writable="false"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="flex   flex-col ml-5 w-[18%] max-md:ml-0 max-md:w-full">
                <div className="flex justify-end grow gap-2.5 mt-10 max-md:mt-8">
                  <a
                    href={spaceData?.[1]?.urls?.twitter?.[0] || "https://x.com"}
                    target="_blank"
                    className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[58px] w-[58px]"
                  >
                    <BsTwitterX style={{ fontSize: "35px", color: "white" }} />
                  </a>
                  <a
                    href={
                      spaceData?.[1]?.urls?.discord[0] || "https://discord.com"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[58px] w-[58px]"
                  >
                    <FaDiscord style={{ fontSize: "40px", color: "white" }} />
                  </a>
                  <a
                    href={
                      spaceData?.[1]?.urls?.telegram[0] ||
                      "https://www.linkedin.com"
                    }
                    target="_blank"
                    className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[58px] w-[58px]"
                  >
                    <LiaTelegram style={{ fontSize: "40px", color: "white" }} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-[#9173FF]"></div>
        <FilterProvider>
          <div className="flex flex-grow   rounded-md ">
            <div className="w-full h-full">
              <Contests
                openWallet={openWallet}
                user_details={user}
                setDiscord_user={setDiscord_user}
                isDrawerOpen={isDrawerOpen}
                onCloseProfile={handleCloseaProfile}
                openRefModal={openRefModal}
                setLoading={setLoading}
              />
            </div>
          </div>
        </FilterProvider>
      </div>

      {isHubModalOpen && (
        <HubConnectionModal
          setLoading={setLoading}
          isOpen={isHubModalOpen}
          onClose={() => setIsHubModalOpen(false)}
          spaces={space}
        />
      )}

      <ReactModal
        isOpen={refModal}
        className="modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backdropFilter: "blur(3px)",
            zIndex: 50,
            backgroundColor: "rbg(0,0,0,0%)",
          },
        }}
      >
        <ReferralModal setOpen={openRefModal} />
      </ReactModal>
    </ParentComponent>
  );
};

export default Home;