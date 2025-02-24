import React, { useEffect, useState } from "react";
import Card from "./Card";
import { useFilterContext } from "../../Context/FilterContext";
import { ICP_Ambassador_Program_backend } from "../../../../../declarations/ICP_Ambassador_Program_backend";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import Contest_Details from "./ContestDetails";
import WalletSidebar from "../../wallet/walletSidebar";
import ProfileDrawer from "../Navbar/ProfileDrawer";
import { MdOutlineStarBorder } from "react-icons/md";
const Contests = ({
  openWallet,
  onCloseWallet,
  user_details,
  setDiscord_user,
  isDrawerOpen,
  onCloseProfile,
  openRefModal,
  setLoading,
}) => {
  const [selectedContest, setSelectContest] = useState("");
  const { selectedPlatform } = useFilterContext();
  const user = useSelector((state) => state.user.value);

  const contests = [];

  const [displayedContests, setDisplayedContests] = useState(contests);
  const [hub, setHub] = useState("");

  useEffect(() => {
    console.log("user details ==>", user_details);
    const HUB = Cookies.get("selectedHubName");
    const space_id = Cookies.get("selectedHub");
    //console.log(space_id)
    setHub(HUB);
    const cookieUser = Cookies.get("discord_user");
    if (cookieUser) {
      //console.log("user space details")
      get_user_mission(space_id);
    } else {
      //console.log("all missions")
      getMissions();
    }
  }, [user]);

  const get_user_mission = async (spaceId) => {
    try {
      const user_contest =
        await ICP_Ambassador_Program_backend.get_all_space_missions(spaceId);
      console.log("user contest ==>", user_contest);

      if (user_contest?.Ok) {
        const contestsArray = Array.isArray(user_contest.Ok)
          ? user_contest.Ok
          : [user_contest.Ok];

        const updatedContests = contestsArray
          .filter((contest) => {
            const contestStatus = Object.keys(contest.status)[0] === "Active";
            const currentTime = Date.now();
            const contestEndDate = contest.end_date; // Assuming the end_date is a timestamp in milliseconds

            // Include only active contests whose end_date is not in the past
            return contestStatus && contestEndDate > currentTime;
          })
          .map((contest) => {
            return { ...contest }; // Make a copy of each active and valid contest
          });

        console.log("updated contests : ", updatedContests);
        setDisplayedContests(updatedContests);
      }
    } catch (e) {
      console.log("Error ==>", e);
    }
  };

  async function getMissions() {
    try {
      const res = await ICP_Ambassador_Program_backend.get_all_spaces();
      console.log(res);

      if (res != undefined && res != null && res?.Ok != undefined) {
        let space_1 = res?.Ok[0][0];
        //console.log(space_1);
        const space_details = await ICP_Ambassador_Program_backend.get_space(
          space_1
        );
        //console.log("Space Details ==>",space_details.Ok.name)
        setHub(space_details.Ok.name);
        const mis_res =
          await ICP_Ambassador_Program_backend.get_all_space_missions(space_1);
        console.log(mis_res);

        if (mis_res?.Ok) {
          // mis_res.Ok.forEach((item, index) => {
          //   console.log(`${index}th element in result:`, item);
          // });
        }
        const updatedContests = mis_res.Ok.map((contest) => ({
          ...contest,
        }));

        let activeContests = [];
        for (let i = 0; i < updatedContests.length; i++) {
          if (Object.keys(updatedContests[i]?.status)[0] == "Active") {
            activeContests.push(updatedContests[i]);
          }
        }
        // let activeMissions=[]
        console.log("updated contests : ", activeContests);

        setDisplayedContests(activeContests);
        //console.log("Updated displayedContests:", updatedContests);
      }
    } catch (error) {
      console.log("err fetching missions : ", error);
    }
  }

  // let displayedContests =contests

  useEffect(() => {
    //getMissions()
    const filteredContests = contests.filter(
      (contest) => {
        // console.log('Current Contest:', contest);
        // console.log('Contest Social Platforms:', contest.social_platforms);
        // console.log('Selected Platforms:', selectedPlatform);

        const matches =
          selectedPlatform.length === 0 ||
          contest.social_platforms.some((platform) =>
            selectedPlatform.includes(platform.name)
          );

        // console.log('Matches Found:', matches);
        return matches;
      },
      [selectedPlatform]
    );

    //  console.log('Selected Platforms ',selectedPlatform)
    //  console.log("Filtered data",filteredContests)
    const unmatchedContests = contests.filter(
      (contest) =>
        !contest.social_platforms.some((platform) =>
          selectedPlatform.includes(platform.name)
        )
    );

    const combinedContests = [...filteredContests, ...unmatchedContests];
    //  displayedContests = filteredContests
    setDisplayedContests(combinedContests);
    //console.log("DisplyedContests",displayedContests)
  }, [selectedPlatform]);
  const sortNewest = () => {
    const sorted = [...displayedContests].sort(
      (a, b) => b.end_date - a.end_date
    );
    setDisplayedContests(sorted);
  };

  return (
    <>
      <div className="flex flex-wrap gap-10 my-6 px-7 w-full text-xl text-white whitespace-nowrap max-md:mt-10 max-md:mr-2 max-md:max-w-full">
        <div className="flex items-center flex-1 gap-3 font-medium">
          {/* <button className="flex gap-2 px-5 py-2.5 rounded-xl bg-violet-500 bg-opacity-50">
                  <LuFilter style={{ fontSize: "30px", color: "white" }} />
                  <span className="my-auto">Sorting</span>
                </button> */}
          <button
            className="flex gap-2 px-5 py-2.5 rounded-xl bg-violet-500 bg-opacity-50"
            onClick={sortNewest}
          >
            <MdOutlineStarBorder style={{ fontSize: "30px", color: "white" }} />
            <span className="my-auto">Newest</span>
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
      <div className="overflow-y-scroll  scrollbar-hide">
        <div className="flex  transition-all duration-500 delay-200 relative ">
          <div
            className={` transition-all h-screen duration-500 ${
              openWallet ? "w-[calc(100%-100px)] " : "w-full"
            } p-2    overflow-y-scroll scrollbar-hide`}
          >
            <div
              className={`grid w-full  ${
                openWallet || isDrawerOpen
                  ? " lg:grid-cols-3"
                  : "lg:grid-cols-3"
              }   sm:grid-cols-1  rounded-md md:grid-cols-2 gap-3 `}
              style={{
                maxWidth: "100%",
                transition: "max-width 0.5s ease-in-out",
                rowGap: "2px",
              }}
            >
              {/* <div className="flex flex-wrap gap-6 mt-8"> */}
              {displayedContests?.length > 0 ? (
                displayedContests.map((contest, index) => (
                  <div className=" h-fit">
                    <Card key={index} contest={contest} hub={hub} />
                  </div>
                ))
              ) : (
                <p className="text-white w-full text-center mt-20 text-2xl">
                  No missions to show
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contests;