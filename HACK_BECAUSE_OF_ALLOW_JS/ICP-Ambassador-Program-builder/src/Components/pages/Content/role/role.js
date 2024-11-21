import React from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import RoleList from './RoleList';
import { useNavigate } from 'react-router-dom';
const Role = () => {
    const nav = useNavigate();
    return (<div>
        <Navbar nav={nav}/>
        <div className='h-screen'>
            <RoleList />
        </div>
       
        <Footer />
    </div>);
};
export default Role;
