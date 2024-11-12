import React, { useEffect, useState } from 'react';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
// import upload_backgroud from '../../../assets/images/upload_background.png'
import RichTextEditor from './TextEditor';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SortDescription from './sortDescription';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Space_Details = () => {
    const spaces = useSelector(state => state.spaces.value);
    const admin = useSelector(state => state.admin.value);
    const actor = useSelector(state => state.actor.value);
    const [logoImage, setLogoImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [chain, setchain] = useState('EVM');
    const [spaceName, setSpaceName] = useState(spaces?.name);
    const [slug, setSlug] = useState(spaces?.slug);
    const [description, setDescription] = useState(spaces?.description);
    const [websitURl, setWebsitURl] = useState('');
    const [twitterURL, setTwitterURL] = useState('');
    const [gitURL, setGitURL] = useState('');
    const [midumURL, setMidumURL] = useState('');
    const [telegramURL, setTelegramURL] = useState('');
    const [discordURL, setDiscordURL] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const [updatedSpace, setUpdatedSpace] = useState(spaces);
    const nav = useNavigate();
    useEffect(() => {
        if (spaces?.space_id == undefined) {
            nav('/');
        }
    }, []);
    async function editSpace() {
        try {
            console.log("updated space : ", updatedSpace);
            let res = await actor?.backendActor?.update_space(updatedSpace);
            console.log(res, "response uodating space");
            if (res != null && res?.Err == undefined && res != undefined) {
                alert('Space updated successfully');
                window?.location?.reload();
            }
        }
        catch (error) {
            console.log("error updating the space : ", error);
        }
    }
    const handleChange = (event) => {
        setchain(event.target.value);
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleFileChangeBackground = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (<div className=''>
        <Navbar />
            <div className='px-10 lg:px-44 py-3 flex flex-col '>
                <div className='text-4xl font-semibold border-b-2 border-slate-600 pb-4 '>
                    {spaces?.name}
                </div>
                <div className='flex justify-between mt-1 text-sm font-semibold'>
                    <div>ID</div>
                    <div>{spaces?.space_id}</div>
                </div>


                <div className='mt-4 w-full '>
                    <div className='text-xl font-medium'>Logo Image</div>
                    <div className="flex flex-col gap-3 items-center justify-center   rounded-lg w-full  h-80 mx-auto">
                        {logoImage ? (<img src={'upload_background.png'} alt="Uploaded" className="object-contain h-full w-full"/>) : (<img src={'upload_background.png'} alt='' className='w-80'/>)}
                        <div>drag file here or</div>
                        <label className="mt-4 w-full bg-blue-500 rounded">
                            <input type="file" className="hidden" onChange={handleFileChange}/>
                            
                            <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-sky-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
                            BROWSE
                            </div>
                        </label>
                    </div>
                </div>

                <div className='mt-4 w-full '>
                    <div className='text-xl  font-medium '>Background image</div>
                    <div className="flex flex-col gap-3 items-center justify-center   rounded-lg w-full  h-80 mx-auto">
                        {backgroundImage ? (<img src={'upload_background.png'} alt="Uploaded" className="object-contain h-full w-full"/>) : (<img src={'upload_background.png'} alt='' className='w-80'/>)}
                        <div>drag file here or</div>
                        <label className="mt-4 w-full bg-blue-500 rounded">
                            <input type="file" className="hidden" onChange={handleFileChangeBackground}/>
                            
                            <div className="w-full flex justify-center items-center text-sm font-semibold py-2 bg-sky-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
                            BROWSE
                            </div>
                        </label>
                    </div>
                </div>
                <div className='space-y-4 mt-4 '>
              
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Space name</label>
                        <input type="text" value={spaceName} className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Space name..." onChange={(e) => { setUpdatedSpace({ ...updatedSpace, name: e.target.value }); }}/>

                    </div>

              
                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Space slug</label>
                        <input type="text" value={slug} className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3 
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Slug with lowercase, e.g. blocked" onChange={(e) => { setUpdatedSpace({ ...updatedSpace, slug: e.target.value }); }}/>
                        <p className=' text-gray-500' style={{ fontSize: '10px' }}>
                        Will be used as URL, e.g. https://app.blocked.cc/blocked
                        </p>
                    </div>

              
                    <div>
                        
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Space chain type</InputLabel>
                        <Select labelId="demo-simple-select-label" id="demo-simple-select" value={chain} label="chain" onChange={handleChange}>
                            <MenuItem value={'cosmos'}>Cosmos</MenuItem>
                            <MenuItem value={'EVM'}>EVM</MenuItem>
                            <MenuItem value={'polkadot'}>PolkaDot</MenuItem>
                            <MenuItem value={'Solana'}>Solana</MenuItem>
                        </Select>
                        </FormControl>
                        <p className='text-sm text-gray-500'>Please select what type is used by this chain</p>
                    </div>

             
                    <div className=''>
                        <label className="block text-sm font-medium text-gray-700 ">Description</label> 
                        <SortDescription initialDescription={description}/>
                    </div>

                    <div className='mt-4'> 
                       <label className="block text-sm font-medium text-gray-700 ">Short Description</label>
                       <SortDescription />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Website URL</label>
                        <input type="text" className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Link to the official website" value={updatedSpace?.urls?.website?.length == 0
            ||
                updatedSpace?.urls?.website?.length == undefined ?
            "" : updatedSpace?.urls?.website[0]} onChange={(e) => { setUpdatedSpace({ ...updatedSpace, urls: { ...updatedSpace.urls, website: [e.target.value] } }); }}/>

                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Twitter URL</label>
                        <input type="text" className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Link to the twitter..." value={updatedSpace?.urls?.twitter?.length == 0
            ||
                updatedSpace?.urls?.twitter?.length == undefined ?
            "" : updatedSpace?.urls?.twitter[0]} onChange={(e) => { setUpdatedSpace({ ...updatedSpace, urls: { ...updatedSpace.urls, twitter: [e.target.value] } }); }}/>

                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Telegram URL</label>
                        <input type="text" className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Telegram URL" value={updatedSpace?.urls?.telegram?.length == 0
            ||
                updatedSpace?.urls?.telegram?.length == undefined ?
            "" : updatedSpace?.urls?.telegram[0]} onChange={(e) => { setUpdatedSpace({ ...updatedSpace, urls: { ...updatedSpace.urls, telegram: [e.target.value] } }); }}/>

                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Discord URL</label>
                        <input type="text" className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Link to the discord channel" value={updatedSpace?.urls?.discord?.length == 0
            ||
                updatedSpace?.urls?.discord?.length == undefined ?
            "" : updatedSpace?.urls?.discord[0]} onChange={(e) => { setUpdatedSpace({ ...updatedSpace, urls: { ...updatedSpace.urls, discord: [e.target.value] } }); }}/>

                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Midum URL</label>
                        <input type="text" className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Link to the medium..." value={updatedSpace?.urls?.medium?.length == 0
            ||
                updatedSpace?.urls?.medium?.length == undefined ?
            "" : updatedSpace?.urls?.medium[0]} onChange={(e) => { setUpdatedSpace({ ...updatedSpace, urls: { ...updatedSpace.urls, medium: [e.target.value] } }); }}/>

                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Github URL</label>
                        <input type="text" className="mt-1 block w-full border-2 outline-none border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="Link to the Github" value={updatedSpace?.urls?.github?.length == 0
            ||
                updatedSpace?.urls?.github?.length == undefined ?
            "" : updatedSpace?.urls?.github[0]} onChange={(e) => { setUpdatedSpace({ ...updatedSpace, urls: { ...updatedSpace.urls, github: [e.target.value] } }); }}/>

                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700'>Space background color</label>
                        <input type="text" className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm p-3
                                    placeholder-gray-500
                                    hover:border-black
                                    outline-none
                                      
                                    focus:border-blue-500 focus:ring-blue-500" placeholder="CSS for background" value={updatedSpace?.bg_css?.length == 0
            ||
                updatedSpace?.bg_css?.length == undefined ?
            "" : updatedSpace?.bg_css[0]} onChange={(e) => { setUpdatedSpace({ ...updatedSpace, bg_css: [e.target.value] }); }}/>

                    </div>

                    <div className=' flex justify-center items-center bg-blue-600 text-white w-20 rounded shadow-2xl h-8 cursor-pointer' onClick={editSpace}>SAVE</div>

                </div>

            </div>
        <Footer />
    </div>);
};
export default Space_Details;
