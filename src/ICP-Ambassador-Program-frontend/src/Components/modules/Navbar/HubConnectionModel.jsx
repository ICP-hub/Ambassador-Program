import React, { useState,useEffect } from 'react';
import {ICP_Ambassador_Program_backend} from '../../../../../declarations/ICP_Ambassador_Program_backend'
import { Principal } from '@dfinity/principal';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { DISCORD_CLIENT_SECRET } from '../../auth/authdata';
import axios from 'axios';
const HubConnectionModal = ({ isOpen, onClose,spaces,setLoading }) => {
    console.log("Spaces ==>",spaces)
    const [referralCode, setReferralCode] = useState('');
    const [selectedHub, setSelectedHub] = useState([]);
    const [verified,setVerified] = useState(false)
    const [joined,setJoined]=useState(false)
    const [verifying,setVerifying]=useState(false)
    const url="https://bondex.kaifoundry.com/api/icp/v1"
    async function verifyGuildJoined(){
        try {
            setVerifying(true)
            let token=Cookies.get('token')
            // const res=await fetch(`https://discord.com/api/guilds/${guildID}/members/search`, {
            //     headers: {
            //     //   Authorization: `Bearer ${token}`,
            //     Authorization:`Bot ${bot}`
            //     },
            //   });
            //   console.log('res from joinguild : ',await res.json())

            //   if(true){
            //     toast.success("Server member Verified!")
            //     setVerified(true)
            //   }else{
            //     toast.error("You have not joined the server")
            //   }
            const user=Cookies.get('discord_user')
            let user_parsed=JSON.parse(user)
            const res=await axios.get(`${url}/userExists?id=${user_parsed.id}`)
            if(res?.data?.joined){
                setVerifying(false)
                toast?.success("Thanks for joining us")
                setVerified(true)
            }else{
                setVerifying(false)
                toast?.error("Please verify if you have joined correctly")
            }
            console.log(res.data,user_parsed.id)
        } catch (error) {
            console.log('err joining guild',error)
        }
    }

    const handleSubmit = () => {
        
        localStorage.setItem('selectedHub', selectedHub);
        localStorage.setItem('referralCode', referralCode);
        let referrer=Cookies.get("ref")
        const user = JSON.parse(Cookies.get('discord_user'));
        console.log("user ==>",user)
        const user_data={
            discord_id:user.id,
            username:user.username,
            hub:selectedHub,
            referrer_principal: referrer?[referrer]:[]
        }
        console.log(user_data)
        setLoading(true)
        createUserInBackend(user_data);
        
        onClose();
    };

    if (!isOpen) return null;

    const createUserInBackend = async (user_data) => {
        try {
            const { discord_id, username, hub, referrer_principal } = user_data;
            // console.log("passing data ==>",user_data);
            const result = await ICP_Ambassador_Program_backend.create_user(
                discord_id,
                username,
                hub,
                referrer_principal
            );
            console.log("Result  ===>", result);
            Cookies.remove('needReg')
            window?.location?.reload()
        } catch (e) {
            console.log("Error ==>", e);
            setLoading(false)
        }
    };


    const handleSelectChange = (e) => {
        const selectedSpaceId = e.target.value;
    
        const selectedSpaceIds = selectedSpaceId;
        const selectedSpace = spaces.find(space => space.space_id === selectedSpaceId);
        
        
        if (selectedSpace) {
            console.log("Selected ===>",selectedSpace.name)
            Cookies.set('selectedHub', selectedSpaceId);
            Cookies.set('selectedHubName', selectedSpace.name);  
        }
    
        
        setSelectedHub(selectedSpaceIds);
    };
    
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex gap-3 items-center justify-center z-50">
            <div className="text-white font-poppins bg-[#1d1d21] rounded-lg p-6 w-96">
                {
                    !verified?
                    <>
                        <h2 className="text-xl  mb-4">{joined?'Verify if you have joined':'Join Ambassador program'}</h2>
                        {
                            !joined?
                            <button className='bg-black text-white px-4 py-2 rounded' onClick={()=>{
                                window.open('https://discord.gg/yRjCXnZkGn')
                                setJoined(true)
                            }} >Join us</button>
                            :
                            <>
                                {
                                    verifying?
                                        <p className='my-2 text-white text-xs font-semibold'>Verification in process...</p>
                                    :
                                        <p className='my-2 text-white text-xs font-semibold'>Please Verify if you have joined our discord</p>
                                }
                                <button disabled={verifying} className='bg-black text-white px-4 py-2 rounded mt-4' onClick={verifyGuildJoined}>Verify</button>
                                
                               
                            </>
                            
                        }
                        
                    </>
                    :
                    <>
                    <h2 className="text-xl font-semibold mb-4">Connect to a Hub</h2>

                    <select
                        value={selectedHub}
                        onChange={handleSelectChange}
                        className="border rounded p-2 w-full mb-4 text-black"
                    >
                        <option value="">Select a Hub</option>
                        {spaces.map(space => (
                            <option key={space.space_id} value={space.space_id}>
                                {space.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end">
                        <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
                            Save
                        </button>
                        <button onClick={onClose} className="ml-2 bg-black px-4 py-2 rounded">
                            Cancel
                        </button>
                    </div>
                    </>
                }
            </div>
        </div>
    );
};

export default HubConnectionModal;
