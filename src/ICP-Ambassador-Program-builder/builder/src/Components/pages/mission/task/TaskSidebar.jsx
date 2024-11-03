// TaskSidebar.js
import React from 'react';
import { Drawer, Box, IconButton, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ApiIcon from '@mui/icons-material/Api';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SendIcon from '@mui/icons-material/Send';
const tasks = [
  { name: 'API Task', type: 'API', icon: <ApiIcon />, color: '#3f51b5' },
  { name: 'Image Task', type: 'Image', icon: <InsertPhotoIcon />, color: '#008bb9' },
  { name: 'SendURL Task', type: 'SendURL', icon: <SendIcon />, color: '#1da1f2' },
];

const TaskSidebar = ({ open, onClose, onSelectTask }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '300px',
          padding: 2,
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Task</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box mt={2}>
          <Typography variant="body1">Task Details</Typography>
          <List>
            {tasks.map((task, index) => (
              <ListItem button key={index} onClick={() => onSelectTask(task.type)} className='cursor-pointer hover:bg-green-50 hover:scale-105'>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: task.color }}>
                    {task.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={task.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default TaskSidebar;
