import React, { useState } from 'react';
import upload_background from '../../../assets/images/upload_background.png';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, IconButton } from '@mui/material';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment-timezone';
import SortDescription from '../Content/sortDescription';
import { AutocompleteSearchInput } from '../autoCompleteInputSearch/AutoCompleteSearchInput';
import Rewards from '../reward/reward';
import TaskSidebar from './task/TaskSidebar';
import { ApiTask, ImageTask, SendURL } from './task/TaskList';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
const ItemTypes = {
    TASK: 'task',
};
const DraggableTask = ({ task, index, moveTask, onDelete }) => {
    const [, ref] = useDrag({
        type: ItemTypes.TASK,
        item: { index },
    });
    const [, drop] = useDrop({
        accept: ItemTypes.TASK,
        hover(item) {
            if (item.index !== index) {
                moveTask(item.index, index);
                item.index = index;
            }
        },
    });
    return (<div ref={(node) => ref(drop(node))} className="mb-2 flex gap-3 items-start  p-2">
       <IconButton style={{ cursor: 'grab', padding: 0 }} ref={ref}>
        <DragIndicatorIcon />
      </IconButton>
      {task.type === 'API' && <ApiTask onDelete={() => onDelete(task.id)}/>}
      {task.type === 'Image' && <ImageTask onDelete={() => onDelete(task.id)}/>}
      {task.type === 'SendURL' && <SendURL onDelete={() => onDelete(task.id)}/>}
    </div>);
};
const MissionEdit = () => {
    const timezone = 'Asia/Calcutta';
    const [logoImage, setLogoImage] = useState(null);
    const [startDate, setStartDate] = useState(moment().tz(timezone));
    const [endDate, setEndDate] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
    };
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
    const handleTaskbar = () => {
        setSidebarOpen(true);
    };
    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };
    const handleAddTask = (taskType) => {
        setTasks([...tasks, { type: taskType, id: Date.now() }]);
        setSidebarOpen(false);
    };
    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };
    const moveTask = (fromIndex, toIndex) => {
        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(fromIndex, 1);
        updatedTasks.splice(toIndex, 0, movedTask);
        setTasks(updatedTasks);
    };
    return (<DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-center mx-auto mb-3">
        <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="w-5/6">
          <div className="mt-4 w-full ">
            <div className="text-xl font-medium">Mission Image</div>
            <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-80 mx-auto">
              {logoImage ? (<img src={logoImage} alt="Uploaded" className="object-contain h-full w-full"/>) : (<img src={upload_background} alt="" className="w-80"/>)}
              <div>drag file here or</div>
              <label className="mt-4 w-full bg-blue-500 rounded">
                <input type="file" className="hidden" onChange={handleFileChange}/>
                <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-sky-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
                  BROWSE
                </div>
              </label>
            </div>
          </div>

          <TextField label="Mission title" placeholder="Title..." size="small" onChange={(e) => { setTitle(e.target.value); }}/>

          <AutocompleteSearchInput noOptionsText="No spaces found" label="Type space name for adding a cohost" isMultiple={true}/>

          <FormControl>
            <TextField label="Current status" disabled/>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <SortDescription />
          </FormControl>

          <FormControl>
            <FormControlLabel control={<Checkbox sx={{ flexDirection: 'row-reverse', gap: 1, alignItems: 'center' }}/>} label="Private (accessible only via direct link)"/>
          </FormControl>

          <FormControl>
            <FormLabel>Mission type</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="reward" control={<Radio />} label="Instant reward"/>
              <FormControlLabel value="raffle" control={<Radio />} label="Raffle"/>
            </RadioGroup>
          </FormControl>

          <FormControl className="">
            <Typography variant="body2">Start date</Typography>
            <Box className="flex gap-4 mb-3">
              <DateTime value={startDate} onChange={handleStartDateChange} dateFormat="YYYY-MM-DD" timeFormat="h:mm A" inputProps={{ placeholder: 'Start date...', style: { fontSize: '12px' } }} className="border border-black"/>
              <span style={{ marginLeft: '10px', fontSize: '11px' }} className="font-semibold">
                Timezone: {timezone}
              </span>
            </Box>
          </FormControl>

          <FormControl className="">
            <Typography variant="body2">End date</Typography>
            <Box className="flex gap-4 mb-3">
              <DateTime value={endDate} onChange={handleEndDateChange} dateFormat="YYYY-MM-DD" timeFormat="h:mm A" inputProps={{ placeholder: 'End date...', style: { fontSize: '12px' } }} className="border border-black"/>
              <span style={{ marginLeft: '10px', fontSize: '11px' }} className="font-semibold">
                Timezone: {timezone}
              </span>
            </Box>
          </FormControl>

          <Rewards />
          <div className=''>
            {tasks.length > 0 && (<div className="text-4xl border-b-2 border-gray-300 mb-4 py-2">Tasks</div>)}
            
            {tasks.map((task, index) => (<DraggableTask key={task.id} index={index} task={task} moveTask={moveTask} onDelete={handleDeleteTask}/>))}
          </div>
          
          <div className='flex justify-between'>
            <Button variant="outlined" className="w-44 mt-2 mb-5" onClick={handleTaskbar}>
              ADD TASK
            </Button>
            <Button variant="contained">Save Draft</Button>
          </div>
          

          <TaskSidebar open={isSidebarOpen} onClose={handleCloseSidebar} onSelectTask={handleAddTask}/>
        </FormControl>
      </div>
    </DndProvider>);
};
export default MissionEdit;
