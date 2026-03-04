import { PayloadAction, createAsyncThunk, createSlice, isFulfilled, isPending } from "@reduxjs/toolkit"
import { UnstrudtedPaymentsState } from "./untrusted-payments.state"
import { getUnstrustedPaymentsReq } from "../../../app/services/payments.service"
import { FeePaymentsResultI } from "../../../app/models/fee-payment-result-inteface"

const initialState: UnstrudtedPaymentsState = {
  loading: false,
  payments: [],
  
}

export const getUnstrustedPaymentThunk = createAsyncThunk("UnstrustedPayments/getUnstrustedPaymentThunk", async () => {
  const payments = await getUnstrustedPaymentsReq()
  return payments
})

export const UnstrudtedPaymentsSlice = createSlice({
  name: "UnstrudtedPayments",
  initialState,
  reducers: {
    setPayForTrustAct: (state, action: PayloadAction<FeePaymentsResultI | undefined>) => {
      state.payForTrust = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(getUnstrustedPaymentThunk.fulfilled, (state, action) => {
      state.payments = action.payload
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("UnstrudtedPayments"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("UnstrudtedPayments"), (state) => {
      state.loading = false
    })
  },
})

export const { setPayForTrustAct } = UnstrudtedPaymentsSlice.actions

export default UnstrudtedPaymentsSlice.reducer