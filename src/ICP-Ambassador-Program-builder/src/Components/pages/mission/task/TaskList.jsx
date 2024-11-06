import React, { useState } from 'react';
import { Box, TextField, FormControl, FormLabel, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SortDescription from '../../Content/sortDescription';
import upload_background from '../../../../assets/images/upload_background.png';

const ApiTask = ({ task, onDelete, onUpdateField }) => {

  const [validationInput, setValidationInput] = useState(task.validationInput || '');
  const [validationError, setValidationError] = useState(false);
  const [apiTitle, setApiTitle] = useState(task.title || '');
  const [apiDescription, setApiDescription] = useState(task.description || '');
  const [apisample,setApisample]=useState('')
  const maxLen = 50;
  const validationRegex = /^[a-zA-Z0-9]*$/; 

  const handleValidationChange = (event) => {
    const value = event.target.value;
    if (value.length <= maxLen && (validationRegex.test(value) || value === '')) {
      setValidationInput(value);
      setValidationError(false);
      const field='validationInput'
      onUpdateField(field,event.target.value,task.id); 
    } else {
      setValidationError(true);
    }
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;
    setApiTitle(value);
   
    const field='title'
    onUpdateField(field,event.target.value,task.id); 
  };

  const handleSampleChange = (event) => {
    const value = event.target.value;
    setApisample(value);
    const field='Sample'
    onUpdateField(field,event.target.value,task.id); 
  };

  const handleDescriptionChange = (newDescription) => {
    setApiDescription(newDescription);
    const field = 'description';
    onUpdateField(field, newDescription, task.id); 
  };

  return (
    <Box className="flex flex-col gap-3 border border-gray-300 p-3 rounded w-full">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" className="border-b-2 border-black">API Task</Typography>
        <IconButton onClick={() => onDelete(task.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <TextField 
        label="Task title" 
        placeholder="Title..." 
        size="small" 
        value={apiTitle} 
        onChange={handleTitleChange}
      />
      <TextField
        label="Validation"
        placeholder="validation..."
        size="small"
        value={validationInput}
        onChange={handleValidationChange}
        error={validationError}
        helperText={validationError ? 'Invalid format' : `${validationInput.length}/${maxLen} characters`}
      />
      <TextField 
        label="Sample" 
        placeholder="Sample..." 
        size="small" 
        value={apisample} 
        onChange={handleSampleChange}
      />
      <FormControl>
        <FormLabel>Description</FormLabel>
        <SortDescription value={apiDescription} onChange={handleDescriptionChange} /> 
      </FormControl>
    </Box>
  );
};

const ImageTask = ({ task, onDelete, onUpdateField }) => {
  const [logoImage, setLogoImage] = useState(task.logoImage || null);
  const [imageTitle, setImageTitle] = useState(task.title || '');
  const [imageDescription, setImageDescription] = useState(task.description || '');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
        const field='logoImage'
        onUpdateField(field,reader.result,task.id); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (e) => {
    setImageTitle(e.target.value);
    
    const field='title'
    
    onUpdateField(field,e.target.value,task.id); 
  };

  const handleDescriptionChange = (newDescription) => {
    setImageDescription(newDescription);
    const field='description'
    
    onUpdateField(field,newDescription,task.id); 
  };

  return (
    <Box className="flex flex-col gap-3 border border-gray-300 p-3 rounded w-full">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" className="border-b-2 border-black">Image Task</Typography>
        <IconButton onClick={() => onDelete(task.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-80 mx-auto">
        {logoImage ? (
          <img src={logoImage} alt="Uploaded" className="object-contain h-full w-full" />
        ) : (
          <img src={upload_background} alt="Upload background" className="w-80" />
        )}
        <div>Drag file here or</div>
        <label className="mt-4 w-full bg-blue-500 rounded">
          <input type="file" className="hidden" onChange={handleFileChange} />
          <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-sky-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
            BROWSE
          </div>
        </label>
      </div>
      <TextField label="Task Title" placeholder="Title..." size="small" value={imageTitle} onChange={handleTitleChange} />
      <FormControl>
        <FormLabel>Description</FormLabel>
        <SortDescription value={imageDescription} onChange={handleDescriptionChange} />
      </FormControl>
    </Box>
  );
};


const SendURL = ({ task, onDelete, onUpdateField }) => {
  const [sendTitle, setSendTitle] = useState(task.title || '');
  const [sendDescription, setSendDescription] = useState(task.description || '');

  const handleTitleChange = (e) => {
    console.log(task)
    setSendTitle(e.target.value);
    const field='title'
    
    onUpdateField(field,e.target.value,task.id); // Update the parent state
  };

  const handleDescriptionChange = (newDescription) => {
    setSendDescription(newDescription);
    const field='description'
    
    onUpdateField(field,newDescription,task.id); // Update the parent state
  };

  return (
    <Box className="flex flex-col gap-3 border border-gray-300 p-3 rounded w-full">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" className="border-b-2 border-black">Send URL</Typography>
        <IconButton onClick={() => onDelete(task.id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
      <TextField 
        label="Task title" 
        placeholder="Title..." 
        size="small" 
        value={sendTitle} 
        onChange={handleTitleChange} 
      />
      <FormControl>
        <FormLabel>Description</FormLabel>
        <SortDescription value={sendDescription} onChange={handleDescriptionChange} />
      </FormControl>
    </Box>
  );
};


export { ApiTask, ImageTask, SendURL};
