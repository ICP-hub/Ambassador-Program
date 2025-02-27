import React from "react";
import bgImg from "../../../../public/leaderboardBg.png";
import { IoSearch } from "react-icons/io5";

const Leaderboard = () => {
  const ranks = [
    "All",
    "Initiate",
    "Padawan",
    "Knight",
    "Master",
    "Grand Master",
  ];
  const data = [
    {
      position: 1,
      user: "1004417914935451721",
      rank: "Grand Master",
      points: "143",
    },
    {
      position: 2,
      user: "1004417914935451727",
      rank: "Grand Master",
      points: "173",
    },
    {
      position: 3,
      user: "1004417914935451774",
      rank: "Grand Master",
      points: "113",
    },
    {
      position: 4,
      user: "1004417914935451797",
      rank: "Grand Master",
      points: "163",
    },
    {
      position: 5,
      user: "1004417914935451701",
      rank: "Master",
      points: "153",
    },
    {
      position: 6,
      user: "1004417914935451761",
      rank: "Master",
      points: "134",
    },
    {
      position: 7,
      user: "1004417914935451711",
      rank: "Knight",
      points: "178",
    },
    {
      position: 8,
      user: "1004417914935451791",
      rank: "Knight",
      points: "157",
    },
    {
      position: 9,
      user: "1004417914935451771",
      rank: "Padawan",
      points: "193",
    },
    {
      position: 10,
      user: "1004417914935451751",
      rank: "Padawan",
      points: "161",
    },
    {
      position: 11,
      user: "1004417914935451741",
      rank: "Padawan",
      points: "141",
    },
    {
      position: 12,
      user: "1004417914935451731",
      rank: "Initiate",
      points: "187",
    },
    {
      position: 13,
      user: "1004417914935451722",
      rank: "Initiate",
      points: "165",
    },
  ];

  return (
    <div className=" bg-[#1E0F33] flex flex-col items-center justify-center ">
      <div className="w-full p-6   ">
        <div
          className="relative w-full  h-[341px] bg-cover bg-center rounded-3xl overflow-hidden"
          style={{
            backgroundImage: `url(https://cdn.builder.io/api/v1/image/assets/TEMP/6d49702b2ce6c35ecb5b45303490eb65fa79cd0b7030bbe3192750c86bcf43c6?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114)`,
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
              className="w-full px-2 py-1  rounded-md bg-[#9173FF]/50 text-white outline-none"
            />
          </div>
        </div>
      </div>
      <div className="h-[2px]  bg-[#9173FF]/50 w-full "></div>

      <div className="flex w-full gap-2 my-4 justify-around flex-wrap">
        {ranks.map((rank, index) => (
          <button
            key={index}
            className={`w-[187px] py-1 text-lg font-medium rounded-md transition ${
              rank === "All"
                ? "bg-[#9173FF]/80 text-white"
                : "bg-[#9173FF]/20 text-gray-300"
            } hover:bg-[#9173FF]`}
          >
            {rank}
          </button>
        ))}
      </div>

      <div className="h-[2px]  bg-[#9173FF]/50 w-full "></div>

      <div className="w-full  p-6">
        <div className="w-full h-screen overflow-y-scroll  scrollbar-hide bg-gradient-to-b from-[#D9D9D9]/5 to-[#9173FF]/3 rounded-2xl overflow-x-auto">
          <table className="w-full text-center text-white">
            <thead className="text-[#9173FF] font-semibold  text-3xl  ">
              <tr>
                <th className="p-3">Position</th>
                <th className="p-3">User</th>
                <th className="p-3">Rank</th>
                <th className="p-3">Points</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b text-2xl font-medium border-[#9173FF]/10"
                >
                  <td className="p-3">{row.position}</td>
                  <td className="p-3">{row.user}</td>
                  <td className="p-3">{row.rank}</td>
                  <td className="p-3">{row.points}</td>
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
      </div>
    </div>
  );
};

export default Leaderboard;
