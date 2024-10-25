import { useState } from 'react';
//import { ICP_Ambassador_Program_backend } from '../../../declarations/ICP-Ambassador-Program-backend';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Components/pages/Home';

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path ='/' element={<Home/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
