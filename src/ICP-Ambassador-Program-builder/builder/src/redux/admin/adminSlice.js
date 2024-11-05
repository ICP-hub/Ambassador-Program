import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:{}
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateAdmin: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { updateAdmin} = adminSlice.actions

export default adminSlice.reducer