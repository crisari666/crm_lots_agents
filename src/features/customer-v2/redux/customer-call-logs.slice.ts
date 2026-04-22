import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import {
  type ListCallLogsAdminParams,
  type ListCallLogsAdminResponse,
  listCallLogsAdmin,
} from "../services/customers-ms.service"

export type CustomerCallLogsState = {
  items: ListCallLogsAdminResponse["items"]
  total: number
  loading: boolean
  error: string | null
  lastParams: ListCallLogsAdminParams | null
}

const initialState: CustomerCallLogsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  lastParams: null,
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

export const fetchCallLogsAdminThunk = createAsyncThunk(
  "customerCallLogs/fetchCallLogsAdmin",
  async (params: ListCallLogsAdminParams, { rejectWithValue }) => {
    try {
      return await listCallLogsAdmin(params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo cargar el historial de llamadas."))
    }
  }
)

const customerCallLogsSlice = createSlice({
  name: "customerCallLogs",
  initialState,
  reducers: {
    clearCallLogsErrorAct: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallLogsAdminThunk.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.lastParams = action.meta.arg
      })
      .addCase(fetchCallLogsAdminThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
      })
      .addCase(fetchCallLogsAdminThunk.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo cargar el historial de llamadas."
        state.items = []
        state.total = 0
      })
  },
})

export const { clearCallLogsErrorAct } = customerCallLogsSlice.actions
export default customerCallLogsSlice.reducer
