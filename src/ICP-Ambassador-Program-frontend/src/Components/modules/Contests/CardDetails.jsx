import React,{useState,useRef,useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineArrowOutward } from "react-icons/md";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import app from "./firebase_config";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
// import upload_background from '../../../assets/images/upload_background.png'
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import Cookies from 'js-cookie'
import toast from 'react-hot-toast';
import {  FaLink, FaTextHeight} from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { RiLoopLeftLine } from "react-icons/ri";
import DoneIcon from '@mui/icons-material/Done';
import { BiSolidSend } from "react-icons/bi";
import { MdOutlineCloudUpload } from "react-icons/md";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosSend } from "react-icons/io";

const auth = getAuth(app);

const CardDetails = () => {
  const adminRegex = /^[A-Za-z0-9\s]+$/;
  const location = useLocation();
  const { updatedContest } = location.state || {};
  const [description, setDescription] = useState(''); 
  const [submission,setSubmission]=useState(null)
  const [loading,setLoading]=useState(false)
  const [subStatus,setSubStatus]=useState("")
  const [authenticate,setAuth]=useState(false);
  const [twitterUser,setTwitterUser]=useState("")
  const [isDragging, setIsDragging] = useState(false);
  // const [expanded, setExpanded] = useState({});
  

  // useEffect(() => {
  //   if (tasks && tasks.length > 0) {
  //     const initialExpandedState = tasks.reduce((acc, task) => {
  //       // Set each task's state as expanded (true) by default
  //       acc[task.task_id] = true;
  //       return acc;
  //     }, {});
  //     setExpanded(initialExpandedState);
  //   }
  // }, [tasks]);
  
  // const handleAccordionChange = (taskId) => {
  //   setExpanded((prevExpanded) => ({
  //     ...prevExpanded,
  //     [taskId]: !prevExpanded[taskId], // Toggle the specific task's expanded state
  //   }));
  // };

  const nav=useNavigate()
  const taskDetailsMap = {
      SendTwitterPost: {
        icon: FaXTwitter,
        color: "#1D9BF0", 
      },
      SendText: {
        icon: FaFileUpload,
        color: "#de7515", 
      },
      SendUrl: {
        icon: FaLink,
        color: "#6d15de", 
      },
      SendImage: {
        icon: FaFileUpload,
        color: "#de7515", 
      },
      TwitterFollow :{
        icon: FaXTwitter,
        color: "#1D9BF0", 
      }
    };
  const [tasks, setTasks] = useState(
    updatedContest.tasks
  );
  console.log(tasks,updatedContest.tasks,"updatedcontest.tasks")
  const [twitterLink, setTwitterLink] = useState("");
  const handleInputTwitter = (e) => {
      setTwitterLink(e.target.value);
  };

  const fileToUint8Array = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = (error) => reject(error);
    });
    async function uploadImgAndReturnURL(metadata,file){
      return new Promise(async(resolve,reject)=>{
          try{
              const fileContent=await fileToUint8Array(file)
              const imageData = {
                  image_title: metadata.title,
                  name: metadata.name,
                  content: [fileContent],
                  content_type: metadata.contentType
              };
              let res= await ICP_Ambassador_Program_backend.upload_profile_image(process.env.CANISTER_ID_IC_ASSET_HANDLER,imageData)
              console.log("image upload promise response : ",res)
              if(res?.Ok){
                  let id=res?.Ok
                  const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
                  const domain = process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
                  let url=`${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${id}`
                  resolve(url)
              }else{
                  reject(new Error("Image upload response was not Ok"))
              }
          }catch(err){
              console.log("rejected in catch : ",err)
              reject(new Error(err))
          }
          
      })
  }
  

  function parseTasks(mission_tasks,sub_tasks){
    try {
      let new_tasks=[]
      console.log(mission_tasks,sub_tasks)
      for(let i=0;i<sub_tasks.length;i++){

        let taskType=Object.keys(sub_tasks[i])[0]
        console.log(taskType)
        if(taskType=="SendText"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.text,submitted:true})
        }
        else if(taskType=="SendImage"){
          new_tasks.push({...mission_tasks[i],image:sub_tasks[i][taskType]?.img,sampleImg:mission_tasks[i].image,submitted:true})
        }
        else if(taskType=="SendUrl"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.url,submitted:true})
        }
        else if(taskType=="SendTwitterPost"){
          console.log("parsing twitter post")
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.post,submitted:true})
        }
        else if(taskType=="TwitterFollow"){
          new_tasks.push({...mission_tasks[i],submitted:true})
        
        }
        else{
          if(mission_tasks[i]?.id=="SendTwitterPost"){
            console.log("unsubmitted twitter tasks left",authenticate)
            setUnsubmittedTwitterPost([...unsubmittedTwitterPost,mission_tasks[i]])
          }
          new_tasks.push({...mission_tasks[i]})
        }
      }
      console.log("parsed mission tasks : ",new_tasks)
      setTasks(new_tasks)
    } catch (error) {
      console.log("err parsing task submission : ",error)
    }
  } 

  async function getSubmission() {
    try {
      setLoading(true)
      let user=JSON.parse(Cookies.get('discord_user'))
      let res=await ICP_Ambassador_Program_backend.get_submission(`${updatedContest.mission_id}_${user.id}`)
      console.log("previous submission : ",res,updatedContest,`${updatedContest.mission_id}_${user.id}`)
      if(res?.Ok){
        setSubStatus(Object.keys(res?.Ok?.status)[0])
        setSubmission(res?.Ok)
        let y=0
        let sub_tasks=[]
        let previous_sub_tasks=res?.Ok?.tasks_submitted
        for(let i=0;i<tasks?.length;i++){
          for(let j=0;j<previous_sub_tasks?.length;j++){
            if(i==previous_sub_tasks[j][Object.keys(previous_sub_tasks[j])[0]].id){
              sub_tasks.push(previous_sub_tasks[j])
              break
            }else{
              if(j==(previous_sub_tasks?.length-1)){
                sub_tasks.push({})
              }
            }
          }
        }
        // for(let i=0;(i<tasks?.length);i++){
        //   console.log(previous_sub_tasks[y],i)
        //   if(y<previous_sub_tasks?.length){
        //     if(i==previous_sub_tasks[y][Object.keys(previous_sub_tasks[y])[0]].id){
        //       sub_tasks.push(previous_sub_tasks[y])
        //       y+=1
        //     }else{
        //       sub_tasks.push({})
        //     }
        //   }else{
        //     sub_tasks.push({})
        //   }
          
        // }
        parseTasks(tasks,sub_tasks)
        setLoading(false)

      }else{
        let newSubmission={
          submission_id:'',
          mission_id:updatedContest.mission_id,
          tasks_submitted:[],
          user:user?.id,
          status:{Unread:null},
          points_rewarded:false
        }
        console.log(newSubmission)
        setSubStatus("Unread")
        setSubmission(newSubmission)
        setLoading(false)
      }
    } catch (error) {
      console.log("error while fetching submission : ",error)
      setLoading(false)

    }
  
  }

  async function submitTask(taskid){
    try{
      let task={}
      for(let i=0;i<tasks?.length;i++){
        if(taskid==tasks[i]?.task_id){
          task=tasks[i]
        }
      }
      console.log(taskid,task)

      setLoading(true)
      let user=JSON.parse(Cookies.get('discord_user'))
      let newTask={}

      if(task?.id=="SendText"){
        newTask={
          SendText:{
            id:task?.task_id,
            text:task?.content || ""
          }
        }
      }
      if(task?.id=="SendImage"){
        if(task?.image==''){
          toast.error("cannot send empty image")
          setLoading(false)
          return
        }
        if(typeof task?.image!='object'){
          newTask={
            SendImage:{
              id:task?.task_id,
              img:task?.image || ""
            }
          }
          
        }else{
          console.log(task)
          let metadata={
            title: task?.image.name.split(".")[0], 
            name: task?.image.name,
            contentType: task?.image.type,
            content: null, 
          }
          let img=await uploadImgAndReturnURL(metadata,task?.image)
          newTask={
            SendImage:{
              id:task?.task_id,
              img:img
            }
          }
        }
        
      }
      if(task?.id=="SendTwitterPost"){
        if(!authenticate){
          setLoading(false)
          toast.error("Please authenticate using twitter for submitting a post")
          return
        }
        const regex = /^https:\/\/x\.com\/[^/]+\/[^/]+\/[^/]+$/;
        console.log("regex test : ",regex.test(task.content),task.content)
        let testResult=regex.test(task.content)
        if(!testResult){
          setLoading(false)
          toast.error("Invalid post link format")
          return
        }
        if(!task.content?.includes(twitterUser)){
          console.log("user check : ",twitterUser)
          setLoading(false)
          toast.error("Someone else's post cannot be submitted")
          return
        }
        newTask={
          SendTwitterPost:{
            id:task?.task_id,
            post:task?.content||""
          }
        }
      }
      if(task?.id=="TwitterFollow"){
        window.open(`https://x.com/${task?.account}`,'_blank')
        newTask={
          TwitterFollow:{
            id:task?.task_id,
            followed:true
          }
        }
      }

      let res=await ICP_Ambassador_Program_backend.add_task_submission(submission,newTask)
      console.log(res)
      
      if(typeof res=="object" && !res?.Err){
        getSubmission()
        setLoading(false)
        toast.success(submission.submission_id==""?"Added new submission":'Updated the submission')
        // nav('/')
      }else{
        setLoading(false)
        toast.error("Some error occurred while submitting")
      }
    }catch(err){
      setLoading(false)
      toast.error("Something went wrong")
      console.log(err)
    }
  }


  const Check_authentication = async () => {
   
    
    const provider = new TwitterAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("user ==>",user)
        const username = user.reloadUserInfo.screenName;
        console.log("username ==>",username)
        // const regex = /(?:twitter|x)\.com\/([^\/]+)/;
        // const match = twitterLink.match(regex);
        // const usernameInLink = match ? match[1] : null;
        // console.log("userNameInLink ==>", usernameInLink);
        if (username) {
            setAuth(true);
            setTwitterUser(username)
            console.log("Authentication successful");
            toast.success("Authenticated using twitter")
        } else {
            console.log("User not authenticated");
            toast.error("Something failed while authenticating with twitter")
        }
    } catch (error) {
        console.error("Error during Twitter login:", error);
    }
};
const twitterSubmit = ()=>{
  if(!authenticate){
    alert("Authenticate twitter before submitting .....");
  }
}

  async function addSubmission(){
    try{
      // e.preventDefault();
      setLoading(true)

      console.log("before finaltasks : ",tasks)
      let user=JSON.parse(Cookies.get('discord_user'))
      let finalTasks=[]
      for(let i=0;i<tasks?.length;i++){
        let task={}
        if(tasks[i]?.id=="SendText"){
          task={
            SendText:{
              id:tasks[i]?.task_id,
              text:tasks[i]?.content || ""
            }
          }
        }
        if(tasks[i]?.id=="SendImage"){
          if(typeof tasks[i]?.image!='object'){
            // toast.error("please choose a correct image")
            // finalTasks.push({
            //   SendImage:{
            //     id:finalTasks?.length,
            //     title:tasks[i]?.title,
            //     body:tasks[i]?.body,
            //     img:tasks[i]?.img
            //   } 
            // })
            task={
              SendImage:{
                id:tasks[i]?.task_id,
                img:tasks[i]?.image || ""
              }
            }
            
          }else{
            console.log(tasks[i])
            let metadata={
              title: tasks[i]?.image.name.split(".")[0], // Use filename (without extension) as title
              name: tasks[i]?.image.name,
              contentType: tasks[i]?.image.type,
              content: null, // Content will be set in handleUpload
            }
            let img=await uploadImgAndReturnURL(metadata,tasks[i]?.image)
            task={
              SendImage:{
                id:tasks[i]?.task_id,
                img:img
              }
            }
            // finalTasks.push({
            //   SendImage:{
            //     id:finalTasks?.length,
            //     title:tasks[i]?.title,
            //     body:tasks[i]?.body,
            //     img:img
            //   } 
            // })
          }
          
        }
        if(tasks[i]?.id=="SendTwitterPost"){
          if(!authenticate){
            setLoading(false)
            toast.error("Please authenticate using twitter for submitting a post")
            return
          }
          const regex = /^https:\/\/x\.com\/[^/]+\/[^/]+\/[^/]+$/;
          console.log("regex test : ",regex.test(tasks[i].content),tasks[i].content)
          let testResult=regex.test(tasks[i].content)
          if(!testResult){
            setLoading(false)
            toast.error("Invalid post link format")
            return
          }
          if(!tasks[i].content?.includes(twitterUser)){
            console.log("user check : ",twitterUser)
            setLoading(false)
            toast.error("Someone else's post cannot be submitted")
            return
          }
          task={
            SendTwitterPost:{
              id:tasks[i]?.task_id,
              post:tasks[i]?.content||""
            }
          }
        }
        if(tasks[i]?.id=="SendUrl"){
          task={
            SendUrl:{
              id:tasks[i]?.task_id,
              url:tasks[i]?.content || ""
            }
          }
        }
        finalTasks.push(task)
      }
      console.log("final submission : ",{
        ...submission,
        tasks_submitted:finalTasks
      })
      let res=await ICP_Ambassador_Program_backend.add_or_update_submission({
        ...submission,
        tasks_submitted:finalTasks
      })
      console.log(res)
      
      if(typeof res=="object" && !res?.Err){
        setLoading(false)
        toast.success(submission.submission_id==""?"Added new submission":'Updated the submission')
        nav('/')
      }else{
        setLoading(false)
        toast.error("Some error occurred while submitting")
      }

    }catch(err){
      console.log("err updating submission : ",err)
      setLoading(false)
      toast.error("Something went wrong")
    }
  }

  const handleInputChange = (e, taskId) => {
    
    const value = e.target.value;
    setTasks(prevTasks => prevTasks.map(task => 
      task.task_id === taskId ? { ...task, content: value } : task
    ));
  };

  const fileInputRef = useRef(null);

  const onFileChange = (e,taskId,task) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(e, taskId,task);
      // Reset the input value
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleFileChange = (e, taskId,task) => {
    const file = e.target.files[0];
    setTasks(prevTasks => prevTasks.map(task => 
      task.task_id === taskId ? { ...task,uploading: true, image: file } : task
    ));
    setTimeout(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          
          t.task_id === taskId ? { ...t, uploading: false, submitted: false } : t
        )
      );
    }, 2000); 
  };


  const handleSend = (taskId,task) => {
    if (!task.content) return; 
    console.log(taskId)
    //console.log('Sending task:', taskId, task);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, submitted: true } : task
      )
    );
  };
  const handleSendImage = (taskId,task) => {
    
    console.log(taskId)
    //console.log('Sending task:', taskId, task);
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.task_id === taskId ? { ...t, submitted: true } : t
      )
    );
  };
  
  const handleSubmit =async (e, taskId) => {
    e.preventDefault();
    setTasks(prevTasks => prevTasks.map(task =>
      task.task_id === taskId ? { ...task, submitted: true } : task
    ));
    console.log("Updated tasks:", tasks);
    let user=JSON.parse(Cookies.get('discord_user'))
    const res=await ICP_Ambassador_Program_backend.add_points(String(user?.id),100)
    console.log(res)
    alert(`task submitted by ${user?.username} !`)
    nav('/')
  };
  //console.log(location)
  if (!updatedContest) {
    return <p className='text-white'>No contest data available</p>;
  }


  const getRandomDarkColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 6)]; 
    }
    return color;
  };
  

  const [randomColor, setRandomColor] = useState('#000000'); 

  useEffect(() => {
    setRandomColor(getRandomDarkColor()); 
    getSubmission()
  }, []);

  const { reward, status, title, img, social_platforms, icons } = updatedContest;
  //console.log("Updated contest ==>",updatedContest)
  const statusKey = Object.keys(status)[0]; 
  const statusValue = status[statusKey]; 
  
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'strike'],
            ['blockquote', 'code-block', 'link', 'image'],
            [{ align: [] }],
            ['clean'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            ['hr'],
          ],
        },
        placeholder: 'Enter your submission...',
      });

      quillRef.current.clipboard.dangerouslyPasteHTML(description);

      quillRef.current.on('text-change', () => {
        const textContent = quillRef.current.getText().replace(/\n/g, '');
        if (adminRegex.test(textContent)) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === 'SendText' ? { ...task,content: textContent } : task
            )
          );
        } else {
          console.log('Invalid content detected');
        }
      });
    }
  }, [description]);

  useEffect(() => {
    //console.log("Updated tasks:", tasks);
  }, [tasks]);

  const handleDeleteFile = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.task_id === taskId ? { ...t, image: null, submitted: false } : t
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, taskId,task) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } }, taskId,task);
    }
  };

  if(loading){
    return(
      <div className='flex justify-center items-center h-screen'>
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    )
  }
  return (
    <div style={{
        background: `linear-gradient(to bottom, ${randomColor}, transparent)`,
        className:'font-poppins'
      }}
      className="h-full pt-3" >
      <Navbar nav={nav} />
      <div className='flex justify-center items-center lg:ml-20 sm:ml-0'>
      <div className=' flex flex-col gap-16 justify-start items-start  lg:w-3/4 sm:w-full lg:p-0 sm:p-3  mt-10 h-full ' >
        <div className="flex items-center justify-center  gap-10">
            <div>
                <div className="mb-4">
                {img?.length>0 ? (
                    <img src={img} alt={title} className="lg:w-44 lg:h-44 sm:w-44 sm:h-20 object-cover rounded-lg" />
                ) : (
                    // <div className="w-20 h-20 bg-gray-700 flex items-center justify-center rounded">
                    // <span>No Image</span>
                    // </div>
                    <img
                      src='https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg'
                      alt={title}
                      className="lg:w-44 lg:h-44 sm:w-44 sm:h-24 object-cover rounded"
                    />
                )}
                </div>
            </div>
            <div className='flex flex-col gap-4 justify-start items-start'>
                <div className=' text-sm' 
                        style={{
                          
                          color:
                            statusKey === 'Active'
                              ? '#1db851'
                              : statusKey === 'Draft'
                              ? '#b8b8b8'
                              : statusValue === 'In Active' 
                              ? '#a0a0a0'
                              : '#e20203',
                        }}
                    >{statusValue === null || statusValue === undefined
                      ? statusKey
                      : statusValue}</div>
                <div>
                    <div className='text-white text-xl '>{title}</div>
                </div>
                <div className="flex items-center gap-3 ">
                    <img src={icons.platform_logo} alt={icons.platform} className="w-8 h-4 rounded-full" />
                    <span className="text-md text-white font-semibold">{icons.platform}</span>
                </div>
                <div className=" font-semibold text-gray-600 text-sm">
                    {/* 2024/10/09 04:30 - 2024/10/11 04:30 GMT +03:00 */}
                </div>
            </div>    
        </div>
        
        <div className='w-full flex flex-col gap-6 overflow-y-auto mb-5'>
            {tasks.map((task,index) => {
              const taskType = task.id;  
              const { icon: IconComponent, color: bgColor } = taskDetailsMap[taskType] || {}; 
              
              return(
                <div className='flex flex-col gap-3 relative rounded-xl bg-[#171717]' style={{ backgroundColor: '#171717' }} key={index}>
                <div className='relative rounded-lg' style={{
                    borderTop: `2px solid ${bgColor}`,
                    borderLeft: `2px solid transparent`, 
                    borderRight: `2px solid transparent`, 
                    borderBottom: 'none',
                    borderRadius: '0.5rem',
                    background: `linear-gradient(to bottom, ${bgColor} 0%, transparent 100%)`,      
                }}>
                    <Accordion expanded={true}  style={{ backgroundColor: '#1d1d21', color: 'white' }}>
                    <AccordionSummary  aria-controls="panel1-content" id="panel1-header" className="text-white  text-lg">
                      <div className='flex justify-between w-full'>
                        <div className='flex gap-4'>
                          <div className="w-7 h-7 flex justify-center items-center rounded-full"
                            style={{ backgroundColor: bgColor }}>
                            {IconComponent ? <IconComponent className='text-[15px]'/> : null}
                          </div>

                          {task.title}
                        </div>
                        <div className='mt-1'>
                            {task.submitted ? (
                              <div className='lg:w-6 sm:w-6 lg:h-6 sm:h-6 bg-[#1DB954] text-black flex justify-center items-center rounded-full'>
                                <DoneIcon style={{fontSize:'15px'}}/>
                              </div>
                            ) : (
                              <div className='border border-[#FFFFFF14] bg-[#1e1e1e] w-6 h-6 rounded-full'></div>
                            )}
                        </div>
                        
                      </div>
                      
                        
                    </AccordionSummary>
                    <div className='h-[1px] bg-gray-500 mx-4'></div>
                    <AccordionDetails>
                        {/* {!task.submitted ? ( */}
                        <form  className="flex flex-col gap-3 mt-3">
                            {task.id === 'SendText' && (
                            <>
                                <div className="text-white  text-md max-w-[95%] overflow-clip">{`Task description :\n\n ${task.description}`}</div>
                                <div className="border border-[#FFFFFF14] m-2 rounded-md custom-quill shadow-sm w-full">
                                    {/* <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div> */}
                                    <textarea 
                                      rows={10}
                                      className='w-full py-2 px-3 mt-2 bg-[#1e1e1e]' 
                                      onChange={(e)=>handleInputChange(e,task.task_id)}
                                      value={task.content}
                                      placeholder='Input text here...'
                                    />
                                </div>
                                {task.submitted ?(
                                    <div className='bg-[#1DB954] text-white flex gap-2 justify-center items-center py-2' >
                                      <DoneIcon />
                                      <div>Completed</div>

                                  </div>
                                ):(
                                    <div 
                                    className={`text-white w-full py-2 flex justify-center items-center gap-2 rounded-md cursor-pointer ${
                                      task.content ? '' : 'opacity-40'
                                    }`} 
                                    style={{ backgroundColor: bgColor }}
                                    onClick={() =>{
                                        submitTask(task.task_id)
                                        handleSend(task.task_id,task)
                                      }}
                                    >
                                    <BiSolidSend />
                                    <div>Send</div>
                                    </div>
                                )}  
                            </>
                            )}
                            {task.id === 'SendUrl' && (
                              <>
                              <div className='flex flex-col gap-3'>

                              <div className="text-white  text-md max-w-[95%] overflow-clip">{`Task description :\n\n ${task.description}`}</div>
                                  <input
                                  type='SendURL'
                                  placeholder='Enter URL'
                                  onChange={(e) => handleInputChange(e, task.task_id)}
                                  className='outline-none p-3 text-white bg-[#1e1e1e] border border-[#FFFFFF14] rounded text-black'
                                  value={task.content}
                              />
                              {task.submitted ?(
                                    <div className='bg-[#1DB954] text-white flex gap-2 justify-center items-center py-2' >
                                      <DoneIcon />
                                      <div>Completed</div>

                                  </div>
                                ):(
                                    <div 
                                    className={`text-white w-full py-2 flex justify-center items-center gap-2 rounded-md cursor-pointer ${
                                      task.content ? '' : 'opacity-40'
                                    }`} 
                                    style={{ backgroundColor: bgColor }}
                                    onClick={() => {
                                      submitTask(task.task_id)
                                      handleSend(task.task_id,task)
                                    }}
                                    >
                                    <BiSolidSend />
                                    <div>Submit</div>
                                    </div>
                                )}  

                              </div>
                            
                            
                            </>
                            )}
                            {task.id==="SendTwitterPost" && (
                               
                                   
                                   <div  className="flex flex-col gap-6 mt-3">  
                                       <div className="text-white text-md max-w-[95%] overflow-clip">{`Task description :\n\n ${task.description}`}</div>
                                       <div className ='flex w-full gap-4 items-center'>
                                       <input
                                             type='text'
                                             value={task.content}
                                             placeholder='Share post link'
                                             onChange={(e) => handleInputChange(e, task.task_id)}
                                             className='outline-none p-3 text-white bg-[#1e1e1e] border border-[#FFFFFF14] rounded w-full text-black'
                                         />
                                         {/* {!authenticate ?(
                                           <button className='w-8 h-8   bg-white flex justify-center items-center rounded-full curso-pointer' onClick={(e)=>{Check_authentication(e)}}>
                                           <PrivacyTipIcon className='text-black'/>
                                           </button>
                                          
                                         ):(
                                           <div className='lg:w-8 sm:w-10 lg:h-8 sm: bg-[#1DB954] text-black flex justify-center items-center rounded-full'>
                                             <DoneIcon />
                                         </div>
                                         )} */}
                                         
                                       </div>
                                         {
                                          task?.submitted?
                                          <div className='bg-[#1DB954] text-white flex gap-2 justify-center items-center py-2' >
                                             <DoneIcon />
                                             <div>Completed</div>
                                             {/* <p className='text-green-500 text-sm font-semibold '>Authenticated</p> */}
                                           </div>
                                           :
                                           !authenticate?
                                           <div className='text-white py-2 gap-2 rounded-md flex cursor-pointer justify-center items-center ' onClick={Check_authentication} style={{ backgroundColor: bgColor }}>
                                            <FaXTwitter/>
                                             <div className='text-lg  text-white'>Connect Twitter</div>
                                             {/* <p  className='text-gray-400 text-sm font-semibold'>Authenticate Twitter before submitting. Click on top right icon  to authenticate</p> */}
                                           </div>
                                           :
                                           <div className='text-white py-2 gap-2 rounded-md flex cursor-pointer justify-center items-center ' onClick={()=>submitTask(task.task_id)} style={{ backgroundColor: bgColor }}>
                                            <FaXTwitter/>
                                            <div className='text-lg  text-white'>Submit Post</div>
                                             {/* <p  className='text-gray-400 text-sm font-semibold'>Authenticate Twitter before submitting. Click on top right icon  to authenticate</p> */}
                                           </div>
                                         }
                                       
                                       <div className='flex items-center justify-center'>
                                       {/* <button
                                           onClick={()=>{twitterSubmit()}}
                                           type="submit"
                                           className="w-2/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
                                       >
                                           Submit <MdOutlineArrowOutward className="ml-3" size={24} />
                                       </button> */}
                                       </div>
                                   </div>
                                   
                            )}
                            {task.id === 'SendImage' && (
                            <div className="mt-4 w-full ">
                              <div className="text-white  text-md max-w-[95%] overflow-clip">{`Task description :\n\n ${task.description}`}</div>
                              {/* <div className='flex gap-5 my-5'>
                                <div className="text-white font-semibold text-md  mt-4">Sample Image</div>
                                <img src={task.sampleImg} className='w-52 rounded h-40' alt=''/>
                              </div> */}
                                
                                <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-auto mx-auto">
                                  
                                {(task.uploading || task.image) && (
                                  <div className="w-full bg-[#1e1e1e] border border-[#FFFFFF14] rounded-md my-4 p-2">
                                    {task.uploading ? (
                                      <div className="w-full flex justify-between items-center gap-2 text-md font-semibold py-2 text-white">
                                        <div className="flex justify-between items-center gap-2 w-full">
                                          <div className="flex gap-2">
                                            <AttachFileIcon />
                                            <span>{task.image?.name || 'Uploading...'}</span>
                                          </div>
                                          <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-white"></div>
                                        </div>
                                      </div>
                                    ) : task.image ? (
                                      <div className="w-full flex justify-between items-center gap-2 text-md font-semibold py-2 text-white">
                                        <div className="flex gap-2">
                                          <AttachFileIcon />
                                          <span>{typeof task.image === 'object' ? task.image.name : task.image}</span>
                                        </div>
                                        <button
                                          className="text-red-500"
                                          onClick={() => handleDeleteFile(task.task_id)}
                                        >
                                          <MdOutlineDeleteOutline />
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                )}

                                {task.image ?(
                                  null
                                ):(
                                  <div className=' flex flex-col items-center mt-6  justify-center gap-2 text-white ' onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, task.task_id,task)}>
                                    <MdOutlineCloudUpload className='text-3xl'/>
                                    <div  className='text-white font-semibold'>Drag your file here or</div>
                                    <div className='text-gray-400'>JPG, PNG, PDF · Max size 5Mb</div>
                                  </div>
                                )}
                                
                                <div className='w-full'>
                                  <label className="mt-4 w-full rounded"
                                  
                                  >
                                    <input
                                      type="file"
                                      className="hidden w-full"
                                      onChange={(e)=>{onFileChange(e, task.task_id, task)}}
                                      ref={fileInputRef}
                                    />
                                    {!task.image && !task.uploading && !task.submitted && (
                                      <div
                                        className="w-full flex justify-center cursor-pointer items-center gap-2 text-md font-semibold py-2 text-white rounded-md"
                                        style={{ backgroundColor: bgColor }}
                                      >
                                        {IconComponent ? <IconComponent /> : null}
                                        <div>Upload Image</div>
                                      </div>
                                    )}
                                  </label>

                                  {task.uploading && (
                                    <div
                                      className="w-full flex justify-center items-center gap-2 text-md font-semibold py-2 text-white"
                                      style={{ backgroundColor: bgColor }}
                                    >
                                      <div className="flex justify-center items-center">
                                        <div className="h-6 w-8 animate-spin rounded-full border border-white rounded-md" />
                                      </div>
                                      Uploading...
                                    </div>
                                  )}

                                  {task.image && !task.submitted && !task.uploading && (
                                    <div
                                      className="w-full flex justify-center items-center cursor-pointer gap-2 text-md font-semibold py-2 text-white rounded-md"
                                      style={{ backgroundColor: bgColor }}
                                      onClick={() => {
                                        handleSendImage(task.task_id, task);
                                        submitTask(task.task_id)
                                      }}
                                    >
                                      <DoneIcon />
                                      <div>Confirm</div>
                                    </div>
                                  )}

                                  {task.submitted && (
                                    <div className="bg-[#1DB954] text-white flex gap-2 justify-center items-center py-2 rounded-md">
                                      <DoneIcon />
                                      <div>Completed</div>
                                    </div>
                                  )}
                                </div>

                                </div>
                            </div>
                            )}
                            {task.id === 'TwitterFollow' &&(
                              <div className='flex flex-col gap-4'>
                                <div className="text-white text-md max-w-[95%] overflow-clip">{`Task description :\n\n ${task.description}`}</div>
                                {
                                  task.submitted?
                                  <div className="bg-[#1DB954] text-white flex gap-2 justify-center items-center py-2 rounded-md">
                                      <DoneIcon />
                                      <div>Completed</div>
                                    </div>
                                  :
                                  <div 
                                    className='w-full text-white py-2 rounded-md flex gap-2 justify-center items-center text-lg' 
                                    style={{backgroundColor:bgColor}}
                                    onClick={()=>submitTask(task.task_id)}
                                  >
                                    <FaXTwitter/>
                                    <div>Follow</div> 
                                  </div>
                                }
                                
                              </div>
                              
                            )}
                            <div className='flex items-center justify-center'>
                            {/* <button
                                type="submit"
                                className="w-2/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
                            >
                                Submit <MdOutlineArrowOutward className="ml-3" size={24} />
                            </button> */}
                            </div>
                        </form>

                        
                    </AccordionDetails>
                    </Accordion>
                    
                </div>
                </div>)
              })}
             {/* <Accordion style={{ backgroundColor: '#1d1d21', color: 'white' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white" />} aria-controls="panel1-content" id="panel1-header" className="text-white font-semibold text-lg">
                        Twitter Post sample task title
                    </AccordionSummary>
                    <div className='h-[1px] bg-gray-500 mx-4'></div>
                    <AccordionDetails>
                        
                        <div  className="flex flex-col gap-3 mt-3">  
                            <div className="text-white font-semibold lg:text-md sm:text-xs">Twitter Post sample description</div>
                            <div className ='flex w-full gap-4 items-center'>
                            <input
                                  type='text'
                                  value={twitterLink}
                                  placeholder='Share post link'
                                  onChange={(e) => handleInputTwitter(e)}
                                  className='outline-none p-3 rounded w-full text-black'
                              />
                              {!authenticate ?(
                                <button className='w-12 lg:h-12 sm:h-10  bg-white flex justify-center items-center rounded-full curso-pointer' onClick={(e)=>{Check_authentication(e)}}>
                                <PrivacyTipIcon className='text-black'/>
                                </button>
                              ):(
                                <div className='w-12 h-12 bg-white flex justify-center items-center rounded-full'>
                                  <AdminPanelSettingsIcon className=' text-green-600'/>
                              </div>
                              )}
                              
                            </div>
                            {!authenticate ?(
                                <div>
                                  <p  className='text-gray-400 text-sm font-semibold'>Authenticate Twitter before submitting. Click on top right icon  to authenticate</p>
                                </div>
                              ):(
                                <div >
                                  <p className='text-green-500 text-sm font-semibold '>Authenticated</p>
                                </div>
                              )}
                            
                            <div className='flex items-center justify-center'>
                            <button
                                onClick={()=>{twitterSubmit()}}
                                type="submit"
                                className="w-2/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
                            >
                                Submit <MdOutlineArrowOutward className="ml-3" size={24} />
                            </button>
                            </div>
                        </div>
                        
                    </AccordionDetails>
                  </Accordion> */}
            {/* <div className='w-full flex justify-center'>
              {
                subStatus=="Unread"?
                <button
                  onClick={addSubmission}
                  className="w-1/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
                >
                  {submission?.submission_id==""?"Submit":"Update Submission"} <MdOutlineArrowOutward className="ml-3" size={24} />
                </button>
                :
                <p className='w-1/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3'>
                  {`Submission ${subStatus}`}
                </p>
              }
              
            </div> */}
           
        
        
       
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}} >
  
           
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CardDetails;