import React,{useState} from 'react'
import Navbar from '../Navbar/Navbar'
import { Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
const Task_Details = () => {
    const location = useLocation();
    const row = location.state?.row;
    const [tasks,setTasks]=useState(row.tasks)
    const [selectedUser, setSelectedUser] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [users] = useState([
        { id: 1, name: "rjx25349", description: "User description for rjx25349" },
        { id: 2, name: "abc12345", description: "User description for abc12345" },
        { id: 3, name: "xyz98765", description: "User description for xyz98765" },
        { id: 4, name: "lmn56789", description: "User description for lmn56789" },
        { id: 5, name: "pqr54321", description: "User description for pqr54321" },
    ]);
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

  return (
    <div>
    <Navbar/>
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
            
            {users.map((user) => (
                <div
                    key={user.id}
                    className="flex justify-between items-center border rounded p-4 mb-2 bg-gray-200"
                >
                    <div className="font-bold">User: {user.name}</div>
                    <button
                        className="px-4 py-2 bg-black text-white rounded font-semibold "
                        onClick={() => handleView(user)}
                    >
                        View
                    </button>
                    
                </div>
            ))}

            
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-white p-6  h-56 rounded shadow-lg w-1/2">
                        <h2 className="text-lg font-bold mb-4">User Task</h2>
                        <p>
                            <strong>Name:</strong> {selectedUser.name}
                        </p>
                        <p>
                            <strong>Description:</strong> {selectedUser.description}
                        </p>
                        <div className="flex justify-between mt-8">
                            <button
                                className="px-4 py-2 bg-black text-white rounded  font-semibold mr-2"
                                onClick={() => {
                                    alert(`${selectedUser.name} Approved!`);
                                    handleClose();
                                }}
                            >
                                Approve
                            </button>
                            <button
                                className="px-4 py-2 bg-black text-white rounded font-semibold "
                                onClick={() => {
                                    alert(`${selectedUser.name} Rejected!`);
                                    handleClose();
                                }}
                            >
                                Reject
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