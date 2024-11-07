import React, { useState, useEffect } from 'react';
import Navbar from '../modules/Navbar/Navbar';
import Filter from '../modules/Filter/Filter';
import Contests from '../modules/Contests/Contests';
import { FilterProvider } from '../Context/FilterContext';
import HubConnectionModal from '../modules/Navbar/HubConnectionModel';
import Cookies from 'js-cookie';

const Home = () => {
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    
    const timer = setTimeout(() => {
      
      const cookieUser = Cookies.get('discord_user');
      setUser(cookieUser ? JSON.parse(cookieUser) : null);

      const isLoggedIn = Cookies.get('isLoggedIn');
      if (isLoggedIn) {
        setIsHubModalOpen(true);
      }

      
      setLoading(false);
    }, 2000); 

    
    return () => clearTimeout(timer);
  }, []);  

  if (loading) {
    
    return (
    <div className='flex justify-center items-center h-screen'>
       <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
    </div>)
   
  }

  return (
    <div className="flex flex-col h-lvh rounded-md m-3 " style={{ backgroundColor: '#16161a' }}>
      <Navbar />
      <FilterProvider>
        <div className="flex flex-grow p-2 m-2 rounded-md overflow-y-scroll scrollbar-hide ">
          <div className="w-1/6 h-full">
            <Filter />
          </div>
          <div className="w-full h-full">
            <Contests />
          </div>
        </div>
      </FilterProvider>
      {isHubModalOpen && (
        <HubConnectionModal
          isOpen={isHubModalOpen}
          onClose={() => setIsHubModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
