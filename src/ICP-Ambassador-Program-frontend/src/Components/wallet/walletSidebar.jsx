import React from 'react'
import { MdClose } from "react-icons/md";
import { MdOutlineArrowRightAlt } from "react-icons/md";
const WalletSidebar = ({onClose, isOpen}) => {
   
  return (

    <div
    className={`fixed top-0 right-0 w-96 h-full my-3 bg-white shadow-lg p-6 z-50 transition-transform duration-500 ease-in-out transform overflow-y-auto scrollbar-hide  ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}
>
    <div className='flex justify-end'>
        <button onClick={onClose} className=' hover:bg-black hover:text-white rounded-full h-9 w-9 flex justify-center items-center cursor-pointer'>
            <MdClose className='text-black  hover:text-white' style={{ fontSize: '20px' }} />
        </button>
    </div>
    <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col gap-5 justify-center items-center mt-8'>
            <div className='font-semibold text-3xl'>Wallet ID</div>
            <div className='bg-black text-white font-semibold py-2 w-full rounded flex justify-center items-center'>Connect wallet</div>
        </div>
        <div className='flex flex-col ml-8 gap-10 mt-16'>
                <div className='flex flex-col gap-5'>
                    <div className='text-md font-semibold '>Total Points Earned : 150</div>
                    <div className='text-md font-semibold '>Redeembale Points : 50</div>
                </div>
                <div className='flex text-sm items-center gap-2 text-[#7064f5] font-semibold' >
                    <div>Conversion rate of your hub : 100p </div>
                    <MdOutlineArrowRightAlt/> 
                    <div>0.6 ICP</div>
                </div>
                <div className='border py-3 w-full border-gray-300 hover:bg-black hover:text-white cursor-pointer font-semibold text-sm flex justify-center items-center rounded'>Enter amount of points to be withdrawed</div>
                <div className=' py-3 w-full  bg-black text-white cursor-pointer font-semibold text-sm flex justify-center items-center rounded'>Withdraw amount</div>
                
            
        </div>
   </div> 
    
</div>
  )
}

export default WalletSidebar 