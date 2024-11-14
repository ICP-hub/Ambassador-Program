import React,{useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import { FaXTwitter } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { BiLogoTelegram } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";


const Card = ({ contest,hub }) => {
  //console.log("contest ==>",contest)
  const { reward, status, title, social_platforms, icons,owner } = contest;
  
  const [image,setImage]=useState();



const uint8ArrayToBase64 = (arr) => {
  
  const blob = new Blob([arr], { type: 'image/png' });
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]; 
      // console.log("Base64 result:", base64); 
      resolve(base64);
    };
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
};

useEffect(() => {
  const convertAndSetImage = async () => {
    if (owner._arr && owner._arr.length > 0) {
      try {
        
        const imageBase64 = await uint8ArrayToBase64(owner._arr);
        
        setImage(imageBase64); 
      } catch (error) {
        console.error("Error converting image:", error);
      }
    } else {
      console.log("owner._arr is empty or invalid");
    }
  };

  convertAndSetImage();
}, [owner._arr]);


  const statusKey = Object.keys(status)[0]; 
  const statusValue = status[statusKey]; 

  
  const navigate=useNavigate();
  const iconMap = {
    Twitter: FaXTwitter,
    Discord: FaDiscord,
    Telegram:BiLogoTelegram,
    Api:GrTransaction,
    Transaction:GrTransaction,
    Upload:FaFileUpload
    
  };

  const handleCard = () => {
    //console.log("Contest",contest)
    navigate('/contest_details', { state: { contest } });
  };


  return (
    <div className=" text-white p-4 rounded-lg shadow-lg " style={{backgroundColor:'#1d1d21'}} onClick={handleCard}>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold py-1 px-2 rounded" style={{backgroundColor:'#29292c'}}>{reward}</span>
        <span
          className={`text-sm py-1 px-2 rounded-md font-bold`}
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


      </div>
      <div className='flex'>
        <div>
            <h3 className="text-md font-bold mb-2">{title}</h3>
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
        {owner._arr ? (
            <img
            src={`data:image/png;base64,${image}`}
              alt={title}
              className="w-24 h-24 object-cover rounded"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-700 text-white flex items-center justify-center rounded">
              <span>No Image</span>
            </div>
          )}
        </div> 
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        {/* <img src={icons.platform_logo} alt={icons.platform} className="w-8 h-4 rounded-full" />
        <span className="text-sm font-semibold">{icons.platform}</span> */}
      </div>
    </div>
  );
};

export default Card;
