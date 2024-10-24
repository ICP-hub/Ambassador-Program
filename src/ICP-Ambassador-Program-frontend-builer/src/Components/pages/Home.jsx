import React from 'react';
import Navbar from '../modules/Navbar/Navbar';
import Filter from '../modules/Filter/Filter';
import Contests from '../modules/Contests/Contests';
import { FilterProvider } from '../Context/FilterContext';

const Home = () => {
  return (
    <div className="flex flex-col h-lvh rounded-md m-3 " style={{backgroundColor:'#16161a'}}> 
      <Navbar />
      <FilterProvider>
        <div className="flex flex-grow p-2 m-2 rounded-md"> 
          <div className="w-1/6 h-full"> 
            <Filter />
          </div>
          <div className="w-full h-full"> 
            <Contests />
          </div>
        </div>
      </FilterProvider>
    </div>
  );
}

export default Home;
