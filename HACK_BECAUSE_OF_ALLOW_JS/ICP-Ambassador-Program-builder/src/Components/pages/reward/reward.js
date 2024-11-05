import React, { useState } from 'react';
import { MenuItem, Select, FormControl, TextField, Box, Typography, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const handleAddReward = () => {
        setRewards([...rewards, { tokenAmount: '', rewardType: '' }]);
    };
    const handleRemoveReward = (index) => {
        setRewards(rewards.filter((_, i) => i !== index));
    };
    const handleRewardChange = (index, field, value) => {
        const updatedRewards = [...rewards];
        updatedRewards[index][field] = value;
        setRewards(updatedRewards);
    };
    return (<div className='flex flex-col gap-3 w-full mt-4 mb-4'>
      <Typography variant='h4'>Rewards</Typography>
      <FormControl className='flex gap-3'>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} gap={2}>
          <Box>Amount of participants</Box>
          <TextField label='How many participants will be rewarded?' size='small' style={{ fontSize: '10px' }}/>
        </Box>
      </FormControl>
      

      
      {rewards.map((reward, index) => (<Box key={index} display='flex' alignItems='center' gap={1} mb={2}>
          <Box display='flex' flexDirection='column' flex='1'>
            <Box display='flex' alignItems='center' gap={2} flexWrap='wrap'>
              <Typography>Reward per participant: </Typography>
              <TextField size='small' label='Token amount' value={reward.tokenAmount} onChange={(e) => handleRewardChange(index, 'tokenAmount', e.target.value)}/>
              <Select size='small' value={reward.rewardType} onChange={(e) => handleRewardChange(index, 'rewardType', e.target.value)}>
                <MenuItem value='Type1'>Type 1</MenuItem>
                <MenuItem value='Type2'>Type 2</MenuItem>
                <MenuItem value='Type3'>Type 3</MenuItem>
              </Select>
            </Box>
          </Box>
          <IconButton onClick={() => handleRemoveReward(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>))}
      <Button variant='outlined' className='w-full mt-2' onClick={handleAddReward}>
        Add reward
      </Button>
    </div>);
};
export default Rewards;
