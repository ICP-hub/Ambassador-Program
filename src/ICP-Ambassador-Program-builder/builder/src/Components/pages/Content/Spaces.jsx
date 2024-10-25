import React, { useState } from 'react';
import RichTextEditor from './TextEditor';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Spaces = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chain, setchain] = useState('');

  const handleChange = (event) => {
    setchain(event.target.value);
  };
 
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <div className='flex justify-between items-center p-16'>
        <div className='text-4xl font-medium'>Spaces</div>
        <div
          className='bg-black text-white font-semibold shadow-md text-sm rounded py-2 px-6 flex justify-center cursor-pointer items-center hover:bg-blue-700'
          onClick={handleModalToggle}
        >
          CREATE SPACE
        </div>
      </div>

      
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-10'>
          <div className='bg-white p-8 rounded-md shadow-lg max-w-lg w-full'>
            <h2 className='text-2xl font-semibold mb-4'>Create space</h2>

            
            <div className='space-y-4'>
              
              <div>
                <label className='block text-sm font-medium text-gray-700'>Space name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3
                            placeholder-gray-500
                            hover:border-black
                            focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Space name..."
                />

              </div>

              
              <div>
                <label className='block text-sm font-medium text-gray-700'>Space slug</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 
                            placeholder-gray-500
                            hover:border-black
                            focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Slug with lowercase, e.g. blocked"
                />
                <p className='text-sm text-gray-500'>
                  Will be used as URL, e.g. https://app.blocked.cc/blocked
                </p>
              </div>

              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Space chain type</label>
                <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={chain}
          label="chain"
          onChange={handleChange}
        >
          <MenuItem value={'cosmos'}>Cosmos</MenuItem>
          <MenuItem value={'EVM'}>EVM</MenuItem>
          <MenuItem value={'polkadot'}>PolkaDot</MenuItem>
          <MenuItem value={'Solana'}>Solana</MenuItem>
        </Select>
      </FormControl>
                <p className='text-sm text-gray-500'>Please select what type is used by this chain</p>
              </div>

             
              <div>
                
                <RichTextEditor/>
              </div>
            </div>

            {/* Buttons */}
            <div className='flex justify-end space-x-2 mt-6'>
              <button
                className='bg-gray-300 text-black py-2 px-4 rounded-md'
                onClick={handleModalToggle}
              >
                Cancel
              </button>
              <button className='bg-blue-600 text-white py-2 px-4 rounded-md'>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spaces;
