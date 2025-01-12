// import React, { useState, useEffect } from 'react';
// import { MdClose } from "react-icons/md";
// import { FaDiscord } from "react-icons/fa";
// import Cookies from 'js-cookie';
// import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../../Util/file';

// const LoginModel = ({ isOpen, onClose  }) => {
//   if (!isOpen) return null;

//   const CLIENT_ID = DISCORD_CLIENT_ID;
//   const REDIRECT_URI = "http://localhost:3000/";
//   const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify email connections`;

//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const checkUserData = async () => {
//       try {
//         const savedUserData = Cookies.get('discord_user');
//         if (savedUserData) {
//           setUserData(JSON.parse(savedUserData));
//           return;
//         }

//         const query = new URLSearchParams(window.location.search);
//         const code = query.get('code');

//         if (code) {
//           const accessToken = await exchangeCodeForToken(code);
//           const response = await fetch('https://discord.com/api/users/@me', {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           });

//           if (!response.ok) throw new Error('Failed to fetch user data');

//           const data = await response.json();
//           setUserData(data);
          
//           Cookies.set('discord_user', JSON.stringify(data), { expires: 10 });
//           Cookies.set('isLoggedIn', 'true', { expires: 1 / 1440 });
         
         
//           window.history.replaceState({}, document.title, window.location.pathname);
//         }
//       } catch (error) {
//         console.error('Error fetching Discord user data:', error);
//       }
//     };

//     checkUserData();
//   }, []); 

//   const exchangeCodeForToken = async (code) => {
//     const params = new URLSearchParams();
//     params.append('client_id', CLIENT_ID);
//     params.append('client_secret', DISCORD_CLIENT_SECRET);
//     params.append('grant_type', 'authorization_code');
//     params.append('code', code);
//     params.append('redirect_uri', REDIRECT_URI);

//     const response = await fetch('https://discord.com/api/oauth2/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params,
//     });

//     if (!response.ok) throw new Error('Failed to exchange code for access token');

//     const data = await response.json();
//     return data.access_token;
//   };

//   const handleDiscordLogin = () => {
//     window.location.href = DISCORD_OAUTH_URL;
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
//       <div className="w-2/4 h-2/5 rounded-lg p-6 shadow-lg relative flex flex-col gap-9" style={{ backgroundColor: '#1d1d21', border: '1px solid #212125' }}>
//         <div className='flex flex-col justify-center items-center'>
//           <h2 className="text-lg font-semibold text-white">Welcome to Ambassador Program</h2>
//           <p className='text-gray-700 font-semibold' style={{ fontSize: '13px' }}>Sign In using Discord</p>
//         </div>
//         <div className='flex justify-center items-center cursor-pointer' onClick={handleDiscordLogin}>
//           <div className='text-white w-full h-9 flex justify-center items-center rounded-md font-bold text-md' style={{ backgroundColor: '#222222', border: '1px solid #212125' }}>
//             <FaDiscord className='mr-3 text-blue-700 text-xl' /> Discord
//           </div>
//         </div>
//       </div>
//       <div className='rounded-md hover:bg-gray-700 py-2 px-2 flex justify-center items-center cursor-pointer' onClick={onClose}>
//         <MdClose className='text-white' style={{ fontSize: '20px' }} />
//       </div>
//     </div>
//   );
// };

// export default LoginModel;

import React, { useEffect, useState } from 'react';
import { MdClose } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";
import { DISCORD_CLIENT_ID } from '../../auth/authdata';
import Cookies from 'js-cookie'
import { BASE_URL } from '../../../../../../DevelopmentConfig';
const LoginModel = ({ isOpen, onClose,isReferred }) => {
  // const [ref,setRef]=useState(false)
  
  if (!isOpen) return null;

  //const REDIRECT_URI = "https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io/auth/discord/callback";
  const REDIRECT_URI = `${BASE_URL}/auth/discord/callback`;
  // const REDIRECT_URI = "http://localhost:3000/auth/discord/callback";
  // const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify email connections guilds.members.read`;
  const DISCORD_OAUTH_URL= `https://discord.com/oauth2/authorize?client_id=1303682602825158676&response_type=code&redirect_uri=https%3A%2F%2Fkgmyp-myaaa-aaaao-a3u4a-cai.icp0.io%2Fauth%2Fdiscord%2Fcallback&scope=identify+email+connections`
  const handleDiscordLogin = () => {https://discord.com/oauth2/authorize?client_id=1303682602825158676&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fdiscord%2Fcallback&scope=guilds.members.read+connections+email+identify
    window.location.href = DISCORD_OAUTH_URL;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
      <div className='flex flex-col gap-2 flex-reverse lg:w-2/4 sm:w-5/6 lg:h-58 sm:h-52 justify-center items-center'>
        <div className='rounded-md hover:bg-gray-700 py-2 px-2 ml-2 self-end flex  justify-center items-center cursor-pointer' onClick={onClose}>
          <MdClose className='text-white' style={{ fontSize: '20px' }} />
        </div>
        <div className="w-full h-full  rounded-lg p-6 shadow-lg relative flex flex-col gap-9" style={{ backgroundColor: '#1d1d21', border: '1px solid #212125' }}>
          <div className='flex flex-col justify-center sm:gap-3 items-center'>
            <h2 className="lg:text-lg sm:text-sm font-semibold text-center text-white">{isReferred?'You are being referred to the Ambassador Program':'Welcome to Ambassador Program'}</h2>
            <p className='text-gray-700 font-semibold' style={{ fontSize: '13px' }}>Sign In using Discord</p>
          </div>
          <div className='flex justify-center items-center cursor-pointer' onClick={handleDiscordLogin}>
            <div className='text-white w-full h-9 flex justify-center items-center rounded-md font-bold text-md' style={{ backgroundColor: '#222222', border: '1px solid #212125' }}>
              <FaDiscord className='mr-3 text-blue-700 text-xl' /> Discord
            </div>
          </div>
        </div>
        
      </div>  
    </div>
  );
};

export default LoginModel;

