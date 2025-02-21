import React, { useEffect, useState } from 'react'

const TaskCard = ({ task }) => {
    const [parsedTask, setParsedTask] = useState(task)
    function parseTask() {
        let taskType = Object.keys(parsedTask)[0]
        if (taskType == "SendText") {
            setParsedTask({
                id: task[taskType]?.id,
                text: task[taskType]?.text,
                type: 'text'
            })
        }
        if (taskType == "SendImage") {
            setParsedTask({
                id: task[taskType]?.id,
                img: task[taskType]?.img,
                type: 'image'
            })
        }
        if (taskType == "SendUrl") {
            setParsedTask({
                id: task[taskType]?.id,
                url: task[taskType]?.url,
                type: 'url'
            })
        }
        if (taskType == "SendTwitterPost") {
            setParsedTask({
                id: task[taskType]?.id,
                url: task[taskType]?.post,
                type: 'url'
            })
        }
        if (taskType == "TwitterFollow") {
            setParsedTask({
                id: task[taskType].id,
                followed: true,
                type: 'follow'
            })
        }
    }
    useEffect(() => {
        parseTask()
        console.log("task cards : ", parsedTask)
    }, [])
    return (
        <div className='flex flex-col py-4 px-3 bg-gray-100 mt-3'>
            <p className='text-sm font-bold mb-3'>{`task ID : ${parsedTask?.id + 1}`}</p>
            <p className='text-sm font-bold mb-3'>{`type: ${parsedTask?.type}`}</p>
            {
                parsedTask?.type != 'follow' && (
                    <p className='text-sm font-bold'>Submission by user : </p>
                )
            }
            {
                parsedTask?.type == "url" ?
                    <a href={parsedTask?.url} target='blank' className='text-sm text-blue-500 cursor-pointer'>{parsedTask?.url}</a>
                    :
                    parsedTask?.type == "image" ?
                        <>
                            <img src={parsedTask?.img} alt="user submission" className='object-cover w-[200px] h-[150px]' />
                            <a href={parsedTask?.img} target='blank' className='text-sm text-blue-500 cursor-pointer'>{parsedTask?.img}</a>
                        </>
                        :
                        parsedTask?.type == "follow" ?
                            <p className='text-sm text-black'>Account is followed by the user</p>
                            :
                            <p className='text-sm'>{parsedTask?.text}</p>
            }
        </div>
    )
}

export default TaskCard