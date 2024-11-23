import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {RxCross1} from 'react-icons/rx'
import { ICP_Ambassador_Program_backend } from '../../../../../declarations/ICP_Ambassador_Program_backend'

const ReferralModal = ({setOpen}) => {
    const user=useSelector(state=>state.user.value)
    const [users,setUsers]=useState([])
    const [loading,setLoading]=useState(false)

    async function getRefers() {
        try {
            setLoading(true)
            let arr=[]
            console.log(user?.direct_refers)
            for(let i=0;i<user?.direct_refers?.length;i++){
                console.log("inside loop")
                let res=await ICP_Ambassador_Program_backend.get_user_data(user?.direct_refers[i])
                console.log(`${i} refer user : `,res)
                if(res && res!=[]){
                    arr.push({name:res[0]?.username,id:user?.direct_refers[i]})
                }
            }
            setUsers(arr)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("Error while fetching refers : ",error)
        }
    }

    useEffect(()=>{
        getRefers()
    },[])

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-transparent">
        
     <div className=' bg-white flex flex-col items-center py-3 rounded-lg min-w-[400px] ' >
        <div className="flex justify-end w-[90%] mb-2">
            <RxCross1 className='text-xl ' onClick={()=>setOpen(false)}/>
        </div>
        <h1 className="text-2xl mb-4 font-semibold">
            People referred by you
        </h1>
        <p className='text-base mb-4'>
            Referrals left : {10-user?.direct_refers?.length}
        </p>
        <div className='flex flex-col gap-4 w-[90%] my-4'>
            {
                loading?
                <p className='text-sm font-semibold w-full text-center'>
                    PLease wait a moment ...
                </p>
                :
                users?.length>0?
                <>
                    {
                        users?.map((user,index)=>(
                            <p key={index} className='text-sm font-bold'>{`${index+1}. ${user?.name}    (${user?.id})`}</p>
                        ))
                    }
                </>
                :
                <p className='text-sm font-semibold w-full text-center'>
                    No people referred yet
                </p>
            }

                <p className='text-sm text-blue-600 w-full text-center mt-8'>
                    Refer more users to earn points
                </p>
        </div>
     </div>
    </div>
  )
}

export default ReferralModal