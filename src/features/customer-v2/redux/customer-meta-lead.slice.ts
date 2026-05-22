import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import {
  type CustomerMetaLeadMappedFieldItem,
  getCustomerMetaLeadMappedFieldsAdmin,
} from "../services/customers-ms.service"

export type CustomerMetaLeadState = {
  detailItems: Record<string, CustomerMetaLeadMappedFieldItem[]>
  detailHasLead: Record<string, boolean>
  detailLoading: boolean
  detailError: string | null
}

const initialState: CustomerMetaLeadState = {
  detailItems: {},
  detailHasLead: {},
  detailLoading: false,
  detailError: null,
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

export const fetchCustomerMetaLeadMappedFieldsThunk = createAsyncThunk(
  "customerMetaLead/fetchByCustomer",
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await getCustomerMetaLeadMappedFieldsAdmin(customerId)
      return {
        customerId,
        hasLead: response.hasLead,
        items: response.items,
      }
    } catch (err: unknown) {
      return rejectWithValue(
        axiosMessage(err, "No se pudieron cargar los datos del formulario Meta.")
      )
    }
  }
)

const customerMetaLeadSlice = createSlice({
  name: "customerMetaLead",
  initialState,
  reducers: {
    clearCustomerMetaLeadDetailAct: (state) => {
      state.detailLoading = false
      state.detailError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerMetaLeadMappedFieldsThunk.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchCustomerMetaLeadMappedFieldsThunk.fulfilled, (state, action) => {
        state.detailLoading = false
        state.detailItems[action.payload.customerId] = action.payload.items
        state.detailHasLead[action.payload.customerId] = action.payload.hasLead
      })
      .addCase(fetchCustomerMetaLeadMappedFieldsThunk.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError =
          (action.payload as string) ??
          action.error.message ??
          "No se pudieron cargar los datos del formulario Meta."
      })
  },
})

export const { clearCustomerMetaLeadDetailAct } = customerMetaLeadSlice.actions
export default customerMetaLeadSlice.reducer
