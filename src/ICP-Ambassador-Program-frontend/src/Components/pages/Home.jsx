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
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../redux/user/userSlice';
import ReactModal from 'react-modal';
import ReferralModal from '../modules/Navbar/ReferralModal';

const Home = () => {
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMobile, setFilterMobile] = useState(false);
  const [refModal,openRefModal]=useState(false)
  const [openWallet, setOpenWallet] = useState(false);
  const [discordl_user,setDiscord_user]=useState()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const nav=useNavigate()
  const dispatch=useDispatch()

  const handleWalletToggle = () => {
    //console.log("open wallet")
    setIsDrawerOpen(false)
    setOpenWallet((prev) => !prev); 
  };

  const handleCloseWallet = () => {
    setOpenWallet(false); 
  };

  const handleProfileToggle = () =>{
    setOpenWallet(false)
    setIsDrawerOpen((prev)=> !prev)
  }
  const handleCloseaProfile = () =>{
    setIsDrawerOpen(false);
  }


  useEffect(() => {
          if (Cookies.get('discord_user')) {
              try {
                  const user = JSON.parse(Cookies.get('discord_user'));
                  //console.log(JSON.parse(Cookies.get('discord_user')))
                  const email = user ? user.email : undefined;
                  //console.log("user ==>",user)
                  //setDiscord_user(user);
                  //console.log("Discord user ==>",discordl_user)
                  if (email) {
                      setUserEmail(email);
                  }
                  
                  if (user && user.id) {
                      getUser_Details(user.id);
                  }
              } catch (error) {
                  console.error("Error parsing discord_user cookie:", error);
              }
          }
      }, []);
      
      
  
  
        const getUser_Details = async(userId)=>{
          try{
              //console.log(userId)
              const details = await ICP_Ambassador_Program_backend.get_user_data(userId);
              //console.log("Details from backend ==>",details)
              const user = JSON.parse(Cookies.get('discord_user'));
              //console.log("Discord user from cookies ==>", user);
  
              
              const updatedDetails = {
              ...details[0], 
              avatar: user.avatar, 
              };
   
              //console.log("user_details in home page ==>",updatedDetails)
              dispatch(updateUser(updatedDetails));
              setDiscord_user(updatedDetails);
              setUser(updatedDetails)
              // dispatch(updateUser(details[0]))
              // setDiscord_user(details[0])
          }catch(e){
              console.log("Error ==>",e)
          }
        }
  const [space,setSpaces]=useState('');
    const loggedIn = Cookies.get('isLoggedIn')
    console.log("Looged In ==>",loggedIn)
    const getUser = async(isLoggedIn)=>{
    try{
        //console.log(userId)
        
        const user = JSON.parse(Cookies.get('discord_user'));
        const details = await ICP_Ambassador_Program_backend.get_user_data(user.id);
        console.log(details,"dd")
        if(details && details?.length!==0){
          dispatch(updateUser(details[0]))
          console.log("dispatching user")
          const spaces = await ICP_Ambassador_Program_backend.get_all_spaces();
          if(spaces?.Ok){
            console.log("getuser spaces : ",spaces)
            for(let i=0;i<spaces?.Ok?.length;i++){
              if(spaces?.Ok[i][0]==details[0]?.hub){
                Cookies.set('selectedHub', details[0]?.hub);
                Cookies.set('selectedHubName', spaces?.Ok[i][1]?.name);
                dispatch(updateUser(details[0]))
              }
            }
          }
          // registered=true

        }
        else{
          if(loggedIn){
            setIsHubModalOpen(true)
          }
           setIsHubModalOpen(true)
          //console.log("user not found")
        }
        setLoading(false)

    }catch(e){
        console.log("Error ==>",e)
        setLoading(false)
    }
  }
    useEffect(()=>{

      if(Cookies.get('discord_user')){
        const user = JSON.parse(Cookies.get('discord_user'));
        //console.log("user ==>",user)
        if(user){
            Get_All_Spaces();
        }
      }else{
        Get_All_Spaces();
      }
    },[])
    const Get_All_Spaces = async() =>{
        try{

            const spaces = await ICP_Ambassador_Program_backend.get_all_spaces();
            //console.log("Spaces ==>",spaces.Ok);
            const spacesObject = spaces.Ok.map(space => {
              const [spaceId, details] = space;
              return {
                  space_id: spaceId,
                  name: details.name
              };
          });

          setSpaces(spacesObject);
          
          //console.log(space)
  
          //console.log("Transformed Spaces Object:", spacesObject);

    

        }catch(e){
            console.log("Error ==> ",e);
        }
    }



  useEffect(() => {
    const timer = setTimeout(() => {
      const cookieUser = Cookies.get('discord_user');
      setUser(cookieUser ? JSON.parse(cookieUser) : null);
      
      const isLoggedIn = Cookies.get('isLoggedIn');
      //console.log("passing is logged in : ",isLoggedIn)
      getUser(isLoggedIn)
      
      console.log(cookieUser && !isLoggedIn,!cookieUser,!isLoggedIn)
      
      if (isLoggedIn) {
        setIsHubModalOpen(true);
      }

      //setIsHubModalOpen(true);
      // setLoading(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);  

  const handleFilterMobile = () => {
    setFilterMobile(true);
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-md m-3 bg-[#16161a] " >
      <Navbar nav={nav} openRefModal={openRefModal} setLoading={setLoading} onWalletClick={handleWalletToggle} onProfileClick={handleProfileToggle}/>
      <FilterProvider>
        <div className="flex flex-grow p-2  rounded-md ">
          
          {/* <div className=" w-1/6 h-full lg:block sm:hidden">
            <Filter />
          </div> */}
          <div className="w-full h-full">
            <Contests openWallet={openWallet} 
              onCloseWallet={handleCloseWallet} 
              user_details={user} 
              setDiscord_user={setDiscord_user} 
              isDrawerOpen={isDrawerOpen}
              onCloseProfile={handleCloseaProfile}
              openRefModal={openRefModal} 
              setLoading={setLoading} 
              />
          </div>
        </div>
      </FilterProvider>

      {isHubModalOpen && (
        <HubConnectionModal
          setLoading={setLoading}
          isOpen={isHubModalOpen}
          onClose={() => setIsHubModalOpen(false)}
          spaces={space}
        />
      )}

      
      {/* <div className='relative'>
        <div className='absolute bottom-44 left-1/2 transform -translate-x-1/2 z-50 lg:hidden' onClick={handleFilterMobile}>
          <div className='bg-white rounded py-2 px-5 font-semibold flex gap-3 justify-center items-center'>
            <MdOutlineTune className='text-lg' /> Filter
          </div>
        </div>
      </div> */}

      
      {/* {filterMobile && (
        <FilterMobile isOpen={filterMobile} onClose={() => setFilterMobile(false)} />
      )} */}
      <ReactModal
        isOpen={refModal}
        className='modal'
        ariaHideApp={false}
        style={{ 
            overlay: { backdropFilter: 'blur(3px)' , zIndex:50, backgroundColor:'rbg(0,0,0,0%)'}, 
        }}>
          <ReferralModal setOpen={openRefModal}/>
        </ReactModal>
    </div>
  );
};

export default Home;
