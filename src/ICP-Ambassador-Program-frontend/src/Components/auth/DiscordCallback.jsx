// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../Util/file.js';
// import { ICP_Ambassador_Program_backend } from '../../../../declarations/ICP_Ambassador_Program_backend';
// const DiscordCallback = ({setOpen}) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleDiscordLogin = async () => {
//       const query = new URLSearchParams(window.location.search);
//       const code = query.get('code');

//       if (!code) {
//         navigate('/');
//         return;
//       }
//       try {
//         const accessToken = await exchangeCodeForToken(code);

//         console.log("access token : ",accessToken)
//         const response = await fetch('https://discord.com/api/users/@me', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         console.log("login re :",response)

//         if (!response.ok) throw new Error('Failed to fetch user data');

//         const userData = await response.json();

//         console.log("userdata : ",userData)
        
//         Cookies.set('discord_user', JSON.stringify(userData), { expires: 10 });
//         // const user=JSON.parse(userData);
//         getUser(userData.id);
        

//         setTimeout(() => {
//             navigate('/');
//           }, 10000);
//       } catch (error) {
//         console.error('Error handling Discord login:', error);
//         navigate('/');
//       }
//     };

//     handleDiscordLogin();
//   }, [navigate]);


//   const getUser = async(userId)=>{
//     try{
//         //console.log(userId)
//         const details = await ICP_Ambassador_Program_backend.get_user_data(userId);
//         console.log(details,"dd")
//         if(details.length ===0){
//           // Cookies.set('isLoggedIn', 'false', { expires: 1 / 1440 });
//           Cookies.set('isLoggedIn', 'true', { expires: 1 / 1440 });
//         }
//         else{
//           //console.log("user not found")
//           // Cookies.set('isLoggedIn', 'true', { expires: 1 / 1440 });
//           // Cookies.set('needReg', 'true', { expires: 1 / 1440 });
//           setOpen(true)
//         }
//     }catch(e){
//         console.log("Error ==>",e)
//     }
//   }

//   const exchangeCodeForToken = async (code) => {
//     const params = new URLSearchParams();
//     console.log("DISCORD IDS : ",DISCORD_CLIENT_ID,DISCORD_CLIENT_SECRET)
//     params.append('client_id', DISCORD_CLIENT_ID);
//     params.append('client_secret', DISCORD_CLIENT_SECRET);
//     params.append('grant_type', 'authorization_code');
//     params.append('code', code);
//     // params.append('redirect_uri', 'https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io/auth/discord/callback');
//     params.append('redirect_uri', 'http://localhost:3000/auth/discord/callback');

//     const response = await fetch('https://discord.com/api/v10/oauth2/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: params,
//     });
//     console.log("exchange token res:",response)

//     if (!response.ok) throw new Error('Failed to exchange code for access token');

//     const data = await response.json();
//     return data.access_token;
//   };

//   return (
//     <div className='flex justify-center items-center h-screen'>
//        <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
//     </div>
//   );
// };

// export default DiscordCallback;
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../Util/file.js';
import { ICP_Ambassador_Program_backend } from '../../../../declarations/ICP_Ambassador_Program_backend';

const DiscordCallback = ({ setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleDiscordLogin = async () => {
      const query = new URLSearchParams(window.location.search);
      const code = query.get('code');

      if (!code) {
        navigate('/');
        return;
      }
      try {
        const accessToken = await exchangeCodeForToken(code);

        const userData = await fetchUserData(accessToken);
        const isMember = await checkServerMembership(userData.id, accessToken);

        if (isMember) {
          Cookies.set('discord_user', JSON.stringify(userData), { expires: 10 });
          getUser(userData.id);

          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          alert('You must be a member of the specific Discord server to log in.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error handling Discord login:', error);
        navigate('/');
      }
    };

    handleDiscordLogin();
  }, [navigate]);

  const exchangeCodeForToken = async (code) => {
    const params = new URLSearchParams();
    params.append('client_id', DISCORD_CLIENT_ID);
    params.append('client_secret', DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:3000/auth/discord/callback');

    const response = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!response.ok) throw new Error('Failed to exchange code for access token');
    const data = await response.json();
    return data.access_token;
  };

  const fetchUserData = async (accessToken) => {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    return response.json();
  };

  const checkServerMembership = async (userId, accessToken) => {
    const SERVER_ID = '935766022257008712';
    const response = await fetch(`https://discord.com/api/v10/guilds/${SERVER_ID}/members/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.ok;
  };

  const getUser = async (userId) => {
    try {
      const details = await ICP_Ambassador_Program_backend.get_user_data(userId);
      if (details.length === 0) {
        Cookies.set('isLoggedIn', 'true', { expires: 1 / 1440 });
      } else {
        setOpen(true);
      }
    } catch (e) {
      console.error('Error fetching user data from backend:', e);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
    </div>
  );
};

export default DiscordCallback;
