import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {
  createActor,
  ICP_Ambassador_Program_backend,
} from "../../../../declarations/ICP_Ambassador_Program_backend";
import { AuthClient } from "@dfinity/auth-client";
import {
  canisterId,
  createActor as createLedgerActor,
} from "../../../../declarations/ledger";
// import {A} from '@dfinity/agent'
import { Principal } from "@dfinity/principal";
import { stringToSubaccountBytes } from "../utils/utils";
import { useSelector } from "react-redux";

const WalletSidebar = ({ onClose, isOpen, setDiscord_user }) => {
  const [hub, setHub] = useState("");
  const [amount, setAmount] = useState(0);
  const [sendAmount, setSendAmount] = useState(0);
  const [conversion, setConversion] = useState(10);
  const [authClient, setAuthClient] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [principal, setPrincipal] = useState(null);
  const user = useSelector((state) => state.user.value);

  const [updatedUser, setUpdatedUser] = useState(user);
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
  async function login() {
    try {
      const authClient = await AuthClient.create();

      await authClient.login({
        identityProvider:
          process.env.DFX_NETWORK === "ic"
            ? "https://identity.ic0.app/"
            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
        onError: (error) => console.log(error),
        onSuccess: async () => {
          if (updatedUser?.wallet?.length == 0) {
            let backendActor = createActor(
              process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND,
              { agentOptions: { identity: authClient?.getIdentity() } }
            );
            let updateWalletRes = await backendActor.add_wallet(
              updatedUser?.discord_id
            );
            if (updateWalletRes?.Ok) {
              toast.success(updateWalletRes?.Ok);
            } else {
              throw new Error(updateWalletRes?.Err);
            }
          }
          let ledgerActor = createLedgerActor(canisterId, {
            agentOptions: {
              identity: authClient.getIdentity(),
            },
          });
          console.log(
            "user connected with principal : ",
            authClient.getIdentity().getPrincipal().toText()
          );
          setPrincipal(authClient.getIdentity().getPrincipal().toText());
          setLedger(ledgerActor);
        },
      });
    } catch (error) {
      toast.error("Something went wring while connecting wallet");
      console.log(error);
    }
  }

  async function logout() {
    await authClient?.logout();
    setLedger(null);
  }

  async function withdraw() {
    try {
      console.log("withdraw", updatedUser?.redeem_points, amount, user);
      if (updatedUser?.wallet?.length == 0) {
        toast.error("You wallet is set, please connect a wallet");
        return;
      }
      if (amount > parseInt(updatedUser?.redeem_points)) {
        toast.error("Not enough redeemable points");
        return;
      }
      let withdrawRes = await ICP_Ambassador_Program_backend.withdraw_points(
        updatedUser?.discord_id,
        parseInt(amount)
      );
      console.log(withdrawRes);
      if (withdrawRes?.Ok) {
        toast.success(withdrawRes?.Ok);
        getUser();
      } else {
        toast.error(
          "Cannot withdraw now, please try after some time or try reducing points"
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  function checkPrincipal() {
    try {
      let p = Principal.fromText(receiver);
      return true;
    } catch (err) {
      return false;
    }
  }
  async function send() {
    try {
      // console.log("withdraw",user?.redeem_points,amount)
      // if(amount>parseInt(user?.redeem_points)){
      // console.log(sendAmount,receiver)
      if (!checkPrincipal(receiver)) {
        toast.error("Invalid principal");
        return;
      }
      if (sendAmount == 0 || sendAmount == "") {
        toast.error("Invalid amount");
        return;
      }
      const balance = await ledger?.icrc1_balance_of({
        owner: Principal.fromText(principal),
        subaccount: [],
      });

      console.log(
        sendAmount,
        receiver,
        principal,
        balance,
        user?.wallet[0]?.toText(),
        "subacc : ",
        user?.hub
      );
      const finalAmount = parseFloat(sendAmount) * Math.pow(10, 8);
      const fees = Math.pow(10, 4);
      if (finalAmount + fees > parseInt(balance)) {
        toast.error("Insufficient balance");
        return;
      }
      const transaction = {
        to: { owner: Principal.fromText(receiver), subaccount: [] },
        fee: [fees],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: finalAmount,
      };
      console.log("final transaction : ", transaction);
      const transactionRes = await ledger.icrc1_transfer(transaction);
      console.log(transactionRes);
      if (transactionRes?.Ok) {
        toast.success("TRansaction successful");
      } else {
        toast.error("Transaction failed due to some reason");
      }
      // }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  return (
    <div
      className={`absolute top-0 right-0 lg:w-96 sm:w-full h-full lg:my-0 rounded-md sm:my-0 text-white font-poppins bg-[#1d1d21] shadow-lg p-6 z-50 transition-transform duration-500 delay-500 ease-in-out transform overflow-y-auto scrollbar-hide  ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{
        transition: "transform 0.5s ease-in-out",
      }}
    >
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="  hover:bg-black hover:text-white rounded-full h-9 w-9 flex justify-center items-center cursor-pointer"
        >
          <MdClose
            className="text-white  hover:text-white"
            style={{ fontSize: "20px" }}
          />
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col gap-5 justify-center items-center mt-8">
          <div className="font-semibold text-3xl text-white">User Wallet</div>
          {ledger ? (
            <div
              className=" hover:bg-black hover:border-black border border-gray-700 cursor-pointer transition-all  duration-500 bg-black text-white font-semibold py-2 w-full rounded-md flex justify-center items-center"
              onClick={logout}
            >
              Disconnect wallet
            </div>
          ) : (
            <div
              className="hover:bg-black hover:border-black border border-gray-700 cursor-pointer transition-all  duration-500 text-white font-semibold py-2 w-full rounded-md flex justify-center items-center"
              onClick={login}
            >
              Connect wallet
            </div>
          )}
        </div>
        <div className="flex flex-col ml-8 gap-4 mt-16">
          <div className="flex flex-col gap-5">
            <div className="text-md font-semibold text-white">
              Total Points Earned : {updatedUser?.xp_points?.toString()}
            </div>
            <div className="text-md font-semibold text-white">
              Redeembale Points : {updatedUser?.redeem_points?.toString()}
            </div>
          </div>
          <div className="flex text-sm items-center gap-2 my-3 text-[#7064f5] font-semibold">
            <div>Conversion rate of your hub : 100p </div>
            <MdOutlineArrowRightAlt />
            <div>{`${parseFloat(conversion / 10)} ICP`}</div>
          </div>
          <input
            className="border px-3 py-3 w-full border-gray-300 text-black  cursor-pointer font-semibold text-sm flex justify-center items-center rounded"
            placeholder="enter amount of points to redeem"
            onChange={(e) => setAmount(e.target.value)}
            onWheel={(e) => e.target.blur()}
            type="number"
          />
          <div
            className=" py-3 w-full  hover:bg-black hover:border-black border border-gray-700 cursor-pointer transition-all  duration-500 font-semibold text-sm flex justify-center items-center rounded-md"
            onClick={withdraw}
          >
            Withdraw points
          </div>
          {ledger ? (
            <>
              <input
                className="border px-3 py-3 w-full border-gray-300  text-black cursor-pointer font-semibold text-sm flex justify-center items-center rounded"
                placeholder="enter amount to be sent in ICP"
                onChange={(e) => setSendAmount(e.target.value)}
                onWheel={(e) => e.target.blur()}
                type="number"
              />
              <input
                className="border px-3 py-3 w-full border-gray-300 text-black cursor-pointer font-semibold text-sm flex justify-center items-center rounded"
                placeholder="enter receiver principal"
                onChange={(e) => setReceiver(e.target.value)}
                type="text"
              />
              <button
                className=" py-3 w-full hover:border-black  hover:bg-black border border-gray-700 cursor-pointer transition-all  duration-500 font-semibold text-sm flex justify-center items-center rounded-md"
                onClick={send}
              >
                Send amount
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletSidebar;
