import React, { useState, useEffect } from "react";
import Navbar from "../modules/Navbar/Navbar";
import Filter from "../modules/Filter/Filter";
import Contests from "../modules/Contests/Contests";

import { FilterProvider } from "../Context/FilterContext";
import HubConnectionModal from "../modules/Navbar/HubConnectionModel";
import FilterMobile from "../modules/Filter/FilterMobile";
import Cookies from "js-cookie";
import { MdOutlineTune } from "react-icons/md";
import { ICP_Ambassador_Program_backend } from "../../../../declarations/ICP_Ambassador_Program_backend";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/user/userSlice";
import ReactModal from "react-modal";
import ReferralModal from "../modules/Navbar/ReferralModal";
import Footer from "../footer/Footer";
import icpbanner from "../.../../../../public/icpbanner.png";
import awtar from "../../../public/icons/Avatar.png";
import UserProfile from "../modules/Navbar/UserProfile";
import WalletSidebar from "../wallet/walletSidebar";
import Setting from "./Setting";
import { WalletPage } from "./walletPage/WalletPage";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { LuFilter } from "react-icons/lu";

const Home = () => {
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMobile, setFilterMobile] = useState(false);
  const [refModal, openRefModal] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [discordl_user, setDiscord_user] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [spaceData, setSpaceData] = useState("");

  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleWalletToggle = () => {
    //console.log("open wallet")
    setIsDrawerOpen(false);
    setOpenWallet((prev) => !prev);
  };

  const handleCloseWallet = () => {
    setOpenWallet(false);
  };

  const handleProfileToggle = () => {
    setOpenWallet(false);
    setIsDrawerOpen((prev) => !prev);
  };
  const handleCloseaProfile = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (Cookies.get("discord_user")) {
      try {
        const user = JSON.parse(Cookies.get("discord_user"));
        //console.log(JSON.parse(Cookies.get('discord_user')))
        const email = user ? user.email : undefined;
        //console.log("user ==>",user)
        //setDiscord_user(user);
        //console.log("Discord user ==>",discordl_user)
        // if (email) {
        //   setUserEmail(email);
        // }

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
      //console.log("Details from backend ==>",details)
      const user = JSON.parse(Cookies.get("discord_user"));
      //console.log("Discord user from cookies ==>", user);

      const updatedDetails = {
        ...details[0],
        avatar: user.avatar,
      };

      //console.log("user_details in home page ==>",updatedDetails)
      dispatch(updateUser(updatedDetails));
      setDiscord_user(updatedDetails);
      setUser(updatedDetails);
      // dispatch(updateUser(details[0]))
      // setDiscord_user(details[0])
    } catch (e) {
      console.log("Error ==>", e);
    }
  };
  const [space, setSpaces] = useState("");
  const loggedIn = Cookies.get("isLoggedIn");

  console.log("Looged In ==>", loggedIn);
  const getUser = async (isLoggedIn) => {
    try {
      //console.log(userId)

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

      //console.log(space)

      //console.log("Transformed Spaces Object:", spacesObject);
    } catch (e) {
      console.log("Error ==> ", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const cookieUser = Cookies.get("discord_user");
      setUser(cookieUser ? JSON.parse(cookieUser) : null);

      const isLoggedIn = Cookies.get("isLoggedIn");
      //console.log("passing is logged in : ",isLoggedIn)
      getUser(isLoggedIn);

      console.log(cookieUser && !isLoggedIn, !cookieUser, !isLoggedIn);

      if (isLoggedIn) {
        setIsHubModalOpen(true);
      }

      //setIsHubModalOpen(true);
      // setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterMobile = () => {
    setFilterMobile(true);
  };

  console.log("Discord user ==>", discordl_user);

  console.log(spaceData, "spacedata");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    );
  }

  return (
    <>
      <div className=" flex flex-col pb-8 bg-gradient-to-b from-[#1E0F33] to-[#9173FF] ">
        <Navbar
          nav={nav}
          openRefModal={openRefModal}
          setLoading={setLoading}
          onWalletClick={handleWalletToggle}
          onProfileClick={handleProfileToggle}
        />
        {isDrawerOpen && (
          <UserProfile
            onWalletClick={handleWalletToggle}
            onProfileClick={handleProfileToggle}
          />
        )}
        {openWallet && (
          <WalletSidebar
            onClose={handleCloseWallet}
            user={user}
            isOpen={openWallet}
            setDiscord_user={setDiscord_user}
          />
        )}

        <div className="mx-12 bg-[#1E0F33] mt-1 rounded-xl pb-4">
          <div className="flex flex-col px-7 py-10  w-full justify-center   max-md:px-5 max-md:max-w-full">
            <div className="flex shrink-0 justify-center w-full rounded-3xl bg-blend-color h-[300px] max-md:mr-0.5">
              <img
                src="https://st.depositphotos.com/3148167/53962/i/450/depositphotos_539628450-stock-photo-internet-computer-icp-cryptocurrency-internet.jpg"
                alt="icp banner"
                className="w-full rounded-3xl"
              />
            </div>
            <div className="mt-5 w-full max-md:mr-1.5 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col">
                <div className="flex flex-col w-[82%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-wrap grow gap-4 max-md:mt-10 max-md:max-w-full">
                    <div className="flex flex-col justify-center items-center px-1.5 rounded-3xl bg-zinc-300 h-[111px] w-[111px]">
                      <img
                        loading="lazy"
                        src={spaceData[1]?.bg_img[0]}
                        alt="ICP HUB India Logo"
                        className="object-contain rounded-3xl aspect-square w-[100px]"
                      />
                    </div>
                    <div className="flex flex-col grow shrink-0 self-start mt-2.5 text-white basis-0 w-fit max-md:max-w-full">
                      <div className="self-start ml-5 text-4xl font-semibold max-md:ml-2.5 max-md:text-3xl">
                        {spaceData[1]?.name}
                      </div>
                      <input
                        className="px-5 py-2 mt-4 text-xl font-medium rounded-xl bg-violet-500 bg-opacity-20 max-md:pr-5 max-md:max-w-full"
                        type="text"
                        placeholder="add your info..."
                        value={spaceData[1]?.description}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex   flex-col ml-5 w-[18%] max-md:ml-0 max-md:w-full">
                  <div className="flex justify-end grow gap-2.5 mt-12 max-md:mt-10">
                    <a
                      target="_blank"
                      className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[63px] w-[63px]"
                    >
                      <BsTwitterX
                        style={{ fontSize: "40px", color: "white" }}
                      />
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[63px] w-[63px]"
                    >
                      <FaDiscord style={{ fontSize: "42px", color: "white" }} />
                    </a>
                    <a
                      target="_blank"
                      className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[63px] w-[63px]"
                    >
                      <FaLinkedinIn
                        style={{ fontSize: "40px", color: "white" }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-0.5 bg-[#9173FF]"></div>
          <div className="flex flex-wrap gap-10 my-6 px-7 w-full text-xl text-white whitespace-nowrap max-md:mt-10 max-md:mr-2 max-md:max-w-full">
            <div className="flex flex-1 gap-3 font-medium">
              <button className="flex gap-2 px-5 py-2.5 rounded-xl bg-violet-500 bg-opacity-50">
                <LuFilter style={{ fontSize: "30px", color: "white" }} />
                <span className="my-auto">Sorting</span>
              </button>
            </div>
            {/* <div className="flex flex-col  pb-3 leading-none">
              <input
                type="text"
                id="searchInput"
                className="overflow-hidden self-stretch px-4 py-2 rounded-3xl bg-white bg-opacity-20 text-white"
                placeholder="Search"
              />
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/085a2850ffba14b649faa1413a9e4c4e326930be68c485bdaef028a572f18c69?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
                alt=""
                className="object-contain  self-end -mt-8 mr-5 w-5 aspect-square max-md:mr-2.5"
              />
            </div> */}
          </div>
          <div className="h-0.5 bg-[#9173FF]"></div>
          <FilterProvider>
            <div className="flex flex-grow p-2  rounded-md ">
              <div className="w-full h-full">
                <Contests
                  openWallet={openWallet}
                  onCloseWallet={handleCloseWallet}
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

        {/* <div className='relative'>
        <div className='absolute bottom-44 left-1/2 transform -translate-x-1/2 z-50 lg:hidden' onClick={handleFilterMobile}>
          <div className='bg-white rounded py-2 px-5 font-semibold flex gap-3 justify-center items-center'>
            <MdOutlineTune className='text-lg' /> Filter
          </div>
        </div>
      </div> */}

        {/* {filterMobile && (
        <FilterMobile isOpen={filterMobile} onClose={() => setFilterMobile(false)} />
      )} */}
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
      </div>
      <Footer />
    </>
  );
};

export default Home;
