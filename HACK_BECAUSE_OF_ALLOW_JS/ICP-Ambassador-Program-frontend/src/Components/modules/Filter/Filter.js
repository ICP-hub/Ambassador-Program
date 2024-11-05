import React, { useState } from 'react';
import { IoChevronUpOutline, IoChevronDownOutline, IoRadioButtonOff } from 'react-icons/io5';
import { FaCheck } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { BiLogoTelegram } from "react-icons/bi";
import { FaFileUpload } from "react-icons/fa";
import { useFilterContext } from '../../Context/FilterContext';
const Filter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSort, setIsOpenSort] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('');
    const { setSelectedPlatform } = useFilterContext();
    const [checkedItems, setCheckedItems] = useState({
        Twitter: false,
        Api: false,
        Discord: false,
        Telegram: false,
        Transaction: false,
        Upload: false,
        new: false,
        inProgress: false,
        collectable: false,
        completed: false,
    });
    const toggleFilter = () => {
        setIsOpen(!isOpen);
    };
    const toggleSort = () => {
        setIsOpenSort(!isOpenSort);
    };
    const handleBoxClick = (id) => {
        setCheckedItems((prev) => {
            const updatedItems = { ...prev, [id]: !prev[id] };
            const selectedPlatforms = [];
            for (const key in updatedItems) {
                if (updatedItems[key]) {
                    selectedPlatforms.push(key);
                }
            }
            if (selectedPlatforms.length > 0) {
                setSelectedPlatform(selectedPlatforms.join(', '));
            }
            else {
                setSelectedPlatform('');
            }
            return updatedItems;
        });
    };
    const handleRadioChange = (value) => {
        setSelectedRadio(value);
    };
    return (<div className='h-full '>
      <div className="overflow-hidden h-full">
        <div className="p-2 mt-4 rounded-lg shadow-lg w-52" style={{ backgroundColor: '#1d1d21' }}>
          <div className="flex justify-between items-center cursor-pointer" onClick={toggleFilter}>
            <h3 className="text-white text-md font-semibold">Filter</h3>
            {isOpen ? (<IoChevronUpOutline className="text-white" style={{ fontSize: '20px' }}/>) : (<IoChevronDownOutline className="text-white" style={{ fontSize: '20px' }}/>)}
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="max-h-60 overflow-y-auto scrollbar-hide"> 
              <ul className="mt-4 space-y-4">
                {renderBox('Twitter', 'Twitter', <FaXTwitter />)}
                {renderBox('Api', 'Api', <GrTransaction />)}
                {renderBox('Discord', 'Discord', <FaDiscord />)}
                {renderBox('Telegram', 'Telegram', <BiLogoTelegram />)}
                {renderBox('Transaction', 'Transaction', <GrTransaction />)}
                {renderBox('Upload', 'Upload', <FaFileUpload />)}
              </ul>
            </div>

            <hr className="border-gray-700 my-4"/>

            <ul className="space-y-4">
              {renderBox('new', 'New')}
              {renderBox('inProgress', 'In progress')}
              {renderBox('collectable', 'Collectable')}
              {renderBox('completed', 'Completed')}
            </ul>

            <button className="w-full mt-4 bg-transparent border-2 border-gray-600 hover:border-white text-white py-2 rounded-lg">
              Clear All
            </button>
          </div>
        </div>

        <div className="p-2 mt-4 rounded-lg shadow-lg w-52" style={{ backgroundColor: '#1d1d21' }}>
          <div className="flex justify-between items-center cursor-pointer" onClick={toggleSort}>
            <h3 className="text-white text-md font-semibold">Sort</h3>
            {isOpenSort ? (<IoChevronUpOutline className="text-white" style={{ fontSize: '20px' }}/>) : (<IoChevronDownOutline className="text-white" style={{ fontSize: '20px' }}/>)}
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpenSort ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="max-h-60 overflow-y-auto scrollbar-hide"> 
              <ul className="mt-4 space-y-4">
                
                {radiobutton('profitability', 'Profitability')}
                {radiobutton('recent', 'Recent deployed')}
                {radiobutton('time', 'Time remaining')}
              </ul>
            </div>
            <button className="w-full mt-4 bg-transparent border-2 border-gray-600 hover:border-white text-white py-2 rounded-lg">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>);
    function renderBox(id, label, icon) {
        return (<li className="flex items-center space-x-3 cursor-pointer" onClick={() => handleBoxClick(id)}>
        <div className={`w-5 h-5 flex items-center justify-center border border-gray-400 rounded-md transition-all duration-300 ${checkedItems[id] ? 'bg-white' : 'bg-transparent'}`}>
          {checkedItems[id] && <FaCheck className="text-black" style={{ fontSize: '10px' }}/>}
        </div>

        {icon && <div className={`text-md ${checkedItems[id] ? 'text-white' : 'text-gray-400'}`}>{icon}</div>}
        <span className={`text-sm ${checkedItems[id] ? 'text-white' : ''}`} style={{ color: checkedItems[id] ? 'white' : '#71827f' }}>
          {label}
        </span>
      </li>);
    }
    function radiobutton(id, label) {
        return (<li className="flex items-center cursor-pointer" onClick={() => handleRadioChange(id)}>
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 cursor-pointer transition-all duration-300 ${selectedRadio === id ? 'border-white bg-white' : 'border-gray-400'}`}>
          {selectedRadio === id && <div className="w-2 h-2 rounded-full bg-black mx-auto"/>} 
        </div>
        <span className={`text-sm ${selectedRadio === id ? 'text-white' : 'text-gray-600'}`}>
          {label}
        </span>
      </li>);
    }
};
export default Filter;
