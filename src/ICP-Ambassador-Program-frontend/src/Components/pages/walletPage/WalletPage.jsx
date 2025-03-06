import React from "react";
import { useState, useEffect } from "react";
import { WalletBalance } from "./WalletBalance";
import { WithdrawForm } from "./WithdrawForm";
import { TransactionHeader } from "./TransactionHeader";
import { TransactionPagination } from "./TransactionPagination";
import { TransactionTableBody } from "./TransactionTableBody";
import { MdClose } from "react-icons/md";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  createActor,
  ICP_Ambassador_Program_backend,
} from "../../../../../declarations/ICP_Ambassador_Program_backend";
import { AuthClient } from "@dfinity/auth-client";
import {
  canisterId,
  createActor as createLedgerActor,
} from "../../../../../declarations/ledger";
import { Principal } from "@dfinity/principal";
import bgImage from "../../../../public/rewardBgImg.png";
import { useSelector } from "react-redux";
import Navbar from "../../modules/Navbar/Navbar";
import Footer from "../../footer/Footer";

export const WalletPage = () => {
  const user = useSelector((state) => state.user.value);
  const [hub, setHub] = useState("");
  const [amount, setAmount] = useState(0);
  const [sendAmount, setSendAmount] = useState(0);
  const [conversion, setConversion] = useState(10);
  const [authClient, setAuthClient] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [principal, setPrincipal] = useState(null);

  const [balance, setBalance] = useState(0);

  const [updatedUser, setUpdatedUser] = useState(user);

  useEffect(() => {
    // If user data is available in Redux, update state immediately
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  useEffect(() => {
    setUpdatedUser(user);
  }, []);

  useEffect(() => {
    const HUB = Cookies.get("selectedHubName");
    setHub(HUB);
  }, []);

  async function getSpace() {
    try {
      const space = await ICP_Ambassador_Program_backend.get_space(
        updatedUser?.hub
      );
      console.log(space, hub, updatedUser?.hub);
      if (space?.Ok) {
        setConversion(parseInt(space?.Ok?.conversion));
      }
    } catch (error) {
      console.log("err fetching hub details : ", error);
    }
  }
  async function init_authclient() {
    let client = await AuthClient.create();
    setAuthClient(client);

    if (await client.isAuthenticated()) {
      let identity = client?.getIdentity();

      if (identity?.getPrincipal() != updatedUser?.wallet[0]) {
        await client.logout();
        return;
      }
      let ledgerActor = createLedgerActor(canisterId, {
        agentOptions: {
          identity: client.getIdentity(),
        },
      });
      setLedger(ledgerActor);
    }
  }

  useEffect(() => {
    init_authclient();
    getSpace();
  }, [hub]);
  async function getUser() {
    try {
      let userRes = await ICP_Ambassador_Program_backend.get_user_data(
        updatedUser?.id
      );
      console.log("userRes : ", userRes);
      if (userRes[0]) {
        setUpdatedUser(userRes[0]);
        setDiscord_user(userRes[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    await authClient?.logout();
    setLedger(null);
  }

  // make changes in below 2 function
  function calculatePoints(usd, conversionRate) {
    return (usd * 100) / conversionRate;
  }
  async function withdraw(event) {
    event.preventDefault();
    try {
      console.log("Amount : ", amount);
      console.log("Receiver : ", receiver, Principal.fromText(receiver));
      console.log("Conversion : ", conversion / 10);
      console.log(
        "Points : ",
        Math.round(calculatePoints(amount, conversion / 10))
      );

      console.log("Type of receiver : ", typeof Principal.fromText(receiver));

      const points = Math.round(calculatePoints(amount, conversion / 10));
      // console.log("withdraw", updatedUser?.redeem_points, amount, user);
      // if (updatedUser?.wallet?.length == 0) {
      //   toast.error("You wallet is set, please connect a wallet");
      //   return;
      // }

      if (points > parseInt(updatedUser?.redeem_points)) {
        toast.error("Not enough balance to withdraw");
        return;
      }

      console.log(updatedUser?.discord_id, receiver, parseFloat(points));
      let withdrawRes = await ICP_Ambassador_Program_backend.withdraw_points(
        updatedUser?.discord_id,
        Principal.fromText(receiver), // receiver principal to withdraw points
        parseFloat(points) // parseInt(amount)
        // parseInt(amount)
      );
      console.log(withdrawRes);
      if (withdrawRes?.Ok) {
        toast.success(withdrawRes?.Ok);
        getUser();
        window.location.reload();
      } else {
        toast.error(
          "Cannot withdraw now, please try after some time or try reducing amount"
        );
      }
    } catch (error) {
      console.log("The Error : ", error);
      toast.error("Something went wrong while withdrawing points");
    }
  }

  return (
    <>
      <div className="flex w-full px-2 flex-col items-center pb-5 bg-gradient-to-b from-[#1E0F33]/90 to-[#9173FF]/20">
        <Navbar />
        <div className=" mx-12 w-[93%] ">
          <div className="flex overflow-hidden w-full flex-col items-center">
            <div
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
              className="flex  flex-col justify-center items-center px-20 py-12 mt-1 w-full rounded-3xl bg-blend-luminosity  lg:min-h-[650px] max-md:px-5 max-md:max-w-full"
            >
              <WalletBalance
                balance={balance}
                setBalance={setBalance}
                user={user}
                ledger={ledger}
                logout={logout}
              />
              <WithdrawForm
                balance={balance}
                setAmount={setAmount}
                setReceiver={setReceiver}
                withdraw={withdraw}
              />
            </div>

            {/* This Commented temporarly Need to be used later [DO NOT REMOVE] */}
            {/* <div className="bg-gradient-to-b from-[#13091F]/20 to-[#522785]/10 rounded-xl my-6 w-full">
            <section className="flex flex-col items-center justify-between  px-16 pt-9 pb-5 mt-5 w-full rounded-3xl   ">
              <TransactionHeader />
              <div className="w-full ">
                <TransactionTableBody />
              </div>
              <TransactionPagination />
            </section>
          </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
