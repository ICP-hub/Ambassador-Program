import React, { useEffect, useState } from "react";
import atlaslogo from "../../../../public/atlaslogo.png";
import backgrounBanner from "../../../../public/backgroundA.png";
import HubCard from "./HubCard";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import ReferalCard from "./ReferalCard";
import bgimg from "../../../../public/rewardBgImg.png";
import downArrow from "../../../../public/icons/downarrowIcon.png";
import A_icon from "../..//../../public/icons/A_icon.png";
import Footer from "../../footer/Footer";
import LoginModel from "../../modules/Navbar/LoginModel";
import { BsFillArrowDownCircleFill } from "react-icons/bs";

const LandingPage = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const data = [
    {
      heading: "Quest",
      text: "Complete quests by doing something for ICP growth.",
    },
    {
      heading: "Leaderboard",
      text: "Climb the leaderboard and grow your level.",
    },
    {
      heading: "Referrals",
      text: "Bring your friends to grow ICP together.",
    },
  ];

  return (
    <>
      <div className="flex flex-col pb-10 bg-gradient-to-b from-[#1E0F33]/60 to-[#9173FF]/10">
        <div
          className={`py-2 sticky top-0 z-50 h-[7rem] px-10 rounded-b-xl flex justify-between items-center mx-3  backdrop-blur-lg shadow-lg bg-[#1E0F33]/60 `}
        >
          <div className="flex items-center gap-5 ml-6 ">
            <img src={atlaslogo} alt="atlas" className="h-[2.6rem] " />
          </div>
          <div
            onClick={() => setOpenLoginModal(true)}
            className="w-[8rem] h-[2.3rem] rounded-lg cursor-pointer flex items-center justify-center bg-[#9173FF]"
          >
            <button className="text-white font-semibold">Join</button>
          </div>
        </div>
        {openLoginModal && (
          <LoginModel
            isOpen={openLoginModal}
            onClose={() => setOpenLoginModal(false)}
          />
        )}
        <div className="w-full  ">
          <div
            style={{
              backgroundImage: `url(${backgrounBanner})`,
              height: "580px",
              backgroundPosition: "right center",
              backgroundSize: "contain",
            }}
            className="flex bg-no-repeat w-full"
          >
            <div className="z-10 flex items-end pb-10 pl-20">
              <div className="text-white">
                <h2 className="font-bold text-5xl">Join</h2>
                <h2 className="font-bold text-5xl">Ambassador</h2>
                <h2 className="font-bold text-5xl">Program</h2>
                <p className="font-[380] text-2xl mt-6">
                  Atlas is a community of ambassadors promoting
                </p>
                <h3 className="font-medium mt-2 text-3xl">ICP HUBS NETWORK</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-3 ">
          <div className=" mb-6  pb-10  w-full rounded-xl bg-gradient-to-b from-[#1E0F33]/60 to-[#9173FF]/40  ">
            <div className="font-medium text-5xl flex justify-center items-center mt-10">
              <h2 className="text-white mt-10">
                ICP HUB IS{" "}
                <span className="text-[#9173FF]">Everywhere for Everyone</span>
              </h2>
            </div>
            <div className="w-full pb-8 px-10">
              <HubCard />
            </div>
            <div className="flex justify-center items-center">
              <div
                onClick={() => setOpenLoginModal(true)}
                className="mt-8 cursor-pointer flex justify-center items-center font-medium  bg-[#9173FF]/50 px-7 py-2 rounded-3xl "
              >
                <span className="text-white text-3xl mr-2">
                  <IoArrowForwardCircleOutline />
                </span>
                <button className="text-white  text-2xl">
                  Join your local hub
                </button>
              </div>
            </div>
            <div className="mt-10 flex justify-center items-center ">
              <h2 className=" flex flex-col items-center mt-6 mb-3 text-white text-4xl font-semibold text-center px-16">
                <p className="">Atlas offers you to participate in the ICP</p>
                <p className="">activities, bring over your friends and </p>
                <p className="">climb up the ladder.</p>
              </h2>
            </div>
            <div className="flex justify-center gap-6 px-16 w-full  mt-10">
              {data.map((item, i) => {
                return (
                  <ReferalCard
                    key={i}
                    heading={item.heading}
                    text={item.text}
                  />
                );
              })}
            </div>
            <div className="mt-24 w-full px-16 flex justify-center items-center mb-12">
              <div
                style={{
                  height: "600px",
                  backgroundImage: `url(${bgimg})`,
                  backgroundSize: "cover",
                  // backgroundImage: `url(https://s3-alpha-sig.figma.com/img/1e1d/8ca7/3c08c53bbaf67f97adfcb10cb09224dd?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ciMQhulpI48WicNp8T4DELH22HbAy3UIiPeBwDMnyhOaFa2vowA7cV3vxhB3ovvqwbytDjfH5QoFVhMgX0eu8r5NI4PlUcEF77sZcKTiFrkstkEW7VZ38z6T1CXh6V28UiSKdghaeiNOCCo-jzwlXc21bQdtNp1Ma9V~vmTVSblQoEkub3kAE2bvG0ABpCdoI9u8yyug8FKyiq7U2RXBu-v-dZdqSt0yU2egP2slYyODg-lXVfF9EBzgcKtY8COGWInLElmOfBA-QUhX4ZUf6ANJNr821einoqmshiMD7JWTVbAsbTbnZqCq-ZsTAkWj2BHtXqan2rTZYgbqbD3ZHg__)`,
                }}
                className="rounded-2xl w-full flex justify-between"
              >
                <div className="w-[35%] flex flex-col justify-end px-5 mb-4 py-6">
                  <h2 className="font-medium  text-4xl text-white ">
                    Earn rewards by being ICP Ambassador
                  </h2>
                </div>
                <div className="flex w-[70%] justify-end items-center">
                  <div className="flex flex-col justify-center items-center  py-6 px-8">
                    <div className="flex  items-start justify-center lg:ml-[35%] lg:mr-[5%] gap-6">
                      <img
                        src={A_icon}
                        alt="atals icon"
                        className="w-[18px] h-[10px] mt-2.5"
                      />

                      <h3 className="text-white text-2xl font-normal">
                        Signup for Atlas with your Discord and join Atlas Server
                      </h3>
                    </div>
                    <div className="flex w-full items-center my-4 pl-[20%] justify-center">
                      <img
                        src={downArrow}
                        alt="arrow icon"
                        className="w-[34px] h-[34px] "
                      />
                      {/* <div className="flex justify-center items-center">
                        <BsFillArrowDownCircleFill
                          style={{
                            fontSize: "40px",
                            color: "#9173FF",
                          }}
                        />
                      </div> */}
                    </div>
                    <div className="flex items-start ml-[35%]  gap-6">
                      <img
                        src={A_icon}
                        alt="atals icon"
                        className="w-[18px] h-[10px] mt-2.5"
                      />

                      <h3
                        className="text-white text-2xl font-normal
                  "
                      >
                        Complete Quests and earn points
                      </h3>
                    </div>
                    <div className="flex items-center my-4 pl-[20%] justify-center">
                      <img
                        src={downArrow}
                        alt="arrow icon"
                        className="w-[34px] h-[34px] "
                      />
                    </div>
                    <div className="flex items-start ml-[35%] mr-[5%] gap-6">
                      <img
                        src={A_icon}
                        alt="atals icon"
                        className="w-[18px] h-[10px] mt-2.5"
                      />

                      <h3
                        className="text-white text-2xl font-normal
                  "
                      >
                        Invite friends and earn points{" "}
                      </h3>
                    </div>
                    <div className="flex items-center my-4 pl-[20%] justify-center">
                      <img
                        src={downArrow}
                        alt="arrow icon"
                        className="w-[34px] h-[34px] "
                      />
                    </div>
                    <div className="flex items-start ml-[35%] mr-[5%] gap-6">
                      <img
                        src={A_icon}
                        alt="atals icon"
                        className="w-[18px] h-[10px] mt-2.5"
                      />

                      <h3
                        className="text-white text-2xl font-normal
                  "
                      >
                        Get new levels, complete in leaderboard and earn points{" "}
                      </h3>
                    </div>
                    <div className="flex items-center my-4 pl-[20%] justify-center">
                      <img
                        src={downArrow}
                        alt="arrow icon"
                        className="w-[34px] h-[34px] "
                      />
                    </div>
                    <div className="flex items-start ml-[35%] mr-[5%] gap-6">
                      <img
                        src={A_icon}
                        alt="atals icon"
                        className="w-[18px] h-[10px] mt-2.5"
                      />

                      <h3
                        className="text-white text-2xl font-normal
                  "
                      >
                        Redeem your rewards as you progress further{" "}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="font-semibold text-5xl flex justify-center items-center mb my-14">
          <h2 className="text-white">
            We are <span className="text-[#9173FF]">big and growing</span>
          </h2>
        </div>{" "}
        <div className="flex w-full items-center justify-center gap-6 px-20 ">
          <div className="w-full h-[500px]  rounded-3xl bg-gradient-to-t from-[#574599]/5 to-[#9173FF]">
            <div className="mt-20">
              <h2 className="text-white text-[100px] font-medium text-center  ">
                20+{" "}
              </h2>
            </div>
            <div className="mt-20">
              <h2 className="text-white text-2xl font-semibold text-center">
                Around the globe and <br /> growing
              </h2>
            </div>
          </div>
          <div className="w-full h-[500px]  rounded-3xl bg-gradient-to-t from-[#574599]/5 to-[#9173FF]">
            <div className="mt-20">
              <h2 className="text-white text-[100px] font-medium text-center  ">
                1000+{" "}
              </h2>
            </div>
            <div className="mt-20">
              <h2 className="text-white text-2xl font-semibold text-center">
                Ambassadors supporting <br /> ICP worldwide
              </h2>
            </div>
          </div>
          <div className="w-full h-[500px]  rounded-3xl bg-gradient-to-t from-[#574599]/5  to-[#9173FF]">
            <div className="mt-20">
              <h2 className="text-white text-[100px] font-medium text-center  ">
                10+<span className="mt-3 text-[50px]">million</span>
              </h2>
            </div>
            <div className="mt-20">
              <h2 className="text-white text-2xl font-semibold text-center">
                Reach of ambassador <br /> program
              </h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full px-20 mb-6 max-md:max-w-full">
          <div className="font-semibold text-5xl flex justify-center items-center mb-2 mt-10">
            <h2 className="text-white">
              Find <span className="text-[#9173FF]">your HUB</span>
            </h2>
          </div>{" "}
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d822c282bdb0106f39f8d23a651f82d23a69b62c0ccf1110934061680d5be6f1?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain mt-14  w-full "
            alt="Hub location map 1"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7fb229ecdabead638c07ed9b60e64aeb42920f8f6141d018d545a2fc845f86cd?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain mt-16 w-full rounded-none "
            alt="Hub location map 2"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3e72522816c1826b2ecd8f30bebcaf5ec88e1da9acffd77458f5c818e2b9742?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain mt-16 w-full "
            alt="Hub location map 3"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/5c512ebcc342e9fe0121093437a3f2d2e93359e741217f83513d82eee21c7e6f?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain mt-16 w-full rounded-none "
            alt="Hub location map 4"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/522b233489e174aef2abba7e96ecdf2956511e7d692c8900437a1023bfaff7f9?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain mt-16 w-full rounded-none "
            alt="Hub location map 5"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ed6c5251c948b0dfbdbf2fcf65beb7a0c27375c1df301d676b6d2011e3fd20a2?placeholderIfAbsent=true&apiKey=91e67b5675284a9cb9ba95a2fcd0d114"
            className="object-contain mt-16 w-full rounded-none "
            alt="Hub location map 6"
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
