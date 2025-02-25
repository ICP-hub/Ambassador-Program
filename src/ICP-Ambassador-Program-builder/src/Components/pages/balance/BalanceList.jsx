import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import {
  formatTokenMetaData,
  stringToSubaccountBytes,
} from "../../../utils/utils";
import { Principal } from "@dfinity/principal";
import { canisterId as ledgerId } from "../../../../../declarations/ledger";
import toast from "react-hot-toast";
import { DEFAULT_CURRENCY } from "../../../../../../DevelopmentConfig";

const BalanceList = () => {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const spaces = useSelector((state) => state.spaces.value);
  const admin = useSelector((state) => state.admin.value);
  const actor = useSelector((state) => state.actor.value);
  const [lockedAm, setLockedAm] = useState(0);
  const [loading, setLoading] = useState(false);

  const [metaData, setMetaData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  async function getFundDetails() {
    try {
      console.log("Spaces object:", spaces);
      console.log("Space ID:", spaces?.space_id);

      if (!spaces?.space_id) {
        console.error("Space ID is invalid or undefined.");
        return;
      }

      let fundRes = await actor?.backendActor?.get_fund_details(
        spaces?.space_id
      );
      console.log("Fund fetch response:", fundRes);

      if (fundRes?.length > 0) {
        const balanceRaw = fundRes[0]?.balance;
        const lockedRaw = fundRes[0]?.locked;

        if (balanceRaw == null || lockedRaw == null) {
          console.error("Invalid response data:", fundRes[0]);
          return;
        }

        let newBalance = parseFloat(parseInt(balanceRaw) / Math.pow(10, 6));
        let locked = parseFloat(parseInt(lockedRaw) / Math.pow(10, 6));
        console.log("Funds available:", newBalance, locked);

        setBalance(newBalance);
        setLockedAm(locked);
      } else {
        console.log("No funds available.");
      }
    } catch (err) {
      console.error("Fetching funds error:", err);
    }
  }

  async function addFunds() {
    try {
      setLoading(true);

      await transferApprove(amount, spaces?.space_id, actor?.ledgerActor);

      let finalAmount = Math.pow(10, 6) * Number(amount);
      console.log("final amount : ", finalAmount);
      console.log(spaces);
      // if(finalAmount>balance){
      //   toast.error("Ca")
      //   return
      // }
      let res = await actor?.backendActor?.add_funds(
        spaces?.space_id,
        finalAmount
      );

      console.log("add fund res : ", res, finalAmount);
      if (res?.Ok) {
        toast.success("amount added");
        getFundDetails();
      } else {
        toast.error("" + res?.Err);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error adding funds : ", err);
    }
  }

  async function getWalletBalance() {
    console.log("Owner Address: ", Principal.fromText(admin.wallet));
    console.log("Ledger : ", actor?.ledgerActor);

    try {
      const owner = Principal.fromText(admin.wallet);

      let balance = await actor?.ledgerActor?.icrc1_balance_of({
        owner: owner,
        subaccount: [],
      });

      // let newBalance = parseFloat(parseInt(balance) / Math.pow(10, 8));
      setWalletBalance(balance);
      console.log("User Wallet Balance: ", balance, "ckUSDC");
      return balance;
    } catch (error) {
      console.log("Error fetching user's balance: ", error);
    }
  }

  // actor?.ledgerActor
  async function settingToken() {
    await actor?.ledgerActor
      ?.icrc1_metadata()
      .then((res) => {
        console.log("icrc1_metadata res : ", res);
        setMetaData(formatTokenMetaData(res));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const transferApprove = async (sendAmount, sendPrincipal, tokenActor) => {
    setLoading(true);
    console.log("metaData[decimals]", metaData);
    let amnt = parseInt(
      Number(sendAmount) * Math.pow(10,6)
    );
    console.log("amount", amnt, spaces.owner, sendPrincipal);

    // try{
    // console.log('canid is anonymous', Principal.fromText(ids.bookingCan));
    // console.log('canid principal', Principal.fromHex(principalToAccountIdentifier(Principal.fromText(ids.bookingCan))));

    if ((await getWalletBalance()) >= amnt) {
      let transaction = {
        amount: Number(amnt) + Number([metaData?.["icrc1:fee"]]),
        from_subaccount: [],
        spender: {
          owner: Principal.fromText(
            process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND
          ),
          subaccount: [],
        },
        fee: [metaData?.["icrc1:fee"]],
        memo: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      };
      console.log(actor?.ledgerActor?.icrc2_approve);
      await actor?.ledgerActor
        ?.icrc2_approve(transaction)
        .then(async (res) => {
          if (res?.Err) {
            setLoading(false);
            console.log(res);
            return;
          } else {
            console.log("Approval Response : ", res);
            // afterPaymentFlow(parseInt(res?.Ok).toString(), amnt);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      console.log("balance is less : ", amnt, sendAmount);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFundDetails();
    settingToken();
    getWalletBalance();
    console.log("XYZ : ", admin.wallet);
    console.log("balances useeffect : ", spaces, balance, actor?.ledgerActor);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col   mx-20 my-10">
        <div className=" flex flex-col">
          <div className="font-semibold text-3xl mb-3">Manage Hub Funds</div>
          <div className=" w-full border border-gray-300"></div>
        </div>
        <div className=" w-1/3">
          <div className=" flex flex-col my-6">
            <div className="font-semibold text-lg mb-3">
              {spaces?.name}
            </div>

            <div className="font-semibold text-lg mb-3">
              Hub Balance : {balance} {DEFAULT_CURRENCY}
            </div>
            <div className="font-semibold text-lg mb-3">
              Locked amount : {lockedAm} {DEFAULT_CURRENCY}
            </div>
          </div>

          <div className="flex items-center gap-4 my-3">
            <div className="w-1/2 font-semibold text-md">
              Deposit Amount (in {DEFAULT_CURRENCY}) :
            </div>
            <div className="w-1/2 -mt-5">
              <TextField
                value={amount}
                id="standard-basic"
                label="Amount"
                variant="standard"
                onChange={(e) => parseFloat(setAmount(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              className="text-white bg-black flex justify-center items-center py-2 font-semibold  rounded px-6 cursor-pointer"
              onClick={addFunds}
            >
              Deposit
            </button>
            {/* <button className='text-white bg-black flex justify-center items-center py-2 font-semibold  rounded px-6 cursor-pointer'>Withdraw All</button> */}
          </div>
        </div>

        {/* <button onClick={settingToken}>Get User wallet balance</button> */}
      </div>
    </div>
  );
};

export default BalanceList;
