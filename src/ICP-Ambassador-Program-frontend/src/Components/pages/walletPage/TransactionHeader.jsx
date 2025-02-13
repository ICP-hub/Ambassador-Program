import React from "react";
import { FiUpload } from "react-icons/fi";

export const TransactionHeader = () => {
  return (
    <div className="flex flex-wrap gap-5 justify-between w-full font-medium text-white ">
      <h2 className="my-auto text-3xl">ICP Transaction</h2>
      <div className="flex gap-3.5 text-xl">
        <button className="px-5 py-3 rounded-xl bg-[#1E0F33] max-md:px-5">
          Transaction Flow
        </button>
        <button className="flex gap-2.5 px-6 py-3 rounded-xl bg-[#9173FF]/50 bg-opacity-50 max-md:px-5">
          <FiUpload style={{ fontSize: "25", color: "white" }} />
          <span className="grow shrink w-[124px]">Export CSV</span>
        </button>
      </div>
    </div>
  );
};
