import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import {
  type CustomerMetadataResponse,
  getCustomerMetadata,
  putCustomerMetadata,
} from "../services/customers-ms.service"

export type CustomerMetadataState = {
  byCustomerId: Record<string, CustomerMetadataResponse>
  loading: boolean
  saving: boolean
  error: string | null
  activeCustomerId: string | null
}

const initialState: CustomerMetadataState = {
  byCustomerId: {},
  loading: false,
  saving: false,
  error: null,
  activeCustomerId: null,
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

export const fetchCustomerMetadataThunk = createAsyncThunk(
  "customerMetadata/fetch",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const data = await getCustomerMetadata(customerId)
      return { customerId, data }
    } catch (err: unknown) {
      return rejectWithValue(
        axiosMessage(err, "No se pudo cargar la captura de datos.")
      )
    }
  }
)

export const saveCustomerMetadataThunk = createAsyncThunk(
  "customerMetadata/save",
  async (
    args: { customerId: string; values: Record<string, string> },
    { rejectWithValue }
  ) => {
    try {
      const data = await putCustomerMetadata(args.customerId, {
        values: args.values,
      })
      return { customerId: args.customerId, data }
    } catch (err: unknown) {
      return rejectWithValue(
        axiosMessage(err, "No se pudo guardar la captura de datos.")
      )
    }
  }
)

const customerMetadataSlice = createSlice({
  name: "customerMetadata",
  initialState,
  reducers: {
    clearCustomerMetadataAct: (state) => {
      state.loading = false
      state.saving = false
      state.error = null
      state.activeCustomerId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerMetadataThunk.pending, (state, action) => {
        state.loading = true
        state.error = null
        state.activeCustomerId = action.meta.arg
      })
      .addCase(fetchCustomerMetadataThunk.fulfilled, (state, action) => {
        state.loading = false
        state.byCustomerId[action.payload.customerId] = action.payload.data
      })
      .addCase(fetchCustomerMetadataThunk.rejected, (state, action) => {
        state.loading = false
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo cargar la captura de datos."
      })
      .addCase(saveCustomerMetadataThunk.pending, (state) => {
        state.saving = true
      })
      .addCase(saveCustomerMetadataThunk.fulfilled, (state, action) => {
        state.saving = false
        state.error = null
        state.byCustomerId[action.payload.customerId] = action.payload.data
      })
      .addCase(saveCustomerMetadataThunk.rejected, (state, action) => {
        state.saving = false
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo guardar la captura de datos."
      })
  },
})

export const { clearCustomerMetadataAct } = customerMetadataSlice.actions
export default customerMetadataSlice.reducer
