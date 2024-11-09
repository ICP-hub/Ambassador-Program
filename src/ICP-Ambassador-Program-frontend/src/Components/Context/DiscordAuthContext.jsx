// DiscordAuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const DiscordAuthContext = createContext();
import { DISCORD_CLIENT_ID,DISCORD_CLIENT_SECRET } from '../auth/authdata';

export const DiscordAuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
//   const CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;  
//   const REDIRECT_URI = "http://localhost:3000/";  
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

        if (code) {
          const accessToken = await exchangeCodeForToken(code);
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
          localStorage.setItem('discord_user', JSON.stringify(data));
          window.history.replaceState({}, document.title, window.location.pathname); // Clear the query parameters
        }
      } catch (error) {
        console.error('Error fetching Discord user data:', error);
      }
    };

    checkUserData();
  }, []); 

  const exchangeCodeForToken = async (code) => {
    const params = new URLSearchParams();
    params.append('client_id', DISCORD_CLIENT_ID);
    params.append('client_secret',DISCORD_CLIENT_SECRET); 
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', "http://localhost:3000/auth/discord/callback");

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
    return data.access_token;
  };

  return (
    <DiscordAuthContext.Provider value={{ userData, DISCORD_OAUTH_URL }}>
      {children}
    </DiscordAuthContext.Provider>
  );
};
