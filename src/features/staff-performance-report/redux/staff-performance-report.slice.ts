import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { postStaffPerformanceReport } from "../../customer-v2/services/customers-ms-admin-customer.http"
import type {
  StaffPerformanceReportBody,
  StaffPerformanceReportDto,
} from "../../customer-v2/services/customers-ms-admin-customer.types"

export type StaffPerformanceReportState = {
  report: StaffPerformanceReportDto | null
  loading: boolean
  error: string | null
}

const initialState: StaffPerformanceReportState = {
  report: null,
  loading: false,
  error: null,
}

export const fetchStaffPerformanceReportThunk = createAsyncThunk<
  StaffPerformanceReportDto,
  StaffPerformanceReportBody,
  { rejectValue: string }
>("staffPerformanceReport/fetch", async (body, { rejectWithValue }) => {
  try {
    return await postStaffPerformanceReport(body)
  } catch (err: unknown) {
    const ax = err as { response?: { data?: { message?: string; error?: string } }; message?: string }
    const fromBody = ax.response?.data?.message ?? ax.response?.data?.error
    const msg =
      typeof fromBody === "string" && fromBody.length > 0
        ? fromBody
        : typeof ax.message === "string"
          ? ax.message
          : "Error al cargar el reporte"
    return rejectWithValue(msg)
  }
})

export const staffPerformanceReportSlice = createSlice({
  name: "staffPerformanceReport",
  initialState,
  reducers: {
    clearStaffPerformanceReportAct: (state) => {
      state.report = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffPerformanceReportThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStaffPerformanceReportThunk.fulfilled, (state, action) => {
        state.loading = false
        state.report = action.payload
      })
      .addCase(fetchStaffPerformanceReportThunk.rejected, (state, action) => {
        state.loading = false
        const fromPayload =
          typeof action.payload === "string" && action.payload.length > 0 ? action.payload : null
        const fromError =
          typeof action.error.message === "string" && action.error.message.length > 0
            ? action.error.message
            : null
        state.error = fromPayload ?? fromError ?? "Error al cargar el reporte"
      })
  },
})

export const { clearStaffPerformanceReportAct } = staffPerformanceReportSlice.actions

export default staffPerformanceReportSlice.reducer
