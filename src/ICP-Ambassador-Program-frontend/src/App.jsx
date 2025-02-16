import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/pages/Home";
import CardDetails from "./Components/modules/Contests/CardDetails";
import { ICP_Ambassador_Program_backend } from "declarations/ICP_Ambassador_Program_backend";
import DiscordCallback from "./Components/auth/DiscordCallback";
import ReferralHandler from "./Components/pages/ReferralHandler";
import { Toaster } from "react-hot-toast";
import LandingPage from "./Components/pages/landingpage/LandingPage";

import Setting from "./Components/pages/Setting";
import { WalletPage } from "./Components/pages/walletPage/WalletPage";
import TaskRedemption from "./Components/pages/MissionSinglePage";

function App() {
  const [open, setOpen] = useState(false);
  // const [user, setUser] = useState(false);
  // useEffect(() => {
  //   if (Cookies.get("discord_user")) {
  //     setUser(true);
  //   }
  // }, []);
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={user ? <Home /> : <LandingPage />} /> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          {/* <Route
            path="/contest_details"
            element={<CardDetails open={open} setOpen={setOpen} />}
          /> */}
          <Route
            path="/auth/discord/callback"
            element={<DiscordCallback setOpen={setOpen} />}
          />
          <Route path="/ref" element={<ReferralHandler />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/contest_details" element={<TaskRedemption />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
