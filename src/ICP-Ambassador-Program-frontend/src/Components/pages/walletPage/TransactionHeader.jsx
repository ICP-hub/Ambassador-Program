import React from "react";

export const TransactionHeader = () => {
  return (
    <div className="flex flex-wrap gap-5 justify-between w-full font-medium text-white ">
      <h2 className="my-auto text-3xl">ICP Transaction</h2>
      <div className="flex gap-3.5 text-xl">
        <button className="px-5 py-3 rounded-xl bg-[#1E0F33] max-md:px-5">
          Transaction Flow
        </button>
        <button className="flex gap-2.5 px-6 py-3 rounded-xl bg-[#9173FF]/50 bg-opacity-50 max-md:px-5">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6bff47c732c3b7e1c210c1814397b51423f2b2c9c0d73f23a1e625c274ff8621?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain shrink-0 aspect-[1.12] w-[27px]"
            alt="Export icon"
          />
          <span className="grow shrink w-[124px]">Export CSV</span>
        </button>
      </div>
    </div>
  );
};
