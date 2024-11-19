import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import MissionEdit from './mission_edit'
import { useNavigate } from 'react-router-dom'
const Mission_Task = ({setLoading}) => {
  const nav=useNavigate()
  return (
    <div>
        <Navbar nav={nav}/>
        <MissionEdit setLoading={setLoading}/>
        <Footer/>
    </div>
  )
}

export default Mission_Task