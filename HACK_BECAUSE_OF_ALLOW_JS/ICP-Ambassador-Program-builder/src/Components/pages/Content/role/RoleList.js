import React, { useState } from 'react';
import SouthIcon from '@mui/icons-material/South';
import { Autocomplete, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, } from '@mui/material';
import { format } from 'date-fns';
import { LoadingButton } from '@mui/lab';
import { AutoCompleteUser } from '../../autoCompleteInputSearch/AutoCompleteUser';
const sampleData = {
    totalAmount: 3,
    data: [
        {
            user: {
                userId: '1',
                userName: 'John Doe',
            },
            role: 'Admin',
            createdAt: '2023-09-01T10:30:00Z',
        },
        {
            user: {
                userId: '2',
                userName: 'Jane Smith',
            },
            role: 'Editor',
            createdAt: '2023-09-10T14:20:00Z',
        },
        {
            user: {
                userId: '3',
                userName: 'Sam Wilson',
            },
            role: 'Viewer',
            createdAt: '2023-09-15T08:45:00Z',
        },
    ],
};
const staticUserProfiles = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
];
const RoleList = () => {
    const [showAssignNewRoleModal, setShowAssignNewRoleModal] = useState(false);
    const [data, setData] = useState(sampleData);
    const [userToAdd, setUserToAdd] = useState(null);
    const [selectedRole, setSelectedRole] = useState(''); // State for selected role
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const handleClose = () => {
        setShowAssignNewRoleModal(false);
        setUserToAdd(null);
        setSelectedRole('');
    };
    const handleAddUser = () => {
        if (userToAdd && selectedRole) {
            const newUser = {
                user: {
                    userId: (data.data.length + 1).toString(),
                    userName: userToAdd.name,
                },
                role: selectedRole,
                createdAt: new Date().toISOString(),
            };
            setData((prevData) => ({
                ...prevData,
                totalAmount: prevData.totalAmount + 1,
                data: [...prevData.data, newUser],
            }));
            handleClose();
        }
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage + 1);
    };
    const handleChangeRowsPerPage = (event) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1);
    };
    return (<div>
      <div className="mx-5 lg:mx-40 text-4xl my-4">Roles</div>
      <Stack className="mx-10 lg:mx-44">
        <Box p={3}>
          <Typography variant="h3" gutterBottom>
            User roles in the space
          </Typography>
        </Box>
        <Box p={3}>
          <Button onClick={() => setShowAssignNewRoleModal(true)}>
            Assign new role for the user
          </Button>
          {showAssignNewRoleModal && (<Dialog open onClose={handleClose}>
              <DialogTitle className="text-sm">Assign new role for the user</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Box className="text-sm mb-2">Please type user name</Box>
                  <AutoCompleteUser options={staticUserProfiles} onSelected={(user) => setUserToAdd(user)} noOptionsText="No users found" label="Type user name"/>
                  <Box className="text-sm mt-2 mb-2">Role</Box>
                  <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} fullWidth>
                    <MenuItem value="Owner">Owner</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                  </Select>
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'space-between' }}>
                <Button color="info" onClick={handleClose}>
                  Cancel
                </Button>
                <LoadingButton color="error" onClick={handleAddUser} disabled={!selectedRole}>
                  Add user
                </LoadingButton>
              </DialogActions>
            </Dialog>)}
        </Box>

        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="List of roles" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell className="flex gap-3">
                    Joined at
                    <IconButton>
                      <SouthIcon style={{ fontSize: '20px' }}/>
                    </IconButton>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((userRole) => (<TableRow key={userRole.user.userId}>
                    <TableCell>{userRole.user.userId}</TableCell>
                    <TableCell>{userRole.user.userName}</TableCell>
                    <TableCell>{userRole.role}</TableCell>
                    <TableCell>
                      {format(new Date(userRole.createdAt), 'yyyy, MMM d, HH:mm')}
                    </TableCell>
                    <TableCell />
                  </TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination rowsPerPageOptions={[15, 50, 100]} component="div" count={data.totalAmount} rowsPerPage={limit} page={page - 1} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage}/>
        </Box>
      </Stack>
    </div>);
};
export default RoleList;
