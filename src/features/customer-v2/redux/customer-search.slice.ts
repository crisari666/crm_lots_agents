import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import {
  type CustomerAutocompleteItem,
  searchCustomersAutocomplete,
} from "../services/customers-ms.service"

const MIN_QUERY_LENGTH = 2

export type CustomerSearchState = {
  items: CustomerAutocompleteItem[]
  loading: boolean
  error: string | null
  lastQuery: string
}

const initialState: CustomerSearchState = {
  items: [],
  loading: false,
  error: null,
  lastQuery: "",
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

export const searchCustomersAutocompleteThunk = createAsyncThunk<
  { query: string; items: CustomerAutocompleteItem[] },
  string,
  { rejectValue: string }
>(
  "customerSearch/search",
  async (query, { rejectWithValue }) => {
    const trimmed = query.trim()
    try {
      const items = await searchCustomersAutocomplete({ q: trimmed, limit: 20 })
      return { query: trimmed, items }
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo buscar clientes."))
    }
  },
  {
    condition: (query) => query.trim().length >= MIN_QUERY_LENGTH,
  }
)

const customerSearchSlice = createSlice({
  name: "customerSearch",
  initialState,
  reducers: {
    clearCustomerSearchResultsAct: (state) => {
      state.items = []
      state.loading = false
      state.error = null
      state.lastQuery = ""
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCustomersAutocompleteThunk.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.lastQuery = action.meta.arg.trim()
      })
      .addCase(searchCustomersAutocompleteThunk.fulfilled, (state, action) => {
        if (action.payload.query !== state.lastQuery) {
          return
        }
        state.loading = false
        state.items = action.payload.items
      })
      .addCase(searchCustomersAutocompleteThunk.rejected, (state, action) => {
        if (action.meta.arg.trim() !== state.lastQuery) {
          return
        }
        state.loading = false
        state.error = action.payload ?? action.error.message ?? "No se pudo buscar clientes."
        state.items = []
      })
  },
})

export const { clearCustomerSearchResultsAct } = customerSearchSlice.actions
export default customerSearchSlice.reducer
