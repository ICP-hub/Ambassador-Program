import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuthClient } from '../../../utils/useAuthClient';
const Navbar = ({ nav }) => {
    const [showLogout, setShowLogout] = useState(false);
    const admin = useSelector(state => state.admin.value);
    const { logout, setIsAuthenticated } = useAuthClient();
    const handleToggle = () => {
        setShowLogout(!showLogout);
    };
    return (<div className='flex justify-between items-center p-5 border-b-2 border-slate-500'>
        <div className='' onClick={() => nav('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="153" height="24" fill="none"><path fill="#101828" d="M24 5.28A5.28 5.28 0 0 0 18.72 0H5.28A5.28 5.28 0 0 0 0 5.28v13.44A5.28 5.28 0 0 0 5.28 24h13.44A5.28 5.28 0 0 0 24 18.72v-6H9.312v-1.44H24v-6ZM46.622 11.332c-.258.267-.212.79.103.987 1.053.657 1.625 1.77 1.625 3.654 0 3.45-2.292 5.085-5.017 5.085H32.86a.426.426 0 0 1-.425-.428V3.599c0-.237.192-.43.428-.43H41.5c3.692 0 6.086 1.509 6.086 5.112 0 1.438-.335 2.4-.964 3.051Zm-6.243-4.61h-3.648a.427.427 0 0 0-.426.429v2.899c0 .237.191.429.427.429h3.826c1.782 0 3.234-.077 3.234-1.866 0-1.789-1.528-1.891-3.413-1.891Zm.815 10.81c1.91 0 3.362-.128 3.362-1.968 0-1.687-1.07-1.968-2.852-1.968H36.73a.427.427 0 0 0-.426.43v3.077c0 .237.191.429.427.429h4.462ZM53.086 3.17c.236 0 .428.192.428.429v13.53c0 .236.191.428.427.428h9.917c.236 0 .428.192.428.43v2.643a.428.428 0 0 1-.428.428H50.07a.428.428 0 0 1-.427-.428V3.599c0-.237.191-.43.427-.43h3.016ZM73.184 2.889c5.195 0 9.142 3.22 9.142 9.097 0 5.878-3.947 9.072-9.142 9.072-5.195 0-9.142-3.092-9.142-9.072 0-5.877 3.947-9.097 9.142-9.097Zm0 14.208c3.081 0 5.347-1.686 5.347-5.11 0-3.502-2.266-5.137-5.347-5.137-3.082 0-5.348 1.584-5.348 5.136 0 3.553 2.266 5.111 5.348 5.111ZM97.069 14.573a.454.454 0 0 1 .422-.312h3.231c.251 0 .449.217.411.466-.576 3.738-3.96 6.331-8.73 6.331-5.118 0-9.014-3.092-9.014-9.072 0-5.877 3.896-9.097 9.015-9.097 4.767 0 8.243 2.755 8.739 6.367a.406.406 0 0 1-.41.456h-3.246a.45.45 0 0 1-.42-.307c-.61-1.732-1.942-2.555-4.663-2.555-3.056 0-5.17 1.584-5.17 5.136 0 3.553 2.114 5.111 5.17 5.111 2.8 0 4.115-.947 4.665-2.524ZM117.903 3.195c.37 0 .565.441.317.717l-6.352 7.048a.43.43 0 0 0-.027.542l6.522 8.873a.429.429 0 0 1-.344.683h-3.778a.427.427 0 0 1-.342-.171l-4.678-6.26a.427.427 0 0 0-.66-.029l-2.242 2.505a.428.428 0 0 0-.11.287v3.24a.428.428 0 0 1-.427.428h-3.016a.428.428 0 0 1-.427-.428V3.599c0-.237.191-.43.427-.43h3.016c.236 0 .427.193.427.43v6.694c0 .391.48.578.743.289l6.592-7.247a.426.426 0 0 1 .315-.14h4.044ZM119.498 3.599c0-.237.191-.43.427-.43h13.788c.236 0 .427.193.427.43v2.669a.428.428 0 0 1-.427.428h-9.917a.428.428 0 0 0-.427.43v2.822c0 .236.191.428.427.428h9.917c.236 0 .427.192.427.43v2.643a.428.428 0 0 1-.427.428h-9.917a.428.428 0 0 0-.427.43v2.77c0 .237.191.43.427.43h9.917c.236 0 .427.191.427.428v2.695a.428.428 0 0 1-.427.428h-13.788a.428.428 0 0 1-.427-.428V3.599ZM143.253 3.17c7.537 0 8.785 5.52 8.785 8.97 0 3.45-1.35 8.918-8.785 8.918h-7.241a.425.425 0 0 1-.424-.428V3.599c0-.237.191-.43.427-.43h7.238Zm0 14.362c3.972 0 4.762-3.476 4.762-5.392 0-2.02-.764-5.418-4.762-5.418h-3.368a.428.428 0 0 0-.427.429v9.952c0 .237.191.429.427.429h3.368Z"></path></svg>
        </div>
        <div className='flex items-center          justify-center gap-3 '>
            <div className='flex flex-col items-end gap-1'>

                <div className='text-sm font-serif '>Singed in as</div>
                <div className='font-bold'>{admin?.wallet?.substr(0, 20)}...{`  ( ${admin?.role} )`}</div>

            </div>
                <div onClick={showLogout ? handleToggle : () => {
            logout();
            setIsAuthenticated();
        }} className="relative cursor-pointer">
                    {showLogout ? (<div className="bg-blue-300 text-blue-600 py-2 px-4 rounded-md" onClick={() => {
                logout();
                setIsAuthenticated();
            }}>
                        Log Out
                        </div>) : (<img src="https://static-00.iconduck.com/assets.00/profile-circle-icon-1023x1024-ucnnjrj1.png" alt="not found" className="w-10 h-10 rounded-full"/>)}
                </div>
        </div>
    </div>);
};
export default Navbar;
