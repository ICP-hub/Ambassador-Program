import React from "react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

const ReferalPage = () => {
  return (
    <div className="flex flex-col pb-8 bg-gradient-to-b from-[#1E0F33] to-[#9173FF] ">
      <div className="bg-[#1E0F33] mx-10 rounded-xl p-6 ">
        <div className="flex items-center gap-6 justify-between">
          <div className="p-4 rounded-2xl bg-[#D9D9D9]/10 w-[404px] h-[341px] flex flex-col justify-between ">
            <h2 className="text-4xl text-white font-semibold mb-10 ">
              Your Referral Earnings
            </h2>
            <div className="">
              <h3 className="text-3xl mb-4 text-white font-semibold">
                0 points
              </h3>
              <div className="py-1 px-2 bg-[#1E0F33] w-[137px] h-[46px] flex items-center justify-center rounded-lg ">
                <h4 className="text-lg font-medium text-white">0.00 USD</h4>
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url(https://s3-alpha-sig.figma.com/img/1e1d/8ca7/3c08c53bbaf67f97adfcb10cb09224dd?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=eIfqinmWMzuJdTas6QVj241u1FCRUSUF-a9qPRhwWiD2r4rGaK~7GbfdhmSjuXIKQDSweWfInwNEfOi9zr4fzWTTfmxglY5qTgmnQXoRSAfWlADjtuFhYoLC6ZI7PKy~GMqlQ7a1dYuyhEnIP4Mlwpf5zlwvsVxKfXB5LwJEbJzOeK-WBwhsv5WutgwT079t5y2LPwYOR0EnWTNLsarhAl6CeiOJLYCkcoCRuSo6TX4h4czeItFA9pin-nfgpy2GKKjbSwiZy16QUGbq-kINguFVLWE5zWuUJcNrdHBpHrhGsBQ5wikb47ZI5efLTv9WwVDZxTsOOGDNbI3qgSJbqA__)`,
            }}
            className="w-full h-[341px] rounded-2xl flex items-end "
          >
            <div className="p-6 flex flex-col items-end w-full">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-[#9173FF] text-3xl font-medium ">
                  Current referral points rate
                </h2>
                <p className="text-[#9173FF] font-semibold text-4xl ">+5%</p>
              </div>
              <div className="flex items-center justify-end mt-4 border-4 rounded-lg border-[#9173FF] w-full">
                <p className="text-[#9173FF] font-medium pr-4 text-base">
                  {" "}
                  Advance to master to increase referral rate to 10%
                </p>
                <div className="text-end w-[20px] h-[26px]  bg-[#9173FF] "></div>
              </div>
              <div className="text-[#FFFFFF]/50 flex justify-end mt-4">
                <p className="font-semibold">How do referrals work</p>
                <span className="text-[#FFFFFF]/50 ml-4 ">
                  <IoArrowForwardCircleOutline style={{ fontSize: "30px" }} />
                </span>
              </div>
            </div>
          </div>
        </div>
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
        <div className="mt-6 flex gap-6">
          <div className="p-4 rounded-2xl bg-[#D9D9D9]/10 w-[404px] h-[306px] flex flex-col justify-end items-center ">
            <h2 className="text-4xl text-white font-semibold mb-4 ">
              Your Referrals
            </h2>
          </div>
          <div className="flex flex-col rounded-xl pb-8 bg-gradient-to-b from-[#D9D9D9]/20 to-[#9173FF]/20">
            <div className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferalPage;
