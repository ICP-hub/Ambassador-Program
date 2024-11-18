import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './Components/pages/Home';
import CardDetails from './Components/modules/Contests/CardDetails';
import { ICP_Ambassador_Program_backend } from 'declarations/ICP_Ambassador_Program_backend';
import UploadProfileImage from './Components/image';


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
        <Route path='/contest_details' element={<CardDetails/>}/>
        <Route path='/image' element={<UploadProfileImage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
