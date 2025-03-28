import React, { useEffect, useState } from "react";
import ReferralBoard from "./ReferralBoard";
import ReferalEarnings from "./ReferalEarnings";
import ParentComponent from "../ParentComponent";
import { useSelector } from "react-redux";
import { ICP_Ambassador_Program_backend } from "../../../../../declarations/ICP_Ambassador_Program_backend";
import { BASE_URL } from "../../../../../../DevelopmentConfig";
import toast, { Toaster } from "react-hot-toast";

const ReferalPage = () => {
  const user = useSelector((state) => state.user.value);
  const [userRefered, setUserRefered] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const baseReferral = `${BASE_URL}/ref?ref=`;

  async function getRefers() {
    try {
      // setLoading(true)
      let arr = [];
      console.log(user?.direct_refers);
      for (let i = 0; i < user?.direct_refers?.length; i++) {
        console.log("inside loop");
        let res = await ICP_Ambassador_Program_backend.get_user_data(
          user?.direct_refers[i]
        );
        console.log(`${i} refer user : `, res);
        if (res && res != []) {
          arr.push({ name: res[0]?.username, id: user?.direct_refers[i] });
        }
      }
      setUsers(arr);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log("Error while fetching refers : ", error);
    }
  }
  const getUserRefered = async () => {
    try {
      let res = await ICP_Ambassador_Program_backend.get_user_refers(
        user?.discord_id
      );
      console.log("user refered : ", res?.Ok);
      if (res?.Ok) {
        setUserRefered(res?.Ok);
      }
    } catch (error) {
      console.log("Error while fetching user refered : ", error);
    }
  };
  console.log("user refered is : ", userRefered);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(baseReferral + user.discord_id)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard", {
          icon: "📋",
        });
        setTimeout(() => setCopied(false), 5000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  useEffect(() => {
    if (user) {
      getUserRefered();
      getRefers();
    }
  }, []);
  return (
    <ParentComponent>
      <div className="w-[93%] flex flex-col items-center ">
        <div className="bg-[#1E0F33] w-full mt-1  rounded-xl p-6 ">
          <ReferalEarnings user={user} />
          <div className="mt-6 bg-[#9173FF]/20 h-[119px] px-6 rounded-2xl flex items-center  w-full ">
            <h2 className="font-semibold w-[16%] text-lg text-white">
              Your Referral Code:
            </h2>
            <div className="border-b border-[#9173FF] w-[70%] flex items-center justify-center px-4 ">
              <a
                href={baseReferral + user.discord_id}
                target="_blank"
                className="text-white text-lg line-clamp-1 break-all cursor-pointer"
              >
                {baseReferral + user.discord_id}
              </a>
            </div>
            <div className="flex justify-end w-[15%] flex-wrap gap-4">
              <button
                onClick={copyToClipboard}
                className="rounded-lg text-white bg-[#9173FF]/50 px-4 py-1.5"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={copyToClipboard}
                className="rounded-lg border-[#9173FF] font-medium text-white bg-[#1E0F33] px-4 py-1.5"
              >
                Share
              </button>
            </div>
          </div>
          <div className="mt-6 w-full justify-between flex gap-6">
            <div className="p-4 rounded-2xl bg-[#D9D9D9]/10 w-[25%] h-[306px] flex flex-col justify-end items-center ">
              <h1 className="text-5xl text-white font-semibold mb-16 ">
                {userRefered.length}
              </h1>
              <h2 className="text-3xl text-white font-semibold mb-4 ">
                Your Referrals
              </h2>
            </div>
            <div className="flex flex-col w-[75%] rounded-xl pb-8 bg-gradient-to-b from-[#D9D9D9]/5 to-[#9173FF]/3">
              <ReferralBoard userRefered={userRefered} />
            </div>
          </div>
        </div>
      </div>
    </ParentComponent>
  );
};

export default ReferalPage;
