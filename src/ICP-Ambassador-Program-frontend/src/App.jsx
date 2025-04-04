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
import AccessDenied from "./Components/pages/AccessDenied";
import NotFound from "./Components/pages/NotFound";
import ReferalPage from "./Components/pages/referalPage/ReferalPage";
import Leaderboard from "./Components/pages/leaderboardpage/Leaderboard";

function App() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(false);

  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null; // Return null if cookie is not found
  }

  // Example usage:
  useEffect(() => {
    const discordUser = getCookie("discord_user");

    if (discordUser) {
      try {
        const parsedUser = JSON.parse(discordUser); // Parse the JSON string
        console.log("Discord User ID:", parsedUser.id); // Access the ID properly
        setUser(true);
      } catch (error) {
        console.error("Invalid JSON in cookie:", error);
      }
    }
  }, []);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <LandingPage />} />
          <Route path="/home" element={user ? <Home /> : <AccessDenied />} />
          <Route path="/referal" element={<ReferalPage />} />

          {/* Below is the old route to single-mission-page */}
          {/* <Route path="/contest_details" element={user ? <CardDetails open={open} setOpen={setOpen} /> : <AccessDenied/>}/> */}
          <Route
            path="/auth/discord/callback"
            element={<DiscordCallback setOpen={setOpen} />}
          />
          <Route
            path="/ref"
            element={<ReferralHandler /> }
          />
          <Route
            path="/settings"
            element={user ? <Setting /> : <AccessDenied />}
          />
          <Route
            path="/wallet"
            element={user ? <WalletPage /> : <AccessDenied />}
          />
          {/* Below is the NEW route to single-mission-page */}
          <Route
            path="/contest_details"
            element={user ? <TaskRedemption /> : <AccessDenied />}
          />
          <Route path="*" element={<NotFound />} />

          <Route path="/leaderboard" element={<Leaderboard />} />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
