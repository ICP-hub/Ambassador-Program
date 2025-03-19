import React, { useEffect, useState } from "react";
import {
  FormControl,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";

const Rewards = ({
  initialReward,
  pool,
  setPool,
  participantsCount,
  setParticipantsCount
}) => {
  const [rewardPerUser, setRewardPerUser] = useState(pool/participantsCount || 0);

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
