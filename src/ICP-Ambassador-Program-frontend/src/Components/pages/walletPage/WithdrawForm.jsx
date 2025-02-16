import React from "react";

export const WithdrawForm = ({ setAmount, setReceiver, withdraw }) => {
  return (
    <section className="flex flex-col items-center mt-6">
      <h2 className="text-5xl font-medium text-white max-md:text-4xl">
        Withdraw
      </h2>
      <div className="flex flex-col items-center w-full max-w-[433px]">
        <input
          type="text"
          value="ckUSDC"
          readOnly
          className="px-6 py-4 mt-6 w-full text-xl font-medium text-white whitespace-nowrap rounded-xl bg-[#D9D9D9] bg-opacity-30 max-md:px-5"
        />
        <input
          type="text"
          placeholder="Enter the account ID or principal ID"
          onChange={(e) => setReceiver(e.target.value)}
          className="px-6 py-4 mt-5 w-full text-xl font-medium text-white rounded-xl bg-[#D9D9D9] bg-opacity-30 max-md:px-5"
        />
        <div className="flex justify-between px-6 py-4 mt-5 w-full text-xl font-medium rounded-xl bg-[#D9D9D9] bg-opacity-30 max-md:px-5">
          <input
            type="number"
            placeholder="Enter the amount"
            className="text-white bg-transparent border-none outline-none"
            onChange={(e) => setAmount(e.target.value)}
            onWheel={(e) => e.target.blur()}
          />
          <button type="button" className="text-right text-[#9173FF]">
            max
          </button>
        </div>
        <p className="px-5 py-2 mt-7 text-sm text-center text-white font-normal rounded-3xl bg-[#9173FF]/40  w-[165px]">
          Fee: 3.41 ckUSDC
        </p>
        <button
          className="px-14 py-3 mt-7 text-xl font-medium text-white whitespace-nowrap rounded-xl border-2 border-white border-solid w-[187px] max-md:px-5"
          onClick={withdraw}
        >
          Confirm
        </button>
      </div>
    </section>
  );
};
