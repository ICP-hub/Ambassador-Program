import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:{}
}

export const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    updateSpace: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { updateSpace} = spaceSlice.actions

export default spaceSlice.reducer