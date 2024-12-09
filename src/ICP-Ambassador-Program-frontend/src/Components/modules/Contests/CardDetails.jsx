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
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
// import upload_background from '../../../assets/images/upload_background.png'
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import Cookies from 'js-cookie'
import toast from 'react-hot-toast';

const CardDetails = () => {
  const adminRegex = /^[A-Za-z0-9\s]+$/;
  const location = useLocation();
  const { updatedContest } = location.state || {};
  const [description, setDescription] = useState(''); 
  const [submission,setSubmission]=useState(null)
  const [loading,setLoading]=useState(false)
  const nav=useNavigate()
  const [tasks, setTasks] = useState(
    updatedContest.tasks
  );

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
          new_tasks.push({...mission_tasks[i],image:sub_tasks[i][taskType]?.img})
        }
        if(taskType=="SendUrl"){
          new_tasks.push({...mission_tasks[i],content:sub_tasks[i][taskType]?.url})
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
 
        setSubmission(res?.Ok)
        parseTasks(tasks,res?.Ok?.tasks_submitted)
      }else{
        console.log({
          submission_id:'',
          mission_id:updatedContest.mission_id,
          tasks_submitted:[],
          user:user?.id
        })
        setSubmission({
          submission_id:'',
          mission_id:updatedContest?.mission_id,
          tasks_submitted:[],
          user:user?.id
        })
      }
    } catch (error) {
      console.log("error while fetching submission : ",error)
    }
  }

  async function addSubmission(){
    try{
      // e.preventDefault();
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
          task={
            SendImage:{
              id:tasks[i]?.task_id,
              img:tasks[i]?.content || ""
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
      setLoading(true)
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

  const { reward, status, title, image, social_platforms, icons } = updatedContest;
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
      <div className='flex justify-center items-center ml-20 '>
      <div className=' flex flex-col gap-16 justify-start items-start  w-3/4 mt-10 h-full ' >
        <div className="flex items-center justify-center  gap-10">
            <div>
                <div className="mb-4">
                {image ? (
                    <img src={image} alt={title} className="w-44 h-44 object-cover rounded-lg" />
                ) : (
                    // <div className="w-20 h-20 bg-gray-700 flex items-center justify-center rounded">
                    // <span>No Image</span>
                    // </div>
                    <img
                      src='https://robots.net/wp-content/uploads/2023/11/what-is-blockchain-used-for-1698982380.jpg'
                      alt={title}
                      className="w-24 h-24 object-cover rounded"
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
                    2024/10/09 04:30 - 2024/10/11 04:30 GMT +03:00
                </div>
            </div>    
        </div>
        
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
                    <Accordion style={{ backgroundColor: '#1d1d21', color: 'white' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white" />} aria-controls="panel1-content" id="panel1-header" className="text-white font-semibold text-lg">
                        {task.title}
                    </AccordionSummary>
                    <div className='h-[1px] bg-gray-500 mx-4'></div>
                    <AccordionDetails>
                        {!task.submitted ? (
                        <form onSubmit={(e) => addSubmission(e, task.task_id)} className="flex flex-col gap-3 mt-3">
                            {task.id === 'SendText' && (
                            <>

                                
                                <div className="text-white font-semibold text-md">{task.description}</div>
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

                              <div className="text-white font-semibold text-md">{task.description}</div>
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
                            {task.id === 'SendImage' && (
                            <div className="mt-4 w-full ">
                              <div className="text-white font-semibold text-md">{task.description}</div>
                              <div className='flex gap-5 my-5'>
                                <div className="text-white font-semibold text-md mt-4">Sample Image</div>
                                <img src={task.image} className='w-40 h-40' alt=''/>
                              </div>
                                
                                <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-80 mx-auto">
                                {task.image ? (
                                    <img src={task.imagye} alt="Uploaded" className="object-contain h-full w-full" />
                                ) : (
                                    <img src={'upload_background.png'} alt="" className="w-80" />
                                )}
                                <div>drag file here or</div>
                                <label className="mt-4 w-full bg-blue-500 rounded">
                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, task.task_id)} />
                                    <div className="w-full flex justify-center items-center text-sm font-semibold py-2  bg-white text-black rounded-md cursor-pointer hover:bg-blue-600">
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
                </div>
            ))}
            <div className='w-full flex justify-center'>
              <button
                onClick={addSubmission}
                className="w-1/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
              >
                {submission?.submission_id==""?"Submit":"Update Submission"} <MdOutlineArrowOutward className="ml-3" size={24} />
              </button>
            </div>
           
        
        
       
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}} >
  
           
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CardDetails;
