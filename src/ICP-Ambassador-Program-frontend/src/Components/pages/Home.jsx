import React,{useState,useEffect} from 'react';
import Navbar from '../modules/Navbar/Navbar';
import Filter from '../modules/Filter/Filter';
import Contests from '../modules/Contests/Contests';
import { FilterProvider } from '../Context/FilterContext';
import HubConnectionModal from '../modules/Navbar/HubConnectionModel';
import Cookies from 'js-cookie';
const Home = () => {

  const [isHubModalOpen, setIsHubModalOpen] = useState(false);

 

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (isLoggedIn) {
      setIsHubModalOpen(true);
    }
  }, []);
  
  
  return (
    <div className="flex flex-col h-lvh rounded-md m-3 " style={{backgroundColor:'#16161a'}}> 
      <Navbar  />
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
      {isHubModalOpen &&<HubConnectionModal 
        isOpen={isHubModalOpen} 
        onClose={() => setIsHubModalOpen(false)} 
      />}
    </div>
  );
}

export default Home;