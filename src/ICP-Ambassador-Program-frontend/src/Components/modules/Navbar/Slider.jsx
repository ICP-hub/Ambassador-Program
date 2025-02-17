import { useState } from "react";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
const MissionCard = ({ updatedContest }) => {
  const [activeIndex, setActiveIndex] = useState(2);
  const totalSlides = 5; // Adjust based on your content

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-[400px] h-[520px] bg-[#1E0F33] text-white p-5 rounded-md">
      {/* Time Remaining */}
      <div className="flex justify-between font-semibold items-center mb-3">
        <span className="text-gray-400 text-sm">Time Remaining</span>
        <span className="text-lg font-semibold">3d 20h 40m</span>
      </div>

      {/* Rewards */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-400 text-sm font-semibold">Reward</span>
        <div className="flex gap-2">
          <button className="border border-gray-500 px-3 py-1 rounded-md text-sm">
            1500 Points
          </button>
          <button className="border border-gray-500  bg-[#FFFFFF33] px-3 py-1 rounded-md text-sm">
            {parseInt(updatedContest.reward)} ckbtc
          </button>
        </div>
      </div>

      {/* Mission Box */}
      <div className="relative w-full h-[350px] bg-gradient-to-b from-[#9173FF] to-[#3b2c6f] rounded-xl flex items-start p-3">
        <span className="bg-[#4A0295] border border-white px-3 py-1 text-xs rounded-lg">
          Ongoing
        </span>
      </div>

      {/* Pagination Dots */}
    </div>
  );
};

export default MissionCard;
