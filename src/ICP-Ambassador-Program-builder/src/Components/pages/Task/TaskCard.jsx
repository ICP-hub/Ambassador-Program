import React, { useEffect, useState } from 'react'

const TaskCard = ({task}) => {
    const [parsedTask,setParsedTask]=useState(task)
    function parseTask(){
        let taskType=Object.keys(parsedTask)[0]
        if(taskType=="SendText"){
            setParsedTask({
                id:task[taskType]?.id,
                text:task[taskType]?.text,
                type:'text'
            })
        }
        if(taskType=="SendImage"){
            setParsedTask({
                id:task[taskType]?.id,
                img:task[taskType]?.img,
                type:'image'
            })
        }
        if(taskType=="SendUrl"){
            setParsedTask({
                id:task[taskType]?.id,
                url:task[taskType]?.url,
                type:'url'
            })
        }
    }
    useEffect(()=>{
        parseTask()
        console.log("task card : ",task)
    },[])
  return (
    <div className='flex flex-col py-4 px-3 bg-gray-100 mt-3'>
        <p className='text-sm font-bold mb-3'>{`task ID : ${parsedTask?.id+1}`}</p>
        <p className='text-sm font-bold mb-3'>{`type: ${parsedTask?.type}`}</p>
        <p className='text-sm font-bold'>Submission by user : </p>
        {
            parsedTask?.type=="url"?
            <a href={parsedTask?.url} target='blank' className='text-sm text-blue-500 cursor-pointer'>{parsedTask?.url}</a>
            :
            parsedTask?.type=="image"?
            <img src={parsedTask?.img} alt="user submission" className='object-cover w-[200px] h-[150px]'/>
            :
            <p className='text-sm'>{parsedTask?.text}</p>
        }
    </div>
  )
}

export default TaskCard