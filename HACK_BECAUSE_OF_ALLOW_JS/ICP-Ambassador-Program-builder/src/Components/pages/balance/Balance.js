import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import BalanceList from './BalanceList';
import { useNavigate } from 'react-router-dom';
const Balance = () => {
    const nav = useNavigate();
    return (<div>
        <Navbar nav={nav}/>
        <div className='h-screen'> 
            <BalanceList />
        </div>
        <Footer />
    </div>);
};
export default Balance;
