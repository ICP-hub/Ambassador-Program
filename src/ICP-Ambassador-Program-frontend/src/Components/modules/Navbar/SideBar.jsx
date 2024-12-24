import React from 'react';
import { MdClose } from "react-icons/md";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-20 right-0 h-full w-96  shadow-lg transform transition-transform duration-700 delay-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{backgroundColor:'#1d1d21'}}>
      <div className="p-4">
        <div className='flex justify-between m-3'>
          <h3 className="text-lg text-white font-semibold">Notifications</h3>
          <div
            className='w-7 h-7 rounded-full border-2 border-gray-500 hover:border-white flex justify-center items-center cursor-pointer'
            onClick={onClose}
          >
            <MdClose className='text-white' style={{ fontSize: '20px' }} />
          </div>
        </div>
        <p className='text-white'>No new notifications</p>
      </div>
    </div>
  );
};

export default Sidebar;
