import React from "react";
import ReferralBoard from "./ReferralBoard";
import ReferalEarnings from "./ReferalEarnings";

const ReferalPage = () => {
  return (
    <div className="flex flex-col pb-8 bg-gradient-to-b from-[#1E0F33] to-[#9173FF] ">
      <div className="bg-[#1E0F33] mx-10 rounded-xl p-6 ">
        <ReferalEarnings />
        <div className="mt-6 bg-[#9173FF]/20 h-[119px] px-6 rounded-2xl flex items-center justify-evenly w-full ">
          <h2 className="font-semibold text-xl text-white">
            Your Referral Code:
          </h2>
          <div className="border-b border-[#9173FF] flex items-center justify-center px-4 ">
            <p className="text-xl text-white">
              https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io/ref?ref=1071106227200868393
            </p>
          </div>
          <div className="flex gap-4">
            <button className="rounded-lg text-white bg-[#9173FF]/50 px-4 py-1.5">
              Copy
            </button>
            <button className="rounded-lg border-[#9173FF] text-white bg-[#1E0F33] px-4 py-1.5">
              Share
            </button>
          </div>
        </div>
        <div className="mt-6 justify-between flex gap-6">
          <div className="p-4 rounded-2xl bg-[#D9D9D9]/10 w-[404px] h-[306px] flex flex-col justify-end items-center ">
            <h2 className="text-4xl text-white font-semibold mb-4 ">
              Your Referrals
            </h2>
          </div>
          <div className="flex flex-col w-full rounded-xl pb-8 bg-gradient-to-b from-[#D9D9D9]/5 to-[#9173FF]/3">
            <ReferralBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferalPage;
