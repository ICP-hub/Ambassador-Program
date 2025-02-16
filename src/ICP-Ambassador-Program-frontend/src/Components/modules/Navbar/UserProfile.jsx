import React from "react";
import { CiSettings } from "react-icons/ci";
import { CiWallet } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import { FaDiscord } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const UserProfile = ({ onWalletClick, onProfileClick }) => {
  const user = useSelector((state) => state.user.value);
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-[#9173ff] px-12 py-8 rounded-lg shadow-lg w-[800px] relative">
          <button
            className="absolute right-1 top-[-30px]"
            onClick={onProfileClick}
          >
            <IoClose size={24} color="white" />
          </button>
          <div className="flex items-center  space-x-4">
            <div className="bg-[#503a8b] rounded-full size-20 overflow-hidden shadow-2xl">
              <img
                src="https://s3-alpha-sig.figma.com/img/4f6f/31c6/bd17e030a4e340e85d148b82ba300180?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bght5lwW6AxmBLlRrdZahJrx8HM8h4BlTetOT7TWK465aLkiCSiMgJSulw4R98YvwhJ-82xHFgt26NnUdyT-4lUZx3OW0TkNJ2ie1vRcNpee9l6VJYEmXcOSEZk32r-sGVe~FvBl7gxbW9mRd5bo0Wg4Zke-fqzMwC6lV9oWJzyuKqGtxOfccxZpf~hC9lg78bD-xwA3pHsVrZmOgs0iR84mrqnSQmx45JifTK4pQyBB0wvjJjVhUakkumNdRmHH~AYvAtJFSe81ZyNbc41dtSqdH56WN4ATxbK8eY1sM8IbDQLN-pdsdDWtFvckrEBp3kYL-cufL7TGX9AhaQqvzw__"
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
                  Connect
                </span>
              </Link>
              <button className="bg-[#503A8b] text-white px-2 py-2 rounded-lg flex items-center">
                <FaDiscord className="text-white text-2xl cursor-pointer" />
              </button>
              <Link
                className="bg-[#503A8b] text-white px-2 py-2 rounded-lg flex items-center"
                to="/settings"
              >
                <CiSettings className="text-white text-2xl cursor-pointer" />
              </Link>
              <button className="bg-[#503A8b] text-white px-2 py-2 rounded-lg flex items-center">
                <FiLogOut className="text-white text-2xl cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="mt-6 bg-[#987dfb] px-24 py-12 rounded-lg overflow-scroll  h-[350px] scrollbar-hide">
            <div className="  absolute font-semibold left-20 text-xl">Rank</div>
            <div className="flex  items-center space-x-3">
              <button className=" bg-[linear-gradient(to_right,#503a8b,#8566e0)] text-white px-2 py-1 rounded-lg flex items-center">
                {" "}
                {" " + Object.keys(user.level)[0]}
              </button>

              <div className="w-full  border-2 border-[#503a8b] h-8  text-sm rounded-md flex justify-between">
                <div
                  className=" custom-model h-7.5 rounded-r-md"
                  style={{ width: "65%" }}
                ></div>
                <span className="flex items-center mr-4">324 / 500 XP</span>
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
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="border-b text-sm">
                      <td className="py-3">02/17/2025</td>
                      <td className="py-3">xxxxxxxxx</td>
                      <td className="py-3 flex items-center">+10</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </>
  );
};

export default UserProfile;
