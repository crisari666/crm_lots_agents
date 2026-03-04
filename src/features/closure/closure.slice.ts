/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  ClosureDataInterface,
  ClosureStateInterface,
} from "./domain/closure.state"
import { getCurrenDateUtil } from "../../utils/date.utils"
import { getCurrentClosureReq } from "../../app/services/closure.service"

const initialState: ClosureStateInterface = {
  closure: {
    done: false,
    capital_added: 0,
    closure: 0,
    cash_init: 0,
    expenses: 0,
    new_cards: 0,
    payments: 0,
  },
  date: getCurrenDateUtil(),
  loading: false,
}

export const getCurrentClosureThunk = createAsyncThunk("ClosureSlice", async () => {
  const getClosure = await getCurrentClosureReq()
  return getClosure
})

export const ClosureSlice = createSlice({
  name: "ClosureSlice",
  initialState,
  reducers: {
    changeDateClosureAction: (state, action: PayloadAction<string>) => {
      state.date = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getCurrentClosureThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      getCurrentClosureThunk.fulfilled,
      (state, action: PayloadAction<ClosureDataInterface>) => {
        state.loading = false
        state.closure = action.payload
      },
    )
  },
})

export const { changeDateClosureAction } = ClosureSlice.actions

export default ClosureSlice.reducer
