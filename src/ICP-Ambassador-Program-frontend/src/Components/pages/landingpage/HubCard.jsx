import * as React from "react";
import AmbassadorCard from "./AmbassadorCard.jsx";
import AmbassadorCardReversed from "./AmbassadorCardReversed.jsx";

function HubCard() {
  const data = [
    { number: 74, country: "India" },
    { number: 34, country: "Indonesia" },
  ];

  return (
    <div className="flex flex-wrap w-full mt-12 items-center justify-center text-xs leading-none text-center text-white">
      <div className="flex justify-center flex-wrap gap-5">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="flex gap-3">
            <div>
              <AmbassadorCard {...data[0]} />
            </div>
            <div className="mt-14 ">
              <AmbassadorCardReversed {...data[1]} />
            </div>
          </div>
        ))}
      </div>
      {/* <div className="flex gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex gap-3">
            <div>
              <AmbassadorCard {...data[0]} />
            </div>
            <div className="mt-14 ">
              <AmbassadorCardReversed {...data[1]} />
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default HubCard;
