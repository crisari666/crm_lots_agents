import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getCustomerById } from "../../../../app/services/customer.service"
import { customerPaymentsReq } from "../../../../app/services/payments.service"
import { VerifyCustomerPaymentsState } from "./verify-customer-payment.state"
const initialState: VerifyCustomerPaymentsState = {
  loading: false,
  payments: [],
  userNotFound: false
}
export const getUserInfoThunk = createAsyncThunk( "VerifyCustomerPayments/verifyCustomerInfoSlice", async (customerId: string) => await getCustomerById({customerId}))

export const getUserPaymentsThunk = createAsyncThunk( "VerifyCustomerPayments/verifyCustomerPaymentsSlice", async (customerId: string) => await customerPaymentsReq({customerId}))

export const verifyCustomerPaymentsSlice = createSlice({
  name: "VerifyCustomerPayments",
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<any>) => {
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfoThunk.fulfilled, (state, action) => {
      if(action.payload === null) {
        state.userNotFound = true
        state.customer = undefined
      } else {
        state.customer = action.payload
        state.userNotFound = false
      }
    }).addCase(getUserPaymentsThunk.fulfilled, (state, action) => {
      state.userNotFound = false
      state.payments = action.payload
    })
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("VerifyCustomerPayments"), (state) => {
      state.loading = true
      state.payments = []
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("VerifyCustomerPayments"), (state) => {
      state.loading = false
    })
  },
})
export const { incrementByAmount } =verifyCustomerPaymentsSlice.actions
export default verifyCustomerPaymentsSlice.reducer