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
import Quill from 'quill';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import 'quill/dist/quill.snow.css';
// import upload_background from '../../../assets/images/upload_background.png'
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import Cookies from 'js-cookie'

const auth = getAuth(app);

const CardDetails = () => {
  const adminRegex = /^[A-Za-z0-9\s]+$/;
  const location = useLocation();
  const { updatedContest } = location.state || {};
  const [description, setDescription] = useState(''); 
  const [authenticate,setAuth]=useState(false);
  const nav=useNavigate()
  const [tasks, setTasks] = useState(
    updatedContest.tasks
  );
  

  const [twitterLink, setTwitterLink] = useState("");

    const handleInputTwitter = (e) => {
        setTwitterLink(e.target.value);
    };


  

  const handleInputChange = (e, taskId) => {
    
    const value = e.target.value;
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, content: value } : task
    ));
  };

  const handleFileChange = (e, taskId) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const fileURL = URL.createObjectURL(file);
  
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, Uploaded_image: fileURL } : task
      )
    );
    console.log(tasks)
  };
  

  
  const handleSubmit =async (e, taskId) => {
    e.preventDefault();
    setTasks(prevTasks => prevTasks.map(task =>
      task.id === taskId ? { ...task, submitted: true } : task
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
        placeholder: 'Enter your submittion...',
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

  const Check_authentication = async (e) => {
    e.preventDefault();

    
    const provider = new TwitterAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("user ==>",user)
        const username = user.reloadUserInfo.screenName;
        console.log("username ==>",username)
        
        const regex = /(?:twitter|x)\.com\/([^\/]+)/;

        const match = twitterLink.match(regex);
        const usernameInLink = match ? match[1] : null;
        console.log("userNameInLink ==>", usernameInLink);
        if (usernameInLink && usernameInLink === username) {
            setAuth(true);
            console.log("Authentication successful");
        } else {
            console.log("User not authenticated");
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

  return (
    <div style={{
        background: `linear-gradient(to bottom, ${randomColor}, transparent)`,
        
      }}
      className="h-full pt-3" >
      <Navbar nav={nav} />
      <div className='flex justify-center items-center lg:ml-20 sm:ml-0   '>
      <div className=' flex flex-col gap-16 justify-start items-start  lg:w-3/4 sm:w-full lg:p-0 sm:p-3  mt-10 h-full ' >
        <div className="flex items-center justify-center  gap-10">
            <div>
                <div className="mb-4">
                {image ? (
                    <img src={image} alt={title} className="lg:w-44 lg:h-44 sm:w-44 sm:h-20 object-cover rounded-lg" />
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
                    2024/10/09 04:30 - 2024/10/11 04:30 GMT +03:00
                </div>
            </div>    
        </div>
        
        <div className='w-full flex flex-col gap-6 overflow-y-auto mb-5'>
            {tasks.map((task) => (
                <div className='flex flex-col gap-3 relative rounded-xl' style={{ backgroundColor: '#1d1d21' }} key={task.id}>
                <div className='relative rounded-lg' style={{
                    borderTop: `2px solid ${randomColor}`,   
                    borderLeft: `2px solid ${randomColor}`,  
                    borderRight: `2px solid ${randomColor}`, 
                    borderBottom: 'none',                    
                    borderRadius: '0.5rem',
                }}>
                    <Accordion style={{ backgroundColor: '#1d1d21', color: 'white' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white lg:text-md sm:text-xs" />} aria-controls="panel1-content" id="panel1-header" className="text-white font-semibold text-lg">
                        {task.title}
                    </AccordionSummary>
                    <div className='h-[1px] bg-gray-500 mx-4'></div>
                    <AccordionDetails>
                        {!task.submitted ? (
                        <form onSubmit={(e) => handleSubmit(e, task.id)} className="flex flex-col gap-3 mt-3">
                            {task.id === 'SendText' && (
                            <>

                                
                                <div className="text-white font-semibold lg:text-md sm:text-xs">{task.description}</div>
                                <div className="border border-gray-300 rounded-md custom-quill shadow-sm w-full">
                                    <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div>
                                </div>
                            </>
                            )}
                            {task.id === 'SendUrl' && (
                              <>
                              <div className='flex flex-col gap-3'>

                              <div className="text-white font-semibold lg:text-md sm:text-xs">{task.description}</div>
                                  <input
                                  type='SendURL'
                                  placeholder='Enter URL'
                                  onChange={(e) => handleInputChange(e, task.id)}
                                  className='outline-none p-3 rounded text-black'
                              />

                              </div>
                            
                            
                            </>
                            )}
                            {task.id === 'SendImage' && (
                              
                            <div className="mt-4 w-full">
                            <div className="text-white font-semibold lg:text-md sm:text-xs">{task.description}</div>
                            <div className="flex gap-5 my-5">
                              <div className="text-white font-semibold lg:text-md sm:text-xs mt-4">Sample Image</div>
                              <img src={task.image} className="w-40 h-40" alt="" />
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
                          </div>
                          
                            )}
                            <div className='flex items-center justify-center'>
                            <button
                                type="submit"
                                className="w-2/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
                            >
                                Submit <MdOutlineArrowOutward className="ml-3" size={24} />
                            </button>
                            </div>
                        </form>
                        ) : (
                        <div className="text-white text-md flex justify-center items-center">Already Submitted</div>
                        )}
                    </AccordionDetails>
                    </Accordion>
                    
                </div>
                </div>
            ))}

                  <Accordion style={{ backgroundColor: '#1d1d21', color: 'white' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white lg:text-md sm:text-xs" />} aria-controls="panel1-content" id="panel1-header" className="text-white font-semibold text-lg">
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
                                <div className='w-12 lg:h-12 sm:h-10 bg-white flex justify-center items-center rounded-full'>
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
                  </Accordion>
    
        
        
       
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}} >
  
           
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CardDetails;
