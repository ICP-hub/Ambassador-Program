import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const ReferralHandler = () => {
    const nav=useNavigate()

    useEffect(()=>{
        const handleReferral=async=>{
            const query = new URLSearchParams(window.location.search);
            const referredBy = query.get('ref');
            console.log(`You are being referred by ${referredBy}`)
            if(referredBy!=null){
                Cookies.set('ref',referredBy)
            }
            nav('/')
        }
        handleReferral()
    },[nav])

  return (
    <div className='text-4xl text-white'>
        {/* Please wait while we are redirecting you to Ambassador program */}
    </div>
  )
}

export default ReferralHandler