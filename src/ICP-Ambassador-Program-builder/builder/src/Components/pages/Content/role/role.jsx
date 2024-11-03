import React from 'react'
import Navbar from '../../Navbar/Navbar'
import Footer from '../../Footer/Footer'
import RoleList from './RoleList'

const Role = () => {
  return (
    <div>
        <Navbar/>
        <div className='h-screen'>
            <RoleList/>
        </div>
       
        <Footer/>
    </div>
  )
}

export default Role