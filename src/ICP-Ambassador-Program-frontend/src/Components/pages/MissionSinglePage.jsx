import MissionCard from "../modules/Navbar/Slider";
import { FaPlus } from "react-icons/fa6";
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaXTwitter } from "react-icons/fa6";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import app from "../modules/Contests/firebase_config";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import Quill from "quill";
import "quill/dist/quill.snow.css";
// import upload_background from '../../../assets/images/upload_background.png'
import { ICP_Ambassador_Program_backend } from "../../../../declarations/ICP_Ambassador_Program_backend";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { FaLink, FaTextHeight } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import DoneIcon from "@mui/icons-material/Done";
import { BiSolidSend } from "react-icons/bi";
import { MdOutlineCloudUpload } from "react-icons/md";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import NoContest from "./NoContest";
import { LiaTelegram } from "react-icons/lia";
import { FaDiscord } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import ParentComponent from "./ParentComponent";
import { ThreeDots } from "react-loader-spinner";
const auth = getAuth(app);
export default function TaskRedemption() {
  const adminRegex = /^[A-Za-z0-9\s]+$/;
  const location = useLocation();
  const { updatedContest } = location.state || {}; // Find why tasks are manupulated ?
  const [description, setDescription] = useState("");
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subStatus, setSubStatus] = useState("");
  const [authenticate, setAuth] = useState(false);
  const [twitterUser, setTwitterUser] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [submittingTasks, setSubmittingTasks] = useState({});

  const current_space = JSON.parse(localStorage.getItem("spaceData"));

  function formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp)); // Convert string to number
    const monthName = date.toLocaleString("en-US", { month: "long" }); // Full month name
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${monthName} ${dd}, ${yyyy}`;
  }

  const nav = useNavigate();

  const taskDetailsMap = {
    SendTwitterPost: {
      icon: FaXTwitter,
      color: "#1D9BF0",
    },
    SendText: {
      icon: FaFileUpload,
      color: "#de7515",
    },
    SendUrl: {
      icon: FaLink,
      color: "#6d15de",
    },
    SendImage: {
      icon: FaFileUpload,
      color: "#de7515",
    },
    TwitterFollow: {
      icon: FaXTwitter,
      color: "#1D9BF0",
    },
  };

  const [tasks, setTasks] = useState(updatedContest?.tasks);
  console.log(
    tasks,
    updatedContest?.tasks,
    updatedContest,
    "updatedcontest.tasks"
  );
  const [twitterLink, setTwitterLink] = useState("");

  // const handleInputTwitter = (e) => {
  //   setTwitterLink(e.target.value);
  // };

  const fileToUint8Array = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = (error) => reject(error);
    });
  async function uploadImgAndReturnURL(metadata, file) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileContent = await fileToUint8Array(file);
        const imageData = {
          image_title: metadata.title,
          name: metadata.name,
          content: [fileContent],
          content_type: metadata.contentType,
        };
        let res = await ICP_Ambassador_Program_backend.upload_profile_image(
          process.env.CANISTER_ID_IC_ASSET_HANDLER,
          imageData
        );
        console.log("image upload promise response : ", res);
        if (res?.Ok) {
          let id = res?.Ok;
          const protocol = process.env.DFX_NETWORK === "ic" ? "https" : "http";
          const domain =
            process.env.DFX_NETWORK === "ic" ? "raw.icp0.io" : "localhost:4943";
          let url = `${protocol}://${process.env.CANISTER_ID_IC_ASSET_HANDLER}.${domain}/f/${id}`;
          resolve(url);
        } else {
          reject(new Error("Image upload response was not Ok"));
        }
      } catch (err) {
        console.log("rejected in catch : ", err);
        reject(new Error(err));
      }
    });
  }

  function parseTasks(mission_tasks, sub_tasks) {
    try {
      let new_tasks = [];
      console.log(mission_tasks, sub_tasks);
      for (let i = 0; i < sub_tasks.length; i++) {
        let taskType = Object.keys(sub_tasks[i])[0];
        console.log(taskType);
        if (taskType == "SendText") {
          new_tasks.push({
            ...mission_tasks[i],
            content: sub_tasks[i][taskType]?.text,
            submitted: true,
          });
        } else if (taskType == "SendImage") {
          new_tasks.push({
            ...mission_tasks[i],
            image: sub_tasks[i][taskType]?.img,
            sampleImg: mission_tasks[i].image,
            submitted: true,
          });
        } else if (taskType == "SendUrl") {
          new_tasks.push({
            ...mission_tasks[i],
            content: sub_tasks[i][taskType]?.url,
            submitted: true,
          });
        } else if (taskType == "SendTwitterPost") {
          console.log("parsing twitter post");
          new_tasks.push({
            ...mission_tasks[i],
            content: sub_tasks[i][taskType]?.post,
            submitted: true,
          });
        } else if (taskType == "TwitterFollow") {
          new_tasks.push({ ...mission_tasks[i], submitted: true });
        } else {
          if (mission_tasks[i]?.id == "SendTwitterPost") {
            console.log("unsubmitted twitter tasks left", authenticate);
            // setUnsubmittedTwitterPost([...unsubmittedTwitterPost,mission_tasks[i]])
          }
          new_tasks.push({ ...mission_tasks[i] });
        }
      }
      console.log("parsed mission tasks : ", new_tasks);
      setTasks(new_tasks);
    } catch (error) {
      console.log("err parsing task submission : ", error);
    }
  }

  async function getSubmission() {
    try {
      setLoading(true);
      let user = JSON.parse(Cookies.get("discord_user"));
      let res = await ICP_Ambassador_Program_backend.get_submission(
        `${updatedContest.mission_id}_${user.id}`
      );
      console.log(
        "previous submission : ",
        res,
        updatedContest,
        `${updatedContest.mission_id}_${user.id}`
      );
      if (res?.Ok) {
        setSubStatus(Object.keys(res?.Ok?.status)[0]);
        setSubmission(res?.Ok);
        let y = 0;
        let sub_tasks = [];
        let previous_sub_tasks = res?.Ok?.tasks_submitted;
        for (let i = 0; i < tasks?.length; i++) {
          for (let j = 0; j < previous_sub_tasks?.length; j++) {
            if (
              i ==
              previous_sub_tasks[j][Object.keys(previous_sub_tasks[j])[0]].id
            ) {
              sub_tasks.push(previous_sub_tasks[j]);
              break;
            } else {
              if (j == previous_sub_tasks?.length - 1) {
                sub_tasks.push({});
              }
            }
          }
        }
        // for(let i=0;(i<tasks?.length);i++){
        //   console.log(previous_sub_tasks[y],i)
        //   if(y<previous_sub_tasks?.length){
        //     if(i==previous_sub_tasks[y][Object.keys(previous_sub_tasks[y])[0]].id){
        //       sub_tasks.push(previous_sub_tasks[y])
        //       y+=1
        //     }else{
        //       sub_tasks.push({})
        //     }
        //   }else{
        //     sub_tasks.push({})
        //   }

        // }
        parseTasks(tasks, sub_tasks);
        setLoading(false);
      } else {
        let newSubmission = {
          submission_id: "",
          mission_id: updatedContest.mission_id,
          tasks_submitted: [],
          user: user?.id,
          status: { Unread: null },
          points_rewarded: false,
        };
        console.log(newSubmission);
        setSubStatus("Unread");
        setSubmission(newSubmission);
        setLoading(false);
      }
    } catch (error) {
      console.log("error while fetching submission : ", error);
      setLoading(false);
    }
  }

  async function submitTask(taskid) {
    try {
      setSubmittingTasks((prev) => ({ ...prev, [taskid]: true }));
      let task = {};
      for (let i = 0; i < tasks?.length; i++) {
        if (taskid == tasks[i]?.task_id) {
          task = tasks[i];
          console.log("task found : ", task);
        }
      }
      console.log("task found : ", taskid, task);

      setLoading(true);
      let user = JSON.parse(Cookies.get("discord_user"));
      let newTask = {};

      if (task?.id == "SendText") {
        if (task?.content == "") {
          setLoading(false);
          setSubmittingTasks((prev) => ({ ...prev, [taskid]: false }));
          toast.error("Cannot submit empty text");
          return;
        }
        newTask = {
          SendText: {
            id: task?.task_id,
            text: task?.content || "",
          },
        };
      }
      if (task?.id == "SendImage") {
        if (task?.image == "") {
          toast.error("cannot send empty image");
          setSubmittingTasks((prev) => ({ ...prev, [taskid]: false }));
          setLoading(false);
          return;
        }
        if (typeof task?.image != "object") {
          newTask = {
            SendImage: {
              id: task?.task_id,
              img: task?.image || "",
            },
          };
        } else {
          console.log(task);
          let metadata = {
            title: task?.image.name.split(".")[0],
            name: task?.image.name,
            contentType: task?.image.type,
            content: null,
          };
          let img = await uploadImgAndReturnURL(metadata, task?.image);
          newTask = {
            SendImage: {
              id: task?.task_id,
              img: img,
            },
          };
        }
      }
      if (task?.id == "SendUrl") {
        if (task?.content == "") {
          setSubmittingTasks((prev) => ({ ...prev, [taskid]: false }));
          setLoading(false);
          toast.error("Cannot submit empty url");
          return;
        }
        newTask = {
          SendUrl: {
            id: task?.task_id,
            url: task?.content || "",
          },
        };
      }
      if (task?.id == "SendTwitterPost") {
        // if (!authenticate && twitterUser == "") {
        //   setLoading(false);
        //   toast.error(
        //     "Please authenticate using twitter for submitting a post"
        //   );
        //   return;
        // }
        if (!authenticate && !sessionStorage.getItem("twitterUser")) {
          setLoading(false);
          toast.error(
            "Please authenticate using Twitter for submitting a post"
          );
          setSubmittingTasks((prev) => ({ ...prev, [taskid]: false }));
          return;
        }

        const regex = /^https:\/\/x\.com\/[^/]+\/[^/]+\/[^/]+$/;
        console.log("regex test : ", regex.test(task.content), task.content);
        let testResult = regex.test(task.content);
        if (!testResult) {
          setLoading(false);
          toast.error("Invalid post link format");
          setSubmittingTasks((prev) => ({ ...prev, [taskid]: false }));
          return;
        }
        if (
          !task.content?.includes(
            twitterUser || sessionStorage.getItem("twitterUser")
          )
        ) {
          console.log("user check : ", twitterUser);
          setLoading(false);
          toast.error("Someone else's post cannot be submitted");
          setSubmittingTasks((prev) => ({ ...prev, [taskid]: false }));
          return;
        }
        newTask = {
          SendTwitterPost: {
            id: task?.task_id,
            post: task?.content || "",
          },
        };
      }

      if (task?.id == "TwitterFollow") {
        window.open(`https://x.com/${task?.account}`, "_blank");
        newTask = {
          TwitterFollow: {
            id: task?.task_id,
            followed: true,
          },
        };
      }

      let res = await ICP_Ambassador_Program_backend.add_task_submission(
        submission,
        newTask
      );
      console.log(res);

      if (typeof res == "object" && !res?.Err) {
        getSubmission();
        setLoading(false);
        toast.success(
          submission.submission_id == ""
            ? "Added new submission"
            : "Updated the submission"
        );
        // nav('/')
      } else {
        setLoading(false);
        toast.error("Some error occurred while submitting");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(err);
    } finally {
      setSubmittingTasks((prev) => ({ ...prev, [taskid]: false }));
    }
  }

  const Check_authentication = async () => {
    const provider = new TwitterAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("user ==>", user);
      const username = user.reloadUserInfo.screenName;
      console.log("username ==>", username);
      // const regex = /(?:twitter|x)\.com\/([^\/]+)/;
      // const match = twitterLink.match(regex);
      // const usernameInLink = match ? match[1] : null;
      // console.log("userNameInLink ==>", usernameInLink);
      if (username) {
        setAuth(true);
        setTwitterUser(username);
        sessionStorage.setItem("twitterUser", username);
        console.log("Authentication successful");
        toast.success("Authenticated using twitter");
      } else {
        console.log("User not authenticated");
        toast.error("Something failed while authenticating with twitter");
      }
    } catch (error) {
      console.error("Error during Twitter login:", error);
    }
  };
  // const twitterSubmit = () => {
  //   if (!authenticate) {
  //     alert("Authenticate twitter before submitting .....");
  //   }
  // };

  async function addSubmission() {
    try {
      // e.preventDefault();
      setLoading(true);

      console.log("before finaltasks : ", tasks);
      let user = JSON.parse(Cookies.get("discord_user"));
      let finalTasks = [];
      for (let i = 0; i < tasks?.length; i++) {
        let task = {};
        if (tasks[i]?.id == "SendText") {
          task = {
            SendText: {
              id: tasks[i]?.task_id,
              text: tasks[i]?.content || "",
            },
          };
        }
        if (tasks[i]?.id == "SendImage") {
          if (typeof tasks[i]?.image != "object") {
            // toast.error("please choose a correct image")
            // finalTasks.push({
            //   SendImage:{
            //     id:finalTasks?.length,
            //     title:tasks[i]?.title,
            //     body:tasks[i]?.body,
            //     img:tasks[i]?.img
            //   }
            // })
            task = {
              SendImage: {
                id: tasks[i]?.task_id,
                img: tasks[i]?.image || "",
              },
            };
          } else {
            console.log(tasks[i]);
            let metadata = {
              title: tasks[i]?.image.name.split(".")[0], // Use filename (without extension) as title
              name: tasks[i]?.image.name,
              contentType: tasks[i]?.image.type,
              content: null, // Content will be set in handleUpload
            };
            let img = await uploadImgAndReturnURL(metadata, tasks[i]?.image);
            task = {
              SendImage: {
                id: tasks[i]?.task_id,
                img: img,
              },
            };
            // finalTasks.push({
            //   SendImage:{
            //     id:finalTasks?.length,
            //     title:tasks[i]?.title,
            //     body:tasks[i]?.body,
            //     img:img
            //   }
            // })
          }
        }
        if (tasks[i]?.id == "SendTwitterPost") {
          if (!authenticate) {
            setLoading(false);
            toast.error(
              "Please authenticate using twitter for submitting a post"
            );
            return;
          }
          const regex = /^https:\/\/x\.com\/[^/]+\/[^/]+\/[^/]+$/;
          console.log(
            "regex test : ",
            regex.test(tasks[i].content),
            tasks[i].content
          );
          let testResult = regex.test(tasks[i].content);
          if (!testResult) {
            setLoading(false);
            toast.error("Invalid post link format");
            return;
          }
          if (!tasks[i].content?.includes(twitterUser)) {
            console.log("user check : ", twitterUser);
            setLoading(false);
            toast.error("Someone else's post cannot be submitted");
            return;
          }
          task = {
            SendTwitterPost: {
              id: tasks[i]?.task_id,
              post: tasks[i]?.content || "",
            },
          };
        }
        if (tasks[i]?.id == "SendUrl") {
          task = {
            SendUrl: {
              id: tasks[i]?.task_id,
              url: tasks[i]?.content || "",
            },
          };
        }
        finalTasks.push(task);
      }
      console.log("final submission : ", {
        ...submission,
        tasks_submitted: finalTasks,
      });
      let res = await ICP_Ambassador_Program_backend.add_or_update_submission({
        ...submission,
        tasks_submitted: finalTasks,
      });
      console.log(res);

      if (typeof res == "object" && !res?.Err) {
        setLoading(false);
        toast.success(
          submission.submission_id == ""
            ? "Added new submission"
            : "Updated the submission"
        );
        nav("/");
      } else {
        setLoading(false);
        toast.error("Some error occurred while submitting");
      }
    } catch (err) {
      console.log("err updating submission : ", err);
      setLoading(false);
      toast.error("Something went wrong");
    }
  }

  const handleInputChange = (e, taskId) => {
    const value = e.target.value;
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, content: value } : task
      )
    );
  };

  const fileInputRef = useRef(null);

  const onFileChange = (e, taskId, task) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(e, taskId, task);
      // Reset the input value
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleFileChange = (e, taskId, task) => {
    const file = e.target.files[0];
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId
          ? { ...task, uploading: true, image: file }
          : task
      )
    );
    setTimeout(() => {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.task_id === taskId
            ? { ...t, uploading: false, submitted: false }
            : t
        )
      );
    }, 2000);
  };

  // const handleSend = (taskId, task) => {
  //   if (!task.content) return;
  //   console.log(taskId);
  //   //console.log('Sending task:', taskId, task);
  //   setTasks((prevTasks) =>
  //     prevTasks.map((task) =>
  //       task.task_id === taskId ? { ...task, submitted: true } : task
  //     )
  //   );
  // };
  // const handleSendImage = (taskId, task) => {
  //   console.log(taskId);
  //   //console.log('Sending task:', taskId, task);
  //   setTasks((prevTasks) =>
  //     prevTasks.map((t) =>
  //       t.task_id === taskId ? { ...t, submitted: true } : t
  //     )
  //   );
  // };

  const handleSubmit = async (e, taskId) => {
    e.preventDefault();
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === taskId ? { ...task, submitted: true } : task
      )
    );
    console.log("Updated tasks:", tasks);
    let user = JSON.parse(Cookies.get("discord_user"));
    const res = await ICP_Ambassador_Program_backend.add_points(
      String(user?.id),
      100
    );
    console.log(res);
    alert(`task submitted by ${user?.username} !`);
    nav("/");
  };
  //console.log(location)
  // 0------------
  // if (!updatedContest) {
  //   return <p className="text-white">No contest data available</p>;
  // }

  const getRandomDarkColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
  };

  const [randomColor, setRandomColor] = useState("#000000");

  useEffect(() => {
    setRandomColor(getRandomDarkColor());
    getSubmission();
  }, []);

  const {
    reward,
    status,
    title,
    img,
    social_platforms,
    icons,
    start_date,
    end_date,
  } = updatedContest;
  //console.log("Updated contest ==>",updatedContest)
  const statusKey = Object.keys(status)[0];
  const statusValue = status[statusKey];

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "strike"],
            ["blockquote", "code-block", "link", "image"],
            [{ align: [] }],
            ["clean"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            ["hr"],
          ],
        },
        placeholder: "Enter your submission...",
      });

      quillRef.current.clipboard.dangerouslyPasteHTML(description);

      quillRef.current.on("text-change", () => {
        const textContent = quillRef.current.getText().replace(/\n/g, "");
        if (adminRegex.test(textContent)) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === "SendText" ? { ...task, content: textContent } : task
            )
          );
        } else {
          console.log("Invalid content detected");
        }
      });
    }
  }, [description]);

  useEffect(() => {
    //console.log("Updated tasks:", tasks);
  }, [tasks]);

  const handleDeleteFile = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.task_id === taskId ? { ...t, image: null, submitted: false } : t
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, taskId, task) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } }, taskId, task);
    }
  };
  return (
    <ParentComponent>
      <div className="mt-1 flex rounded-xl flex-wrap  bg-gradient-to-b from-[#1E0F33] to-[#35245d] text-white p-6  gap-6 w-[93%]">
        <div className="w-full md3:w-[60%]">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <img
                loading="lazy"
                src={icons.platform_logo}
                alt="ICP HUB India Logo"
                className="object-contain border-4  rounded-xl border-white aspect-square w-[60px] "
              />
              <h2 className="text-3xl font-semibold">{icons.platform}</h2>
              <a
                href={current_space?.[1].urls.website[0]}
                target="_blank"
                className=" flex items-center border ml-4 border-white gap-2 text-white  font-semibold px-4 py-1.5 hover:bg-gray-300 rounded-xl text-sm"
              >
                <FaPlus size={16} /> Follow
              </a>
            </div>
            <div className="flex gap-2">
              <a
                href={current_space?.[1].urls.twitter[0]}
                target="_blank"
                className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[56px] w-[56px]"
              >
                <BsTwitterX style={{ fontSize: "32px", color: "white" }} />
              </a>
              <a
                href={current_space?.[1].urls.discord[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[56px] w-[56px]"
              >
                <FaDiscord style={{ fontSize: "38px", color: "white" }} />
              </a>
              <a
                href={current_space?.[1].urls.telegram[0]}
                target="_blank"
                className="flex items-center justify-center shrink-0 rounded-md bg-[#9173FF] bg-opacity-20 h-[56px] w-[56px]"
              >
                <LiaTelegram style={{ fontSize: "38px", color: "white" }} />
              </a>
            </div>
          </div>
          <div className="w-full my-4 border-2 border-[#FFFFFF]/20"></div>
          <h1 className="text-3xl w-full font-semibold ">
            Do task to redeem rewards
          </h1>
          <p className=" rounded-xl w-full  my-4 p-2 flex gap-4  bg-[#3722534d] text-[#9173FF]">
            <svg
              width="22"
              height="24"
              viewBox="0 0 22 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.3333 1.16675V5.50008M6.66667 1.16675V5.50008M1.25 9.83342H20.75M3.41667 3.33341H18.5833C19.78 3.33341 20.75 4.30346 20.75 5.50008V20.6667C20.75 21.8634 19.78 22.8334 18.5833 22.8334H3.41667C2.22005 22.8334 1.25 21.8634 1.25 20.6667V5.50008C1.25 4.30346 2.22005 3.33341 3.41667 3.33341Z"
                stroke="#9173FF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Event Period: {formatTimestamp(start_date)} -{" "}
            {formatTimestamp(end_date)}
          </p>

          {/* Tasks */}
          {tasks.length > 0 ? (
            <div className="my-5 px-4 space-y-4 w-full ">
              {tasks.map((task, index) => {
                const taskType = task.id;
                const { icon: IconComponent, color: bgColor } =
                  taskDetailsMap[taskType] || {};

                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center mt-3">
                      <div className="bg-[#1E0F33] p-1.5 rounded-lg size-8">
                        {task.submitted && (
                          <svg
                            width="24"
                            height="22"
                            viewBox="0 0 30 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 11.6667L13 15.6667L26.3333 2.33333M25 13V22.3333C25 23.0406 24.719 23.7189 24.219 24.219C23.7189 24.719 23.0406 25 22.3333 25H3.66667C2.95942 25 2.28115 24.719 1.78105 24.219C1.28095 23.7189 1 23.0406 1 22.3333V3.66667C1 2.95942 1.28095 2.28115 1.78105 1.78105C2.28115 1.28095 2.95942 1 3.66667 1H18.3333"
                              stroke="#9173FF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      {tasks.length > index + 1 && (
                        <div className="my-4 w-[3px] h-[30vh] border-2 border-[#1E0F33]"></div>
                      )}
                    </div>

                    <div className="bg-[#1E0F33] p-4 rounded-lg flex w-[90%]">
                      <div className="w-full">
                        <div className="text-lg font-medium flex line-clamp-2 break-all gap-4 mb-2">
                          {" "}
                          <span
                            className="w-7 h-7 flex justify-center  items-center rounded-full"
                            style={{ backgroundColor: bgColor }}
                          >
                            {IconComponent ? (
                              <IconComponent className="" />
                            ) : null}
                          </span>
                          <p className="w-[98%] line-clamp-2 break-all">
                            {task.title}
                          </p>
                        </div>
                        <p className="text-[#A0A0A0] line-clamp-2 break-all pl-11 text-sm">
                          {task.description}
                        </p>
                        {/* <div className="text-sm  flex items-center gap-1 mt-2 mb-4 font-semibold">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.21985 8.72C6.08737 8.86217 6.01524 9.05022 6.01867 9.24452C6.0221 9.43882 6.10081 9.62421 6.23822 9.76162C6.37564 9.89903 6.56102 9.97775 6.75532 9.98118C6.94963 9.9846 7.13767 9.91248 7.27985 9.78L12.4998 4.56V6.25C12.4998 6.44891 12.5789 6.63968 12.7195 6.78033C12.8602 6.92098 13.0509 7 13.2498 7C13.4488 7 13.6395 6.92098 13.7802 6.78033C13.9208 6.63968 13.9998 6.44891 13.9998 6.25V2.75C13.9998 2.55109 13.9208 2.36032 13.7802 2.21967C13.6395 2.07902 13.4488 2 13.2498 2H9.74985C9.55093 2 9.36017 2.07902 9.21952 2.21967C9.07886 2.36032 8.99985 2.55109 8.99985 2.75C8.99985 2.94891 9.07886 3.13968 9.21952 3.28033C9.36017 3.42098 9.55093 3.5 9.74985 3.5H11.4398L6.21985 8.72Z"
                        fill="#FAFAFA"
                      />
                      <path
                        d="M3.5 6.75C3.5 6.06 4.06 5.5 4.75 5.5H7C7.19891 5.5 7.38968 5.42098 7.53033 5.28033C7.67098 5.13968 7.75 4.94891 7.75 4.75C7.75 4.55109 7.67098 4.36032 7.53033 4.21967C7.38968 4.07902 7.19891 4 7 4H4.75C4.02065 4 3.32118 4.28973 2.80546 4.80546C2.28973 5.32118 2 6.02065 2 6.75V11.25C2 11.9793 2.28973 12.6788 2.80546 13.1945C3.32118 13.7103 4.02065 14 4.75 14H9.25C9.97935 14 10.6788 13.7103 11.1945 13.1945C11.7103 12.6788 12 11.9793 12 11.25V9C12 8.80109 11.921 8.61032 11.7803 8.46967C11.6397 8.32902 11.4489 8.25 11.25 8.25C11.0511 8.25 10.8603 8.32902 10.7197 8.46967C10.579 8.61032 10.5 8.80109 10.5 9V11.25C10.5 11.94 9.94 12.5 9.25 12.5H4.75C4.06 12.5 3.5 11.94 3.5 11.25V6.75Z"
                        fill="#FAFAFA"
                      />
                    </svg>
                    Detailssss
                  </div> */}
                        {/* <button className="bg-[#9173FF] text-white px-4 py-2 rounded-md mt-2">
                    Connect Wallet
                  </button> */}
                        <div
                          className="flex flex-col relative rounded-xl "
                          style={{ backgroundColor: "#171717" }}
                          key={index}
                        >
                          <Accordion
                            expanded={true}
                            style={{
                              backgroundColor: "#1E0F33",
                              color: "white",
                              width: "100%",
                              height: "auto",
                              borderRadius: "10px",
                              boxShadow: "none",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            <AccordionDetails>
                              {/* {!task.submitted ? ( */}
                              <form className="flex flex-col gap-3 ml-4 mt-1">
                                {task.id === "SendText" && (
                                  <>
                                    <div className="border border-[#FFFFFF14] m-2 rounded-md custom-quill w-full">
                                      {/* <div ref={editorRef} className="p-2" style={{ height: '200px' }}></div> */}
                                      <textarea
                                        rows={2}
                                        className="w-full py-2 px-3 mt-2 line-clamp-2 break-all bg-[#1E0F33]"
                                        onChange={(e) =>
                                          handleInputChange(e, task.task_id)
                                        }
                                        value={task.content}
                                        placeholder="Input text here..."
                                      />
                                    </div>
                                    {task.submitted ? (
                                      <div className="bg-[#1DB954] text-white flex gap-2 justify-center rounded-md ml-2 w-full items-center py-2">
                                        <DoneIcon />
                                        <div>Completed</div>
                                      </div>
                                    ) : submitTask[task.task_id] ? (
                                      <div
                                        style={{ backgroundColor: bgColor }}
                                        className="text-white w-full py-2 flex justify-center items-center gap-2 ml-2 rounded-md"
                                      >
                                        <ThreeDots
                                          visible={true}
                                          height="30"
                                          width="40"
                                          color="white"
                                          radius="9"
                                          ariaLabel="three-dots-loading"
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        className={`text-white w-full py-2 flex justify-center items-center gap-2 ml-2 rounded-md cursor-pointer ${
                                          task.content ? "" : "opacity-40"
                                        }`}
                                        style={{ backgroundColor: bgColor }}
                                        onClick={() => {
                                          submitTask(task.task_id);
                                          // handleSend(task.task_id,task)
                                        }}
                                      >
                                        <BiSolidSend />
                                        <div>Send</div>
                                      </div>
                                    )}
                                  </>
                                )}
                                {task.id === "SendUrl" && (
                                  <>
                                    <div className="flex flex-col gap-3">
                                      <input
                                        type="SendURL"
                                        placeholder="Enter URL"
                                        onChange={(e) =>
                                          handleInputChange(e, task.task_id)
                                        }
                                        className="outline-none p-3 text-white ml-2  bg-[#1E0F33] border border-[#FFFFFF14] rounded "
                                        value={task.content}
                                      />
                                      {task.submitted ? (
                                        <div className="bg-[#1DB954] text-white flex gap-2 justify-center rounded-md ml-2 w-full items-center py-2">
                                          <DoneIcon />
                                          <div>Completed</div>
                                        </div>
                                      ) : submittingTasks[task.task_id] ? (
                                        <div
                                          style={{ backgroundColor: bgColor }}
                                          className="text-white w-full py-2 mt-3 flex justify-center items-center gap-2 ml-2 rounded-md"
                                        >
                                          <ThreeDots
                                            visible={true}
                                            height="30"
                                            width="40"
                                            color="white"
                                            radius="9"
                                            ariaLabel="three-dots-loading"
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          className={`text-white w-full py-2 mt-3 flex justify-center items-center gap-2 ml-2 rounded-md cursor-pointer ${
                                            task.content ? "" : "opacity-40"
                                          }`}
                                          style={{ backgroundColor: bgColor }}
                                          onClick={() => {
                                            submitTask(task.task_id);
                                            // handleSend(task.task_id,task)
                                          }}
                                        >
                                          <BiSolidSend />
                                          <div>Submit</div>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                                {task.id === "SendTwitterPost" && (
                                  <div className="flex flex-col gap-6 mt-3">
                                    <div className="flex w-full gap-4 items-center">
                                      <input
                                        type="text"
                                        value={task.content}
                                        placeholder="Share post link"
                                        onChange={(e) =>
                                          handleInputChange(e, task.task_id)
                                        }
                                        className="outline-none p-3  bg-[#1E0F33] border border-[#FFFFFF14] ml-2 rounded w-full text-white"
                                      />
                                      {/* {!authenticate ?(
                                         <button className='w-8 h-8   bg-white flex justify-center items-center rounded-full curso-pointer' onClick={(e)=>{Check_authentication(e)}}>
                                         <PrivacyTipIcon className='text-black'/>
                                         </button>
                                        
                                       ):(
                                         <div className='lg:w-8 sm:w-10 lg:h-8 sm: bg-[#1DB954] text-black flex justify-center items-center rounded-full'>
                                           <DoneIcon />
                                       </div>
                                       )} */}
                                    </div>
                                    {task?.submitted ? (
                                      <div className="bg-[#1DB954] text-white flex gap-2 justify-center rounded-md ml-2 w-full items-center py-2">
                                        <DoneIcon />
                                        <div>Completed</div>
                                        {/* <p className='text-green-500 text-sm font-semibold '>Authenticated</p> */}
                                      </div>
                                    ) : submittingTasks[task.task_id] ? (
                                      <div
                                        style={{ backgroundColor: bgColor }}
                                        className="text-white w-full py-2 mt-3 flex justify-center items-center gap-2 ml-2 rounded-md"
                                      >
                                        <ThreeDots
                                          visible={true}
                                          height="30"
                                          width="40"
                                          color="white"
                                          radius="9"
                                          ariaLabel="three-dots-loading"
                                        />
                                      </div>
                                    ) : !authenticate ? (
                                      <div
                                        className="text-white py-2 gap-2 rounded-md flex cursor-pointer ml-2 justify-center items-center "
                                        onClick={Check_authentication}
                                        style={{ backgroundColor: bgColor }}
                                      >
                                        <FaXTwitter />
                                        <div className="text-lg  text-white">
                                          Connect Twitter
                                        </div>
                                        {/* <p  className='text-gray-400 text-sm font-semibold'>Authenticate Twitter before submitting. Click on top right icon  to authenticate</p> */}
                                      </div>
                                    ) : (
                                      <div
                                        className="text-white py-2 gap-2 rounded-md ml-2 flex cursor-pointer justify-center items-center "
                                        onClick={() => submitTask(task.task_id)}
                                        style={{ backgroundColor: bgColor }}
                                      >
                                        <FaXTwitter />
                                        <div className="text-lg  text-white">
                                          Submit Post
                                        </div>
                                        {/* <p  className='text-gray-400 text-sm font-semibold'>Authenticate Twitter before submitting. Click on top right icon  to authenticate</p> */}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-center">
                                      {/* <button
                                         onClick={()=>{twitterSubmit()}}
                                         type="submit"
                                         className="w-2/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
                                     >
                                         Submit <MdOutlineArrowOutward className="ml-3" size={24} />
                                     </button> */}
                                    </div>
                                  </div>
                                )}
                                {task.id === "SendImage" && (
                                  <div className="mt-4 w-full ">
                                    {/* <div className='flex gap-5 my-5'>
                              <div className="text-white font-semibold text-md  mt-4">Sample Image</div>
                              <img src={task.sampleImg} className='w-52 rounded h-40' alt=''/>
                            </div> */}

                                    <div className="flex flex-col gap-3 items-center justify-center rounded-lg w-full h-auto mx-auto">
                                      {(task.uploading || task.image) && (
                                        <div className="w-full   border border-[#1E0F33]   rounded-md my-4 p-2">
                                          {task.uploading ? (
                                            <div className="w-full flex justify-between items-center gap-2 text-md font-semibold py-2 text-white">
                                              <div className="flex justify-between items-center gap-2 w-full">
                                                <div className="flex gap-2">
                                                  <AttachFileIcon />
                                                  <span>
                                                    {task.image?.name ||
                                                      "Uploading..."}
                                                  </span>
                                                </div>
                                                <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-white"></div>
                                              </div>
                                            </div>
                                          ) : task.image && !task.submitted ? (
                                            <div className="w-full flex justify-between items-center gap-2 text-md font-semibold py-2 text-white">
                                              <div className="flex gap-2">
                                                <AttachFileIcon />
                                                <span>
                                                  {typeof task.image ===
                                                  "object"
                                                    ? task.image.name
                                                    : task.image}
                                                </span>
                                              </div>
                                              <button
                                                className="text-red-500"
                                                onClick={() =>
                                                  handleDeleteFile(task.task_id)
                                                }
                                              >
                                                <MdOutlineDeleteOutline />
                                              </button>
                                            </div>
                                          ) : null}
                                        </div>
                                      )}

                                      {task.image || task.submitted ? null : (
                                        <div
                                          className=" flex flex-col items-center mt-6  justify-center gap-2 h-[50px] text-white "
                                          onDragOver={handleDragOver}
                                          onDragLeave={handleDragLeave}
                                          onDrop={(e) =>
                                            handleDrop(e, task.task_id, task)
                                          }
                                        >
                                          <MdOutlineCloudUpload className="text-3xl" />
                                          <div className="text-white font-semibold">
                                            Drag your file here or
                                          </div>
                                        </div>
                                      )}

                                      <div className="w-full">
                                        <label className="mt-4 w-full rounded">
                                          <input
                                            type="file"
                                            className="hidden w-full"
                                            onChange={(e) => {
                                              onFileChange(
                                                e,
                                                task.task_id,
                                                task
                                              );
                                            }}
                                            ref={fileInputRef}
                                          />
                                          {!task.image &&
                                            !task.uploading &&
                                            !task.submitted && (
                                              <div
                                                className="w-full flex justify-center cursor-pointer items-center ml-2 gap-2 text-md font-semibold py-2 text-white rounded-md"
                                                style={{
                                                  backgroundColor: bgColor,
                                                }}
                                              >
                                                {IconComponent ? (
                                                  <IconComponent />
                                                ) : null}
                                                <div>Upload Image</div>
                                              </div>
                                            )}
                                        </label>

                                        {task.uploading && (
                                          <div
                                            className="w-full flex justify-center items-center gap-2 text-md font-semibold py-2 text-white"
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            <div className="flex justify-center items-center">
                                              <div className="h-6 w-8 animate-spin rounded-full border border-white " />
                                            </div>
                                            Uploading...
                                          </div>
                                        )}

                                        {submittingTasks[task.task_id] ? (
                                          <div
                                            className="w-full flex justify-center items-center gap-2 text-md font-semibold py-2 text-white rounded-md"
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            <ThreeDots
                                              visible={true}
                                              height="30"
                                              width="40"
                                              color="white"
                                              radius="9"
                                              ariaLabel="three-dots-loading"
                                            />
                                          </div>
                                        ) : (
                                          // Show Confirm Button Only if Image is Selected and Not Submitted
                                          task.image &&
                                          !task.submitted &&
                                          !task.uploading && (
                                            <div
                                              className="w-full flex justify-center items-center cursor-pointer gap-2 text-md font-semibold py-2 text-white rounded-md"
                                              style={{
                                                backgroundColor: bgColor,
                                              }}
                                              onClick={() => {
                                                setSubmittingTasks((prev) => ({
                                                  ...prev,
                                                  [task.task_id]: true,
                                                })); // Set loading state immediately
                                                submitTask(task.task_id);
                                              }}
                                            >
                                              <DoneIcon />
                                              <div>Confirm</div>
                                            </div>
                                          )
                                        )}

                                        {/* {task.image &&
                                          !task.submitted &&
                                          !task.uploading &&
                                          !submittingTasks[task.task_id] && (
                                            <div
                                              className="w-full flex justify-center items-center cursor-pointer gap-2 text-md font-semibold py-2 text-white rounded-md"
                                              style={{
                                                backgroundColor: bgColor,
                                              }}
                                              onClick={() => {
                                                // handleSendImage(task.task_id, task);
                                                submitTask(task.task_id);
                                              }}
                                            >
                                              <DoneIcon />
                                              <div>Confirm</div>
                                            </div>
                                          )} */}

                                        {/* {submittingTasks[task.task_id] && (
                                          <div
                                            className="w-full flex justify-center items-center gap-2 text-md font-semibold py-2 text-white rounded-md"
                                            style={{ backgroundColor: bgColor }}
                                          >
                                            <ThreeDots
                                              visible={true}
                                              height="30"
                                              width="40"
                                              color="white"
                                              radius="9"
                                              ariaLabel="three-dots-loading"
                                            />
                                          </div>
                                        )} */}

                                        {task.submitted && (
                                          <div className="bg-[#1DB954]  text-white flex gap-2 justify-center ml-2 w-full items-center py-2 rounded-md">
                                            <DoneIcon />
                                            <div>Completed</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {task.id === "TwitterFollow" && (
                                  <div className="flex flex-col gap-4">
                                    <div className="text-white text-md w-full ml-2 line-clamp-2 break-all overflow-clip">{`Task description :\n\n ${task.description}`}</div>
                                    {task.submitted ? (
                                      <div className="bg-[#1DB954] text-white w-full ml-2 flex gap-2 justify-center items-center py-2 rounded-md">
                                        <DoneIcon />
                                        <div>Completed</div>
                                      </div>
                                    ) : submittingTasks[task.task_id] ? (
                                      <div
                                        style={{ backgroundColor: bgColor }}
                                        className="text-white w-full py-2 mt-3 flex justify-center items-center gap-2 ml-2 rounded-md"
                                      >
                                        <ThreeDots
                                          visible={true}
                                          height="30"
                                          width="40"
                                          color="white"
                                          radius="9"
                                          ariaLabel="three-dots-loading"
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        className="w-full text-white py-2 rounded-md flex gap-2 ml-2 line-clamp-2 break-all justify-center items-center text-lg"
                                        style={{ backgroundColor: bgColor }}
                                        onClick={() => submitTask(task.task_id)}
                                      >
                                        <FaXTwitter />
                                        <div>Follow</div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                {/* <div className="flex items-center justify-center"> */}
                                {/* <button
                              type="submit"
                              className="w-2/3 flex justify-center items-center max-w-full text-black rounded bg-white text-sm font-semibold h-9 m-3"
                          >
                              Submit <MdOutlineArrowOutward className="ml-3" size={24} />
                          </button> */}
                                {/* </div> */}
                              </form>
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoContest />
          )}
        </div>

        {/* Reward Section */}
        <div className="w-full md3:w-[37%] rounded-lg space-y-5">
          <div className="flex items-center justify-end">
            <button
              onClick={() => nav("/")}
              className="flex items-center  text-xl justify-end gap-2 font-semibold bg-[#FFFFFF33]  border-2 ml-4 border-[#FFFFFF33]  text-white m-4  px-4 py-1 rounded-xl"
            >
              <FaRegArrowAltCircleLeft size={16} /> Back
            </button>
          </div>

          <MissionCard updatedContest={updatedContest} />
        </div>
      </div>
    </ParentComponent>
  );
}
