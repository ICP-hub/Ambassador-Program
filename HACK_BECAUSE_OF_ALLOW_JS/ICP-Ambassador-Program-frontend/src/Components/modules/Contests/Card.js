import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaXTwitter } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { BiLogoTelegram } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
const Card = ({ contest, hub }) => {
    //console.log(hub)
    //console.log("contest ==>",contest)
    const { status, title, description, img, reward } = contest;
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        if (contest?.tasks) {
            console.log("contest tasks : ", contest);
            const formattedTasks = contest.tasks.map((task) => {
                const taskKey = Object.keys(task)[0];
                return {
                    id: taskKey,
                    title: task[taskKey]?.title || taskKey,
                    description: task[taskKey]?.body || '',
                    submitted: false,
                    image: task[taskKey]?.img || null,
                    sampleImg: task[taskKey]?.img || null,
                    validation_rule: task[taskKey]?.validation_rule || '',
                    task_id: task[taskKey]?.id
                };
            });
            setTasks(formattedTasks);
        }
    }, [contest]);
    const HUB = Cookies.get('selectedHubName');
    const icons = {
        platform: hub,
        platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"
    };
    const updatedContest = {
        ...contest,
        tasks,
        icons,
        HUB
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
        Upload: FaFileUpload
    };
    const handleCard = () => {
        //console.log("Contest",contest)
        let user = Cookies.get('discord_user');
        if (user) {
            navigate('/contest_details', { state: { updatedContest } });
        }
        else {
            toast.error("Please login to view the details");
        }
    };
    return (<div className=" text-white p-4 rounded-lg shadow-lg font-poppins" style={{ backgroundColor: '#1d1d21' }}>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm  py-1 px-2 rounded" style={{ backgroundColor: '#29292c' }}>{parseInt(contest?.reward) + " "}points </span>
        <span className={`text-sm py-1 px-2 rounded-md `} style={{
            backgroundColor: statusKey === 'Active'
                ? '#1d2d27'
                : statusKey === 'Draft'
                    ? '#29292c'
                    : statusValue === 'In Active'
                        ? '#f0f0f0'
                        : '#331a1e',
            color: statusKey === 'Active'
                ? '#1db851'
                : statusKey === 'Draft'
                    ? '#b8b8b8'
                    : statusValue === 'In Active'
                        ? '#a0a0a0'
                        : '#e20203',
        }}>
          {statusValue === null || statusValue === undefined
            ? statusKey
            : statusValue}
        </span>


      </div>
      <div className='flex justify-between'>
        <div>
            <h3 className="text-md  mb-2">{title}</h3>
            {/* <div className='mt-4 text-sm text-gray-600'>{description}</div> */}
            {/* {social_platforms(
                <div className="flex space-x-2">
            {social_platforms.map((platform, index) => {
              const IconComponent = iconMap[platform.name];
              
              return (
                <div key={index} className={`text-white w-6 h-6 rounded-full flex justify-center items-center`} style={{ backgroundColor: platform.bgcolor,fontSize:'12px' }} >
                  {IconComponent ? <IconComponent /> : null}
                </div>
              );
            })}
          </div>)} */}
        </div>
        
        <div className="mb-4">
        {img?.length > 0 ? (<img src={img[0]} alt={title} className="w-24 h-24 object-cover rounded"/>) : (
        // <div className="w-24 h-24 bg-gray-700 text-white flex items-center justify-center rounded">
        //   <span>No Image</span>
        // </div>
        <img src='https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg' alt={title} className="w-24 h-24 object-cover rounded"/>)}
        </div> 
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <img src={icons.platform_logo} alt={icons.platform} className="w-8 h-4 rounded-full"/>
        <span className="text-sm ">{icons.platform}</span>
      </div>
    </div>);
};
export default Card;
