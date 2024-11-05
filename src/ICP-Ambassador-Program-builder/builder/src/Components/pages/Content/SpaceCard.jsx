import React from 'react'

const SpaceCard = ({handleSpace,item}) => {
  return (
    <div 
          className="border border-gray-300 bg-[#fbfcff] rounded-lg min-w-[300px] h-72 hover:bg-blue-100 transition-colors duration-300 cursor-pointer"
           onClick={()=>handleSpace(item)}>
               <div className='text-black text-sm font-semibold flex justify-center mx-auto mt-4 w-32 py-3 px-4 rounded-full bg-[#fbfcff] ' style={{boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'}} >
                Not visible
               </div>
               <div className='px-3'>
                <div className='text-sm font-bold'>{item?.name}</div>
                <div className='text-sm font-semibold text-gray-500'>{`\n\nid : ${item?.description}`}</div>
               </div>
        </div>        
  )
}

export default SpaceCard