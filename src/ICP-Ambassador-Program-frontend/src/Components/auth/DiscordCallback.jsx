import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../Util/file.js';
import { ICP_Ambassador_Program_backend } from '../../../../declarations/ICP_Ambassador_Program_backend';
const DiscordCallback = () => {
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

        const response = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();
        
        Cookies.set('discord_user', JSON.stringify(userData), { expires: 10 });
        const user=JSON.parse(userData);
        getUser(user.id);
        

        setTimeout(() => {
            navigate('/');
          }, 10000);
      } catch (error) {
        console.error('Error handling Discord login:', error);
        navigate('/');
      }
    };

    handleDiscordLogin();
  }, [navigate]);


  const getUser = async(userId)=>{
    try{
        //console.log(userId)
        const details = await ICP_Ambassador_Program_backend.get_user_data(userId);
        if(details){
          Cookies.set('isLoggedIn', 'true', { expires: 1 / 1440 });
        }
        else{
          console.log("user not found")
        }
    }catch(e){
        console.log("Error ==>",e)
    }
  }

  const exchangeCodeForToken = async (code) => {
    const params = new URLSearchParams();
    console.log("DISCORD IDS : ",DISCORD_CLIENT_ID,DISCORD_CLIENT_SECRET)
    params.append('client_id', DISCORD_CLIENT_ID);
    params.append('client_secret', DISCORD_CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://localhost:3000/auth/discord/callback');

    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) throw new Error('Failed to exchange code for access token');

    const data = await response.json();
    return data.access_token;
  };

  return (
    <div className='flex justify-center items-center h-screen'>
       <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
    </div>
  );
};

export default DiscordCallback;
