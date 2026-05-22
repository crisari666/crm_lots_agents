import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { listCustomerAssignmentChanges } from "../services/customer-assignment-audit.http"
import type {
  ListCustomerAssignmentChangesParams,
  ListCustomerAssignmentChangesResponse,
} from "../types/customer-assignment-audit.types"

function createDefaultDateRange(): { dateFrom: string; dateTo: string } {
  const dateEnd = new Date()
  dateEnd.setHours(23, 59, 59, 999)
  const dateStart = new Date()
  dateStart.setDate(dateStart.getDate() - 30)
  dateStart.setHours(0, 0, 0, 0)
  return { dateFrom: dateStart.toISOString(), dateTo: dateEnd.toISOString() }
}

const initialRange = createDefaultDateRange()

export type CustomerAssignmentAuditState = {
  items: ListCustomerAssignmentChangesResponse["items"]
  total: number
  limit: number
  skip: number
  loading: boolean
  error: string | null
  lastParams: ListCustomerAssignmentChangesParams | null
  filters: {
    assigneeUserId: string
    dateFrom: string
    dateTo: string
    limit: 100 | 200 | 500
    page: number
  }
}

const initialState: CustomerAssignmentAuditState = {
  items: [],
  total: 0,
  limit: 100,
  skip: 0,
  loading: false,
  error: null,
  lastParams: null,
  filters: {
    assigneeUserId: "",
    dateFrom: initialRange.dateFrom,
    dateTo: initialRange.dateTo,
    limit: 100,
    page: 0,
  },
}

function axiosMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) {
      return data.message.join(", ")
    }
    if (typeof data?.message === "string") {
      return data.message
    }
  }
  return fallback
}

export const fetchCustomerAssignmentChangesThunk = createAsyncThunk(
  "customerAssignmentAudit/fetch",
  async (params: ListCustomerAssignmentChangesParams, { rejectWithValue }) => {
    try {
      return await listCustomerAssignmentChanges(params)
    } catch (err: unknown) {
      return rejectWithValue(
        axiosMessage(err, "No se pudo cargar el historial de asignaciones.")
      )
    }
  }
)

const customerAssignmentAuditSlice = createSlice({
  name: "customerAssignmentAudit",
  initialState,
  reducers: {
    clearCustomerAssignmentAuditErrorAct: (state) => {
      state.error = null
    },
    setCustomerAssignmentAuditFiltersAct: (
      state,
      action: PayloadAction<Partial<CustomerAssignmentAuditState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerAssignmentChangesThunk.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.lastParams = action.meta.arg
      })
      .addCase(fetchCustomerAssignmentChangesThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.limit = action.payload.limit
        state.skip = action.payload.skip
      })
      .addCase(fetchCustomerAssignmentChangesThunk.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo cargar el historial de asignaciones."
        state.items = []
        state.total = 0
      })
  },
})

export const {
  clearCustomerAssignmentAuditErrorAct,
  setCustomerAssignmentAuditFiltersAct,
} = customerAssignmentAuditSlice.actions
export default customerAssignmentAuditSlice.reducer
