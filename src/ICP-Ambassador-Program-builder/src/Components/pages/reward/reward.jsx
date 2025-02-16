import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  TextField,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";

const Rewards = ({
  spaceBal,
  onRewardsChange,
  onParticipantsChange,
  initialReward,
  pool,
  setPool,
  conv,


  participantsCount,
  setParticipantsCount
}) => {
  const [rewards, setRewards] = useState(initialReward);
  const [rewardPerUser, setRewardPerUser] = useState(pool/participantsCount || 0);

  // const handleAddReward = () => {
  //   const updatedRewards = [...rewards, { tokenAmount: "", rewardType: "" }];
  //   setRewards(updatedRewards);
  //   onRewardsChange(updatedRewards);
  // };

  // const handleRemoveReward = (index) => {
  //   const updatedRewards = rewards.filter((_, i) => i !== index);
  //   setRewards(updatedRewards);
  //   onRewardsChange(updatedRewards);
  // };

  // const handleRewardChange = (index, field, value) => {
  //   const updatedRewards = [...rewards];
  //   updatedRewards[index][field] = value;
  //   setRewards(updatedRewards);
  //   onRewardsChange(updatedRewards);
  // };

  // const handleParticipantsChange = (e) => {
  //   setRewards(e.target.value);
  //   onParticipantsChange(e.target.value);
  // };

  useEffect(() => {
    if (rewardPerUser && participantsCount) {
      setPool(participantsCount * rewardPerUser);
    }
  }, [rewardPerUser, participantsCount])


  return (
    <div className="flex flex-col gap-3 w-full mt-4 mb-4">
      <Typography variant="h4">Rewards</Typography>
      <FormControl className="flex gap-3">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: "30px",
          }}
          gap={2}
        >

          {/* <Box>Amount of reward points per user</Box> */}
          <Box>Total Number of participants</Box>
          <TextField
            // label="How many points will be rewarded?"
            label="How many users will be participate?"
            size="small"
            style={{ fontSize: "10px" }}
            value={participantsCount}
            // onChange={handleParticipantsChange}
            onChange={(e) => setParticipantsCount(e.target.value)}
          />
        </Box>
      </FormControl>
      <FormControl className="flex gap-3">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          gap={2}
        >

          <Box>Reward per participants (in {DEFAULT_CURRENCY})</Box>
          <TextField
            label="How many points will be rewarded?"
            size="small"
            style={{ fontSize: "10px" }}
            // value={pool}
            value={rewardPerUser}
            // onChange={(e) => parseFloat(setPool(e.target.value))}
            onChange={(e) => parseFloat(setRewardPerUser(e.target.value))}
          />
        </Box>
      </FormControl>

      <Typography variant="body1" >Total Reward Pool : {pool} {DEFAULT_CURRENCY}</Typography>

    </div>
  );
};

export default Rewards;
