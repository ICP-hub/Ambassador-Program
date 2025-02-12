import React, { useEffect, useState } from "react";
import SouthIcon from "@mui/icons-material/South";
import toast from "react-hot-toast";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { LoadingButton } from "@mui/lab";
import { AutoCompleteUser } from "../../autoCompleteInputSearch/AutoCompleteUser";
import { useSelector } from "react-redux";
import { Principal } from "@dfinity/principal";
import { useAuthClient } from "../../../../utils/useAuthClient";

const RoleList = () => {
  const [showAssignNewRoleModal, setShowAssignNewRoleModal] = useState(false);
  const [data, setData] = useState([]);
  const [userPrincipal, setUserPrincipal] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // State for selected role
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const { principal } = useAuthClient();

  const actors = useSelector((state) => state.actor.value);

  const spaces = useSelector((state) => state.spaces.value);

  const [totalAmount, setTotalAmount] = useState(0);

  const getRolesList = async () => {
    try {
      await actors?.backendActor
        .get_space(spaces?.space_id)
        .then((res) => {
          console.log("Roles list fetched successfully!");
          const editors = res.Ok.editors || [];
          const moderators = res.Ok.moderators || [];

          const editorObjects = editors.map((editorId, index) => ({
            id: `editor_${index}`,
            wallet: editorId.toText(),
            role: "Editor",
          }));

          const moderatorObjects = moderators.map((moderatorId, index) => ({
            id: `moderator_${index}`,
            wallet: moderatorId.toText(),
            role: "Moderator",
          }));

          const rolesList = [...editorObjects, ...moderatorObjects];

          console.log("rolesList: ", rolesList);

          setData(rolesList);

          setTotalAmount(rolesList.length);
        })
        .catch((err) => {
          console.error("Error fetching roles list: ", err);
        });
    } catch (error) {
      console.error("Error fetching roles list: ", error);
    }
  };
  console.log("data: ", data);

  const handleClose = () => {
    setShowAssignNewRoleModal(false);
    setSelectedRole("");
  };

  const handleAddUser = async () => {
    if (userPrincipal && selectedRole) {
      try {
        const space_id = spaces?.space_id;
        const user_principal = Principal.fromText(userPrincipal);
        const roleVariant = { [selectedRole]: null }; // Correct variant format

        // Check if the user being assigned is the authenticated user (owner)
        if (userPrincipal === principal?.toText()) {
          toast.error(" You cannot assign a role to the Owner of the space.");
          return;
        }

        // Check if userPrincipal (wallet) already exists in data
        const existingUser = data.find((user) => user.wallet === userPrincipal);

        if (existingUser) {
          toast.error(
            `User is already assigned as ${existingUser.role} in this space.`
          );
          return;
        }

        console.log("space_id: ", space_id);
        console.log("user_principal: ", user_principal);
        console.log("roleVariant: ", roleVariant);

        await actors?.backendActor
          .add_role_to_space(space_id, user_principal, roleVariant)
          .then((res) => {
            console.log("Role added successfully!");
            console.log("res : ", res);
            toast.success(`Role "${selectedRole}" added successfully!`);
          })
          .catch((err) => {
            console.error("Error adding role: ", err);
            toast.error("Failed to add role.");
          });
      } catch (error) {
        console.error("Error adding role: ", error);
        toast.error("An unexpected error occurred.");
      }

      handleClose();
      getRolesList();
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    getRolesList();
  }, []);

  return (
    <div>
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
          {showAssignNewRoleModal && (
            <Dialog open onClose={handleClose}>
              <DialogTitle className="text-sm">
                Assign new role for the user
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Box className="text-sm mb-2">Please type user name</Box>
                  <TextField
                    fullWidth
                    label="Type user name"
                    variant="outlined"
                    value={userPrincipal}
                    onChange={(e) => setUserPrincipal(e.target.value)}
                  />

                  <Box className="text-sm mt-2 mb-2">Role</Box>
                  <Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Moderator">Moderator</MenuItem>
                  </Select>
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "space-between" }}>
                <Button color="info" onClick={handleClose}>
                  Cancel
                </Button>
                <LoadingButton
                  color="error"
                  onClick={handleAddUser}
                  disabled={!selectedRole}
                >
                  Add user
                </LoadingButton>
              </DialogActions>
            </Dialog>
          )}
        </Box>

        <Box>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="List of roles"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Wallet</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((userRole) => {
                  return (
                    <TableRow key={userRole?.id}>
                      <TableCell>{userRole?.wallet}</TableCell>
                      <TableCell>{userRole?.role}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15, 50, 100]}
            component="div"
            count={totalAmount}
            rowsPerPage={limit}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Stack>
    </div>
  );
};

export default RoleList;
