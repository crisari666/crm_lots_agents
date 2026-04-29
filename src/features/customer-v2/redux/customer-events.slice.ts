import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import {
  type CustomerEventType,
  type ListCustomerEventsParams,
  type ListCustomerEventsResponse,
  listCustomerEventsAdmin,
  listCustomerEventsByCustomerId,
} from "../services/customers-ms.service"

export type CustomerEventsState = {
  items: ListCustomerEventsResponse["items"]
  total: number
  limit: number
  skip: number
  loading: boolean
  error: string | null
  lastParams: ListCustomerEventsParams | null
  detailItems: Record<string, ListCustomerEventsResponse["items"]>
  detailLoading: boolean
  detailError: string | null
  filters: {
    dateFrom: string
    dateTo: string
    eventType: CustomerEventType | ""
    officeId: string
    userId: string
    limit: 100 | 200 | 500
    page: number
  }
}

const initialState: CustomerEventsState = {
  items: [],
  total: 0,
  limit: 100,
  skip: 0,
  loading: false,
  error: null,
  lastParams: null,
  detailItems: {},
  detailLoading: false,
  detailError: null,
  filters: {
    dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    dateTo: new Date().toISOString(),
    eventType: "",
    officeId: "",
    userId: "",
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

export const fetchCustomerEventsAdminThunk = createAsyncThunk(
  "customerEvents/fetchAdmin",
  async (params: ListCustomerEventsParams, { rejectWithValue }) => {
    try {
      return await listCustomerEventsAdmin(params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudieron cargar los eventos."))
    }
  }
)

export const fetchCustomerEventsByCustomerThunk = createAsyncThunk(
  "customerEvents/fetchByCustomer",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await listCustomerEventsByCustomerId(customerId, {
        limit: 500,
        skip: 0,
      })
      return { customerId, items: response.items }
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudieron cargar los eventos del cliente."))
    }
  }
)

const customerEventsSlice = createSlice({
  name: "customerEvents",
  initialState,
  reducers: {
    clearCustomerEventsErrorAct: (state) => {
      state.error = null
      state.detailError = null
    },
    setCustomerEventsFiltersAct: (
      state,
      action: PayloadAction<Partial<CustomerEventsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerEventsAdminThunk.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.lastParams = action.meta.arg
      })
      .addCase(fetchCustomerEventsAdminThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.limit = action.payload.limit
        state.skip = action.payload.skip
      })
      .addCase(fetchCustomerEventsAdminThunk.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "No se pudieron cargar los eventos."
        state.items = []
        state.total = 0
      })
      .addCase(fetchCustomerEventsByCustomerThunk.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchCustomerEventsByCustomerThunk.fulfilled, (state, action) => {
        state.detailLoading = false
        state.detailItems[action.payload.customerId] = action.payload.items
      })
      .addCase(fetchCustomerEventsByCustomerThunk.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError =
          (action.payload as string) ??
          action.error.message ??
          "No se pudieron cargar los eventos del cliente."
      })
  },
})

export const { clearCustomerEventsErrorAct, setCustomerEventsFiltersAct } = customerEventsSlice.actions
export default customerEventsSlice.reducer
