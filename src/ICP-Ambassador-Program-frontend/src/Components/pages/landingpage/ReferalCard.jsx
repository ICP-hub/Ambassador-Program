import React from "react";
import A_logo from "../..//../../public/icons/A_logo.png";

const ReferalCard = ({ heading, text }) => {
  return (
    <div className="rounded-2xl bg-[#9173FF] opacity-80 w-[418px] h-[457px] flex flex-col justify-between">
      <div className="flex gap-4 p-4">
        <img src={A_logo} alt="atlas" className="w-[43px] h-[30px] " />
        <h2 className="text-white text-2xl font-semibold">{heading}</h2>
      </div>
      <div className=" p-4">
        <p className="text-white font-medium text-xl">{text}</p>
      </div>
    </div>
  );
};

export default ReferalCard;
