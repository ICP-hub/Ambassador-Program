import React from "react";
import { FiCopy, FiSettings, FiLogOut } from "react-icons/fi";
import { FaExternalLinkAlt } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Model = ({ principalId, handleLogout }) => {
  // Function to handle copying the principal ID
  const handleCopy = () => {
    navigator.clipboard
      .writeText(principalId)
      .then(() => {
        toast.success("Principal ID copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg absolute top-16 right-2">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-400">Principal ID</p>
          <div className="flex items-center justify-start space-x-4">
            <span className="text-sm">{principalId.substr(0, 20)}...</span>
            <button onClick={handleCopy} className="text-blue-400" title="Copy">
              <FiCopy size={18} />
            </button>
            {/* <button className="text-gray-400 focus:outline-none" title="Info">
              <IoIosInformationCircleOutline size={18} />
            </button> */}
          </div>
        </div>

        {/* Menu Links */}
        <nav className="space-y-4">
          <Link
            className="flex items-center space-x-2 text-sm"
            to="/manage-identity"
          >
            <FaExternalLinkAlt size={16} />
            <span>Manage Internet Identity</span>
          </Link>
          <Link className="flex items-center space-x-2 text-sm" to="/reporting">
            <HiDocumentReport size={18} />
            <span>Reporting</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm   "
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Model;
