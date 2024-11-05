import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import BalanceList from './BalanceList';
const Balance = () => {
    return (<div>
        <Navbar />
        <div className='h-screen'> 
            <BalanceList />
        </div>
        <Footer />
    </div>);
};
export default Balance;
