import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HandlePaymentState } from "./handle-payment.state";
import { anulatePaymentReq, changePaymentCollectorReq, changePaymentUserReq, fetchPaymentByIdReq, setPaymentAlertReq, setPaymentWaitingReq, setRatainedFeePaymentReq } from "../../../../app/services/payments.service";

const initialState: HandlePaymentState = {
  loading: false,
}
export const getPaymentByIdThunk = createAsyncThunk( "HandlePayment/getPaymentByIdThunk", async (paymentId: string) => await fetchPaymentByIdReq(paymentId))

export const changePaymentUserThunk = createAsyncThunk( "HandlePayment/changePaymentUserThunk", async (p: {user: string, payment: string}) => await changePaymentUserReq(p))

export const anulatePaymentThunk = createAsyncThunk( "HandlePayment/anulatePaymentThunk", async (paymentId: string) => await anulatePaymentReq(paymentId) )

export const setRetainedPaymentThunk = createAsyncThunk( "HandlePayment/setRetainedPaymentThunk", async (PARAM: {feePaymentId: string, retained: boolean}) => await setRatainedFeePaymentReq(PARAM))

export const changePaymentCollectorThunk = createAsyncThunk( "HandlePayment/changePaymentCollectorThunk", async (p: {payment: string, collector: string}) => await changePaymentCollectorReq(p))

export const setPaymentAlertThunk = createAsyncThunk( 
  "HandlePayment/setPaymentAlertThunk", 
  async (p: {paymentId: string, alerted: boolean}) => await setPaymentAlertReq(p)
)

export const setPaymentWaitingThunk = createAsyncThunk( 
  "HandlePayment/setPaymentWaitingThunk", 
  async (p: {paymentId: string, waiting: boolean}) => await setPaymentWaitingReq(p)
)

export const handlePaymentSlice = createSlice({
  name: "HandlePayment",
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<any>) => {
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPaymentByIdThunk.fulfilled, (state, action) => {
      state.payment = action.payload
    }).addCase(getPaymentByIdThunk.pending, (state, action) => {
      state.payment = undefined
    }).addCase(changePaymentUserThunk.fulfilled, (state, action) => {
      state.payment = action.payload
    }).addCase(anulatePaymentThunk.fulfilled, (state, action) => {
      state.payment = action.payload
    }).addCase(setRetainedPaymentThunk.fulfilled, (state, action) => {
      state.payment = action.payload
    }).addCase(changePaymentCollectorThunk.fulfilled, (state, action) => {
      const indexFeePayment = state.payment?.fees.findIndex((fee) => fee._id === action.payload._id)
      if(indexFeePayment !== -1 && indexFeePayment !== undefined) {
        state.payment!.fees[indexFeePayment].collector = action.payload.collector
      }
    }).addCase(setPaymentAlertThunk.fulfilled, (state, action) => {
      state.payment = action.payload
    }).addCase(setPaymentWaitingThunk.fulfilled, (state, action) => {
      if(state.payment) {
        state.payment.waiting = action.payload.waiting
      }
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("HandlePayment"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("HandlePayment"), (state) => {
      state.loading = false
    })
  },
})
export const { incrementByAmount } =handlePaymentSlice.actions
export default handlePaymentSlice.reducer