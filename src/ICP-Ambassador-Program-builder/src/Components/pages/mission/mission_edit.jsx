import React, { useEffect, useState } from 'react';
// import upload_background from '../../../assets/images/upload_background.png';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  IconButton
} from '@mui/material';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment-timezone';
import SortDescription from '../Content/sortDescription';
import Rewards from '../reward/reward';
import TaskSidebar from './task/TaskSidebar';
import { ApiTask, ImageTask, SendURL, TwitterFollowTask, TwitterTask } from './task/TaskList';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Principal } from '@dfinity/principal';
import { formatTokenMetaData, stringToSubaccountBytes } from '../../../utils/utils';

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

  return (
    <div ref={(node) => ref(drop(node))} className="mb-2 flex gap-3 items-start p-2">
      <IconButton style={{ cursor: 'grab', padding: 0 }} ref={ref}>
        <DragIndicatorIcon />
      </IconButton>

      {task.type === 'text' && (
        <ApiTask
          task={task}
          onDelete={() => onDelete(task.id)}
          onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}
        />
      )}
      {task.type === 'img' && (
        <ImageTask
          task={task}
          onDelete={() => onDelete(task.id)}
          onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}
        />
      )}
      {task.type === 'url' && (
        <SendURL
          task={task}
          onDelete={() => onDelete(task.id)}
          onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}
        />
      )}
      {task.type === 'twitter_post' && (
        <TwitterTask
          task={task}
          onDelete={() => onDelete(task.id)}
          onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}
        />
      )}
      {task.type === 'twitter_follow' && (
        <TwitterFollowTask
          task={task}
          onDelete={() => onDelete(task.id)}
          onUpdateField={(field, value) => handleUpdateTaskField(task.id, field, value)}
        />
      )}
    </div>
  );

};

const MissionEdit = () => {
  const [loading, setLoading] = useState(false)
  const actor = useSelector(state => state.actor.value)
  const spaces = useSelector(state => state.spaces.value)
  const mission = useSelector(state => state.mission.value)

  const [pool, setPool] = useState(parseFloat(parseInt(mission?.pool) / Math.pow(10, 6)) || 0)
  const timezone = 'UTC';
  const [logoImage, setLogoImage] = useState(null);

  const [startDate, setStartDate] = useState(
    mission?.start_date
      ? moment(parseInt(mission.start_date)).tz(timezone)
      : moment().tz(timezone)
  );

  const [endDate, setEndDate] = useState(
    mission?.end_date
      ? moment(parseInt(mission.end_date)).tz(timezone)
      : moment().tz(timezone)
  );

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState(mission?.title)
  const [isPrivate, setIsPrivate] = useState(false);
  const [missionType, setMissionType] = useState('');
  const [space, setSpace] = useState([])
  const [description, setDescription] = useState(mission?.description)
  const [rewardsData, setRewardsData] = useState(parseInt(mission?.reward));
  const [imgMetadata, setImgMetadata] = useState(null)
  const [spaceBalance, setSpaceBalance] = useState(0)
  const [participantsCount, setParticipantsCount] = useState('');
  const nav = useNavigate()


  const [participantsCount2, setParticipantsCount2] = useState(parseInt(mission?.max_users_rewarded) || 0);

  // Change in this file

  async function getBalance() {
    try {
      let balance = await actor?.ledgerActor?.icrc1_balance_of({ owner: Principal.fromText(process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND), subaccount: [stringToSubaccountBytes(spaces?.space_id)] })
      console.log("Spaced id ==>",)
      let metadataRes = await actor?.ledgerActor?.icrc1_metadata()
      let metadata = formatTokenMetaData(metadataRes)
      console.log("space balance", parseInt(balance), parseInt(metadata?.["icrc1:decimals"]))
      setSpaceBalance(parseFloat(balance) / Math.pow(10, parseInt(metadata?.["icrc1:decimals"])))
    } catch (error) {
      console.log(error)
    }
  }

  const fileToUint8Array = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = (error) => reject(error);
    });
  async function uploadImgAndReturnURL(metadata, file) {

    return new Promise(async (resolve, reject) => {
      try {
        const fileContent = await fileToUint8Array(file)
        const imageData = {
          image_title: metadata.title,
          name: metadata.name,
          content: [fileContent], // This is the field expected by the backend
          content_type: metadata.contentType // Ensure this matches backend expectations
        };
        let res = await actor?.backendActor?.upload_profile_image(process.env.CANISTER_ID_IC_ASSET_HANDLER, imageData)
        console.log("image upload promise response : ", res)
        if (res?.Ok) {
          let id = res?.Ok
          const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
          const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
          let url = `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${id}`
          resolve(url)
        } else {
          reject(new Error("Image upload response was not Ok"))
        }
      } catch (err) {
        console.log("rejected in catch : ", err)
        reject(new Error(err))
      }

    })
  }

  function calculatePointsPerUser(totalParticipants, rewardPool, conversionRate) {
    const usd = rewardPool / totalParticipants;
    return (usd * 100) / conversionRate;
  }

  const handlesave = async (action) => {
    try {
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

      }
      setLoading(true)

      let finalTasks = []
      for (let i = 0; i < tasks?.length; i++) {
        if (tasks[i]?.type == "text") {
          finalTasks.push({
            SendText: {
              id: finalTasks?.length,
              title: tasks[i]?.title,
              body: tasks[i]?.body,
              sample: tasks[i]?.sample,
              validation_rule: tasks[i]?.validation_rule,
              max_len: tasks[i]?.max_len,
            }
          })
        }
        if (tasks[i]?.type == "url") {
          finalTasks.push({
            SendUrl: {
              id: finalTasks?.length,
              title: tasks[i]?.title,
              body: tasks[i]?.body,
            }
          })
        }
        if (tasks[i]?.type == "twitter_follow") {
          finalTasks.push({
            TwitterFollow: {
              id: finalTasks?.length,
              title: tasks[i]?.title,
              body: tasks[i]?.body,
              account: tasks[i]?.account
            }
          })
        }
        if (tasks[i]?.type == "twitter_post") {
          finalTasks.push({
            SendTwitterPost: {
              id: finalTasks?.length,
              title: tasks[i]?.title,
              body: tasks[i]?.body,
            }
          })
        }
        if (tasks[i]?.type == "img") {
          if (typeof tasks[i]?.img != 'object') {
            // toast.error("please choose a correct image")
            finalTasks.push({
              SendImage: {
                id: finalTasks?.length,
                title: tasks[i]?.title,
                body: tasks[i]?.body,
                img: tasks[i]?.img
              }
            })

          } else {
            let metadata = {
              title: tasks[i]?.img.name.split(".")[0], // Use filename (without extension) as title
              name: tasks[i]?.img.name,
              contentType: tasks[i]?.img.type,
              content: null, // Content will be set in handleUpload
            }
            let img = await uploadImgAndReturnURL(metadata, tasks[i]?.img)
            finalTasks.push({
              SendImage: {
                id: finalTasks?.length,
                title: tasks[i]?.title,
                body: tasks[i]?.body,
                img: img
              }
            })
          }

        }
      }

      let poolamount = parseInt(pool * Math.pow(10, 6)) //token pool

      if(pool/participantsCount2 < 0.03){
        toast.error("Reward amount per user should be atleast 0.03")
        setLoading(false)
        return
      }

      const pointsPerUser = calculatePointsPerUser(participantsCount2, poolamount / (10 ** 6), parseInt(spaces.conversion) / 10);

      let updatedMission = {
        ...mission,
        title: title,
        description: description,
        status: action == "save" ? { Draft: null } : { Active: null },
        reward: parseInt(pointsPerUser), // reward in POINTS
        // reward:100, // reward in POINTS (total)
        tasks: finalTasks,
        pool: poolamount, // pool in tokens
        // max_users_rewarded: Math.floor(Math.abs(poolamount / minPoolForOneUser)), 
        max_users_rewarded: parseInt(participantsCount2),
        total_user_rewarded: parseInt(participantsCount2),
        start_date: String(Date.parse(startDate.toDate())),
        end_date: String(Date.parse(endDate.toDate()))
      }

      if (imgMetadata) {
        let newId = await uploadImgAndReturnURL(imgMetadata, logoImage)
        updatedMission = { ...updatedMission, img: [newId] }
      }

      console.log("data ==>", draft_data, mission, actor, finalTasks)
      console.log("dates : ", startDate.toDate(), endDate.toDate())
      console.log("final updated mission : ", updatedMission, tasks)


      const res = await actor?.backendActor?.edit_mission(updatedMission);

      console.log(res)
      if (res != null && res != undefined && res?.Err == undefined) {
        setLoading(false)
        toast.success('Mission updated successfully')
        nav('/slug_url/mission')
      } else {
        setLoading(false)
        toast.error('Some error occurred')
      }
    } catch (err) {
      console.log("err updating mission : ", err)
      toast.error("some error occurred!")
      setLoading(false)
    }

  }

  function parseTasks(oldTasks) {
    let displayableTasks = []
    for (let i = 0; i < oldTasks?.length; i++) {
      if (oldTasks[i]?.SendText) {
        displayableTasks.push({
          id: i,
          type: 'text',
          ...oldTasks[i]?.SendText
        })
      }
      if (oldTasks[i]?.SendImage) {
        displayableTasks.push({
          id: i,
          type: 'img',
          ...oldTasks[i]?.SendImage
        })
      }
      if (oldTasks[i]?.SendUrl) {
        displayableTasks.push({
          id: i,
          type: 'url',
          ...oldTasks[i]?.SendUrl
        })
      }
      if (oldTasks[i]?.SendTwitterPost) {
        displayableTasks.push({
          id: i,
          type: "twitter_post",
          ...oldTasks[i]?.SendTwitterPost
        })
      }
      if (oldTasks[i]?.TwitterFollow) {
        displayableTasks.push({
          id: i,
          type: "twitter_follow",
          ...oldTasks[i]?.TwitterFollow
        })
      }
    }
    console.log("parsed tasks : ", displayableTasks)
    setTasks(displayableTasks)
  }

  useEffect(() => {
    if (mission?.mission_id == undefined) {
      nav('/')
    }
    console.log(mission, "mission", actor)
    parseTasks(mission?.tasks)
    getBalance()
  }, [mission])

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setLogoImage(file)
    setImgMetadata({
      title: file.name.split(".")[0], // Use filename (without extension) as title
      name: file.name,
      contentType: file.type,
      content: null, // Content will be set in handleUpload
    })
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setLogoImage(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  const handleTaskbar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleAddTask = (taskType) => {
    let taskFields = {}
    if (taskType == "img") {
      taskFields = { title: "", body: "", img: "" }
    }
    if (taskType == "url") {
      taskFields = { title: "", body: "" }
    }
    if (taskType == "text") {
      taskFields = { title: "", body: "", sample: "", validation_rule: "", max_len: 100 }
    }
    if (taskType == "twitter_follow") {
      taskFields = { title: "", body: "", account: "" }
    }
    setTasks([...tasks, { type: taskType, id: Date.now(), ...taskFields }]);
    setSidebarOpen(false);
  };


  const handleUpdateTaskField = (field, value, taskId) => {
    console.log(taskId, field, value)
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === field ? { ...task, [value]: taskId } : task
      );
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

  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription)
  }

  const handleRewardsChange = (updatedRewards) => {
    setRewardsData(updatedRewards);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-center mx-auto mb-3">
        <FormControl sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className="w-5/6">
          <div className="mt-4 w-full ">
            <div className="text-xl font-medium">Mission Image</div>
            <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full  mx-auto">
              {logoImage ? (
                <img src={URL.createObjectURL(logoImage)} alt="Uploaded" className="object-contain h-[300px] w-[400px] " />
              ) : (
                <img src={mission?.img?.length > 0 ? mission?.img[0] : 'upload_background.png'} alt="" className="object-contain " />
              )}
              <div>{mission?.img?.length > 0 ? "" : "Choose an Image"}</div>
              <label className="mt-4 w-full bg-blue-500 rounded">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-sky-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
                  BROWSE
                </div>
              </label>
            </div>
          </div>

          <input className='py-4 border-2 px-4' type="text" value={title} label="Mission title" placeholder="Title..." size="small" onChange={(e) => { setTitle(e.target.value) }} />

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
            <SortDescription initialDescription={description} value={description} onChange={handleDescriptionChange} />
          </FormControl>

          {/* <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                sx={{ flexDirection: 'row-reverse', gap: 1, alignItems: 'center' }}
              />
              }

              label="Private (accessible only via direct link)"
            />
          </FormControl> */}

          {/* <FormControl>
            <FormLabel>Mission type</FormLabel>
            <RadioGroup
              row
              value={missionType}
              onChange={(e) => setMissionType(e.target.value)}
            >
              <FormControlLabel value="reward" control={<Radio />} label="Instant reward" />
              <FormControlLabel value="raffle" control={<Radio />} label="Raffle" />
            </RadioGroup>
        </FormControl> */}

          <FormControl className="">
            <Typography variant="body2">Start date</Typography>
            <Box className="flex gap-4 mb-3">
              <DateTime
                value={startDate}
                onChange={handleStartDateChange}
                dateFormat="YYYY-MM-DD"
                timeFormat="h:mm A"
                inputProps={{ placeholder: 'Start date...', style: { fontSize: '12px' } }}
                className="border border-black"
              />
              <span style={{ marginLeft: '10px', fontSize: '11px' }} className="font-semibold">
                Timezone: {timezone}
              </span>
            </Box>
          </FormControl>

          <FormControl className="">
            <Typography variant="body2">End date</Typography>
            <Box className="flex gap-4 mb-3">
              <DateTime
                value={endDate}
                onChange={handleEndDateChange}
                dateFormat="YYYY-MM-DD"
                timeFormat="h:mm A"
                inputProps={{ placeholder: 'End date...', style: { fontSize: '12px' } }}
                className="border border-black"
              />
              <span style={{ marginLeft: '10px', fontSize: '11px' }} className="font-semibold">
                Timezone: {timezone}
              </span>
            </Box>
          </FormControl>

          <Rewards
            spaceBal={spaceBalance}
            onRewardsChange={handleRewardsChange}
            initialReward={rewardsData}
            onParticipantsChange={(value) => setRewardsData(value)}
            pool={pool}
            setPool={setPool}

            participantsCount={participantsCount2}
            setParticipantsCount={setParticipantsCount2}
          />
          <div className=''>
            {tasks.length > 0 && (<div className="text-4xl border-b-2 border-gray-300 mb-4 py-2">Tasks</div>)}

            {tasks.map((task, index) => (
              <DraggableTask key={index} index={index} task={task} moveTask={moveTask} onDelete={handleDeleteTask} handleUpdateTaskField={handleUpdateTaskField} />
            ))}
          </div>

          <div className='flex justify-start gap-8'>
            <Button variant="outlined" className="w-44 mt-2 mb-5" onClick={handleTaskbar}>
              ADD TASK
            </Button>
            <Button variant="contained" onClick={() => handlesave("save")}>Save as Draft</Button>
            <Button variant="contained" onClick={() => handlesave("publish")}>Publish</Button>
          </div>


          <TaskSidebar open={isSidebarOpen} onClose={handleCloseSidebar} onSelectTask={handleAddTask} />
        </FormControl>
      </div>
    </DndProvider>
  );
};

export default MissionEdit;
