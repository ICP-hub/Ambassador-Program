import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from '../../../declarations/ICP_Ambassador_Program_backend';
import { Principal } from '@dfinity/principal';
import { Provider, useDispatch } from 'react-redux';
import { updateActor } from '../redux/actors/actorSlice';
import Login from '../Components/pages/authComponents/Login';
import { store } from '../redux/store';
import { updateAdmin } from '../redux/admin/adminSlice';
import { createActor as createLedgerActor} from '../../../declarations/ledger';

const AuthContext = createContext();

export const useAuthClient = () => {
    const [authClient, setAuthClient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const dispatch=useDispatch()
        
    const clientInfo = async (client) => {
        const isAuthenticated = await client.isAuthenticated();
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        console.log("principal : ",Principal.anonymous().compareTo(principal),principal.toText())

        setAuthClient(client);
        setIsAuthenticated(isAuthenticated);
        setIdentity(identity);
        setPrincipal(principal);

        if (isAuthenticated && identity && principal && principal.isAnonymous() === false) {
            let backendActor = createActor(process.env.CANISTER_ID_ICP_AMBASSADOR_PROGRAM_BACKEND,{agentOptions:{
                identity:identity
            }})
            let ledgerActor = createLedgerActor("ryjl3-tyaaa-aaaaa-aaaba-cai",{agentOptions:{
                identity:identity
            }})

            dispatch(updateActor({
                backendActor,
                ledgerActor
            }))
            let res=await backendActor.get_admin()
            console.log("login res : ",res)
            if(res!=null && res!=undefined && res?.Err==undefined){
                setIsAuthenticated(true);
                console.log({
                    wallet:principal?.toText()||principal,
                    role:Object.keys(res.Ok)[0],
                    spaces:res?.Ok?.spaces
                })
                dispatch(updateAdmin({
                    wallet:principal?.toText()||principal,
                    role:Object.keys(res.Ok.role)[0],
                    spaces:res?.Ok?.spaces
                }))
            }
            else{
                console.log("You are not an admin -->" + principal)

            }
            
        }

        return true;
    }

    useEffect(() => {
        (async () => {
            const authClient = await AuthClient.create();
            clientInfo(authClient);
        })();
    }, []);

    const login = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
                    resolve(clientInfo(authClient));
                } else {
                    await authClient.login({
                        identityProvider: process.env.DFX_NETWORK === "ic"
                            ? "https://identity.ic0.app/"
                            : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
                        onError: (error) => reject((error)),
                        onSuccess: () => {
                            console.log("login success")
                            resolve(clientInfo(authClient))},
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = async () => {
        await authClient?.logout();
    }

    return {
        login, logout, authClient, isAuthenticated, identity, principal,setIsAuthenticated
    };
}

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
    if (!auth.isAuthenticated) {
        return (
            <Provider store={store}>
                <AuthContext.Provider>
                    <Login />
                </AuthContext.Provider>
            </Provider>
        )    
    }
    return (
        
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);