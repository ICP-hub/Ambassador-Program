import React,{useEffect, useState} from 'react'
import Navbar from '../Navbar/Navbar'
import { Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TaskCard from './TaskCard';
import toast from 'react-hot-toast';
const Task_Details = ({setLoading}) => {
    const location = useLocation();
    const row = location.state?.row;
    const [tasks,setTasks]=useState(row.tasks)
    const [selectedUser, setSelectedUser] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const actors=useSelector(state=>state.actor.value)
    const nav=useNavigate()
    const [users,setUsers] = useState([
        // { id: 1, name: "993209495805239487", description: "User description for rjx25349" },
        // { id: 2, name: "abc12345", description: "User description for abc12345" },
        // { id: 3, name: "xyz98765", description: "User description for xyz98765" },
        // { id: 4, name: "lmn56789", description: "User description for lmn56789" },
        // { id: 5, name: "pqr54321", description: "User description for pqr54321" },
    ]);

    async function getSubmissions(load){
        try {
            setUsers([])
            if(load==true){
                setLoading(true)
            }
            let res=await actors?.backendActor?.get_all_mission_submissions(row?.mission_id);
            console.log("mission specific submissions : ",res)
            if(res && res!=[]){
                let arr=[]
                console.log("submissions not empty")
                for(let i=0;i<res[0]?.submissions?.length;i++){
                    let subRes=await actors?.backendActor?.get_submission(res[0]?.submissions[i])
                    console.log("sub details : ",subRes)
                    if(subRes?.Ok){
                        if(Object.keys(subRes?.Ok?.status)[0]=='Unread'){
                            arr.push(subRes?.Ok)
                        }
                    }
                }
                console.log("sub arr : ",arr)
                setUsers(arr)
            }
                setLoading(false)

        } catch (error) {
            console.log("error fetching submissions : ",error)
            setLoading(false)
        }
    }

    useEffect(()=>{
        getSubmissions(false)
        console.log("mission tasks page : ",row)
    },[])
    // console.log("Tasks",tasks)
    // console.log("Mission ==>",row);

    const handleView = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    // Close the modal
    const handleClose = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    async function rejectSubmission(){
        try{
            setLoading(true)
            const res=await actors?.backendActor?.reject_submission(selectedUser?.submission_id);
            console.log("submission reject res : ",res)
            if(res?.Ok){
                
                setLoading(false)
                toast.success("Submission rejected")
                handleClose()                
            }else{
                setLoading(false)
                toast.error("Something went wrong!")
            }
        }catch(err){
            setLoading(false)                                                
            toast.error("Something went wrong")
            console.log("error approving the submission : ",err)
        }
    }

    async function approveSubmission(){
        try{
            setLoading(true)
            console.log(row?.submission_id)
            const res=await actors?.backendActor?.approve_submission(selectedUser?.submission_id);
            console.log("submission approve res : ",res)
            if(res?.Ok){
                setLoading(false)
                toast.success("Submission approved")

                handleClose()                
            }else{
                setLoading(false)
                toast.error("Something went wrong!")
            }
        }catch(err){
            setLoading(false)
            toast.error("Something went wrong")
            console.log("error approving the submission : ",err)
        }
    }

  return (
    <div>
    <Navbar nav={nav}/>
    <div className='flex flex-col   mx-20 my-10'>
        <div className=' flex flex-col'>
            <div className='font-semibold text-3xl mb-3'>Submissions</div>
            <div className=' w-full border border-gray-300'></div>
        </div>
        <div className='mt-4 flex gap-4 items-center '>
            <div className='font-semibold text-2xl'>Mission :</div>
            <div className='font-semibold text-xl'>{row.title}</div>
        </div>

        <div>
            {tasks.length > 0 ? (
                tasks.map((task, index) => {
                    const key = Object.keys(task)[0]; 
                    const taskData = task[key]; 
                    return (
                        <div className="grid grid-cols-[15%_60%] my-3 items-center" key={index}>
                            <div className="font-semibold text-lg  ">
                                {key} :
                            </div>
                            <div className="font-semibold text-md border rounded border-gray-500 p-3">
                                <div>{taskData.body || "No description provided"}</div>
                                <div>{taskData.sample || ""}</div>
                                {taskData.img?(
                                    <img src={taskData.img} className='w-48 h-48 object-cover my-3' alt=''/>
                                ):(
                                    null
                                )}
                                
                            </div>
                        </div>
                    );
                })
            ) : (
                <div>No tasks</div>
            )}
        </div>

        <div className="py-4 w-1/2">
            
            {
            users?.length>0?
            users.map((user) => (
                <div
                    key={user.id}
                    className="flex justify-between items-center border rounded p-4 mb-2 bg-gray-200"
                >
                    <div className="font-bold">User: {user?.user}</div>
                    <button
                        className="px-4 py-2 bg-black text-white rounded font-semibold "
                        onClick={() => handleView(user)}
                    >
                        View
                    </button>
                    
                </div>
            ))
            :
            <p className='text-xl mt-4'>No unreviewed submissions on this mission</p>
            }

            
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 overflow-y-scroll">
                    <div className="bg-white p-6  max-h-[80vh] rounded shadow-lg w-1/2 overflow-y-scroll">
                        <h2 className="text-lg font-bold mb-4">User Submission</h2>
                        <p>
                            <strong>Name:</strong> {selectedUser.user}
                        </p>
                        {
                            selectedUser?.tasks_submitted?.map((task,index)=>(
                                <TaskCard task={task} key={index}/>
                            ))
                        }
                        <div className="flex justify-between mt-8">
                            <button
                                className="px-4 py-2 bg-black text-white rounded  font-semibold mr-2"
                                onClick={approveSubmission}
                            >
                                Approve
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded font-semibold "
                                onClick={rejectSubmission}
                            >
                                Reject
                            </button>
                            <button className='px-4 py-2 bg-black text-white rounded font-semibold' onClick={handleClose}>
                                See later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        
    </div>  

    </div>
    
  )
}

export default Task_Details