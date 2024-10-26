import { useState } from 'react';
//import { ICP_Ambassador_Program_backend } from '../../../declarations/ICP-Ambassador-Program-backend';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Components/pages/Home';
import Space_Details from './Components/pages/Content/Space_Details';
import SpacesDetails from './Components/pages/Content/Space/SpacesDetails';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path ='/' element={<Home/>}/>
        <Route path='/space_details' element={<Space_Details/>}/>
        <Route path='/slug_url/mission' element={<SpacesDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
