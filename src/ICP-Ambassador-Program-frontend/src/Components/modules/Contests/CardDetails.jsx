import React,{useState,useRef,useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { FaXTwitter } from "react-icons/fa6";
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaFileImage } from "react-icons/fa";
import { LuText } from "react-icons/lu";
import { RiAttachment2 } from "react-icons/ri";
import { MdDelete, MdOutlineArrowOutward } from "react-icons/md";
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
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import 'quill/dist/quill.snow.css';
// import upload_background from '../../../assets/images/upload_background.png'
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import Cookies from 'js-cookie'
import toast from 'react-hot-toast';

const colors={
  twitter:'rgb(29,155,240)',
  img:'rgb(222,117,21)',
  text:'rgb(109,21,222)',
  completed:'rgb(29,185,84)'
}

const auth = getAuth(app);

//const auth = getAuth(app);

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
  const [unsubmittedTwitterPost,setUnsubmittedTwitterPost]=useState([])
  const nav=useNavigate()
  const [tasks, setTasks] = useState(
    updatedContest.tasks
  );
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
                  content: [fileContent], // This is the field expected by the backend
                  content_type: metadata.contentType // Ensure this matches backend expectations
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
        setLoading(false)
        toast.success(submission.submission_id==""?"Added new submission":'Updated the submission')
        nav('/')
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

  function parseTasks(mission_tasks,sub_tasks){
    try {
      let new_tasks=[]
      console.log(mission_tasks,sub_tasks)
      for(let i=0;i<sub_tasks.length;i++){

        let taskType=Object.keys(sub_tasks[i])[0]
        console.log(taskType)
        if(taskType=="SendText"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.text,completed:true})
        }
        else if(taskType=="SendImage"){
          new_tasks.push({...mission_tasks[i],image:sub_tasks[i][taskType]?.img,sampleImg:mission_tasks[i].image,completed:true})
        }
        else if(taskType=="SendUrl"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.url,completed:true})
        }
        else if(taskType=="SendTwitterPost"){
          console.log("parsing twitter post")
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.post,completed:true})
        }
        else if(taskType=="TwitterFollow"){
          new_tasks.push({...mission_tasks[i],completed:true})
        
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
      }
    } catch (error) {
      console.log("error while fetching submission : ",error)
    }
  }
  const Check_authentication = async (e) => {
    e.preventDefault();
    
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

  const handleFileChange = (e, taskId) => {
    const file = e.target.files[0];
    setTasks(prevTasks => prevTasks.map(task => 
      task.task_id === taskId ? { ...task, image: file } : task
    ));
  };
  const clearFile =(taskId)=>{
    setTasks(prevTasks => prevTasks.map(task => 
      task.task_id === taskId ? { ...task, image: '' } : task
    ));
  }

  
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
                      className="lg:w-24 lg:h-24 sm:w-44 sm:h-24 object-cover rounded"
                    />
                )}
                </div>
            </div>
            <div className='flex flex-col gap-4 justify-start items-start'>
                <div className='font-bold text-sm' 
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
                    <div className='text-white text-xl font-bold'>{title}</div>
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
        <p className='text-white'>{updatedContest?.description}</p> 
        {
          !authenticate && unsubmittedTwitterPost?.length>0?
          <button className=' px-4 flex justify-center items-center text-sm font-semibold py-2 bg-white text-black rounded-md b cursor-pointer ' onClick={Check_authentication}>Authenticate for twitter tasks</button>

            :
            <></>
          
        }

        <div className='w-full flex flex-col gap-6 overflow-y-auto mb-5'>
            {tasks.map((task,index) => (
                <div className='flex flex-col gap-3 relative rounded-xl' style={{ backgroundColor: '#1d1d21' }} key={index}>
                <div className='relative rounded-lg' style={{
                    borderTop: `2px solid ${randomColor}`,   
                    borderLeft: `2px solid ${randomColor}`,  
                    borderRight: `2px solid ${randomColor}`, 
                    borderBottom: 'none',                    
                    borderRadius: '0.5rem',
                }}>
                    <Accordion  style={{ backgroundColor: '#1d1d21', color: 'white' }} defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white lg:text-md sm:text-xs" />} aria-controls="panel1-content" id="panel1-header" className="text-white font-semibold text-lg">
                        <div className='flex items-center text-white'>
                          {
                            task?.bg=='img'?
                            <div className='w-10 h-10 rounded-full flex items-center justify-center mr-2' style={{backgroundColor:colors.img}}>
                              <feImage className='text-white'/>
                            </div>
                            :
                            task?.bg=='text'?
                            <div className='w-10 h-10 rounded-full flex items-center justify-center mr-2' style={{backgroundColor:colors.text}}>
                            <LuText className=''/>
                            </div>
                            :
                            <div className='w-10 h-10 rounded-full flex items-center justify-center mr-2' style={{backgroundColor:colors.twitter}}>
                            <BsTwitterX className=''/>
                            </div>
                          }
                          <p>{task.title}</p>
                        </div>
                        
                    </AccordionSummary>
                    <div className='h-[1px] bg-gray-500 mx-4'></div>
                    <AccordionDetails>
                        {!task.submitted ? (
                        <form onSubmit={(e) => {e.preventDefault()}} className="flex flex-col gap-6 mt-3">
                          {
                            task.id==='TwitterFollow' && (
                              <p>Please click on the link to follow the twitter account</p>
                            )
                          }
                            {task.id === 'SendText' && (
                            <>

                                
                                <div className="text-white font-semibold lg:text-md sm:text-xs">{`Task description :\n\n ${task.description}`}</div>
                                <div className="my-4 text-white font-semibold lg:text-md sm:text-xs">{`Sample text :\n\n ${task.sampleText}`}</div>
                                <div className="border border-gray-300 rounded-md custom-quill shadow-sm w-full">
                                    {/* <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div> */}
                                    <textarea 
                                      rows={10}
                                      className='w-full py-2 px-3 bg-[#1d1d21]' 
                                      onChange={(e)=>handleInputChange(e,task.task_id)}
                                      value={task.content}
                                    />
                                </div>
                            </>
                            )}
                            {task.id === 'SendUrl' && (
                              <>
                              <div className='flex flex-col gap-3'>

                              <div className="text-white font-semibold lg:text-md sm:text-xs">{`Task description :\n\n ${task.description}`}</div>
                                  <input
                                  type='SendURL'
                                  placeholder='Enter URL'
                                  onChange={(e) => handleInputChange(e, task.task_id)}
                                  className='outline-none p-3 rounded text-black'
                                  value={task.content}
                              />

                              </div>
                            
                            
                            </>
                            )}
                            {task.id==="SendTwitterPost" && (
                               
                                   
                                   <div  className="flex flex-col gap-3 mt-3">  
                                       <div className="text-white font-semibold lg:text-md sm:text-xs">{`Task description :\n\n ${task.description}`}</div>
                                       <div className ='flex w-full gap-4 items-center'>
                                       <input
                                             type='text'
                                             value={task.content}
                                             placeholder='Share post link'
                                             onChange={(e) => handleInputChange(e, task.task_id)}
                                             className='outline-none p-3 rounded w-full text-black'
                                         />
                                         {/* {!authenticate ?(
                                           <button className='w-12 lg:h-12 sm:h-10  bg-white flex justify-center items-center rounded-full curso-pointer' onClick={(e)=>{Check_authentication(e)}}>
                                           <PrivacyTipIcon className='text-black'/>
                                           </button>
                                         ):(
                                           <div className='w-12 h-12 bg-white flex justify-center items-center rounded-full'>
                                             <AdminPanelSettingsIcon className=' text-green-600'/>
                                         </div>
                                         )} */}
                                         
                                       </div>
                                       {!authenticate ?(
                                           <div>
                                             {/* <p  className='text-gray-400 text-sm font-semibold'>Authenticate Twitter before submitting. Click on top right icon  to authenticate</p> */}
                                           </div>
                                         ):(
                                           <div >
                                             {/* <p className='text-green-500 text-sm font-semibold '>Authenticated</p> */}
                                           </div>
                                         )}
                                       
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
                              <div className="text-white font-semibold lg:text-md sm:text-xs">{task.description}</div>
                              {/* <div className='flex gap-5 my-5'>
                                <div className="text-white font-semibold lg:text-md sm:text-xs mt-4">Sample Image</div>
                                <img src={task.sampleImg} className='w-40 h-40' alt=''/>
                              </div> */}
                                
                                <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-auto mx-auto">
                                {/* {task.image ? (
                                    <img src={typeof task.image=='object'?URL.createObjectURL(task.image):task.image} alt="Uploaded" className="object-contain sm:max-h-64 sm:w-full h-[300px] w-[400px]" />
                                ) : (
                                    <img src={'upload_background.png'} alt="" className="" />
                                )} */}
                                {/* <div  className='mt-4 text-gray-500'>drag file here or</div> */}
                                <div className='flex items-center px-2 mt-4' style={{boxShadow:'0 0 0 0.3px orange'}}>
                                  <label className=" w-full flex flex-col items-center rounded z-10">
                                      <input type="file" className="hidden" onChange={(e) => handleFileChange(e, task.task_id)} />
                                      {/* <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-white text-black hover:text-white rounded-md b cursor-pointer hover:bg-blue-600">
                                      BROWSE
                                      </div> */}
                                      <div 
                                        style={{ backgroundColor: '#1e1e1e', color: 'white', }} className=" max-w-[900px] w-[50vw] py-3 px-2 min-w-[300px] flex justify-between items-center  bg-[#1e1e1e]">
                                        <div className="flex items-center cursor-pointer">
                                          <RiAttachment2 className='text-white mr-1 '/>
                                          {task?.image?.name||"Choose image"}
                                        </div>
                                        
                                      </div>
                                  </label>
                                  <MdDelete className='text-red-600 z-30 text-2xl cursor-pointer' onClick={()=>clearFile(task?.task_id)}/>
                                </div>
                                
                                </div>
                            </div>
                          
                            <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-auto mx-auto">
                              {task.image ? (
                                <img src={task.Uploaded_image} alt="Uploaded" className="object-contain max-h-64" />
                              ) : (
                                <img src={'upload_background.png'} alt="" className="w-80" />
                              )}
                              <div className="mt-4 text-gray-500">Drag file here or</div>
                              <label className="w-full">
                                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, task.id)} />
                                <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-white text-black hover:text-white rounded-md b cursor-pointer hover:bg-blue-600">
                                  BROWSE
                                </div>
                              </label>
                            </div>
                          
                          
                            )}
                            <div className='flex items-center justify-center'>
                              {
                                task?.completed?
                                <button
                                className={
                                  `w-2/3 flex justify-center items-center max-w-[600px] bg-[rgb(29,185,84)] text-white rounded bg- text-sm font-semibold h-9 m-3 sm:w-[80vw]`
                                }
                            >
                                <IoCheckmarkSharp className="mr-3" size={24} /> Completed
                            </button>
                                :
                                <button
                                className="w-2/3 flex justify-center items-center max-w-[600px] text-white rounded bg-white text-sm font-semibold h-9 m-3 sm:w-[80vw]"
                                style={{
                                  backgroundColor:task?.bg=="img"?"rgb(222,117,21)":task?.bg=="text"?"rgb(109,21,222)":"rgb(29,155,240)"
                                }}
                                onClick={()=>submitTask(task?.task_id)}
                            >
                                <IoCheckmarkSharp className="mr-3" size={24} /> Confirm
                            </button>
                              }
                            
                            </div>
                        </form>
                        ) : (
                        // <div className="text-white text-md flex justify-center items-center">Already Submitted</div>
                        <></>
                        )}
                        
                    </AccordionDetails>
                    </Accordion>
                    
                </div>
                </div>
            ))}
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
