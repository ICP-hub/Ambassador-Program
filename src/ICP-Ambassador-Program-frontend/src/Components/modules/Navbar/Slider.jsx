import {useEffect, useState } from "react";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";

import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";

const MissionCard = ({ updatedContest }) => {
  const [activeIndex, setActiveIndex] = useState(2);
  const totalSlides = 5; // Adjust based on your content

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  function convertTimestampAndTimeRemaining(timestamp) {
    // Current date and time
    const currentDate = new Date();

    // Target date based on the provided timestamp
    const targetDate = new Date(timestamp);

    // Calculate the difference in milliseconds
    const timeDifference = targetDate - currentDate;

    // If the target date is in the past
    if (timeDifference < 0) {
        return "0m";
    }

    // Calculate days, hours, and minutes remaining
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Calculate the target date in a readable format
    const formattedTargetDate = targetDate.toLocaleString();

    // Build the result for time remaining
    let timeRemaining = '';
    if (days > 0) timeRemaining += `${days}d `;
    if (hours > 0) timeRemaining += `${hours}h `;
    if (minutes > 0) timeRemaining += `${minutes}m`;

    return timeRemaining.trim();
}


  return (
    <div className="w-[400px] h-[520px] bg-[#1E0F33] text-white p-5 rounded-md">
      {/* Time Remaining */}
      <div className="flex justify-between font-semibold items-center mb-3">
        <span className="text-gray-400 text-sm">Time Remaining</span>
        <span className="text-lg font-semibold">{convertTimestampAndTimeRemaining(parseInt(updatedContest.end_date))}</span>
      </div>

      {/* Rewards */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-400 text-sm font-semibold">Reward</span>
        <div className="flex gap-2">
          <button className="border border-gray-500 px-3 py-1 rounded-md text-sm">
            {parseInt(updatedContest.reward)} Points
          </button>
          <button className="border border-gray-500  bg-[#FFFFFF33] px-3 py-1 rounded-md text-sm">
            {parseInt(updatedContest.pool)/1000000} {DEFAULT_CURRENCY}
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
