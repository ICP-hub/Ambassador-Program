import React from 'react';
import Navbar from './Navbar/Navbar';
import Spaces from './Content/Spaces';
import Footer from './Footer/Footer';
import { useNavigate } from 'react-router-dom';

const Home = ({setLoading}) => {
  const nav=useNavigate()
  return (
    <div> 
      <Navbar nav={nav}/>
      <Spaces setLoading={setLoading}/>
      <Footer/>
     
    </div>
  );
}

export default Home;
