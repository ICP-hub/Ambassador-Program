import React, { useState } from 'react';

const HubConnectionModal = ({ isOpen, onClose }) => {
    const [referralCode, setReferralCode] = useState('');
    const [selectedHub, setSelectedHub] = useState('');

    const handleSubmit = () => {
        
        localStorage.setItem('selectedHub', selectedHub);
        localStorage.setItem('referralCode', referralCode);

        
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex gap-3 items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Connect to a Hub</h2>
                <input
                    type="text"
                    placeholder="Referral Code (optional)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="border rounded p-2 w-full mb-4"
                />
                <select
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    className="border rounded p-2 w-full mb-4"
                >
                    <option value="">Select a Hub</option>
                    <option value="ICP Hub">ICP Hub</option>
                    <option value="ICP Community Hub">ICP Community Hub</option>
                </select>
                <div className="flex justify-end">
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                    <button onClick={onClose} className="ml-2 bg-gray-300 px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HubConnectionModal;
