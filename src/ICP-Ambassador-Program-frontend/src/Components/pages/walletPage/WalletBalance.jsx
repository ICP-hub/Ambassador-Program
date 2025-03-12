import React, { useState, useEffect } from "react";
import walletIcon from "../../../../public/icons/smartwallet.png";
import { ICP_Ambassador_Program_backend } from "../../../../../declarations/ICP_Ambassador_Program_backend/index";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";
export const WalletBalance = ({ setBalance, user }) => {
  const [conversionRate, setConversionRate] = useState();

  const getSpaceConversion = async () => {
    try {
      console.log("HUB : ", user?.hub);
      const space = await ICP_Ambassador_Program_backend.get_space(user?.hub);
      console.log("Conversion Rate : ", space.Ok.conversion / 10);
      if (space?.Ok) {
        setConversionRate(parseInt(space?.Ok?.conversion) / 10);
      }
    } catch (error) {
      console.log("err fetching hub details : ", error);
    }
  };

  useEffect(() => {
    setBalance((parseInt(user.redeem_points) * conversionRate) / 100);
  }, [conversionRate]);

  useEffect(() => {
    if (user) {
      getSpaceConversion();
    }
  }, [user]);

  return (
    <section className="flex relative flex-col items-center max-w-full w-[55%]">
      <div className="self-stretch md:px-4 dlg:px-9 py-6 rounded-3xl border-[#9173FF] border-solid border-[3px] max-md:px-5 max-md:max-w-full">
        <div className="flex items-center md:gap-3 dlg:gap-5 ">
          <div className="w-[22%] ">
            <h2 className="dlg:text-4xl md:text-xl md3:text-2xl font-semibold  text-white   ">
              Smart <br />
              Wallet
            </h2>
          </div>
          <div className="flex items-center gap-5 ml-4 w-[78%] max-md:ml-0 max-md:w-full">
            <img
              src={walletIcon}
              alt="wallet"
              className="w-[58px] h-[50px] dlg:w-[98px] dlg:h-[80px]"
            />
            <div className=" cursor-pointer transition-all  bg-[#9173ff6d] duration-500 text-white md:font-medium dlg:font-semibold md:text-base dlg:text-2xl py-4 dlg:py-5 w-full rounded-2xl flex justify-center items-center">
              {user ? (parseInt(user.redeem_points) * conversionRate) / 100 : 0}{" "}
              {DEFAULT_CURRENCY}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
