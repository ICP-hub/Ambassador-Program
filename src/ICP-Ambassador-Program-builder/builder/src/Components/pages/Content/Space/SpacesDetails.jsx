import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, IconButton, Box, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from 'react-redux';

const SpacesDetails = () => {
    const navigate=useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [expireFilter, setExpireFilter] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const spaces=useSelector(state=>state.spaces.value)
  const actors=useSelector(state=>state.actor.value)

  async function fetchMissions(){
    try {
      const res=await actors?.backendActor.get_all_space_missions(spaces?.space_id)
      console.log("fetch mission response : ",res)
    } catch (error) {
      console.log("error fetching missions : ",error)
    }
  }

  async function createDraftMission(){
    try {
      const res=await actors?.backendActor.create_draft_mission(spaces.space_id)
      console.log(res)
      if(res?.Ok==null && res!=undefined && res!=null){
        alert("Mission added as a draft successfully")
        window.location.reload()
      }
    } catch (error) {
      console.log("error creating draft mission : ",error)
    }
  }

  useEffect(()=>{
    if(spaces.space_id==undefined){
      navigate('/')
    }
    fetchMissions()
  },[actors])

  const rows = [
    { id: 1, status: 'draft', expired: '---' },
    { id: 2, status: 'draft', expired: '---' },
    { id: 3, status: 'draft', expired: '---' },
    { id: 4, status: 'draft', expired: '---' },
    { id: 5, status: 'draft', expired: '---' },
  ];

  const toggleStatusFilter = () => {
    setStatusFilter((prevStatus) => (prevStatus === 'all' ? 'active' : 'all'));
  };

  const toggleExpireFilter = () => {
    setExpireFilter(!expireFilter);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () =>{
    navigate('/space_details')
  }

  const handleRole = () =>{
    navigate('/slug_url/role')
  }

  const handleBalance = () =>{
    navigate('/slug_url/balance')
  }

  const handleMission = () =>{
    navigate('/slug_url/mission/223/edit')
  }

  const filteredRows = statusFilter === 'all' ? rows : rows.filter(row => row.status === 'active');

  return (
    <div className=''>
      <Navbar />
      <div className='py-3 px-5 lg:px-20 h-screen'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-3 items-center '>
            <div className='font-semibold text-md'>Sample_space space</div>
            <div className='text-sm text-white bg-black hover:bg-blue-700 py-2 px-4 rounded cursor-pointer shadow-2xl' onClick={handleEdit}>EDIT</div>
            <div className='text-sm text-white bg-black py-2 hover:bg-blue-700 px-4 rounded cursor-pointer shadow-2xl' onClick={handleRole}>ROLES</div>
            <div className='text-sm text-white bg-black py-2 hover:bg-blue-700 px-4 rounded cursor-pointer shadow-2xl'onClick={handleBalance}>BALANCE</div>
          </div>
          <div className='text-sm text-white bg-black py-2 px-2 lg:px-6 rounded shadow-2xl cursor-pointer' onClick={createDraftMission}>CREATE MISSION</div>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Mission name</TableCell>
                <TableCell align="center">Reward</TableCell>
                <TableCell align="center">Pool</TableCell>
                <TableCell align="center">Token</TableCell>
                <TableCell align="center" style={{ cursor: 'pointer', width: '150px' }} onClick={toggleStatusFilter}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    Status ({statusFilter})
                    {statusFilter === 'all' ? <ArrowDropDownIcon fontSize="small" /> : <ArrowDropUpIcon fontSize="small" />}
                  </Box>
                </TableCell>
                <TableCell align="center" style={{ cursor: 'pointer', width: '150px' }} onClick={toggleExpireFilter}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <div style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, transform 0.2s',
                      }}>Expired</div>
                    {expireFilter ? <ArrowDropDownIcon fontSize="small" /> : <ArrowDropUpIcon fontSize="small" />}
                  </Box>
                </TableCell>
                <TableCell align="center" style={{ cursor: 'pointer' }}>
                  <IconButton onClick={handleMenuClick}>
                    <FilterListIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>Recently deployed</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Time remaining</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Pending tasks</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Profitability</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody >
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <TableRow key={row.id} className='hover:bg-blue-100 cursor-pointer '>
                  <TableCell align="center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar variant="rounded" sx={{ width: 40, height: 40 }} onClick={handleMission}>M</Avatar>
                  </TableCell>
                    <TableCell align="center"> - </TableCell>
                    <TableCell align="center"> - </TableCell>
                    <TableCell align="center"> - </TableCell>
                    <TableCell align="center"> - </TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.expired}</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Footer />
    </div>
  );
};

export default SpacesDetails;
