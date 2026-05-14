import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  createCustomerPaymentReq,
  getPaymentSummaryByCustomerReq,
  listCustomerPaymentsReq,
  listPaymentsByCustomerReq,
} from "../../customer-v2/services/customer-payments-ms.http"
import type {
  CreateCustomerPaymentThunkInput,
  ListCustomerPaymentsParams,
} from "../../customer-v2/services/customer-payments-ms.types"
import type { CustomerPaymentsState } from "./customer-payments.state"

const initialState: CustomerPaymentsState = {
  payments: [],
  total: 0,
  customerPayments: [],
  summaries: [],
  isLoading: false,
  isSaving: false,
  error: null,
}

export const fetchCustomerPaymentsThunk = createAsyncThunk(
  "customerPayments/fetchList",
  async (params: ListCustomerPaymentsParams) => listCustomerPaymentsReq(params),
)

export const fetchPaymentsByCustomerThunk = createAsyncThunk(
  "customerPayments/fetchByCustomer",
  async (customerId: string) => listPaymentsByCustomerReq(customerId),
)

export const fetchPaymentSummaryByCustomerThunk = createAsyncThunk(
  "customerPayments/fetchSummary",
  async (customerId: string) => getPaymentSummaryByCustomerReq(customerId),
)

export const createCustomerPaymentThunk = createAsyncThunk(
  "customerPayments/create",
  async ({ body, evidenceFile }: CreateCustomerPaymentThunkInput) =>
    createCustomerPaymentReq(body, evidenceFile),
)

const customerPaymentsSlice = createSlice({
  name: "customerPayments",
  initialState,
  reducers: {
    clearCustomerPaymentsErrorAct: (state) => {
      state.error = null
    },
    clearCustomerPaymentsAct: (state) => {
      state.customerPayments = []
      state.summaries = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPaymentsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomerPaymentsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.payments = action.payload.data
        state.total = action.payload.total
      })
      .addCase(fetchCustomerPaymentsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al cargar pagos"
      })
      .addCase(fetchPaymentsByCustomerThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPaymentsByCustomerThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.customerPayments = action.payload
      })
      .addCase(fetchPaymentsByCustomerThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error al cargar pagos del cliente"
      })
      .addCase(fetchPaymentSummaryByCustomerThunk.fulfilled, (state, action) => {
        state.summaries = action.payload
      })
      .addCase(createCustomerPaymentThunk.pending, (state) => {
        state.isSaving = true
        state.error = null
      })
      .addCase(createCustomerPaymentThunk.fulfilled, (state, action) => {
        state.isSaving = false
        state.customerPayments.unshift(action.payload)
      })
      .addCase(createCustomerPaymentThunk.rejected, (state, action) => {
        state.isSaving = false
        state.error = action.error.message ?? "Error al registrar pago"
      })
  },
})

export const { clearCustomerPaymentsErrorAct, clearCustomerPaymentsAct } =
  customerPaymentsSlice.actions

export default customerPaymentsSlice.reducer
