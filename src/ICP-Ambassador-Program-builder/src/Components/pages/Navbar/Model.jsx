import React from "react";
import { FiCopy, FiLogOut } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import toast from "react-hot-toast";

const Model = ({
  principalId,
  handleLogout,
  walletBalanceICP,
  walletBalanceUSD,
}) => {
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
      <div className="w-full max-w-xs bg-gray-900 text-white p-4 rounded-lg shadow-lg absolute top-16 right-2 sm:max-w-sm sm:w-64">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-400">Principal ID</p>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-sm truncate">
              {principalId.substr(0, 20)}...
            </span>
            <button onClick={handleCopy} className="text-blue-400" title="Copy">
              <FiCopy size={18} />
            </button>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-gray-400">
            <p>Wallet Balance</p>
            <FaWallet size={16} />
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>ICP: {walletBalanceICP}</span>
            <span>USD: {walletBalanceUSD}</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-sm w-full mt-4"
        >
          <FiLogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Model;
