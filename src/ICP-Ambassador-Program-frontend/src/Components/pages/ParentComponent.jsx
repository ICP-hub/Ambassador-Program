import React from 'react'
import Footer from '../footer/Footer'
import Navbar from '../modules/Navbar/Navbar'

export default function ParentComponent(props) {
  return (
    <>
    <div className='flex flex-col pb-8 bg-gradient-to-b from-[#1E0F33] to-[#9173FF]'>
        <Navbar />   
        {props.children}    
    </div>
    <Footer/>
    </>
  )
}
