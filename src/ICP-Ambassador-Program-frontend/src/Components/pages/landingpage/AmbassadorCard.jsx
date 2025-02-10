import * as React from "react";
import icpindia from "../../../../public/icons/icpIndiaImage.png";

function AmbassadorCard({ number, country }) {
  return (
    <div className="flex flex-col items-center  border border-white border-solid  rounded-t-full ">
      <div className="w-[90px] h-[90px] mb-3 rounded-full  flex items-center justify-center">
        <img src={icpindia} alt="icpIndonesia" />
      </div>
      <div className="text-3xl font-bold">{number}</div>
      <div className="mt-2 font-medium">Ambassador</div>
      <div className="self-stretch px-4 py-3 mt-4 font-semibold leading-3 rounded-xl border-t border-white border-solid">
        Join
        <br />
        ICP HUB <br />
        {country}
      </div>
    </div>
  );
}

export default AmbassadorCard;
