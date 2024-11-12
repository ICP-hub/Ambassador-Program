import React, { useEffect, useState } from 'react';
// import upload_background from '../../../assets/images/upload_background.png';
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
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const ItemTypes = {
    TASK: 'task',
};
const DraggableTask = ({ task, index, moveTask, onDelete, handleUpdateTaskField }) => {
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
    return (<div ref={(node) => ref(drop(node))} className="mb-2 flex gap-3 items-start p-2">
      <IconButton style={{ cursor: 'grab', padding: 0 }} ref={ref}>
        <DragIndicatorIcon />
      </IconButton>
  
      {task.type === 'API' && (<ApiTask task={task} onDelete={() => onDelete(task.id)} onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}/>)}
      {task.type === 'Image' && (<ImageTask task={task} onDelete={() => onDelete(task.id)} onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}/>)}
      {task.type === 'SendURL' && (<SendURL task={task} onDelete={() => onDelete(task.id)} onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}/>)}
    </div>);
};
const MissionEdit = () => {
    const actor = useSelector(state => state.actor.value);
    const mission = useSelector(state => state.mission.value);
    const timezone = 'Asia/Calcutta';
    const [logoImage, setLogoImage] = useState(null);
    const [startDate, setStartDate] = useState(moment().tz(timezone));
    const [endDate, setEndDate] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState(mission?.title);
    const [isPrivate, setIsPrivate] = useState(false);
    const [missionType, setMissionType] = useState('');
    const [space, setSpace] = useState([]);
    const [description, setDescription] = useState(mission?.description);
    const [rewardsData, setRewardsData] = useState([]);
    const [participantsCount, setParticipantsCount] = useState('');
    const nav = useNavigate();
    const handlesave = async () => {
        const draft_data = {
            Title: title,
            Image: logoImage,
            tasks: tasks,
            Start_Date: startDate,
            End_Date: endDate,
            Selected_Space: space,
            Description: description,
            Reward_data: rewardsData,
            participants_count: participantsCount
        };
        console.log("data ==>", draft_data, mission, actor);
        const updatedMission = { ...mission, title: title, description: description, status: { Active: null } };
        console.log("final updated mission : ", updatedMission);
        const res = await actor?.backendActor?.edit_mission(updatedMission);
        console.log(res);
        if (res != null && res != undefined && res?.Err == undefined) {
            alert('Mission updated successfully');
            nav('/');
        }
    };
    useEffect(() => {
        if (mission?.mission_id == undefined) {
            nav('/');
        }
        console.log(mission, "mission", actor);
    }, [mission]);
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
    const handleUpdateTaskField = (field, value, taskId) => {
        //console.log(taskId,field,value)
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) => task.id === field ? { ...task, [value]: taskId } : task);
            // console.log(`Updated Task ID: ${taskId}, Field: ${field}, New Value: ${value}`);
            // console.log('Updated Task:', updatedTasks.find(task => task.id === field));
            return updatedTasks;
        });
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
    const sampleSearchFunction = async (input) => {
        const sampleSpaces = [
            { id: '1', name: 'Space Alpha' },
            { id: '2', name: 'Space Beta' },
            { id: '3', name: 'Space Gamma' },
            { id: '4', name: 'Space Delta' },
            { id: '5', name: 'Space Epsilon' },
        ];
        return sampleSpaces.filter((space) => space.name.toLowerCase().includes(input.toLowerCase()));
    };
    const handleSelectedCohosts = (selectedCohosts) => {
        //console.log("Selected Cohosts:", selectedCohosts);
        setSpace(selectedCohosts);
    };
    const handleDescriptionChange = (newDescription) => {
        setDescription(newDescription);
    };
    const handleRewardsChange = (updatedRewards) => {
        setRewardsData(updatedRewards);
        //console.log('Updated Rewards:', updatedRewards);
    };
    const handleParticipantsChange = (updatedParticipantsCount) => {
        setParticipantsCount(updatedParticipantsCount);
        //console.log('Updated Participants Count:', updatedParticipantsCount);
    };
    return (<DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-center mx-auto mb-3">
        <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="w-5/6">
          <div className="mt-4 w-full ">
            <div className="text-xl font-medium">Mission Image</div>
            <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-80 mx-auto">
              {logoImage ? (<img src={logoImage} alt="Uploaded" className="object-contain h-full w-full"/>) : (<img src={'upload_background.png'} alt="" className="w-80"/>)}
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

          {/* <AutocompleteSearchInput
          searchFunction={sampleSearchFunction}
         
          label="Type space name for adding a cohost"
          isMultiple={true}
          onSelected={handleSelectedCohosts}
        /> */}

          <FormControl>
            {/* <TextField label="Current status"  /> */}
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <SortDescription value={description} onChange={handleDescriptionChange}/>
          </FormControl>

          <FormControl>
            <FormControlLabel control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} sx={{ flexDirection: 'row-reverse', gap: 1, alignItems: 'center' }}/>} label="Private (accessible only via direct link)"/>
          </FormControl>

          <FormControl>
            <FormLabel>Mission type</FormLabel>
            <RadioGroup row value={missionType} onChange={(e) => setMissionType(e.target.value)}>
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

          <Rewards onRewardsChange={handleRewardsChange} onParticipantsChange={handleParticipantsChange}/>
          <div className=''>
            {tasks.length > 0 && (<div className="text-4xl border-b-2 border-gray-300 mb-4 py-2">Tasks</div>)}
            
            {tasks.map((task, index) => (<DraggableTask key={task.id} index={index} task={task} moveTask={moveTask} onDelete={handleDeleteTask} handleUpdateTaskField={handleUpdateTaskField}/>))}
          </div>
          
          <div className='flex justify-between'>
            <Button variant="outlined" className="w-44 mt-2 mb-5" onClick={handleTaskbar}>
              ADD TASK
            </Button>
            <Button variant="contained" onClick={handlesave}>Save</Button>
          </div>
          

          <TaskSidebar open={isSidebarOpen} onClose={handleCloseSidebar} onSelectTask={handleAddTask}/>
        </FormControl>
      </div>
    </DndProvider>);
};
export default MissionEdit;
