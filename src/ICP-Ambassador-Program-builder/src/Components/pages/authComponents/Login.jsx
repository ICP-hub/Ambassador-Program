import React, { useEffect, useState } from 'react'
import { useAuthClient } from '../../../utils/useAuthClient'
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../../../declarations/ICP_Ambassador_Program_backend';
import { useDispatch } from 'react-redux';
import { updateActor } from '../../../redux/actors/actorSlice';
import { updateAdmin } from '../../../redux/admin/adminSlice';
import { useNavigate } from 'react-router-dom';
import { createActor as createLedgerActor } from '../../../../../declarations/ledger';
import toast from 'react-hot-toast';
import { LEDGER_CANISTER_ID } from "../../../../../../DevelopmentConfig";

const Login = () => {
  const { setIsAuthenticated, isAuthenticated } = useAuthClient();
  const dispatch = useDispatch();
  // const nav=useNavigate()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  async function login() {
    try {
      const authClient = await AuthClient.create();
      setLoading(true)
      await authClient.login({
        identityProvider: process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app/"
          : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
        onError: (error) => {
          toast.error("Some error occured while authentication")
          setLoading(false)
          console.log(error)
        },
        onSuccess: async() => {
          let backendActor = createActor(process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND, {
            agentOptions: {
              identity: authClient.getIdentity()
            }
          })
          let ledgerActor = createLedgerActor(LEDGER_CANISTER_ID || 'xevnm-gaaaa-aaaar-qafnq-cai', {
            agentOptions: {
              identity: authClient.getIdentity()
            }
          })

          dispatch(updateActor({
            backendActor,
            ledgerActor,
          }))
          let res = await backendActor.get_admin();
          console.log("login res : ", res);
          if (res != null && res != undefined && res?.Err == undefined) {
            setIsAuthenticated(true);
            window.location.reload();
          }
          else {
            console.log("You are not an admin -->" + authClient.getIdentity().getPrincipal());


            let reg_res = await backendActor.register_admin();
            console.log("register admin response : ", reg_res);
            localStorage.setItem("admin", JSON.stringify(reg_res));

            if (reg_res?.Ok == null && res != null && res != undefined) {
              console.log(reg_res, "not undefined");
              dispatch(
                updateAdmin({
                  wallet: authClient.getIdentity().getPrincipal().toText(),
                  role: "HubLeader",
                  spaces: [],
                }));
              setIsAuthenticated(true);
              window.location.reload();
            }
          }
        },
      });
    } catch (error) {
      setLoading(false);
      toast.error("Some error occured while authenticating");
      console.log("login function : ", error);
    }
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-black" />
      </div>
    );
  }
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
      <div className=" w-[400px] flex flex-col items-center justify-between py-7 px-3 rounded-3xl bg-white">
        <h3 className="text-3xl font-semibold mb-8">ICP Ambassador Program</h3>
        <button
          onClick={login}
          className="bg-black text-white font-semibold shadow-md text-lg rounded py-2 px-6 flex justify-center cursor-pointer items-center hover:bg-blue-700"
        >
          Join us
        </button>
      </div>
    </div>
  );
};

export default Login;
