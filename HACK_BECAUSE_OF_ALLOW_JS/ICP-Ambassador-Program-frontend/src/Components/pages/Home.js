import React, { useState, useEffect } from 'react';
import Navbar from '../modules/Navbar/Navbar';
import Filter from '../modules/Filter/Filter';
import Contests from '../modules/Contests/Contests';
import { FilterProvider } from '../Context/FilterContext';
import HubConnectionModal from '../modules/Navbar/HubConnectionModel';
import FilterMobile from '../modules/Filter/FilterMobile';
import Cookies from 'js-cookie';
import { MdOutlineTune } from "react-icons/md";
import { ICP_Ambassador_Program_backend } from '../../../../declarations/ICP_Ambassador_Program_backend';
const Home = () => {
    const [isHubModalOpen, setIsHubModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterMobile, setFilterMobile] = useState(false);
    const getUser = async (userId) => {
        try {
            //console.log(userId)
            const details = await ICP_Ambassador_Program_backend.get_user_data(userId);
            console.log(details, "dd");
            if (details && details != []) {
            }
            else {
                setIsHubModalOpen(true);
                console.log("user not found");
            }
        }
        catch (e) {
            console.log("Error ==>", e);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            const cookieUser = Cookies.get('discord_user');
            setUser(cookieUser ? JSON.parse(cookieUser) : null);
            const isLoggedIn = Cookies.get('isLoggedIn');
            console.log(cookieUser && !isLoggedIn, !cookieUser, !isLoggedIn);
            // getUser(cookieUser?.id)
            if (isLoggedIn) {
                setIsHubModalOpen(true);
            }
            setLoading(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);
    const handleFilterMobile = () => {
        setFilterMobile(true);
    };
    if (loading) {
        return (<div className='flex justify-center items-center h-screen'>
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black"/>
      </div>);
    }
    return (<div className="flex flex-col rounded-md m-3 h-screen " style={{ backgroundColor: '#16161a' }}>
      <Navbar />
      <FilterProvider>
        <div className="flex flex-grow p-2 m-2 rounded-md overflow-y-scroll scrollbar-hide">
          
          <div className=" w-1/6 h-full">
            <Filter />
          </div>
          <div className="w-full h-full">
            <Contests />
          </div>
        </div>
      </FilterProvider>

      {isHubModalOpen && (<HubConnectionModal isOpen={isHubModalOpen} onClose={() => setIsHubModalOpen(false)}/>)}

      
      <div className='relative'>
        <div className='absolute bottom-44 left-1/2 transform -translate-x-1/2 z-50 lg:hidden' onClick={handleFilterMobile}>
          <div className='bg-white rounded py-2 px-5 font-semibold flex gap-3 justify-center items-center'>
            <MdOutlineTune className='text-lg'/> Filter
          </div>
        </div>
      </div>

      
      {filterMobile && (<FilterMobile isOpen={filterMobile} onClose={() => setFilterMobile(false)}/>)}
    </div>);
};
export default Home;
