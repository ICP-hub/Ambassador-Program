import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateMission } from "../../../../redux/mission/missionSlice";
import toast from "react-hot-toast";
import TaskIcon from "@mui/icons-material/Task";
import { useAuthClient } from "../../../../utils/useAuthClient";
import { formatDate } from "../../../../utils/formatDate";
import { FaEdit } from "react-icons/fa";
import { DEFAULT_CURRENCY } from '../../../../../../../DevelopmentConfig';

const SpacesDetails = ({ setLoading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const spaces = useSelector((state) => state.spaces.value);
  const actors = useSelector((state) => state.actor.value);
  const { principal } = useAuthClient();

  const [missionList, setMissionList] = useState([]);
  const [missionArr, setMissionArr] = useState([]);
  const [permissions, setPermissions] = useState({
    owner: false,
    moderator: false,
    editor: false,
    superAdmin: false,
  });

  const fetchMissions = async () => {
    try {
      const res = await actors?.backendActor.get_all_space_missions(spaces?.space_id);
      if (res?.Ok) {
        setMissionArr(res.Ok);
        setMissionList(res.Ok);
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
    }
  };

  const createDraftMission = async () => {
    try {
      setLoading(true);
      const res = await actors?.backendActor.create_draft_mission(spaces.space_id);
      if (res?.Ok) {
        toast.success("Mission added as a draft successfully");
        navigate("/slug_url/mission");
      } else {
        toast.error("Some error occurred!");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error creating draft mission:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!spaces?.space_id) navigate("/");
    fetchMissions();
  }, [actors]);

  useEffect(() => {
    if (spaces && principal) {
      const isOwner = spaces.owner.toText() === principal.toText();
      const isModerator = spaces.moderators.some((mod) => mod.toText() === principal.toText());
      const isEditor = spaces.editors.some((edit) => edit.toText() === principal.toText());
      const isSuperAdmin = spaces.super_admins.some((sup) => sup.toText() === principal.toText());

      setPermissions({
        owner: isOwner,
        moderator: isModerator || isOwner || isSuperAdmin,
        editor: isEditor || isOwner || isSuperAdmin,
        superAdmin: isSuperAdmin,
      });
    }
  }, [spaces, principal]);

  const handleNavigation = (path) => navigate(path);

  const handleMission = (index) => {
    dispatch(updateMission(missionArr[index]));
    navigate(`/slug_url/mission/223/edit`);
  };

  const handleTasks = (row) => navigate(`/mission/223/tasks`, { state: { row } });


  return (
    <div>
      <Navbar nav={navigate} />
      <div className="py-3 px-5 lg:px-20 h-screen">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="font-semibold text-md mr-8">Space name: {spaces?.name}</div>
            {(permissions.moderator || permissions.superAdmin) && (
              <Button sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleNavigation("/space_details")} variant="outlined">EDIT</Button>
            )}
            {(permissions.owner || permissions.superAdmin) && (
              <Button sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleNavigation("/slug_url/role")} variant="contained">ROLES</Button>
            )}
            {(permissions.editor || permissions.superAdmin) && (
              <Button sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => handleNavigation("/slug_url/balance")} variant="contained">BALANCE</Button>
            )}
          </div>
          {(permissions.editor || permissions.superAdmin) && (
            <Button sx={{ backgroundColor: 'black', color: 'white' }} onClick={createDraftMission} variant="contained">CREATE MISSION</Button>
          )}
        </div>

        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                {(permissions.editor || permissions.superAdmin) && <TableCell align="center">Edit</TableCell>}
                <TableCell align="center">Mission Name</TableCell>
                <TableCell align="center">Reward</TableCell>
                <TableCell align="center">Pool</TableCell>
                <TableCell align="center">Token</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Expiry Date</TableCell>
                <TableCell align="center"><TaskIcon /></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {missionList.length > 0 ? (
                missionList.map((row, index) => (
                  <TableRow key={index} className="hover:bg-blue-100 cursor-pointer">
                    {(permissions.editor || permissions.superAdmin) && (
                      <TableCell align="center">
                        <Avatar variant="rounded" onClick={() => handleMission(index)}>
                          <FaEdit className="w-7 text-black" />
                        </Avatar>
                      </TableCell>
                    )}
                    <TableCell align="center">{row?.title}</TableCell>
                    <TableCell align="center">{parseInt(row?.reward)}</TableCell>
                    <TableCell align="center">{parseInt(row?.pool) / 10 ** 6} {DEFAULT_CURRENCY}</TableCell>
                    <TableCell align="center">XP</TableCell>
                    <TableCell align="center">{Object.keys(row?.status)[0]}</TableCell>
                    <TableCell align="center">{formatDate(row?.end_date)}</TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" onClick={() => handleTasks(row)}>View Tasks</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No data available</TableCell>
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
