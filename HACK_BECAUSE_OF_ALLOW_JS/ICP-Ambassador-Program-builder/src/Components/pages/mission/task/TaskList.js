import React, { useState } from 'react';
import { Box, TextField, FormControl, FormLabel, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SortDescription from '../../Content/sortDescription';
import upload_background from '../../../../assets/images/upload_background.png';
const ApiTask = ({ onDelete }) => {
    const [validationInput, setValidationInput] = useState('');
    const [validationError, setValidationError] = useState(false);
    const [apiTitle, setApiTitle] = useState('');
    const maxLen = 50;
    const validationRegex = /^[a-zA-Z0-9]*$/; // Example regex allowing alphanumeric characters
    const handleValidationChange = (event) => {
        const value = event.target.value;
        if (value.length <= maxLen && (validationRegex.test(value) || value === '')) {
            setValidationInput(value);
            setValidationError(false);
        }
        else {
            setValidationError(true);
        }
    };
    return (<Box className="flex flex-col gap-3 border border-gray-300 p-3 rounded w-full">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" className="border-b-2 border-black">API Task</Typography>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <TextField label="Task title" placeholder="Title..." size="small" onChange={(e) => { setApiTitle(e.target.value); }}/>
      <TextField label="Validation" placeholder="validation..." size="small" value={validationInput} onChange={handleValidationChange} error={validationError} helperText={validationError ? 'Invalid format' : `${validationInput.length}/${maxLen} characters`}/>
      <TextField label="Sample" placeholder="Sample..." size="small"/>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <SortDescription />
      </FormControl>
    </Box>);
};
const ImageTask = ({ onDelete }) => {
    const [logoImage, setLogoImage] = useState(null);
    const [imageTitle, setImageTitle] = useState('');
    const [imageDescription, setImageDescription] = useState('');
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (<Box className="flex flex-col gap-3 border border-gray-300 p-3 rounded w-full">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" className="border-b-2 border-black">Image Task</Typography>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-80 mx-auto">
        {logoImage ? (<img src={logoImage} alt="Uploaded" className="object-contain h-full w-full"/>) : (<img src={upload_background} alt="Upload background" className="w-80"/>)}
        <div>Drag file here or</div>
        <label className="mt-4 w-full bg-blue-500 rounded">
          <input type="file" className="hidden" onChange={handleFileChange}/>
          <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-sky-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
            BROWSE
          </div>
        </label>
      </div>
      <TextField label="Task Title" placeholder="title..." size="small" onChange={(e) => { setImageTitle(e.target.value); }}/>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <SortDescription />
      </FormControl>
    </Box>);
};
const SendURL = ({ onDelete }) => {
    const [sendTitle, setSendTitle] = useState('');
    const [sendDescription, setSendDescription] = useState('');
    return (<Box className="flex flex-col gap-3 border border-gray-300 p-3 rounded w-full">
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Typography variant="body1" className="border-b-2 border-black">Send URL</Typography>
      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
    <TextField label="Task title" placeholder="Title..." size="small" onChange={(e) => { setSendTitle(e.target.value); }}/>
    <FormControl>
      <FormLabel>Description</FormLabel>
      <SortDescription />
    </FormControl>
  </Box>);
};
export { ApiTask, ImageTask, SendURL };
