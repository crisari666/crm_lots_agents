import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  addCustomerPaymentFeeReq,
  createCustomerDownPaymentReq,
  listCustomerDownPaymentsReq,
  listDownPaymentsByCustomerReq,
} from "../../customer-v2/services/customer-payments-ms.http"
import type {
  CreateCustomerDownPaymentThunkInput,
  CreateCustomerPaymentFeeThunkInput,
  ListCustomerDownPaymentsParams,
} from "../../customer-v2/services/customer-payments-ms.types"
import type { CustomerPaymentsState } from "./customer-payments.state"

const initialState: CustomerPaymentsState = {
  payments: [],
  total: 0,
  customerDownPayments: [],
  isLoading: false,
  isSaving: false,
  error: null,
}

export const fetchCustomerDownPaymentsThunk = createAsyncThunk(
  "customerPayments/fetchList",
  async (params: ListCustomerDownPaymentsParams) => listCustomerDownPaymentsReq(params),
)

export const fetchDownPaymentsByCustomerThunk = createAsyncThunk(
  "customerPayments/fetchByCustomer",
  async (customerId: string) => listDownPaymentsByCustomerReq(customerId),
)

export const createCustomerDownPaymentThunk = createAsyncThunk(
  "customerPayments/createDownPayment",
  async ({ body, contractFile, evidenceFile }: CreateCustomerDownPaymentThunkInput) =>
    createCustomerDownPaymentReq(body, contractFile, evidenceFile),
)

export const addCustomerPaymentFeeThunk = createAsyncThunk(
  "customerPayments/addFee",
  async ({ downPaymentId, body, evidenceFile }: CreateCustomerPaymentFeeThunkInput) =>
    addCustomerPaymentFeeReq(downPaymentId, body, evidenceFile),
)

const customerPaymentsSlice = createSlice({
  name: "customerPayments",
  initialState,
  reducers: {
    clearCustomerPaymentsErrorAct: (state) => {
      state.error = null
    },
    clearCustomerPaymentsAct: (state) => {
      state.customerDownPayments = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerDownPaymentsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomerDownPaymentsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.payments = action.payload.data
        state.total = action.payload.total
      })
      .addCase(fetchCustomerDownPaymentsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al cargar separaciones"
      })
      .addCase(fetchDownPaymentsByCustomerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDownPaymentsByCustomerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.customerDownPayments = action.payload
      })
      .addCase(fetchDownPaymentsByCustomerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al cargar separaciones del cliente"
      })
      .addCase(createCustomerDownPaymentThunk.pending, (state) => {
        state.isSaving = true
        state.error = null
      })
      .addCase(createCustomerDownPaymentThunk.fulfilled, (state, action) => {
        state.isSaving = false
        state.customerDownPayments = [
          action.payload,
          ...state.customerDownPayments.filter((d) => d.id !== action.payload.id),
        ]
      })
      .addCase(createCustomerDownPaymentThunk.rejected, (state, action) => {
        state.isSaving = false
        state.error = action.error.message ?? "Error al registrar separación"
      })
      .addCase(addCustomerPaymentFeeThunk.pending, (state) => {
        state.isSaving = true
        state.error = null
      })
      .addCase(addCustomerPaymentFeeThunk.fulfilled, (state, action) => {
        state.isSaving = false
        state.customerDownPayments = state.customerDownPayments.map((d) =>
          d.id === action.payload.id ? action.payload : d,
        )
      })
      .addCase(addCustomerPaymentFeeThunk.rejected, (state, action) => {
        state.isSaving = false
        state.error = action.error.message ?? "Error al registrar abono"
      })
  },
})

export const { clearCustomerPaymentsErrorAct, clearCustomerPaymentsAct } =
  customerPaymentsSlice.actions

export default customerPaymentsSlice.reducer
