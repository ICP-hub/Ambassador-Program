import React from "react";

export const TransactionPagination = () => {
  return (
    <div className="flex flex-col items-center mt-5">
      <div className="flex gap-5 text-xl text-right text-white whitespace-nowrap w-[257px]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9fa8d922630e5dd9ab21b2eb7a9961acd58f3bb46b72b2c3079f9f608ea4f671?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
          className="object-contain shrink-0 w-6 aspect-square"
          alt="Previous page"
        />
        <button className="font-bold">1</button>
        <button>2</button>
        <button>3</button>
        <button>5</button>
        <button>6</button>
        <button>7</button>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c40cb2cc49351d027319e07a26c4f4cdeed2d80086ea786735958dc7b1df78a8?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
          className="object-contain shrink-0 w-6 aspect-square"
          alt="Next page"
        />
      </div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/3e3875135ac361379ccf38c3e7cd142e80423124a70d558c49f64940a536251b?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
        className="object-contain mt-1 aspect-[9.52] w-[19px]"
        alt="Divider"
      />
      <p className="mt-2.5 text-base font-medium text-white">
        1 - 24 of 100 items
      </p>
    </div>
  );
};
