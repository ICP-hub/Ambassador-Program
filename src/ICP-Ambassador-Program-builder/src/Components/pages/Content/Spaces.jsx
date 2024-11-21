import React, { useEffect, useState } from 'react';
import RichTextEditor from './TextEditor';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import SpaceCard from './SpaceCard';
import { useDispatch } from 'react-redux';
import { updateSpace } from '../../../redux/spaces/spaceSlice';
import toast from 'react-hot-toast';

const Spaces = ({setLoading}) => {
  const navigate=useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [chain, setchain] = useState('');
  const [spaces,setSpaces]=useState([])
  const actor=useSelector(state=>state.actor.value)
  const admin=useSelector(state=>state.admin.value)
  const dispatch=useDispatch()
  const [newSpace,setNewSpace]=useState({
    name:"",
    slug:"",
    description:"THis is a sample description",
    chain:chain
  })

  async function createNewSpace(){
    try {
      setLoading(true)
      let res = await actor?.backendActor?.create_space(newSpace)
      console.log("space creation response : ",res)
      if(res!=undefined && res!=null ){
        window.location.reload()
        handleModalToggle()
      }else{
        setLoading(false)
        toast.error('Some error occurred!')
      }
    } catch (error) {
      setLoading(false)
      toast.error('Something went wrong!')
      console.log("space creation error : ",error)
    }
  }
  
  async function fetchSpaces(){
    try {
      console.log("fetching spaces")
      let key_arr=[]
      let val_arr=[]
      for(let i=0;i<admin?.spaces?.length;i++){
        let res = await actor?.backendActor?.get_space(admin?.spaces[i])
        let x= JSON.parse(JSON.stringify(res?.Ok))
        // console.log(`space item ${i} response :  ${typeof JSON.stringify(x)}`)
        console.dir(x)
        if(res?.Ok!=null && res?.Ok!=undefined){
          key_arr.push(Object.keys(res?.Ok))
          val_arr.push(Object.entries(res?.Ok)||null)
        }
      }
      // console.log(`key array : ${key_arr}\n\nkey array length: ${key_arr.length} \n\n\n\nvalue array : ${val_arr}\n\nvalue array length : ${val_arr.length}`)
      let main_arr=[]
      for(let i=0;i<val_arr.length;i++){
        let el_obj=new Object()
        for(let j=0;j<key_arr[0].length;j++){
          // console.log(val_arr[i][j])
          el_obj[key_arr[0][j]]=val_arr[i][j][1]
        }
        // console.log(el_obj)
        main_arr.push(el_obj)
      }
      console.log("final spaces : ",main_arr)
      setSpaces(main_arr)
    } catch (error) {
      console.log("error fetching spaces : ",error)
    }
  }

  useEffect(()=>{
    fetchSpaces()
  },[admin])

  const handleChange = (event) => {
    setchain(event.target.value);
  };

  const handleClick = () => {
    setIsClicked(true);
    handleModalToggle();
  };
 
  const handleModalToggle = () => {
   
    setIsModalOpen(!isModalOpen);
  };

  const handleSpace = (item) =>{
    dispatch(updateSpace(item))
    navigate('/slug_url/mission')
  }

  return (
    <div>
      <div className='flex flex-col gap-10 px-16 py-10 h-screen'>
        <div className='flex justify-between items-center '>
          <div className='text-4xl font-medium'>Spaces</div>
          <div
            className='bg-black text-white font-semibold shadow-md text-sm rounded py-2 px-6 flex justify-center cursor-pointer items-center hover:bg-blue-700'
            onClick={handleModalToggle}
          >
            CREATE SPACE
          </div>
        </div>
        <div className='w-[80vw] flex flex-wrap items-center justify-start gap-6'>
        {
          spaces?.map((item,index)=>(
            <SpaceCard item={item} handleSpace={handleSpace} key={index}/>
          ))
        }
        </div>

      </div>

      
      
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center  overflow-y-scroll '>
          <div className='bg-white px-8 py-2 rounded-md shadow-lg max-w-lg w-full max-h-fit mt-20 '>
            <h2 className='text-2xl font-semibold mb-4'>Create space</h2>

            
            <div className='space-y-4'>
              
              <div>
                <label className='block text-sm font-medium text-gray-700'>Space name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3
                            placeholder-gray-500
                            hover:border-black
                            focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Space name..."
                  onChange={(e)=>setNewSpace({...newSpace,name:e.target.value})}
                />

              </div>

              
              <div>
                <label className='block text-sm font-medium text-gray-700'>Space slug</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 
                            placeholder-gray-500
                            hover:border-black
                            focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Slug with lowercase, e.g. blocked"
                  onChange={(e)=>setNewSpace({...newSpace,slug:e.target.value})}
                />
                <p className='text-sm text-gray-500'>
                  Will be used as URL, e.g. https://app.blocked.cc/blocked
                </p>
              </div>

              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Space chain type</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={chain}
                    label="chain"
                    onChange={handleChange}
                  >
                    <MenuItem value={'cosmos'}>Cosmos</MenuItem>
                    <MenuItem value={'EVM'}>EVM</MenuItem>
                    <MenuItem value={'polkadot'}>PolkaDot</MenuItem>
                    <MenuItem value={'Solana'}>Solana</MenuItem>
                  </Select>
                </FormControl>
                <p className='text-sm text-gray-500'>Please select what type is used by this chain</p>
              </div>

             
              <div>
                
                <RichTextEditor/>
              </div>
            </div>

            
            <div className='flex justify-end space-x-2 mt-2'>
            <button
                className={`${
                  isClicked ? 'bg-blue-200' : 'bg-transparent'
                } text-blue-500 py-2 px-4 rounded-md transition-colors duration-300`}
                onClick={handleClick}
              >
                Cancel
              </button>
              <button className='bg-blue-600 text-white py-2 px-4 rounded-md' onClick={createNewSpace}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spaces;
