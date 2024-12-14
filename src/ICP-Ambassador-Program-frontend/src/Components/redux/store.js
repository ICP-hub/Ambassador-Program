import { configureStore } from "@reduxjs/toolkit";
import userReducer from './user/userSlice'
import ledgerActorReducer from "./actor/ledgerActorSlice";

export const store=configureStore({
    reducer:{
        user:userReducer,
        ledgerActor:ledgerActorReducer
    }
})