import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RafflesListState } from "./raffles-list.state"
import { getRafflesReq } from "../../app/services/raffle.service"
import { RaffleInterface } from "../../app/models/raffle-interface"

const initialState: RafflesListState = {
  raffles: [],
  loading: true
}

export const getRafflesThunk = createAsyncThunk("RafflesListSlice/getRafflesThunk", async () => {
  const raffles = await getRafflesReq()
  return raffles
})

export const RafflesListSlice = createSlice({
  name: "RafflesListSlice",
  initialState,
  reducers: {
    setLoadingRafflesListAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addRaffleToStackAct: (state, action: PayloadAction<RaffleInterface  >) => {
      state.raffles.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRafflesThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(getRafflesThunk.fulfilled, (state, action) => {
        state.raffles = action.payload
        state.loading = false
      })
      .addCase(getRafflesThunk.rejected, (state) => {
        state.loading = false
      })
  
  }
})

export const { setLoadingRafflesListAct, addRaffleToStackAct } = RafflesListSlice.actions

export default RafflesListSlice.reducer