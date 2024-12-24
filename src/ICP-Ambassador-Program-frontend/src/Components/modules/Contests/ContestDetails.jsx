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
import { MdClose } from "react-icons/md";
// import upload_background from '../../../assets/images/upload_background.png'
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import Cookies from 'js-cookie'
import toast from 'react-hot-toast';

const auth = getAuth(app);

const Contest_Details = ({closeContestDetails,contests}) => {
  const adminRegex = /^[A-Za-z0-9\s]+$/;
//   const location = useLocation();
//   const { updatedContest } = location.state || {};
console.log("contest in detial ==>",contests)

  
  
  const {contesttasks}=contests.tasks
  const [description, setDescription] = useState(''); 
  const [submission,setSubmission]=useState(null)
  const [loading,setLoading]=useState(false)
  const [subStatus,setSubStatus]=useState("")
  const [authenticate,setAuth]=useState(false);
  const [twitterUser,setTwitterUser]=useState("")
  const nav=useNavigate()
   const HUB=Cookies.get('selectedHubName')
  const icons={
    
    platform: HUB,
    platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"

}
  const Contest ={
    ...updatedContest.tasks,
    icons
  }
  const [tasks, setTasks] = useState(
    contests.tasks
  );
  const hubicons={
    
    platform: HUB,
    platform_logo: "https://seeklogo.com/images/I/internet-computer-icp-logo-83628B267C-seeklogo.com.png"

} 
const updatedContest ={
    ...contests,
    hubicons
}
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

  function parseTasks(mission_tasks,sub_tasks){
    try {
      let new_tasks=[]
      console.log(mission_tasks,sub_tasks)
      for(let i=0;i<sub_tasks.length;i++){
        let taskType=Object.keys(sub_tasks[i])[0]
        console.log(taskType)
        if(taskType=="SendText"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.text})
        }
        if(taskType=="SendImage"){
          new_tasks.push({...mission_tasks[i],image:sub_tasks[i][taskType]?.img,sampleImg:mission_tasks[i].image})
        }
        if(taskType=="SendUrl"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.url})
        }
        if(taskType=="SendTwitterPost"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.post})
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
        parseTasks(tasks,res?.Ok?.tasks_submitted)
      }else{
        let newSubmission={
          submission_id:'',
          mission_id:updatedContest.mission_id,
          tasks_submitted:[],
          user:user?.id,
          status:{Unread:null}
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
  if (!contests) {
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

  const { reward, status, title, img, social_platforms,  } = updatedContest;
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
  }, [description,updatedContest]);

  if(loading){
    return(
      <div className='flex justify-center items-center h-screen'>
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    )
  }
  return (
    <div 
      className="h-full    lg:w-[400px] sm:w-full rounded-md bg-[#16161a] font-poppins" >
      
      <div className='flex justify-center items-center w-full '>
      <div className=' flex flex-col gap-16 justify-start items-start w-full  h-full ' >
        <div className="flex flex-col items-center justify-center w-full gap-10">
            
            <div className='flex flex-col gap-4 w-full h-52 rounded-md' style={{
                background: `linear-gradient(to bottom, ${randomColor}, transparent)`,    
                }}>       
                <div className='flex w-full justify-end '>
                    <div
                        className='w-7 h-7 rounded-full m-2 hover:bg-black hover:border-black flex justify-center items-center cursor-pointer'
                        onClick={closeContestDetails}
                        >
                        <MdClose className='text-white' style={{ fontSize: '20px' }} />
                    </div>
                </div>
                <div className='flex justify-around '>
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
                        className="w-40 h-32 object-cover rounded"
                        />
                    )}
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
                        <img src={hubicons.platform_logo} alt={hubicons.platform} className="w-8 h-4 rounded-full" />
                        <span className="text-md text-white ">{hubicons.platform}</span>
                    </div>
                    <div className=" font-semibold text-gray-600 text-sm">
                        {/* 2024/10/09 04:30 - 2024/10/11 04:30 GMT +03:00 */}
                    </div>
                </div>
                </div>
            </div>    
        </div>
        
        <div className='w-full flex flex-col gap-6 overflow-y-auto mb-5 p-2'>
            {tasks.map((task,index) => {
                 const [dynamicKey, taskData] = Object.entries(task)[0];
                return(
                <div className='flex flex-col gap-3 relative rounded-xl' style={{ backgroundColor: '#1d1d21' }} key={index}>
                <div className='relative rounded-lg' style={{
                    borderTop: `2px solid ${randomColor}`,   
                    borderLeft: `2px solid ${randomColor}`,  
                    borderRight: `2px solid ${randomColor}`, 
                    borderBottom: 'none',                    
                    borderRadius: '0.5rem',
                }}>
                    <Accordion style={{ backgroundColor: '#1d1d21', color: 'white' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white lg:text-md sm:text-xs" />} aria-controls="panel1-content" id="panel1-header" className="text-white  text-lg">
                        {taskData.title}
                    </AccordionSummary>
                    <div className='h-[1px] bg-gray-500 mx-4'></div>
                    <AccordionDetails>
                        {!task.submitted ? (
                        <form onSubmit={(e) => addSubmission(e, taskData.task_id)} className="flex flex-col gap-3 mt-3">
                            {dynamicKey.id === 'SendText' && (
                            <>

                                
                                <div className="text-white font-semibold lg:text-md sm:text-xs">{`Task description :\n\n ${taskData.description}`}</div>
                                <div className="border border-gray-300 rounded-md custom-quill shadow-sm w-full">
                                    {/* <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div> */}
                                    <textarea 
                                      rows={10}
                                      className='w-full py-2 px-3 bg-[#1d1d21]' 
                                      onChange={(e)=>handleInputChange(e,taskData.task_id)}
                                      value={taskData.content}
                                    />
                                </div>
                            </>
                            )}
                            {dynamicKey === 'SendUrl' && (
                              <>
                              <div className='flex flex-col gap-3'>

                              <div className="text-white font-semibold lg:text-md sm:text-xs">{`Task description :\n\n ${taskData.description}`}</div>
                                  <input
                                  type='SendURL'
                                  placeholder='Enter URL'
                                  onChange={(e) => handleInputChange(e, task.task_id)}
                                  className='outline-none p-3 rounded text-black'
                                  value={taskData.content}
                              />

                              </div>
                            
                            
                            </>
                            )}
                            {dynamicKey==="SendTwitterPost" && (
                               
                                   
                                   <div  className="flex flex-col gap-3 mt-3">  
                                       <div className="text-white font-semibold lg:text-md sm:text-xs">{`Task description :\n\n ${taskData.description}`}</div>
                                       <div className ='flex w-full gap-4 items-center'>
                                       <input
                                             type='text'
                                             value={task.content}
                                             placeholder='Share post link'
                                             onChange={(e) => handleInputChange(e, taskData.task_id)}
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
                            {dynamicKey === 'SendImage' && (
                            <div className="mt-4 w-full ">
                              <div className="text-white font-semibold lg:text-md sm:text-xs">{taskData.description}</div>
                              <div className='flex gap-5 my-5'>
                                <div className="text-white font-semibold lg:text-md sm:text-xs mt-4">Sample Image</div>
                                <img src={task.sampleImg} className='w-40 h-40' alt=''/>
                              </div>
                                
                                <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-auto mx-auto">
                                {task.image ? (
                                    <img src={typeof task.image=='object'?URL.createObjectURL(taskData.image):taskData.image} alt="Uploaded" className="object-contain sm:max-h-64 sm:w-full h-[300px] w-[400px]" />
                                ) : (
                                    <img src={'upload_background.png'} alt="" className="" />
                                )}
                                <div  className='mt-4 text-gray-500'>drag file here or</div>
                                <label className="mt-4 w-full bg-blue-500 rounded">
                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, task.task_id)} />
                                    <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-white text-black hover:text-white rounded-md b cursor-pointer hover:bg-blue-600">
                                    BROWSE
                                    </div>
                                </label>
                                </div>
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
                        ) : (
                        // <div className="text-white text-md flex justify-center items-center">Already Submitted</div>
                        <></>
                        )}
                        
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
            <div className='w-full flex justify-center'>
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
              
            </div>
           
        
        
       
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}} >
  
           
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Contest_Details;