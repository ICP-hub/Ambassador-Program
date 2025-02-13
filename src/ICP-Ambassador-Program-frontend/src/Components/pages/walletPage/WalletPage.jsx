import React from "react";
import { WalletBalance } from "./WalletBalance";
import { WithdrawForm } from "./WithdrawForm";
import { TransactionHeader } from "./TransactionHeader";
import { TransactionPagination } from "./TransactionPagination";
import { TransactionTableBody } from "./TransactionTableBody";

export const WalletPage = () => {
  return (
    <div className=" mx-12  ">
      <div className="flex overflow-hidden w-full flex-col items-center">
        <div
          style={{
            backgroundImage: `url(https://cdn.builder.io/api/v1/image/assets/TEMP/6d49702b2ce6c35ecb5b45303490eb65fa79cd0b7030bbe3192750c86bcf43c6?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114)`,
          }}
          className="flex  flex-col justify-center items-center px-20 py-12 mt-2 w-full rounded-3xl bg-blend-luminosity  lg:min-h-[701px] max-md:px-5 max-md:max-w-full"
        >
          <WalletBalance />
          <WithdrawForm />
        </div>
        <div className="bg-gradient-to-b from-[#13091F]/20 to-[#522785]/10 rounded-xl my-6 w-full">
          <section className="flex flex-col items-center justify-between  px-16 pt-9 pb-5 mt-5 w-full rounded-3xl   ">
            <TransactionHeader />
            <div className="w-full ">
              <TransactionTableBody />
            </div>
            {/* <TransactionPagination /> */}
          </section>
        </div>
      </div>
    </div>
  );
};
