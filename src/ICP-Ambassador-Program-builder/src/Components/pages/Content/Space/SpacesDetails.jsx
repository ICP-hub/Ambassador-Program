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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateMission } from "../../../../redux/mission/missionSlice";
import toast from "react-hot-toast";
import TaskIcon from "@mui/icons-material/Task";
import { useAuthClient } from "../../../../utils/useAuthClient";
import { formatDate } from "../../../../utils/formatDate";
import { FaEdit } from "react-icons/fa";
import { DEFAULT_CURRENCY } from '../../../../../../../DevelopmentConfig';


const SpacesDetails = ({ setLoading }) => {
  const navigate = useNavigate();

  const spaces = useSelector((state) => state.spaces.value);
  const actors = useSelector((state) => state.actor.value);
  const [missionList, setMissionList] = useState([]);
  const [missionArr, setMissionArr] = useState([]);
  const [owner, setOwner] = useState(false);
  const { principal } = useAuthClient();

  const [moderator, setModerator] = useState(false);
  const [editor, setEditor] = useState(false);
  const dispatch = useDispatch();

  async function fetchMissions() {
    try {
      const res = await actors?.backendActor.get_all_space_missions(
        spaces?.space_id
      );
      console.log("fetch mission response : ", res, res?.Ok?.length);
      if (res != undefined && res != null && res?.Ok != undefined) {
        setMissionArr(res?.Ok);
        console.log(
          new Array(res?.Ok?.length).fill({
            id: 1,
            status: "draft",
            expired: "---",
          })
        );
        // setMissionList(new Array(res?.Ok).fill({ id: 1, status: 'draft', expired: '---' }))
        setMissionList(res?.Ok);
      }
    } catch (error) {
      console.log("error fetching missions : ", error);
    }
  }

  async function createDraftMission() {
    try {
      setLoading(true);
      const res = await actors?.backendActor.create_draft_mission(
        spaces.space_id
      );

      console.log("create draft mission response : ", res);
      if (res?.Ok == null && res != undefined && res != null) {
        toast.success("Mission added as a draft successfully");

        setLoading(false);
        // window.location.reload();
        navigate("/slug_url/mission");
      } else {
        toast.error("Some error occurred!");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log("error creating draft mission : ", error);
    }
  }

  useEffect(() => {
    if (spaces.space_id == undefined) {
      navigate("/");
    }
    fetchMissions();
  }, [actors]);

  useEffect(() => {
    if (spaces && spaces.moderators && spaces.editors) {
      if (principal) {
        const isModerator = spaces.moderators.some(
          (mod) => mod.toText() === principal.toText()
        );

        const isEditor = spaces.editors.some(
          (edit) => edit.toText() === principal.toText()
        );

        const isOwner = spaces.owner.toText() === principal.toText();
        console.log("isOwner : ", isOwner);
        console.log("isModerator : ", isModerator);
        console.log(isEditor, "isEditor");

        // Update states
        setOwner(isOwner);
        setModerator(isModerator || isOwner);
        setEditor(isEditor || isOwner);
      }
    }
  }, [spaces, principal]);

  useEffect(() => {
    console.log("missionList : ", missionList);
  }, [missionList]);

  const handleEdit = () => {
    navigate("/space_details");
  };

  const handleRole = () => {
    navigate("/slug_url/role");
  };

  const handleBalance = () => {
    navigate("/slug_url/balance");
  };

  const handleMission = (index) => {
    dispatch(updateMission(missionArr[index]));
    navigate("/slug_url/mission/223/edit");
  };

  const handleTasks = (row) => {
    navigate("/mission/223/tasks", { state: { row } });
  };

  return (
    <div className="">
      <Navbar nav={navigate} />
      <div className="py-3 px-5 lg:px-20 h-screen">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center ">
            <div className="font-semibold text-md mr-8">
              Space name : {spaces?.name}
            </div>
            {moderator && (
              <div
                className="text-sm text-white bg-black hover:bg-blue-700 py-2 px-4 rounded cursor-pointer shadow-2xl"
                onClick={handleEdit}
              >
                EDIT
              </div>
            )}
            {owner && (
              <div
                className="text-sm text-white bg-black py-2 hover:bg-blue-700 px-4 rounded cursor-pointer shadow-2xl"
                onClick={handleRole}
              >
                ROLES
              </div>
            )}
            {editor && (
              <div
                className="text-sm text-white bg-black py-2 hover:bg-blue-700 px-4 rounded cursor-pointer shadow-2xl"
                onClick={handleBalance}
              >
                BALANCE
              </div>
            )}
          </div>
          {editor && (
            <div
              className="text-sm text-white bg-black py-2 px-2 lg:px-6 rounded shadow-2xl cursor-pointer"
              onClick={createDraftMission}
            >
              CREATE MISSION
            </div>
          )}
        </div>

        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                {editor && (
                  <TableCell align="center">Edit</TableCell>
                )}
                <TableCell align="center">Mission Name</TableCell>
                <TableCell align="center">Reward</TableCell>
                <TableCell align="center">Pool</TableCell>
                <TableCell align="center">Token</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Expiry Date</TableCell>
                <TableCell align="center">
                  <TaskIcon />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {missionList.length > 0 ? (
                missionList.map((row, index) => {
                  console.log("filter: ", row);
                  return (
                    <TableRow
                      key={index}
                      className="hover:bg-blue-100 cursor-pointer "
                    >
                      {editor && (
                        <TableCell
                          align="center"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {/* {row?.img?.length > 0 ? (
                          <img
                            src={row?.img[0]}
                            className="w-[40px] h-[40px] rounded-sm object-fill"
                            onClick={() => handleMission(index)}
                          />
                        ) : ( */}
                          <Avatar
                            variant="rounded"
                            sx={{ width: 40, height: 40 }}
                            onClick={() => handleMission(index)}
                          >
                            <FaEdit className="w-7 text-black" />
                          </Avatar>
                          {/* )} */}
                        </TableCell>
                      )}

                      <TableCell align="center">{row?.title}</TableCell>

                      <TableCell align="center">
                        {parseInt(row?.reward)}{" "}
                      </TableCell>

                      <TableCell align="center"> {parseInt(row?.pool) / 10 ** 6} {DEFAULT_CURRENCY}</TableCell>


                      <TableCell align="center"> XP </TableCell>

                      <TableCell align="center">
                        {Object.keys(row?.status)[0]}
                      </TableCell>

                      <TableCell align="center">
                        {formatDate(row?.end_date)}
                      </TableCell>
                      {/* <TableCell align="center"></TableCell> */}

                      <TableCell
                        align="center"
                        onClick={() => {
                          handleTasks(row);
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "black",
                            color: "black",
                            "&:hover": {
                              backgroundColor: "black",
                              color: "white",
                              borderColor: "black",
                            },
                          }}
                        >
                          View Tasks
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
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
