import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/pages/Home';
import CardDetails from './Components/modules/Contests/CardDetails';
import { ICP_Ambassador_Program_backend } from 'declarations/ICP_Ambassador_Program_backend';
import DiscordCallback from './Components/auth/DiscordCallback';
function App() {
    return (<BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/contest_details' element={<CardDetails />}/>
        <Route path='/auth/discord/callback' element={<DiscordCallback />}/>
      </Routes>
    </BrowserRouter>);
}
export default App;
