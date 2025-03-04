import React, { useState, useEffect } from "react";
import bgImg from "../../../../public/leaderboardBg.png";
import { IoSearch } from "react-icons/io5";
import ParentComponent from "../ParentComponent";
import { ICP_Ambassador_Program_backend } from "../../../../../declarations/ICP_Ambassador_Program_backend";
import background from "../../../../public/rewardBgImg.png";

const Leaderboard = () => {
  const ranks = [
    "All",
    "Initiate",
    "Padawan",
    "Knight",
    "Master",
    "Grand Master",
  ];

  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedRank, setSelectedRank] = useState("All"); // State to track the selected rank
  const [searchQuery, setSearchQuery] = useState(""); // State to track the search query

  const getLeaderboard = async () => {
    try {
      const spaceData = JSON.parse(localStorage.getItem("spaceData"));
      if (!spaceData || spaceData.length === 0) {
        throw new Error("No space data found in localStorage.");
      }
        const space_id = spaceData[0];
        const leaderboard_res = await ICP_Ambassador_Program_backend.get_leaderboard(space_id);
        if (leaderboard_res && leaderboard_res.Ok) {
        console.log("Leaderboard:", leaderboard_res.Ok);
        setLeaderboard(leaderboard_res.Ok); // Update state with leaderboard data
      } else {
        console.error("No leaderboard data received.");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  // Filter the leaderboard based on the selected rank and search query
  const filteredLeaderboard = leaderboard.filter((row) => {
    const matchesRank = selectedRank === "All" || row.rank === selectedRank;
    const matchesSearch = row.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesRank && matchesSearch;
  });

  useEffect(() => {
    getLeaderboard();
  }, []);

  return (
    <ParentComponent>
      <div className="w-[93%] mt-1 rounded-[45px] bg-[#1E0F33] flex flex-col items-center justify-center ">
        <div className="w-full p-6">
          <div
            className="relative w-full h-[341px] bg-cover bg-center rounded-3xl overflow-hidden"
            style={{
              backgroundImage: `url(${background})`,
            }}
          >
            <img src={bgImg} alt="logo" className="h-full w-full relative " />
            <div className="absolute top-[60%] left-[30%] w-[40%] flex items-center justify-center mt-4">
              <IoSearch
                style={{ fontSize: 30 }}
                className="text-[#9173FF]/50 mr-1 "
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-2 py-1 rounded-md bg-[#9173FF]/50 text-white outline-none"
                value={searchQuery} // Bind search input to state
                onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state
              />
            </div>
          </div>
        </div>
        <div className="h-[2px] bg-[#9173FF]/50 w-full "></div>

        <div className="flex w-full gap-2 my-4 justify-around flex-wrap">
          {ranks.map((rank, index) => (
            <button
              key={index}
              className={`w-[175px] py-1 text-lg font-medium rounded-md transition ${rank === selectedRank
                ? "bg-[#9173FF]/80 text-white"
                : "bg-[#9173FF]/20 text-gray-300"
                } hover:bg-[#9173FF]`}
              onClick={() => setSelectedRank(rank)} // Set the selected rank on button click
            >
              {rank}
            </button>
          ))}
        </div>

        <div className="h-[2px] bg-[#9173FF]/50 w-full "></div>

        <div className="w-full p-6">
          {leaderboard.length > 0 ? (
            filteredLeaderboard.length > 0 ? ( // Check if there is filtered data
              <div className="w-full h-fit min-h-[200px] overflow-y-scroll scrollbar-hide bg-gradient-to-b from-[#D9D9D9]/5 to-[#9173FF]/3 rounded-2xl overflow-x-auto">
                <table className="w-full text-center text-white">
                  <thead className="text-[#9173FF] font-semibold text-3xl ">
                    <tr>
                      <th className="p-3">Position</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaderboard.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b text-2xl font-medium border-[#9173FF]/10"
                      >
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{row.name}</td>
                        <td className="p-3">{row.rank}</td>
                        <td className="p-3">{parseInt(row.points)}</td>
                      </tr>
                    ))}
                    {[...Array(3)].map((_, index) => (
                      <tr
                        key={`empty-${index}`}
                        className="border-b border-[#9173FF]/10"
                      >
                        <td className="p-3 text-transparent">-</td>
                        <td className="p-3 text-transparent">-</td>
                        <td className="p-3 text-transparent">-</td>
                        <td className="p-3 text-transparent">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // If no data found for the search query and selected rank
              <div className="w-full h-[200px] flex items-center justify-center text-white">
                <p>No data to display for this search query.</p>
              </div>
            )
          ) : (
            <div className="w-full h-[200px] flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-[#9173FF]/10 rounded-full border-t-[#9173FF] animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </ParentComponent>
  );
};

export default Leaderboard;
