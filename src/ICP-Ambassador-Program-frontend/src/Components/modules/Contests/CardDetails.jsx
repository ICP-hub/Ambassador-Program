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

const CardDetails = () => {
  const adminRegex = /^[A-Za-z0-9\s]+$/;
  const location = useLocation();
  const { updatedContest } = location.state || {};
  const [description, setDescription] = useState(''); 
  const nav=useNavigate()
  const [tasks, setTasks] = useState(
    updatedContest.tasks
  );


  

  const handleInputChange = (e, taskId) => {
    
    const value = e.target.value;
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, title: value } : task
    ));
  };

  const handleFileChange = (e, taskId) => {
    const file = e.target.files[0];
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, image: file } : task
    ));
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
        placeholder: 'Type your description here...',
      });

      quillRef.current.clipboard.dangerouslyPasteHTML(description);

      quillRef.current.on('text-change', () => {
        const textContent = quillRef.current.getText().replace(/\n/g, '');
        if (adminRegex.test(textContent)) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === 'SendText' ? { ...task,description: textContent } : task
            )
          );
        } else {
          console.log('Invalid content detected');
        }
      });
    }
  }, [description]);

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
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white" />} aria-controls="panel1-content" id="panel1-header" className="text-white font-semibold text-lg">
                        {task.id}
                    </AccordionSummary>
                    <div className='h-[1px] bg-gray-500 mx-4'></div>
                    <AccordionDetails>
                        {!task.submitted ? (
                        <form onSubmit={(e) => handleSubmit(e, task.id)} className="flex flex-col gap-3 mt-3">
                            {task.id === 'SendText' && (
                            <>

                                <div className='flex flex-col gap-3'>

                                <label className='text-lg ml-1 font-semibold'>Title</label>
                                <input
                                type='SendURL'
                                value={task.title}
                                placeholder={task.title}
                                onChange={(e) => handleInputChange(e, task.id)}
                                className='outline-none p-3 rounded text-black'
                                />

                                </div>
                                <div className="text-white font-semibold text-md">Description</div>
                                <div className="border border-gray-300 rounded-md custom-quill shadow-sm w-full">
                                    <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div>
                                </div>
                            </>
                            )}
                            {task.id === 'SendUrl' && (
                              <>
                              <div className='flex flex-col gap-3'>

                                  <label className='text-lg ml-1 font-semibold'>Title</label>
                                  <input
                                  type='SendURL'
                                  value={task.title}
                                  placeholder={task.title}
                                  onChange={(e) => handleInputChange(e, task.id)}
                                  className='outline-none p-3 rounded text-black'
                              />

                              </div>
                            <div className='flex flex-col gap-3'>
                              <label className='text-lg ml-1 font-semibold'>Description</label>
                              <div className="border border-gray-300 rounded-md custom-quill shadow-sm w-full">
                                    <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div>
                                </div>
                            </div>  
                            
                            </>
                            )}
                            {task.id === 'SendImage' && (
                            <div className="mt-4 w-full ">
                                <div className="text-white font-semibold text-md">Sample Image</div>
                                <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-80 mx-auto">
                                {task.image ? (
                                    <img src={task.image} alt="Uploaded" className="object-contain h-full w-full" />
                                ) : (
                                    <img src={'upload_background.png'} alt="" className="w-80" />
                                )}
                                <div>drag file here or</div>
                                <label className="mt-4 w-full bg-blue-500 rounded">
                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, task.id)} />
                                    <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-white text-black rounded-md cursor-pointer hover:bg-blue-600">
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
    
        
        
       
        <div className='flex flex-col gap-3 relative rounded-xl' style={{backgroundColor:'#1d1d21'}} >
  
           
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CardDetails;
