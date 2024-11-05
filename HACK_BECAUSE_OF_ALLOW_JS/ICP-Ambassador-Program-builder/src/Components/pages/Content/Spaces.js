import React, { useState } from 'react';
import RichTextEditor from './TextEditor';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
const Spaces = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [chain, setchain] = useState('');
    const handleChange = (event) => {
        setchain(event.target.value);
    };
    const handleClick = () => {
        setIsClicked(true);
        handleModalToggle();
    };
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };
    const handleSpace = () => {
        navigate('/slug_url/mission');
    };
    return (<div>
      <div className='flex flex-col gap-10 px-16 py-10 h-screen'>
        <div className='flex justify-between items-center '>
          <div className='text-4xl font-medium'>Spaces</div>
          <div className='bg-black text-white font-semibold shadow-md text-sm rounded py-2 px-6 flex justify-center cursor-pointer items-center hover:bg-blue-700' onClick={handleModalToggle}>
            CREATE SPACE
          </div>
        </div>

        <div className="border border-gray-300 bg-[#fbfcff] rounded-lg w-80 h-72 hover:bg-blue-100 transition-colors duration-300 cursor-pointer" onClick={handleSpace}>
               <div className='text-black text-sm font-semibold flex justify-center mx-auto mt-4 w-32 py-3 px-4 rounded-full bg-[#fbfcff] ' style={{ boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px' }}>
                Not visible
               </div>
               <div className='px-3'>
                <div className='text-sm font-bold'>Sample test space</div>
                <div className='text-sm font-semibold text-gray-500'>testing the create space</div>
               </div>
        </div>        
      </div>

      
      
      {isModalOpen && (<div className='fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center  overflow-y-scroll '>
          <div className='bg-white px-8 py-2 rounded-md shadow-lg max-w-lg w-full max-h-fit mt-20 '>
            <h2 className='text-2xl font-semibold mb-4'>Create space</h2>

            
            <div className='space-y-4'>
              
              <div>
                <label className='block text-sm font-medium text-gray-700'>Space name</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3
                            placeholder-gray-500
                            hover:border-black
                            focus:border-blue-500 focus:ring-blue-500" placeholder="Space name..."/>

              </div>

              
              <div>
                <label className='block text-sm font-medium text-gray-700'>Space slug</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 
                            placeholder-gray-500
                            hover:border-black
                            focus:border-blue-500 focus:ring-blue-500" placeholder="Slug with lowercase, e.g. blocked"/>
                <p className='text-sm text-gray-500'>
                  Will be used as URL, e.g. https://app.blocked.cc/blocked
                </p>
              </div>

              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Space chain type</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select</InputLabel>
                  <Select labelId="demo-simple-select-label" id="demo-simple-select" value={chain} label="chain" onChange={handleChange}>
                    <MenuItem value={'cosmos'}>Cosmos</MenuItem>
                    <MenuItem value={'EVM'}>EVM</MenuItem>
                    <MenuItem value={'polkadot'}>PolkaDot</MenuItem>
                    <MenuItem value={'Solana'}>Solana</MenuItem>
                  </Select>
                </FormControl>
                <p className='text-sm text-gray-500'>Please select what type is used by this chain</p>
              </div>

             
              <div>
                
                <RichTextEditor />
              </div>
            </div>

            
            <div className='flex justify-end space-x-2 mt-2'>
            <button className={`${isClicked ? 'bg-blue-200' : 'bg-transparent'} text-blue-500 py-2 px-4 rounded-md transition-colors duration-300`} onClick={handleClick}>
                Cancel
              </button>
              <button className='bg-blue-600 text-white py-2 px-4 rounded-md'>
                Save
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
export default Spaces;
