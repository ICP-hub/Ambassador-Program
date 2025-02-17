import React, {useState, useEffect } from "react";
import walletIcon from "../../../../public/icons/smartwallet.png";
import { RiWallet3Fill } from "react-icons/ri";
import {ICP_Ambassador_Program_backend} from "../../../../../declarations/ICP_Ambassador_Program_backend/index";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";
export const WalletBalance = ({ user,login, ledger, logout }) => {
  
  // console.log("User in wallet modal : ", user);
  const [conversionRate, setConversionRate] = useState();

  const getSpaceConversion = async () => {
    try {
      console.log("HUB : ", user?.hub);
      const space = await ICP_Ambassador_Program_backend.get_space(user?.hub);
      console.log("Conversion : ", space.Ok.conversion/10);
      if (space?.Ok) {
        setConversionRate(parseInt(space?.Ok?.conversion)/10);
      }
    } catch (error) {
      console.log("err fetching hub details : ", error);
    }
  };

  useEffect(() => {
    if(user){
      getSpaceConversion();
      console.log("UU : ", user);
    }
  }, [user]);

  return (
    <section className="flex relative flex-col items-center max-w-full w-[711px]">
      <div className="self-stretch px-9 py-7 rounded-3xl border-[#9173FF] border-solid border-[3px] max-md:px-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[22%] max-md:ml-0 max-md:w-full">
            <h2 className="text-5xl font-semibold tracking-tighter text-white leading-[54px] max-md:mt-10 max-md:text-4xl max-md:leading-[53px]">
              Smart <br />
              Wallet
            </h2>
          </div>
          <div className="flex items-center gap-5 ml-4 w-[78%] max-md:ml-0 max-md:w-full">
            <img
              src={walletIcon}
              alt="wallet"
              className="w-[108px] h-[90px] "
            />
            {/* {ledger ? (
              <button
                className="  cursor-pointer   bg-[#9173ff6d] py-7 text-white font-semibold w-full text-2xl rounded-2xl flex justify-center items-center"
                onClick={logout}
              >
                Disconnect wallet
              </button>
            ) : (
              <button
                className=" cursor-pointer transition-all  bg-[#9173ff6d] duration-500 text-white font-semibold text-2xl py-7 w-full rounded-2xl flex justify-center items-center"
                onClick={login}
              >
                Connect wallet
              </button>
            )} */}
            <div className=" cursor-pointer transition-all  bg-[#9173ff6d] duration-500 text-white font-semibold text-2xl py-7 w-full rounded-2xl flex justify-center items-center">
              {user ? (parseInt(user.redeem_points) * conversionRate)/100 : 0} {DEFAULT_CURRENCY}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
