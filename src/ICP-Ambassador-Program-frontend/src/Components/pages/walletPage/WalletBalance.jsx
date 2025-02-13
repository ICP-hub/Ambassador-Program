import React from "react";
import walletIcon from "../../../../public/icons/smartwallet.png";
import { RiWallet3Fill } from "react-icons/ri";

export const WalletBalance = () => {
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
            {/* <RiWallet3Fill
              style={{ width: "140px", height: "120px", color: "#9173FF" }}
            /> */}
            <p className="self-stretch px-16 py-7 my-auto w-full text-3xl font-medium text-center text-white bg-[#9173FF]/30  rounded-3xl max-md:px-5 max-md:mt-10">
              0.00 USD
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
