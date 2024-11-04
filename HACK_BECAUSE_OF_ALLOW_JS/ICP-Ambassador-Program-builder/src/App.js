import { useState } from 'react';
//import { ICP_Ambassador_Program_backend } from '../../../declarations/ICP-Ambassador-Program-backend';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/pages/Home';
import Space_Details from './Components/pages/Content/Space_Details';
import SpacesDetails from './Components/pages/Content/Space/SpacesDetails';
import Role from './Components/pages/Content/role/role';
import Balance from './Components/pages/balance/Balance';
import MissionEdit from './Components/pages/mission/mission_edit';
import Mission_Task from './Components/pages/mission/Mission_Task';
function App() {
    return (<BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/space_details' element={<Space_Details />}/>
        <Route path='/slug_url/mission' element={<SpacesDetails />}/>
        <Route path='/slug_url/role' element={<Role />}/>
        <Route path='/slug_url/balance' element={<Balance />}/>
        <Route path='/slug_url/mission/223/edit' element={<Mission_Task />}/>
      </Routes>
    </BrowserRouter>);
}
export default App;
