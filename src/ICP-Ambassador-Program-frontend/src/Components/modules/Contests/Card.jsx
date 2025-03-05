import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { BiLogoTelegram } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FaTwitter, FaLink, FaTextHeight, FaImage } from "react-icons/fa";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";
import cardDefaultImg from "../../../../public/cardDefaultImg.jpg";

const Card = ({ contest, hub }) => {
  //console.log(hub)
  //console.log("contest ==>",contest)
  const { status, title, description, img, reward } = contest;

  console.log(contest, "contest");

  const [tasks, setTasks] = useState(contest.tasks);
  //console.log(tasks)

  const taskDetailsMap = {
    SendTwitterPost: {
      icon: FaXTwitter,
      color: "#1D9BF0",
    },
    SendText: {
      icon: FaFileUpload,
      color: "#FFD700",
    },
    SendUrl: {
      icon: FaLink,
      color: "#6d15de",
    },
    SendImage: {
      icon: FaFileUpload,
      color: "#de7515",
    },
    JoinTwitter: {
      icon: FaXTwitter,
      color: "#1D9BF0",
    },
  };

  useEffect(() => {
    if (contest?.tasks) {
      //console.log("contest tasks : ",contest)
      const formattedTasks = contest.tasks.map((task) => {
        const taskKey = Object.keys(task)[0];
        return {
          id: taskKey,
          title: task[taskKey]?.title || taskKey,
          description: task[taskKey]?.body || "",
          submitted: false,
          image: task[taskKey]?.img || null,
          sampleImg: task[taskKey]?.sampleImg || null,
          validation_rule: task[taskKey]?.validation_rule || "",
          task_id: task[taskKey]?.id,
          account: task[taskKey]?.account || "",
        };
      });
      //console.log("formatted :",formattedTasks)
      setTasks(formattedTasks);
    }
  }, [contest]);

  const HUB = Cookies.get("selectedHubName");
  const icons = {
    platform: hub,
    platform_logo:
      "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png",
  };

  const updatedContest = {
    ...contest,
    tasks,
    icons,
    HUB,
  };

  //console.log(updatedContest);

  const statusKey = Object.keys(status)[0];
  const statusValue = status[statusKey];

  const navigate = useNavigate();
  const iconMap = {
    Twitter: FaXTwitter,
    Discord: FaDiscord,
    Telegram: BiLogoTelegram,
    Api: GrTransaction,
    Transaction: GrTransaction,
    Upload: FaFileUpload,
  };

  const handleCard = (status, updatedContest) => {
    if (status === "Ongoing") {
      let user = Cookies.get("discord_user");
      if (user) {
        navigate("/contest_details", { state: { updatedContest } });
      } else {
        toast.error("Please login to view the details");
      }
    } else if (status === "Expired") {
      toast.error("Contest is expired");
    } else {
      toast.error("Contest is not active yet");
    }
  };

  function getStatus(startDate, endDate) {
    const currentTime = Date.now(); // Current time in milliseconds
    const timeRemaining = startDate - currentTime; // Time remaining in milliseconds
    // Check if the event is expired (endDate has passed)
    if (currentTime > endDate) {
      return "Expired"; // End date has passed, it's expired
    }

    if (timeRemaining < 0) {
      return "Ongoing"; // Start date has passed, it's ongoing
    }

    // If the remaining time is within 48 hours (48 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    if (timeRemaining <= 48 * 60 * 60 * 1000) {
      const remainingHours = Math.floor(timeRemaining / (60 * 60 * 1000));
      return `Start in ${remainingHours} hr${remainingHours > 1 ? "s" : ""}`;
    }

    // If the remaining time is within 3 days (3 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    if (timeRemaining <= 3 * 24 * 60 * 60 * 1000) {
      const remainingDays = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
      return `Start in ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
    }

    // If the remaining time is more than 3 days
    return "Start in more than 3 days";
  }

  return (
    <div
      className="text-white p-4 mb-2 font-poppins min-w-[350px] rounded-xl "
      onClick={() =>
        handleCard(
          getStatus(contest?.start_date, contest?.end_date),
          updatedContest
        )
      }
    >
      <div
        style={{
          backgroundImage: `url(${
            img?.length > 0
              ? img[0]
              : //  "https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg"
                cardDefaultImg
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" custom-gradient h-[400px] rounded-xl  relative"
      >
        <span className="absolute top-3 left-3  bg-[#4a0295]  text-white text-xs   px-2 py-1 rounded border border-white">
          {getStatus(contest?.start_date, contest?.end_date)}
        </span>

        {/* {img?.length > 0 ? (
          <img
            src={img[0]}
            alt={title}
            className="h-[272px] w-full file: rounded-t-xl "
          />
        ) : (
          <img
            src="https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg"
            alt={title}
            className="h-[272px] w-full rounded-t-xl "
          />
        )} */}
        <div className="rounded-b-xl absolute bottom-0 bg-gradient-to-b from-[#9173FF] to-[#574599] opacity-95 w-full h-[140px] left-0  px-4">
          <div className="mt-4 text-white text-xl font-medium line-clamp-2 break-all ">
            {title?.length > 50 ? `${title?.substring(0, 60)}...` : title}
          </div>
          <div className="mt-2 flex justify-end items-center space-x-2 bottom-4 absolute right-4">
            <span className="  border border-[#D9D9D9] text-white text-xs  px-3 py-1 rounded">
              {parseInt(contest?.reward) + " "}points{" "}
            </span>
            <span className="border border-[#FFFFFF] bg-[#FFFFFF]/20  text-white text-xs px-3 py-1 rounded">
              {parseInt(contest?.pool) /
                10 ** 6 /
                parseInt(contest.total_user_rewarded) +
                " " +
                DEFAULT_CURRENCY}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
