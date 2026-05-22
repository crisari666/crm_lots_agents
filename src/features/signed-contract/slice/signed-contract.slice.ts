import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {
  fetchSignedContractHistoryReq,
  markSignedContractByIdReq,
} from "../services/agent-contract-sign-admin.service"
import type { SignedContractSignStatusFilter } from "../types/signed-contract.types"
import type { SignedContractState } from "./signed-contract.state"

const initialState: SignedContractState = {
  items: [],
  sentFrom: "",
  sentTo: "",
  groupRepeatedByEmail: false,
  signStatusFilter: "all",
  isLoading: false,
  error: null,
}

export const fetchSignedContractHistoryThunk = createAsyncThunk(
  "signedContract/fetchHistory",
  async (params: { readonly sentFrom?: string; readonly sentTo?: string }) => {
    return fetchSignedContractHistoryReq(params)
  }
)

export const markSignedContractThunk = createAsyncThunk(
  "signedContract/markSigned",
  async (contractId: string) => {
    return markSignedContractByIdReq(contractId)
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
    setGroupRepeatedByEmailAct: (state, action: PayloadAction<boolean>) => {
      state.groupRepeatedByEmail = action.payload
    },
    setSignStatusFilterAct: (
      state,
      action: PayloadAction<SignedContractSignStatusFilter>,
    ) => {
      state.signStatusFilter = action.payload
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
      .addCase(markSignedContractThunk.fulfilled, (state, action) => {
        const contractId = action.meta.arg
        const signedAt = action.payload.signedAt
        const signedPdfLink = action.payload.signedPdfLink ?? null
        const index = state.items.findIndex((item) => item.id === contractId)
        if (index < 0) {
          return
        }
        state.items[index] = {
          ...state.items[index],
          signed: true,
          dateSigned: signedAt,
          signedPdfLink:
            signedPdfLink != null && signedPdfLink !== ""
              ? signedPdfLink
              : state.items[index].signedPdfLink,
        }
      })
  },
})

export const {
  setSentFromFilterAct,
  setSentToFilterAct,
  clearSignedContractErrorAct,
  setGroupRepeatedByEmailAct,
  setSignStatusFilterAct,
} = signedContractSlice.actions

export default signedContractSlice.reducer
