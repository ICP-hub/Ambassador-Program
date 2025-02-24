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

  const handleCard = (status) => {
    //console.log("Contest",contest)

    if (status === "Ongoing") {
      console.log("Clicked");
      let user = Cookies.get("discord_user");
      if (user) {
        navigate("/contest_details", { state: { updatedContest } });
      } else {
        toast.error("Please login to view the details");
      }
    } else {
      toast.error("Contest is not active yet");
    }
  };

  function getStatus(startDate) {
    const currentTime = Date.now(); // Current time in milliseconds
    const timeRemaining = startDate - currentTime; // Time remaining in milliseconds

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
      className=" text-white p-4    mb-2 font-poppins min-w-[350px]"
      onClick={() => handleCard(getStatus(contest?.start_date))}
    >
      <div className=" custom-gradient h-[427px] rounded-xl  relative">
        <span className="absolute top-3 left-3  bg-[#4a0295]  text-white text-xs   px-2 py-1 rounded border border-white">
          {getStatus(contest?.start_date)}
        </span>

        {img?.length > 0 ? (
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
        )}
        <div className="px-4">
          <div className="mt-4 text-white text-2xl  ">
            {title?.length > 50 ? `${title?.substring(0, 50)}...` : title}
          </div>
          <div className="mt-2 flex justify-end items-center space-x-2 bottom-4 absolute right-2">
            <span className="  border border-white text-white text-xs  px-3 py-1 rounded">
              {parseInt(contest?.reward) + " "}points{" "}
            </span>
            <span className="border border-white bg-[#FFFFFF33]  text-white text-xs px-3 py-1 rounded">
              {(parseInt(contest?.pool) / (10**6)) / parseInt(contest.total_user_rewarded) + " " + DEFAULT_CURRENCY}
            </span>
          </div>
        </div>
      </div>
      {/* <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <div>
            {img?.length > 0 ? (
              <img
                src={img[0]}
                alt={title}
                className="h-[272px] bg-[#9173ff] rounded-t-xl "
              />
            ) : (
              <img
                src="https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg"
                alt={title}
                className="h-[272px] bg-[#9173ff] rounded-t-xl "
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            {/* <span
              className={`text-sm py-1 px-2 rounded-md w-1/2 flex justify-center items-center `}
              style={{
                backgroundColor:
                  statusKey === 'Active'
                    ? '#1d2d27'
                    : statusKey === 'Draft'
                    ? '#29292c'
                    : statusValue === 'In Active' 
                    ? '#f0f0f0'
                    : '#331a1e',
                color:
                  statusKey === 'Active'
                    ? '#1db851'
                    : statusKey === 'Draft'
                    ? '#b8b8b8'
                    : statusValue === 'In Active' 
                    ? '#a0a0a0'
                    : '#e20203',
              }}
            >
              {statusValue === null || statusValue === undefined
                ? statusKey
                : statusValue}
                Once
            </span> */}
      {/* <span className="text-sm text-gray-500">Once</span>
            <h3 className="text-md  mb-2">{title}</h3>
            <div className="flex space-x-2">
              {tasks.map((task, index) => {
                const taskType = task.id; // Get task type from the id
                const { icon: IconComponent, color: bgColor } =
                  taskDetailsMap[taskType] || {}; // Match task type to map
                if (index > 2) return;

                return (
                  <div
                    key={index}
                    className="text-white w-6 h-6 rounded-full flex justify-center items-center"
                    style={{ backgroundColor: bgColor, fontSize: "16px" }}
                    title={task.title}
                  >
                    {IconComponent ? <IconComponent /> : null}
                  </div>
                );
              })}
            </div> */}
      {/* <div className="mt-4 flex items-center space-x-2">
              <img src={icons.platform_logo} alt={icons.platform} className="w-8 h-4 rounded-full" />
              <span className="text-sm ">{icons.platform}</span>
            </div> */}
      {/* </div>
        </div> */}
      {/* <div>
          <div className="flex flex-col gap-4 items-end mb-4 min-w-24">
            <div className="text-xs">Fixed rewards</div>
            <span className="text-sm font-semibold   rounded ">
              {parseInt(contest?.reward) + " "}points{" "}
            </span>
            <div className="text-sm text-gray-500 font-semibold">$3.00</div>
          </div>
        </div>
      </div> */}

      {/* <div className="flex justify-between items-center mb-4">
        <span className="text-sm  py-1 px-2 rounded" style={{backgroundColor:'#29292c'}}>{parseInt(contest?.reward)+" "}points </span>
        <span
          className={`text-sm py-1 px-2 rounded-md `}
          style={{
            backgroundColor:
              statusKey === 'Active'
                ? '#1d2d27'
                : statusKey === 'Draft'
                ? '#29292c'
                : statusValue === 'In Active' 
                ? '#f0f0f0'
                : '#331a1e',
            color:
              statusKey === 'Active'
                ? '#1db851'
                : statusKey === 'Draft'
                ? '#b8b8b8'
                : statusValue === 'In Active' 
                ? '#a0a0a0'
                : '#e20203',
          }}
        >
          {statusValue === null || statusValue === undefined
            ? statusKey
            : statusValue}
        </span>
      </div> */}
      {/* <div className='flex justify-between '>
        <div className='w-[70%] overflow-hidden'>
            <h3 className="text-md  mb-2">{title}</h3>
            <div className='mt-4 text-sm text-gray-600 w-full '>{description?.length>50?`${description?.substring(0,45)}...`:description}</div>
            {social_platforms(
                    <div className="flex space-x-2">
                {social_platforms.map((platform, index) => {
                  const IconComponent = iconMap[platform.name]; 
                  
                  return (
                    <div key={index} className={`text-white w-6 h-6 rounded-full flex justify-center items-center`} style={{ backgroundColor: platform.bgcolor,fontSize:'12px' }} >
                      {IconComponent ? <IconComponent /> : null} 
                    </div>
                  );
                })}
              </div>)}
        </div>
        
        <div className="mb-4">
        {img?.length>0 ? (
            <img
            src={img[0]}
              alt={title}
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            // <div className="w-24 h-24 bg-gray-700 text-white flex items-center justify-center rounded">
            //   <span>No Image</span>
            // </div>
            <img
            src='https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg'
              alt={title}
              className="w-24 h-24 object-cover rounded"
            />
          )}
        </div> 
      </div> */}

      {/* <div className="mt-4 flex items-center space-x-2">
        <img src={icons.platform_logo} alt={icons.platform} className="w-8 h-4 rounded-full" />
        <span className="text-sm ">{icons.platform}</span>
      </div> */}
    </div>
  );
};

export default Card;
