import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchDownPaymentSalesReportReq } from "../../customer-v2/services/customer-payments-ms.http"
import type {
  CustomerDownPaymentSalesReportResponse,
  ListCustomerDownPaymentsParams,
} from "../../customer-v2/services/customer-payments-ms.types"

export type SalesDownPaymentsReportState = {
  report: CustomerDownPaymentSalesReportResponse | null
  isLoading: boolean
  error: string | null
  lastParams: ListCustomerDownPaymentsParams | null
}

const initialState: SalesDownPaymentsReportState = {
  report: null,
  isLoading: false,
  error: null,
  lastParams: null,
}

export const fetchSalesDownPaymentsReportThunk = createAsyncThunk<
  CustomerDownPaymentSalesReportResponse,
  ListCustomerDownPaymentsParams,
  { rejectValue: string }
>("salesDownPaymentsReport/fetch", async (params, { rejectWithValue }) => {
  try {
    return await fetchDownPaymentSalesReportReq(params)
  } catch (err: unknown) {
    const ax = err as {
      response?: { data?: { message?: string; error?: string } }
      message?: string
    }
    const fromBody = ax.response?.data?.message ?? ax.response?.data?.error
    const msg =
      typeof fromBody === "string" && fromBody.length > 0
        ? fromBody
        : typeof ax.message === "string"
          ? ax.message
          : "Error al cargar el reporte de ventas"
    return rejectWithValue(msg)
  }
})

const salesDownPaymentsReportSlice = createSlice({
  name: "salesDownPaymentsReport",
  initialState,
  reducers: {
    clearSalesDownPaymentsReportAct: (state) => {
      state.report = null
      state.error = null
      state.lastParams = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesDownPaymentsReportThunk.pending, (state, action) => {
        state.isLoading = true
        state.error = null
        state.lastParams = action.meta.arg
      })
      .addCase(fetchSalesDownPaymentsReportThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.report = action.payload
      })
      .addCase(fetchSalesDownPaymentsReportThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error =
          (typeof action.payload === "string" && action.payload.length > 0
            ? action.payload
            : null) ??
          action.error.message ??
          "Error al cargar el reporte de ventas"
      })
  },
})

export const { clearSalesDownPaymentsReportAct } = salesDownPaymentsReportSlice.actions

export default salesDownPaymentsReportSlice.reducer
