import React from "react";

export const TransactionTableBody = () => {
  const transactions = Array(24).fill({
    hash: "8a076523a8493fcdjdkshdcf3...0c40",
    amount: { value: "0.0001", currency: "ICP" },
    type: "Transfer",
    timestamp: "2025/01/05, 15:44:37 PM UTC",
    timeAgo: "5 days ago",
    from: "bca87516...c1e0",
    to: "xpf85738...dfr3",
  });

  return (
    <div className="flex justify-evenly mt-10 gap-4 w-full ">
      <div className="flex flex-col">
        <div className="flex justify-center gap-2 text-xl font-medium text-white">
          <span>Transaction Hash</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/fdcddd3bca23dbc36c780657c88270eb67b554705616742e0218155d29235c48?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain shrink-0 my-auto w-5 aspect-square"
            alt="Sort icon"
          />
        </div>
        <div className="flex flex-col opacity-50 bg-[#9173FF]/20 py-4 ">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="px-6  py-1 rounded text-base text-center text-white whitespace-nowrap "
            >
              {transaction.hash}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center gap-2 text-xl font-medium text-white whitespace-nowrap">
          <span>Amount</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/63f40b8873ae3b416bccc5b0afc348a5c118baec2e23a701b13f6fdf16f9217e?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain shrink-0 my-auto w-5 aspect-square"
            alt="Sort icon"
          />
        </div>
        <div className="flex flex-col w-[120px] bg-[#9173FF]/20 py-4 ">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="px-6  py-1 rounded text-base text-center text-white whitespace-nowrap "
            >
              <span className="text-right  text-gray-200">
                {transaction.amount.value}
              </span>
              <span className="text-[#9173FF] ml-1">
                {transaction.amount.currency}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center gap-2">
          <span className="text-xl font-medium text-white">Type</span>
          <div className="flex">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a32ec8687e8104cab1c369b79113da571b58c17049b08f09c3cbfb9164aeb707?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
              className="object-contain shrink-0 my-auto w-5 aspect-square"
              alt="Sort icon"
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f29bfb98e9b659710588f68ee67475de97e5f7b37606587d561047df662bf6e?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
              className="object-contain shrink-0 w-6 aspect-square"
              alt="Filter icon"
            />
          </div>
        </div>
        <div className="flex flex-col w-[132px] bg-[#9173FF]/20 py-4 ">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="px-4   py-1 rounded text-base text-center text-white whitespace-nowrap "
            >
              <div className="flex gap-2 px-4 justify-center bg-gray-400 rounded-full  ">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f93182d305530321f5c3b84ed9eb92887fd44027c267251135910bd584b98c59?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
                  className="object-contain shrink-0 my-auto w-3 aspect-square"
                  alt="Transaction type icon"
                />
                <span>{transaction.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center gap-2 text-xl font-medium text-white whitespace-nowrap">
          <span>Timestamp</span>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b9438fbbbd67bf6dd8ce4ca18eaa43119fb22e29849cc9be9299575cc9841f25?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain shrink-0 my-auto w-5 aspect-square"
            alt="Sort icon"
          />
        </div>
        <div className="flex flex-col  bg-[#9173FF]/20 py-4 ">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="px-6  py-1 text-center rounded text-base  text-white whitespace-nowrap "
            >
              <div className="flex gap-2.5">
                <span className="grow text-base text-white">
                  {transaction.timestamp}
                </span>
                <span className="my-auto text-xs text-white text-opacity-50">
                  {transaction.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center gap-2">
          <span className="text-xl font-medium text-white">From</span>
          <div className="flex">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e8c9f3d865d91315edec418c42a06a6257410185a8b5f2a61b29017ccdb7722a?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
              className="object-contain shrink-0 my-auto w-5 aspect-square"
              alt="Sort icon"
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f29bfb98e9b659710588f68ee67475de97e5f7b37606587d561047df662bf6e?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
              className="object-contain shrink-0 w-6 aspect-square"
              alt="Filter icon"
            />
          </div>
        </div>
        <div className="flex flex-col w-[180px] bg-[#9173FF]/20 py-4 ">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="px-6 text-center opacity-50 py-1 rounded text-base  text-white whitespace-nowrap "
            >
              {transaction.from}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center gap-2">
          <span className="text-xl font-medium text-white">To</span>
          <div className="flex">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/728830398530b17d09273edb892c2b195def0d4f51cbfd9cf2022e9db9065e07?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
              className="object-contain shrink-0 my-auto w-5 aspect-square"
              alt="Sort icon"
            />
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f29bfb98e9b659710588f68ee67475de97e5f7b37606587d561047df662bf6e?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
              className="object-contain shrink-0 w-6 aspect-square"
              alt="Filter icon"
            />
          </div>
        </div>
        <div className="flex flex-col w-[180px] bg-[#9173FF]/20 py-4 ">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="px-6 text-center opacity-50 py-1 rounded text-base  text-white whitespace-nowrap "
            >
              {transaction.to}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
