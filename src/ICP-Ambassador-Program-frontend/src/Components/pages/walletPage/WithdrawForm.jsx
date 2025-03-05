import React from "react";

export const WithdrawForm = ({ balance, setAmount, setReceiver, withdraw }) => {
  return (
    <section className="flex flex-col items-center mt-6">
      <h2 className="text-4xl font-medium text-white max-md:text-3xl">
        Withdraw
      </h2>

      <form className="flex flex-col items-center w-full max-w-[433px]">
        <input
          type="text"
          value="ckUSDC"
          readOnly
          className="px-6 py-3 mt-6 w-full text-xl font-medium text-white whitespace-nowrap rounded-xl bg-[#D9D9D9] bg-opacity-30 max-md:px-5"
        />
        <input
          type="text"
          placeholder="Enter the account ID or principal ID"
          onChange={(e) => setReceiver(e.target.value)}
          className="px-6 py-3 mt-5 w-full text-xl font-medium text-white rounded-xl bg-[#D9D9D9] bg-opacity-30 max-md:px-5"
        />
        <div className="flex justify-between px-6 py-3 mt-5 w-full text-xl font-medium rounded-xl bg-[#D9D9D9] bg-opacity-30 max-md:px-5">
          <input
            id="amount"
            type="text"
            placeholder="Enter the amount"
            className="text-white bg-transparent border-none outline-none"
            // value={balance}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only valid floating-point or integer numbers
              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(Number(value));
              }
            }}
            onWheel={(e) => e.target.blur()}
          />

          <button
            type="button"
            className="text-right text-[#9173FF]"
            onClick={() => {
              setAmount(Number(balance - 0.01));
              document.getElementById("amount").value = Number(balance - 0.01);
            }}
          >
            max
          </button>
        </div>
        <p className="px-5 py-1.5 mt-6 text-sm text-center text-white font-normal rounded-3xl bg-[#9173FF]/40  w-[165px]">
          Fee: 0.01 USD
        </p>
        <button
          className="px-14 py-2 mt-6 text-xl font-medium text-white whitespace-nowrap rounded-xl border-2 border-white border-solid w-[187px] max-md:px-5"
          onClick={(e) => withdraw(e)}
        >
          Confirm
        </button>
      </form>
    </section>
  );
};
