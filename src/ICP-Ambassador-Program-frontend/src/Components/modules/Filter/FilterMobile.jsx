import React from 'react';
import { MdClose } from "react-icons/md";

const FilterMobile = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-20 right-0 h-full w-96  shadow-lg transform transition-transform duration-700 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{backgroundColor:'#1d1d21'}}>
      <div className="p-4">
        <div className='flex justify-between m-3'>
          <h3 className="text-lg text-white font-semibold">Filter</h3>
          <div
            
            onClick={onClose}
          >
            <MdClose className='text-grey-500' style={{ fontSize: '20px' }} />
          </div>
        </div>
        <p className='text-white'>No new notifications</p>
      </div>
    </div>
  );
};

export default FilterMobile;
