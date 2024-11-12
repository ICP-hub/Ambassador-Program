import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/pages/Home';
import CardDetails from './Components/modules/Contests/CardDetails';
import { ICP_Ambassador_Program_backend } from 'declarations/ICP_Ambassador_Program_backend';
import DiscordCallback from './Components/auth/DiscordCallback';
function App() {
    const [open, setOpen] = useState(false);
    return (<BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/contest_details' element={<CardDetails open={open} setOpen={setOpen}/>}/>
        <Route path='/auth/discord/callback' element={<DiscordCallback setOpen={setOpen}/>}/>
      </Routes>
    </BrowserRouter>);
}
export default App;
