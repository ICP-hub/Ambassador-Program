// import React, { useState,useEffect } from 'react';
// import { MdClose } from "react-icons/md";
// import { MdOutlineQuestionMark } from "react-icons/md";
// import Cookies from 'js-cookie'
// import { FaUserCircle } from 'react-icons/fa';
// const ProfileDrawer = ({ user, onClose, isOpen,openRefModal,setLoading }) => {
//     // console.log("user ==>",user)
//     const [points,setPoints]=useState(0)
//     const [hub,setHub]=useState('')
//     const baseReferral=`http://localhost:3000/ref?ref=`
//     // const baseReferral=`https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io/ref?ref=`
//     useEffect(()=>{
//         const HUB=Cookies.get('selectedHubName')
//         setHub(HUB)
//     },[])
//     const handlelogout =() =>{
//         localStorage.removeItem('discord_user')
//         Cookies.remove('discord_user')
//         Cookies.remove('ref')
//         window?.location?.reload()
//     }

//     return (
//         <div
//             className={`fixed top-0 right-0 w-96 h-full my-3 bg-white shadow-lg p-6 z-50 transition-transform duration-500 ease-in-out transform overflow-y-auto scrollbar-hide  ${
//                 isOpen ? 'translate-x-0' : 'translate-x-full'
//             }`}
//         >
//             <div className='flex justify-end'>
//                 <button onClick={onClose} className=' hover:bg-black hover:text-white rounded-full h-9 w-9 flex justify-center items-center cursor-pointer'>
//                     <MdClose className='text-black  hover:text-white' style={{ fontSize: '20px' }} />
//                 </button>
//             </div>
            
//             <h2 className="text-xl font-semibold mb-4">{user.username}</h2>
//             <div className='flex justify-center items-center mb-3 mt-3'>
//             {/* <img
//                         src="https://static-00.iconduck.com/assets.00/profile-circle-icon-1023x1024-ucnnjrj1.png"
//                         alt="not found"
//                         className="w-20 h-20 rounded-full"
//                         /> */}
//                 <FaUserCircle className='w-20 h-20 rounded-full bg-gray-500'/>
//             </div>
//             <div className='flex flex-col gap-3'>
//                 <p className=' mt-3 border-b border-gray-500 pb-4'><strong >Discord ID:</strong> {user.discord_id}</p>
//                 <p className=' mt-3 border-b border-gray-500 pb-4'><strong>Current Level :</strong> {' '+Object.keys(user.level)[0]}</p>
//                 <p className=' mt-3'><strong>Hub Connected To:</strong> {hub}</p>
//             </div>
           
//             <div className='flex flex-col gap-3'>
//                 <div className='flex gap-4 items-center mt-4'>
//                     <div className='text-[#0d033e] text-sm font-semibold'>Membership progress</div>
//                     <hr className='flex-grow h-3/6 bg-black' />
//                 </div>
//                 <div className='flex flex-col justify-center  gap-3'>
//                     <div className='flex  justify-around mt-4'>
//                         <div className='flex flex-col justify-center items-center'>
//                             <div className='text-[#503cb6] text-2xl font-semibold'>{user.xp_points.toString()}</div>
//                             <div className='text-[#0d033e] text-sm font-semibold'>XP Points</div>
//                         </div>
//                         <div className='flex flex-col justify-center items-center'>
//                             <div className='text-[#503cb6] text-2xl font-semibold'>{user.redeem_points.toString()}</div>
//                             <div className='text-[#0d033e] text-sm font-semibold'>Redeemable Points</div>
//                         </div>

                        
                       
//                     </div>
//                     {/* <div className='flex justify-center items-center gap-2 my-3'>
//                             <div className='bg-black h-7 w-7 flex justify-center items-center rounded-full'><MdOutlineQuestionMark  className='text-white '/></div>
//                             <div className=' font-semibold text-sm'>What happen to my points</div>
//                         </div> */}
//                     {/* <div className='flex gap-3 py-2 px-4 bg-gray-100 rounded-lg mb-5'>
//                         <div className='bg-black h-5 w-9 flex justify-center items-center rounded-full'><div className='text-white text-sm font-semibold'>i</div></div>
//                         <div className='flex flex-col gap-3'>
//                             <div className='font-semibold text-sm'>Your XP points are valid until 31.01.2036</div>
//                             <div className='text-sm'>Collect,use or buy Avios at least once every 18 months to keep them from expiring.</div>
//                         </div>
//                     </div> */}
//                     {/* <div className='flex flex-col gap-1 justify-center items-center'>
//                         <div className='text-sm font-semibold'>Finnair Plus Gold</div>
//                         <div className='text-md font-semibold'>14 days</div>
//                         <div className='font-light text-sm'>left to gain next tier</div>
//                     </div> */}
//                 </div>
//             </div>
//             <div className='flex flex-col gap-3 mt-4'>
//                 <div className='flex gap-4 items-center mt-4'>
//                     <div className='text-[#0d033e] text-sm font-semibold'>Referrals</div>
//                     <hr className='flex-grow h-3/6 bg-black' />
//                 </div>
//                 <div className='flex flex-col items-center'>
//                     <p className='text-xs mb-3'>
//                         Share this referral with others and grow your referral tree and earn rewards! You can refer upto 10 people
//                     </p>
//                     <a href={baseReferral+user.discord_id} target='blank' className='text-blue-600 text-sm font-bold cursor-pointer'>
//                         {baseReferral+user.discord_id}
//                     </a>
//                     <p className='mt-3 text-sm underline font-semibold cursor-pointer' onClick={()=>openRefModal(true)}>
//                         View people referred by You
//                     </p>
//                 </div>
//             </div>
//             <div className='flex justify-center items-center mt-4'>
//                 <button className="mt-4 text-gray-400 font-semibol border py-2 px-4 hover:bg-black hover:text-white cursor-pointer hover:border-black border-slate-500 rounded" onClick={handlelogout}>
//                     Logout
//                 </button>
//             </div>
            
//         </div>
//     );
// };

// export default ProfileDrawer;
import React, { useState, useEffect } from 'react';
import { MdClose } from "react-icons/md";
import { FaUserCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../../../../../DevelopmentConfig';
const ProfileDrawer = ({ user, onClose, isOpen, openRefModal, setLoading }) => {
  const [hub, setHub] = useState('');
  // const baseReferral = `http://localhost:3000/ref?ref=`;
  // const baseReferral=`https://kgmyp-myaaa-aaaao-a3u4a-cai.icp0.io/ref?ref=`

  const baseReferral=`${BASE_URL}/ref?ref=`
   console.log("user in profile & BASE url ==>",user,BASE_URL)
  useEffect(() => {
    const HUB = Cookies.get('selectedHubName');
    setHub(HUB);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('discord_user');
    Cookies.remove('discord_user');
    Cookies.remove('ref');
    window?.location?.reload();
  };

  return (
    <div
      className={`absolute top-0 right-0 lg:w-96 sm:w-full rounded-md h-full  overflow-y-scroll text-white font-poppins scrollbar-hide lg:my-3 sm:my-0 bg-[#1d1d21] shadow-lg p-6  transition-all duration-500 ease-in-out transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="hover:bg-black hover:text-white rounded-full h-9 w-9 flex justify-center items-center cursor-pointer"
        >
          <MdClose className="text-white hover:text-white" style={{ fontSize: '20px' }} />
        </button>
      </div>

      

      <div className="flex flex-col gap-2 justify-center items-center mb-3 ">
        {user.avatar ? (
          <img
            src={`https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`}
            alt="User Avatar"
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <FaUserCircle className="w-20 h-20 rounded-full bg-gray-500" />
        )}
        {/* <h2 className=" text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FFFFFF] text-xl  mb-4">{user.username}</h2> */}
        <h2 className='text-white text-xl mb-4'>{user.username}</h2>
      </div>

      <div className="flex flex-col gap-3">
        <p className="mt-3 border-b border-gray-500 pb-4">
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#245ce2] to-[#FFFFFF]'>Discord ID : </span> 
          {user.discord_id}
        </p>
        <p className="mt-3 border-b border-gray-500 pb-4">
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#245ce2] to-[#FFFFFF]'>Current Level :</span> 
          {' ' + Object.keys(user.level)[0]}
        </p>
        <p className="mt-3">
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#245ce2] to-[#FFFFFF]'>Hub Connected To : </span> 
          {hub}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-4 items-center mt-4">
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FFD439] text-sm ">Membership progress</div>
          <hr className="flex-grow h-3/6 bg-black" />
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div className="flex justify-around mt-4">
            <div className="flex flex-col justify-center items-center">
              <div className="text-transparent text-white text-2xl font-semibold">{user.xp_points.toString()}</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FFFFFF] text-sm">XP Points</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-transparent text-white text-2xl font-semibold">{user.redeem_points.toString()}</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FFFFFF] text-sm ">Redeemable Points</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <div className="flex gap-4 items-center mt-4">
          <div className="text-transparent text-white text-sm font-semibold">Referrals</div>
          <hr className="flex-grow h-3/6 bg-black" />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xs mb-3">
            Share this referral with others and grow your referral tree and earn rewards! You can refer up to 10 people
          </p>
          <a href={baseReferral + user.discord_id} target="_blank" className="text-blue-600 text-sm font-bold cursor-pointer">
            {baseReferral + user.discord_id}
          </a>
          <p className="mt-3 text-sm underline font-semibold cursor-pointer" onClick={() => openRefModal(true)}>
            View people referred by You
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
          className="mt-4 text-gray-400 font-semibold border py-2 px-4 hover:bg-black hover:text-white cursor-pointer hover:border-black border-slate-500 rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDrawer;



