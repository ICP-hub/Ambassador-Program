import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaXTwitter } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { BiLogoTelegram } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";
const Card = ({ contest, hub }) => {
    const { reward, status, title, image, social_platforms, icons } = contest;
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
        console.log("Contest", contest);
        navigate('/contest_details', { state: { contest } });
    };
    return (<div className=" text-white p-4 rounded-lg shadow-lg " style={{ backgroundColor: '#1d1d21' }} onClick={handleCard}>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold py-1 px-2 rounded" style={{ backgroundColor: '#29292c' }}>{reward}</span>
        <span className={`text-sm py-1 px-2 rounded-md font-bold`} style={{
            backgroundColor: status === 'Active' ? '#1d2d27' : status === 'Draft' ? '#29292c' : '#331a1e',
            color: status === 'Active' ? '#1db851' : status === 'Draft' ? '#b8b8b8' : '#e20203'
        }}>
          {status}
        </span>
      </div>
      <div className='flex'>
        <div>
            <h3 className="text-md font-bold mb-2">{title}</h3>
            <div className="flex space-x-2">
        {social_platforms.map((platform, index) => {
            const IconComponent = iconMap[platform.name];
            return (<div key={index} className={`text-white w-6 h-6 rounded-full flex justify-center items-center`} style={{ backgroundColor: platform.bgcolor, fontSize: '12px' }}>
              {IconComponent ? <IconComponent /> : null} 
            </div>);
        })}
      </div>
        </div>
        
        <div className="mb-4">
            {image ? (<img src={image} alt={title} className="w-24 h-24 object-cover rounded"/>) : (<div className="w-24 h-24 bg-gray-700 flex items-center justify-center rounded">
                <span>No Image</span>
            </div>)}
        </div> 
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <img src={icons.platform_logo} alt={icons.platform} className="w-8 h-4 rounded-full"/>
        <span className="text-sm font-semibold">{icons.platform}</span>
      </div>
    </div>);
};
export default Card;
