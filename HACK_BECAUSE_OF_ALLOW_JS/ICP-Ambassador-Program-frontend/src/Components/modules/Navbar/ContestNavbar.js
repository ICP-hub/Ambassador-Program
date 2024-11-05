import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { AiFillThunderbolt } from "react-icons/ai";
import { HiSignal } from "react-icons/hi2";
import { FaWallet } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { BiLogoTelegram } from "react-icons/bi";
import { IoNotificationsOutline, IoChevronUpOutline } from "react-icons/io5";
import LoginModel from './LoginModel';
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import Sidebar from './SideBar';
import { MdClose } from "react-icons/md";
import { HiMenu } from 'react-icons/hi';
const ContestNavbar = () => {
    const [isModelOpen, setModelOpen] = useState(false);
    const [isSideBarOpen, setSideBarOpen] = useState(false);
    const [isSideBar, setIsSideBar] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        console.log("Email ==>", email);
        if (email) {
            setUserEmail(email);
        }
    }, []);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSideBar(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (<div className=' flex justify-between items-center mx-3'>
        <div className='flex items-center gap-5 '>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="153" height="24" fill="none"><path fill="#FAFAFA" d="M24 5.28A5.28 5.28 0 0 0 18.72 0H5.28A5.28 5.28 0 0 0 0 5.28v13.44A5.28 5.28 0 0 0 5.28 24h13.44A5.28 5.28 0 0 0 24 18.72v-6H9.312v-1.44H24v-6ZM46.622 11.332c-.258.267-.212.79.103.987 1.053.657 1.625 1.77 1.625 3.654 0 3.45-2.292 5.085-5.017 5.085H32.86a.426.426 0 0 1-.425-.428V3.599c0-.237.192-.43.428-.43H41.5c3.692 0 6.086 1.509 6.086 5.112 0 1.438-.335 2.4-.964 3.051Zm-6.243-4.61h-3.648a.427.427 0 0 0-.426.429v2.899c0 .237.191.429.427.429h3.826c1.782 0 3.234-.077 3.234-1.866 0-1.789-1.528-1.891-3.413-1.891Zm.815 10.81c1.91 0 3.362-.128 3.362-1.968 0-1.687-1.07-1.968-2.852-1.968H36.73a.427.427 0 0 0-.426.43v3.077c0 .237.191.429.427.429h4.462ZM53.086 3.17c.236 0 .428.192.428.429v13.53c0 .236.191.428.427.428h9.917c.236 0 .427.192.427.43v2.643a.428.428 0 0 1-.427.428H50.07a.428.428 0 0 1-.427-.428V3.599c0-.237.191-.43.427-.43h3.016ZM73.184 2.889c5.195 0 9.142 3.22 9.142 9.097 0 5.878-3.947 9.072-9.142 9.072-5.195 0-9.142-3.092-9.142-9.072 0-5.877 3.947-9.097 9.142-9.097Zm0 14.208c3.08 0 5.347-1.686 5.347-5.11 0-3.502-2.266-5.137-5.347-5.137-3.082 0-5.348 1.584-5.348 5.136 0 3.553 2.266 5.111 5.348 5.111ZM97.069 14.573a.454.454 0 0 1 .422-.312h3.231c.251 0 .449.217.411.466-.576 3.738-3.96 6.331-8.73 6.331-5.118 0-9.014-3.092-9.014-9.072 0-5.877 3.896-9.097 9.015-9.097 4.767 0 8.243 2.755 8.739 6.367a.406.406 0 0 1-.411.456h-3.245a.45.45 0 0 1-.42-.307c-.61-1.732-1.942-2.555-4.663-2.555-3.056 0-5.17 1.584-5.17 5.136 0 3.553 2.114 5.111 5.17 5.111 2.8 0 4.115-.947 4.665-2.524ZM117.903 3.195c.37 0 .565.441.317.717l-6.352 7.048a.429.429 0 0 0-.027.542l6.522 8.873a.429.429 0 0 1-.344.683h-3.778a.427.427 0 0 1-.342-.171l-4.678-6.26a.427.427 0 0 0-.66-.029l-2.242 2.505a.428.428 0 0 0-.11.287v3.24a.428.428 0 0 1-.427.428h-3.016a.428.428 0 0 1-.427-.428V3.599c0-.237.191-.43.427-.43h3.016c.236 0 .427.193.427.43v6.694c0 .391.48.578.743.289l6.592-7.247a.426.426 0 0 1 .315-.14h4.044ZM119.498 3.599c0-.237.191-.43.427-.43h13.788c.236 0 .427.193.427.43v2.669a.428.428 0 0 1-.427.428h-9.917a.429.429 0 0 0-.428.43v2.822c0 .236.192.428.428.428h9.917c.236 0 .427.192.427.43v2.643a.428.428 0 0 1-.427.428h-9.917a.429.429 0 0 0-.428.43v2.77c0 .237.192.43.428.43h9.917c.236 0 .427.191.427.428v2.695a.428.428 0 0 1-.427.428h-13.788a.428.428 0 0 1-.427-.428V3.599ZM143.253 3.17c7.537 0 8.785 5.52 8.785 8.97 0 3.45-1.35 8.918-8.785 8.918h-7.241a.425.425 0 0 1-.424-.428V3.599c0-.237.191-.43.427-.43h7.238Zm0 14.362c3.972 0 4.761-3.476 4.761-5.392 0-2.02-.763-5.418-4.761-5.418h-3.368a.428.428 0 0 0-.427.429v9.952c0 .237.191.429.427.429h3.368Z"></path></svg>
            </div>
            {/* <div className='lg:flex sm:hidden'>
            <div className='flex  border-2  hover:border-white bg-trasparent py-1  text-white w-96 rounded-md  gap-4 items-center px-2' style={{border:'1px solid #71827f'}}>
                <CiSearch className='' style={{fontSize :'20px',color:'#71827f'}}/>
                <input className='text-white bg-transparent outline-none border-none placeholder:font-bold'  placeholder='Search'/>
            </div>
        </div> */}
        </div>
        <div className='flex items-center gap-3'>
            <div className='flex justify-between items-center gap-2 rounded-md hover:bg-gray-700 py-2 px-2 cursor-pointer'>
                <div className='w-6 h-6 rounded-full border-2 border-gray-500 flex justify-center items-center'>
                    <AiFillThunderbolt className='text-white' style={{ fontSize: '13px' }}/>
                </div>
                <div className='text-white' style={{ fontSize: '14px' }}>0</div>
            </div>
            <div className='flex justify-between items-center gap-2 rounded-md hover:bg-gray-700 py-2 px-2 cursor-pointer'>
                <div className='w-6 h-6 rounded-full border-2 border-gray-500 flex justify-center items-center'>
                    <HiSignal className='text-white' style={{ fontSize: '13px' }}/>
                </div>
                <div className='text-white' style={{ fontSize: '14px' }}>0</div>
            </div>
            <div className='sm:block lg:hidden'>
                <HiMenu className='text-white' size={24} onClick={() => {
            setIsSideBar(!isSideBar);
        }}/>
            </div>

            <div className='lg:flex sm:hidden   justify-between items-center gap-2 rounded-md hover:bg-gray-700 py-1 px-1 cursor-pointer'>
                
                <FaWallet className='text-white' style={{ fontSize: '20px' }}/>
                
                <div className='text-white' style={{ fontSize: '14px' }}>$0</div>
            </div>

            <div className='lg:flex sm:hidden  justify-between items-center gap-3 rounded-md hover:bg-gray-700 p-1 cursor-pointer'>
                <HiOutlineQuestionMarkCircle className='text-white' style={{ fontSize: '20px' }}/>   
            </div>
            <div className='lg:flex sm:hidden  justify-between items-center gap-1
             rounded-md hover:bg-gray-700 p-1 cursor-pointer' onClick={() => { setSideBarOpen(true); }}>
                <IoNotificationsOutline className='text-white' style={{ fontSize: '20px' }}/>   
                <IoChevronUpOutline className={`text-white transition-transform duration-300 ${isSideBarOpen ? 'rotate-180' : 'rotate-0'}`} style={{ fontSize: '20px', cursor: 'pointer' }}/>   
            </div>
            {userEmail ? (<div className='lg:block sm:hidden'>
            <div className='bg-white text-black py-1 px-4 rounded-md text-sm font-semibold cursor-pointer'>
              {userEmail} {/* Display user email */}
              <button onClick={handleLogout} className="ml-4 text-red-500">Logout</button>
            </div>
          </div>) : (
        // Show login button if not logged in
        <div className='lg:block sm:hidden'>
            <button className='bg-white text-black py-1 px-8 rounded-md text-sm font-semibold cursor-pointer' onClick={() => setModelOpen(true)}>
              Login
            </button>
          </div>)}
            
        </div>

        {isSideBar && (<div className={`fixed top-0 right-0 h-full w-full   shadow-lg transition-transform duration-1000 ease-in-out ${isSideBar ? 'translate-x-0' : 'translate-x-full'}`} style={{ backgroundColor: '#1d1d21' }}>
                    <div className='flex flex-col h-full justify-between'>
                        <div>
                            <div className='flex justify-between items-center p-4'>
                                
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="153" height="24" fill="none"><path fill="#FAFAFA" d="M24 5.28A5.28 5.28 0 0 0 18.72 0H5.28A5.28 5.28 0 0 0 0 5.28v13.44A5.28 5.28 0 0 0 5.28 24h13.44A5.28 5.28 0 0 0 24 18.72v-6H9.312v-1.44H24v-6ZM46.622 11.332c-.258.267-.212.79.103.987 1.053.657 1.625 1.77 1.625 3.654 0 3.45-2.292 5.085-5.017 5.085H32.86a.426.426 0 0 1-.425-.428V3.599c0-.237.192-.43.428-.43H41.5c3.692 0 6.086 1.509 6.086 5.112 0 1.438-.335 2.4-.964 3.051Zm-6.243-4.61h-3.648a.427.427 0 0 0-.426.429v2.899c0 .237.191.429.427.429h3.826c1.782 0 3.234-.077 3.234-1.866 0-1.789-1.528-1.891-3.413-1.891Zm.815 10.81c1.91 0 3.362-.128 3.362-1.968 0-1.687-1.07-1.968-2.852-1.968H36.73a.427.427 0 0 0-.426.43v3.077c0 .237.191.429.427.429h4.462ZM53.086 3.17c.236 0 .428.192.428.429v13.53c0 .236.191.428.427.428h9.917c.236 0 .427.192.427.43v2.643a.428.428 0 0 1-.427.428H50.07a.428.428 0 0 1-.427-.428V3.599c0-.237.191-.43.427-.43h3.016ZM73.184 2.889c5.195 0 9.142 3.22 9.142 9.097 0 5.878-3.947 9.072-9.142 9.072-5.195 0-9.142-3.092-9.142-9.072 0-5.877 3.947-9.097 9.142-9.097Zm0 14.208c3.08 0 5.347-1.686 5.347-5.11 0-3.502-2.266-5.137-5.347-5.137-3.082 0-5.348 1.584-5.348 5.136 0 3.553 2.266 5.111 5.348 5.111ZM97.069 14.573a.454.454 0 0 1 .422-.312h3.231c.251 0 .449.217.411.466-.576 3.738-3.96 6.331-8.73 6.331-5.118 0-9.014-3.092-9.014-9.072 0-5.877 3.896-9.097 9.015-9.097 4.767 0 8.243 2.755 8.739 6.367a.406.406 0 0 1-.411.456h-3.245a.45.45 0 0 1-.42-.307c-.61-1.732-1.942-2.555-4.663-2.555-3.056 0-5.17 1.584-5.17 5.136 0 3.553 2.114 5.111 5.17 5.111 2.8 0 4.115-.947 4.665-2.524ZM117.903 3.195c.37 0 .565.441.317.717l-6.352 7.048a.429.429 0 0 0-.027.542l6.522 8.873a.429.429 0 0 1-.344.683h-3.778a.427.427 0 0 1-.342-.171l-4.678-6.26a.427.427 0 0 0-.66-.029l-2.242 2.505a.428.428 0 0 0-.11.287v3.24a.428.428 0 0 1-.427.428h-3.016a.428.428 0 0 1-.427-.428V3.599c0-.237.191-.43.427-.43h3.016c.236 0 .427.193.427.43v6.694c0 .391.48.578.743.289l6.592-7.247a.426.426 0 0 1 .315-.14h4.044ZM119.498 3.599c0-.237.191-.43.427-.43h13.788c.236 0 .427.193.427.43v2.669a.428.428 0 0 1-.427.428h-9.917a.429.429 0 0 0-.428.43v2.822c0 .236.192.428.428.428h9.917c.236 0 .427.192.427.43v2.643a.428.428 0 0 1-.427.428h-9.917a.429.429 0 0 0-.428.43v2.77c0 .237.192.43.428.43h9.917c.236 0 .427.191.427.428v2.695a.428.428 0 0 1-.427.428h-13.788a.428.428 0 0 1-.427-.428V3.599ZM143.253 3.17c7.537 0 8.785 5.52 8.785 8.97 0 3.45-1.35 8.918-8.785 8.918h-7.241a.425.425 0 0 1-.424-.428V3.599c0-.237.191-.43.427-.43h7.238Zm0 14.362c3.972 0 4.761-3.476 4.761-5.392 0-2.02-.763-5.418-4.761-5.418h-3.368a.428.428 0 0 0-.427.429v9.952c0 .237.191.429.427.429h3.368Z"></path></svg>
                                </div>
                                
                                <div className=' hover:border-white flex justify-center items-center cursor-pointer' onClick={() => {
                setIsSideBar(!isSideBar);
            }}>
                                    <MdClose className='text-white' style={{ fontSize: '20px' }}/>
                                </div>
                            </div>
                            <div className='flex flex-col items-start gap-4 mx-4 mt-4'>
                                <div className='flex  border-2  hover:border-white bg-trasparent py-2  text-white w-full rounded-md  gap-4 items-center px-2' style={{ border: '1px solid #71827f' }}>
                                    <CiSearch className='' style={{ fontSize: '20px', color: '#71827f' }}/>
                                    <input className='text-white bg-transparent outline-none border-none placeholder:font-bold' placeholder='Search'/>
                                </div>
                                <div className='flex  bg-white w-full text-black justify-center items-center py-2 px-7 rounded-md text-sm font-semibold cursor-pointer' style={{ boxShadow: 'rgba(255, 255, 255, 0.25) 0px 50px 100px -20px, rgba(255, 255, 255, 0.3) 0px 63px 60px -50px' }} onClick={() => { setModelOpen(true); }}>
                                    Log In
                                </div> 
                                <div className='flex items-center gap-3 rounded-md  p-1 cursor-pointer'>
                                    <HiOutlineQuestionMarkCircle className='text-white font-bold' style={{ fontSize: '23px' }}/> <div className='text-white font-semibold'>Support</div>  
                                </div>
                            </div>
                        </div>
                        <div className='mb-16 flex gap-5 flex-col justify-center items-center '>
                            <div className='flex gap-4 '>
                                <div className='text-white p-3 hover:bg-slate-800 rounded-md' style={{ backgroundColor: '#2f2f32' }}>
                                    <BiLogoTelegram size={24}/>
                                </div>
                                <div className='text-white p-3 hover:bg-slate-800 rounded-md' style={{ backgroundColor: '#2f2f32' }}>
                                    <FaDiscord size={24} className='text-blue-700'/>
                                </div>
                                <div className='text-white p-3 hover:bg-slate-800 rounded-md' style={{ backgroundColor: '#2f2f32' }}>
                                    <FaXTwitter size={24}/>
                                </div>
                            </div>
                            <div className=' text-gray-700 text-center max-w-24 text-sm font-semibold'>
                               Your ultimate destination for a more meaningful and rewarding Web3 experience
                            </div>
                        </div>
                    </div>    
                </div>)}
        <LoginModel isOpen={isModelOpen} onClose={() => setModelOpen(false)}/>
        <Sidebar isOpen={isSideBarOpen} onClose={() => setSideBarOpen(false)}/>
    </div>);
};
export default ContestNavbar;
