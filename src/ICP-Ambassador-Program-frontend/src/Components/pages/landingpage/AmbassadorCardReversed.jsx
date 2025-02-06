import * as React from "react";
import icpIndonesia from "../../../../public/icons/icpIndonesiaImage.png";

function AmbassadorCardReversed({ number, country }) {
  return (
    <div className="flex flex-col items-center  border rounded-t-xl rounded-b-full  border-white border-solid ">
      <div className="self-stretch px-4 py-2.5 font-semibold  rounded-b-md rounded-t-xl  border-b">
        Join
        <br />
        ICP HUB
        <br />
        {country}
      </div>
      <div className="mt-5 text-3xl font-bold">{number}</div>
      <div className="mt-2 mb-0 font-medium max-md:mb-2.5">Ambassador</div>
      <div className="w-[90px] h-[90px] mt-3 rounded-full  flex items-center justify-center">
        <img
          src={icpIndonesia}
          alt="icpIndonesia"
          //   className="h-[57px] w-[65px] "
        />
      </div>
    </div>
  );
}

export default AmbassadorCardReversed;
