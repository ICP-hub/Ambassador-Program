import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value:{}
}

export const ledgerActorSlice = createSlice({
  name: 'ledgerActor',
  initialState,
  reducers: {
    updateLedgerActor: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { updateLedgerActor} = ledgerActorSlice.actions

export default ledgerActorSlice.reducer