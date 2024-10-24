import React,{useState,useEffect} from 'react';
import { MdClose } from "react-icons/md";
import { FaDiscord } from "react-icons/fa";
import Cookies from 'js-cookie';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../../Util/file';
const LoginModel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [userData, setUserData] = useState(null);
  const CLIENT_ID = DISCORD_CLIENT_ID;  
  const REDIRECT_URI = "http://localhost:3000/";  
  const DISCORD_OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=1297821230786940948&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=identify+email+connections`;

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const savedUserData = localStorage.getItem('discord_user');
        if (savedUserData) {
          setUserData(JSON.parse(savedUserData));
          return;
        }

        const query = new URLSearchParams(window.location.search);
        const code = query.get('code');
        console.log("Code from Discord:", code);  

        if (code) {
          const accessToken = await exchangeCodeForToken(code);
          console.log("Access Token:", accessToken);  
          const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }

          const data = await response.json();
          setUserData(data);
          console.log("User Data ==>", data); 
          localStorage.setItem('discord_user', JSON.stringify(data)); 
        }
      } catch (error) {
        console.error('Error fetching Discord user data:', error);
      }
    };

    checkUserData();
  }, []); // Empty array to run only once when component mounts

  const exchangeCodeForToken = async (code) => {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', DISCORD_CLIENT_SECRET); 
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for access token');
    }

    const data = await response.json();
    console.log("Exchange data ==>", data);
    return data.access_token;
  };

  const handleDiscordLogin = () => {
    console.log("Redirecting to Discord");
    window.location.href = DISCORD_OAUTH_URL;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex gap-3 items-center justify-center">
      <div className="w-2/4 h-2/5 rounded-lg p-6 shadow-lg relative flex gap-9 flex-col" style={{ backgroundColor: '#1d1d21', border: '1px solid #212125' }}>
        <div className='flex flex-col justify-center items-center '>
          <h2 className="text-lg font-semibold text-white">Welcome to Ambassador Program</h2>
          <p className='text-gray-700 font-semibold' style={{ fontSize: '13px' }}>Sign In using Discord</p>
        </div>
        <div className='flex justify-center items-center' onClick={handleDiscordLogin}>
          <div className='text-white w-full h-9 flex justify-center items-center rounded-md font-bold text-md' style={{ backgroundColor: '#222222', border: '1px solid #212125' }}>
            <FaDiscord className='mr-3 text-blue-700 text-xl'/> Discord
          </div>
        </div>
      </div>

      <div
        className='rounded-md hover:bg-gray-700 py-2 px-2 flex justify-center items-center cursor-pointer'
        onClick={onClose}
      >
        <MdClose className='text-white' style={{ fontSize: '20px' }} />
      </div>
    </div>
  );
};

export default LoginModel;
