import { configureStore } from "@reduxjs/toolkit";
import actorReducer from './actors/actorSlice'
import adminReducer from './admin/adminSlice'
import spaceReducer from './spaces/spaceSlice'
import missionReducer from './mission/missionSlice'

export const store=configureStore({
    reducer:{
        actor:actorReducer,
        admin:adminReducer,
        spaces:spaceReducer,
        mission:missionReducer
    }
})