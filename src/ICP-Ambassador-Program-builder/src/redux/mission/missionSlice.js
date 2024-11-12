import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:{}
}

export const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    updateMission: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { updateMission} = missionSlice.actions

export default missionSlice.reducer