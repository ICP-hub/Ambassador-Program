import React, { useState } from "react";

const ReferralBoard = ({userRefered}) => {
  const data = [
    {
      user: "Username",
      dateAdded: "01/01/2025",
      rank: "Master",
      points: "151",
    },
    {
      user: "Username",
      dateAdded: "02/01/2025",
      rank: "Grand Master",
      points: "148",
    },
    {
      user: "Username",
      dateAdded: "03/01/2025",
      rank: "Grand Master",
      points: "123",
    },
  ];

  return (
    <div className="w-full  mx-auto p-4">
      <div className=" rounded-lg overflow-hidden">
        <table className="w-full text-center  text-white">
          <thead className="bg-transparent font-semibold  text-3xl text-[#9173FF] ">
            <tr>
              <th className="p-3">User</th>
              {/* <th className="p-3">Date Added</th> */}
              <th className="p-3">Rank</th>
              <th className="p-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {userRefered.length > 0 ? (
              userRefered.map((row, index) => (
                <tr
                  key={index}
                  className="border-b text-2xl font-medium border-[#9173FF]/10"
                >
                  <td className="p-3">{row?.username}</td>
                  {/* <td className="p-3">{row?.dateAdded}</td> */}
                  <td className="p-3">{Object.keys(row?.rank)}</td>
                  <td className="p-3">{parseInt(row?.xp_points)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="p-3 text-center pt-10 font-medium text-2xl"
                >
                  You haven't referred anyone yet.
                </td>
              </tr>
            )}

            {userRefered.length > 0 &&
              [...Array(7)].map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="border-b border-[#9173FF]/10"
                >
                  <td className="p-3 text-transparent">-</td>
                  {/* <td className="p-3 text-transparent">-</td> */}
                  <td className="p-3 text-transparent">-</td>
                  <td className="p-3 text-transparent">-</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralBoard;
