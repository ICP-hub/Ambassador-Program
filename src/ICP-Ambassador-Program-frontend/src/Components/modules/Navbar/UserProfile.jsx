import { React, useState, useEffect } from "react";
import { CiSettings } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import { FaDiscord } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { ICP_Ambassador_Program_backend } from "../../../../../declarations/ICP_Ambassador_Program_backend";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";
import { formatDate } from "../../utils/formatDate";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = ({ onWalletClick, onProfileClick, isDrawerOpen }) => {
  const user = useSelector((state) => state.user.value);

  const [conversionRate, setConversionRate] = useState();
  const [userRewardHistory, setUserRewardHistory] = useState();
  const [points, setPoints] = useState(99);
  const [percent, setPercent] = useState(0);

  const navigate = useNavigate();

  const logout = () => {
    // Clear Local Storage
    localStorage.clear();

    // Clear Session Storage
    sessionStorage.clear();

    // Clear Cookies
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });

    // Clear IndexedDB
    if (window.indexedDB) {
      indexedDB
        .databases()
        .then((databases) => {
          databases.forEach((db) => {
            indexedDB.deleteDatabase(db.name);
          });
        })
        .catch(console.error);
    }

    navigate("/");
    window.location.reload();
  };

  const getSpaceConversion = async () => {
    try {
      console.log("HUB : ", user?.hub);
      const space = await ICP_Ambassador_Program_backend.get_space(user?.hub);
      console.log("Conversion : ", space.Ok.conversion / 10);
      if (space?.Ok) {
        setConversionRate(parseInt(space?.Ok?.conversion) / 10);
      }
    } catch (error) {
      console.log("err fetching hub details : ", error);
    }
  };
  const fetchPoints = () => {
    if (user?.xp_points) {
      const xpPoints = parseInt(user.xp_points);
      // const maxXP = xpPoints === 0 ? 99 : Math.pow(10, user.xp_points.toString().length) - 1;
      const maxXP =
        Math.pow(10, Math.max(2, user.xp_points.toString().length)) - 1;
      const percentage = (xpPoints / maxXP) * 100;

      setPoints(maxXP);
      setPercent(percentage);
    }
  };

  useEffect(() => {
    if (user) {
      getSpaceConversion();
      fetchPoints();
    }
  }, [user]);

  const getUserRewardHistory = async () => {
    try {
      const rewdardHistory =
        await ICP_Ambassador_Program_backend.get_user_reward_history(
          user?.discord_id
        );
      console.log("rewdardHistory : ", rewdardHistory);
      if (rewdardHistory?.Ok) {
        setUserRewardHistory(rewdardHistory?.Ok?.rewards);
      }
    } catch (error) {
      console.log("err fetching hub details : ", error);
    }
  };

  useEffect(() => {
    console.log("user =>", user);
    getUserRewardHistory();
  }, []);

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 1, opacity: 1 }}
            exit={{ y: "-100vh", opacity: 0 }}
            transition={{ type: "tween", duration: 0.5 }}
            onClick={onProfileClick}
          >
            <motion.div
              className="bg-[#9173ff] px-12 py-8 rounded-lg shadow-lg w-[800px] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center  space-x-4">
                <div className="bg-[#503a8b] rounded-full size-20 overflow-hidden shadow-2xl">
                  <img
                    src="https://s3-alpha-sig.figma.com/img/4f6f/31c6/bd17e030a4e340e85d148b82ba300180?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=mJJy-sq7coOiM~UlVCcircsfNS2meOlw~jPf4Vb9oyzunN~YfV6HgNfLKuNnlEaly6CeYROoShnurmHh5YDCgYLxAI05cT7XeYyd2IwOwtPTLZXl8Pyq7Y0kFhpp4Itu5bRKpqh2H5IGZiVC-nT2YMa63GmRGLxuhgzn7EL6vakt4y7UcyUPTgx60wH8zz6koqOwdoi6stSUvuwZarqm~k56r0flqZSLHxm2QFJzOpP3TGcry3xD-SSSnYj0cZVAcJ1SiduQmTtrI3Gs2jt2VFiao-Dpt9X2pDHXJ1gEx3UE3MMC2N4WSWvC2yvBeG0-yCWzN7QY96vt7lbTEc29nQ__"
                    alt="Avatar"
                  />
                </div>
                <input
                  type="text"
                  value={user?.username}
                  className="bg-[#a78fff] text-white px-4 py-2 rounded-md outline-none w-[300px]  "
                  readOnly
                />

                <div className="flex items-center space-x-3">
                  <Link
                    className="bg-[#503A8b] text-white w-32 px-2  space-x-2 text-xs rounded-lg flex items-center"
                    to={`/wallet`}
                  >
                    <svg
                      width="48"
                      height="40"
                      viewBox="0 0 48 42"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.57156 0.428711C3.85219 0.428711 0 4.28087 0 9.00022V33.0001C0 37.7185 3.85219 41.5716 8.57156 41.5716H39.4284C44.1469 41.5716 48 37.7194 48 33.0001V29.5716H30.8569C26.1384 29.5716 22.2853 25.7195 22.2853 21.0001C22.2853 16.2808 26.1375 12.4286 30.8569 12.4286H48V9.00022C48 4.28181 44.1478 0.428711 39.4284 0.428711H8.57156ZM30.8569 15.857C27.9778 15.857 25.7137 18.1211 25.7137 21.0001C25.7137 23.8792 27.9778 26.1432 30.8569 26.1432H48V15.858H30.8569V15.857ZM30.8569 19.2855C31.8038 19.2855 32.5716 20.0533 32.5716 21.0001C32.5716 21.947 31.8038 22.7148 30.8569 22.7148C29.91 22.7148 29.1422 21.947 29.1422 21.0001C29.1422 20.0533 29.91 19.2855 30.8569 19.2855Z"
                        fill="#9173FF"
                      />
                    </svg>

                    <span className="bg-[#654db0] p-1 rounded-sm w-full">
                      {/* Connect {conversionRate} */}
                      {user
                        ? (parseInt(user.redeem_points) * conversionRate) / 100
                        : 0}{" "}
                      {DEFAULT_CURRENCY}
                    </span>
                  </Link>
                  <button className="bg-[#503A8b] text-white px-2 py-2 rounded-lg flex items-center">
                    <a
                      target="_blank"
                      href="https://discord.com/channels/1309834458777653279/1309834458777653282"
                    >
                      <FaDiscord className="text-white text-2xl cursor-pointer" />
                    </a>
                  </button>
                  <Link
                    className="bg-[#503A8b] text-white px-2 py-2 rounded-lg flex items-center"
                    to="/settings"
                  >
                    <CiSettings className="text-white text-2xl cursor-pointer" />
                  </Link>
                  <button className="bg-[#503A8b] text-white px-2 py-2 rounded-lg flex items-center">
                    <FiLogOut
                      className="text-white text-2xl cursor-pointer"
                      onClick={logout}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-[#987dfb] px-24 py-12 rounded-lg overflow-scroll  h-[350px] scrollbar-hide">
                <div className="  absolute font-semibold left-20 text-xl">
                  Rank
                </div>
                <div className="flex  items-center space-x-3">
                  <button className=" bg-[linear-gradient(to_right,#503a8b,#8566e0)] text-white px-2 py-1 rounded-lg flex items-center">
                    {" "}
                    {" " + Object.keys(user.level)[0]}
                  </button>

                  <div className="w-full  border-2 border-[#503a8b] h-8  text-sm rounded-md flex justify-between">
                    <div
                      className=" custom-model h-7.5 rounded-r-md"
                      style={{ width: `${percent}%` }}
                    ></div>
                    <span className="flex items-center mr-4">
                      {/* {parseInt(user.xp_points)} / 500 XP */}
                      {parseInt(user.xp_points)} / {parseInt(points)} XP
                    </span>
                  </div>
                </div>

            <table className="w-full mt-4 text-white ">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Mission</th>
                  <th className="text-left py-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {userRewardHistory && userRewardHistory.length > 0 ? (
                  userRewardHistory.map((items, index) => (
                    <tr key={index} className="border-b text-sm">
                      <td className="py-3">
                        {formatDate(parseInt(items?.date) / 1_000_000)}
                      </td>
                      <td className="py-3">{items?.mission_title}</td>
                      <td className="py-3 flex items-center">
                        +{Number(items?.reward) || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center h-[150px]">No rewards earned yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
