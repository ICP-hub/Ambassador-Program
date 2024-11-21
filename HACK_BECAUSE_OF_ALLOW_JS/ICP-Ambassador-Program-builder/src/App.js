import { useEffect, useState } from 'react';
//import { ICP_Ambassador_Program_backend } from '../../../declarations/ICP-Ambassador-Program-backend';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/pages/Home';
import Space_Details from './Components/pages/Content/Space_Details';
import SpacesDetails from './Components/pages/Content/Space/SpacesDetails';
import Role from './Components/pages/Content/role/role';
import Balance from './Components/pages/balance/Balance';
import MissionEdit from './Components/pages/mission/mission_edit';
import Mission_Task from './Components/pages/mission/Mission_Task';
import { AuthProvider, useAuthClient } from './utils/useAuthClient';
import Task_Details from './Components/pages/Task/Task_Details';
import Login from './Components/pages/authComponents/Login';
function App() {
    const { isAuthenticated } = useAuthClient();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        console.log(isAuthenticated);
    }, []);
    if (loading) {
        return (<div className='flex justify-center items-center h-screen'>
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black"/>
      </div>);
    }
    else {
        return (<BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/' element={<Home setLoading={setLoading}/>}/>
          <Route path='/space_details' element={<Space_Details setLoading={setLoading}/>}/>
          <Route path='/slug_url/mission' element={<SpacesDetails setLoading={setLoading}/>}/>
          <Route path='/slug_url/role' element={<Role />}/>
          <Route path='/slug_url/balance' element={<Balance />}/>
          <Route path='/slug_url/mission/223/edit' element={<Mission_Task setLoading={setLoading}/>}/>
          <Route path='/mission/223/tasks' element={<Task_Details />}/>
        </Routes>
        </AuthProvider>
      </BrowserRouter>);
    }
}
export default App;
