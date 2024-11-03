import React,{useState,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import ContestNavbar from '../Navbar/ContestNavbar';
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineArrowOutward } from "react-icons/md";

const CardDetails = () => {
  const location = useLocation();
  const { contest } = location.state || {};
  console.log(location)
  if (!contest) {
    return <p className='text-white'>No contest data available</p>;
  }

  const getRandomDarkColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 6)]; // Limiting to the first 6 hex digits for darker colors
    }
    return color;
  };
  

  const [randomColor, setRandomColor] = useState('#000000'); // Default to black

  useEffect(() => {
    setRandomColor(getRandomDarkColor()); // Set a random color when the component mounts
  }, []);

  const { reward, status, title, image, social_platforms, icons } = contest;

  return (
    <div style={{
        background: `linear-gradient(to bottom, ${randomColor}, transparent)`,
        
      }}
      className="h-full pt-3" >
      <ContestNavbar />
      <div className='flex justify-center items-center ml-20 '>
      <div className=' flex flex-col gap-16 justify-start items-start  w-3/4 mt-10 h-full ' >
        <div className="flex items-center justify-center  gap-10">
            <div>
                <div className="mb-4">
                {image ? (
                    <img src={image} alt={title} className="w-44 h-44 object-cover rounded-lg" />
                ) : (
                    <div className="w-20 h-20 bg-gray-700 flex items-center justify-center rounded">
                    <span>No Image</span>
                    </div>
                )}
                </div>
            </div>
            <div className='flex flex-col gap-4 justify-start items-start'>
                <div className='font-bold text-sm' style={{
                        color:status ==='Active' ? '#1db851' : status === 'Draft' ? '#b8b8b8': '#e20203'
                    }}>{status}</div>
                <div>
                    <div className='text-white text-xl font-bold'>{title}</div>
                </div>
                <div className="flex items-center gap-3 ">
                    <img src={icons.platform_logo} alt={icons.platform} className="w-8 h-4 rounded-full" />
                    <span className="text-md text-white font-semibold">{icons.platform}</span>
                </div>
                <div className=" font-semibold text-gray-600 text-sm">
                    2024/10/09 04:30 - 2024/10/11 04:30 GMT +03:00
                </div>
            </div>    
        </div>
        <div className='w-full flex flex-col gap-6 overflow-y-auto mb-5'>
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}}>
  
            <div 
                className='relative rounded-lg'
                style={{
                borderTop: `2px solid ${randomColor}`,   
                borderLeft: `2px solid ${randomColor}`,  
                borderRight: `2px solid ${randomColor}`, 
                borderBottom: 'none',                    
                borderRadius: '0.5rem', 
                
                }}
            >
                <div className='p-3 flex justify-between'>
                    <div className='flex gap-4 items-center '>
                        <div 
                            className='h-6 w-6 rounded-full flex justify-center items-center' 
                            style={{
                            backgroundColor: '#1dc0f2'
                            }}
                        >
                            <FaXTwitter className='text-white' />
                        </div>
                        <div className='text-white font-semibold text-lg'>Follow us</div>
                    </div>
                    <div className='h-6 w-6 rounded-full' style={{backgroundColor:'#29292c'}}>

                    </div>  
                </div>
                
                <div className='flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3 '>
                    Follow <MdOutlineArrowOutward className='ml-3' size={24} />
                </div>
            </div>  
        </div>
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}}>
  
            <div 
                className='relative rounded-lg'
                style={{
                borderTop: `2px solid ${randomColor}`,   
                borderLeft: `2px solid ${randomColor}`, 
                borderRight: `2px solid ${randomColor}`, 
                borderBottom: 'none',                    
                borderRadius: '0.5rem', 
                
                }}
            >
                <div className='p-3 flex justify-between'>
                    <div className='flex gap-4 items-center '>
                        <div 
                            className='h-6 w-6 rounded-full flex justify-center items-center' 
                            style={{
                            backgroundColor: '#1dc0f2'
                            }}
                        >
                            <FaXTwitter className='text-white' />
                        </div>
                        <div className='text-white font-semibold text-lg'>Follow ICP Hubs Network</div>
                    </div>
                    <div className='h-6 w-6 rounded-full' style={{backgroundColor:'#29292c'}}>

                    </div>  
                </div>
                <div className='flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3'>
                    Follow <MdOutlineArrowOutward className='ml-3' size={24} />
                </div>
            </div>  
        </div>
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}}>
  
            <div 
                className='relative rounded-lg'
                style={{
                borderTop: `2px solid ${randomColor}`,   
                borderLeft: `2px solid ${randomColor}`,  
                borderRight: `2px solid ${randomColor}`, 
                borderBottom: 'none',                    
                borderRadius: '0.5rem',
                
                }}
            >
                <div className='p-3 flex justify-between'>
                    <div className='flex gap-4 items-center '>
                        <div 
                            className='h-6 w-6 rounded-full flex justify-center items-center' 
                            style={{
                            backgroundColor: '#1dc0f2'
                            }}
                        >
                            <FaXTwitter className='text-white' />
                        </div>
                        <div className='text-white font-semibold text-lg'>Follow WaterNeuron</div>
                    </div>
                    <div className='h-6 w-6 rounded-full' style={{backgroundColor:'#29292c'}}>

                    </div>  
                </div>
                <div className='flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3'>
                    Follow <MdOutlineArrowOutward className='ml-3' size={24} />
                </div>
            </div>   
        </div>
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}} >
  
            <div 
                className='relative rounded-lg'
                style={{
                borderTop: `2px solid ${randomColor}`,   
                borderLeft: `2px solid ${randomColor}`,  
                borderRight: `2px solid ${randomColor}`, 
                borderBottom: 'none',                    
                borderRadius: '0.5rem', 
                
                }}
            >
                <div className='flex p-3 justify-between'>
                    
                    
                    <div className='text-white font-semibold text-lg'>Register on Luma</div>
                    <div className='h-6 w-6 rounded-full' style={{backgroundColor:'#29292c'}}>

                    </div> 
                </div>
                
                <div className='flex justify-center items-center max-w-full rounded bg-white text-sm font-semibold h-9 m-3' style={{backgroundColor:'#303033',color:'#5f5d5c'}}>
                    Register 
                </div>
            </div>   
        </div>
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}} >
  
            <div 
                className='relative rounded-lg'
                style={{
                borderTop: `2px solid ${randomColor}`,   
                borderLeft: `2px solid ${randomColor}`,  
                borderRight: `2px solid ${randomColor}`, 
                borderBottom: 'none',                   
                borderRadius: '0.5rem',
                }}
            >
                <div className='flex p-3 justify-between'>
                    
                    
                    <div className='text-white font-semibold text-lg'>Submit your attedance</div>
                    <div className='h-6 w-6 rounded-full' style={{backgroundColor:'#29292c'}}>

                    </div> 
                </div>
                <div className='flex justify-center items-center max-w-full rounded bg-white text-sm font-semibold h-9 m-3' style={{backgroundColor:'#303033',color:'#5f5d5c'}}>
                    Submit
                </div>
            </div>   
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CardDetails;
