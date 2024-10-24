import { useState } from 'react';
import { ICP_Ambassador_Program_backend } from 'declarations/ICP-Ambassador-Program-backend';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Components/pages/Home';



function App() {
  // const [greeting, setGreeting] = useState('');

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const name = event.target.elements.name.value;
  //   ICP_Ambassador_Program_backend.greet(name).then((greeting) => {
  //     setGreeting(greeting);
  //   });
  //   return false;
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path ='/' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
