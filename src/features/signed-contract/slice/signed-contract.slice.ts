import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fetchSignedContractHistoryReq } from "../services/agent-contract-sign-admin.service"
import type { SignedContractState } from "./signed-contract.state"

const initialState: SignedContractState = {
  items: [],
  sentFrom: "",
  sentTo: "",
  isLoading: false,
  error: null,
}

export const fetchSignedContractHistoryThunk = createAsyncThunk(
  "signedContract/fetchHistory",
  async (params: { readonly sentFrom?: string; readonly sentTo?: string }) => {
    return fetchSignedContractHistoryReq(params)
  }
)

const signedContractSlice = createSlice({
  name: "signedContract",
  initialState,
  reducers: {
    setSentFromFilterAct: (state, action: PayloadAction<string>) => {
      state.sentFrom = action.payload
    },
    setSentToFilterAct: (state, action: PayloadAction<string>) => {
      state.sentTo = action.payload
    },
    clearSignedContractErrorAct: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignedContractHistoryThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSignedContractHistoryThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchSignedContractHistoryThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "Failed to load contract history"
      })
  },
})

export const {
  setSentFromFilterAct,
  setSentToFilterAct,
  clearSignedContractErrorAct,
} = signedContractSlice.actions

export default signedContractSlice.reducer
