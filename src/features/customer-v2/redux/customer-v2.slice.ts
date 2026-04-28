import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import {
  type CustomerAdminDetail,
  type CustomerAdminListResponse,
  type ListCustomersAdminParams,
  getCustomerAdminDetail,
  listCustomersAdmin,
  updateCustomerReferral,
  updateCustomerAdmin,
  type UpdateCustomerAdminBody,
} from "../services/customers-ms.service"

export type CustomerV2State = {
  listItems: CustomerAdminListResponse["items"]
  listStepDistribution: CustomerAdminListResponse["stepDistribution"]
  listTotal: number
  listLoading: boolean
  listError: string | null
  /** Last successful list query (for refetch after detail save). */
  lastListFetchParams: ListCustomersAdminParams | null
  detail: CustomerAdminDetail | null
  detailForm: CustomerAdminDetail | null
  detailLoading: boolean
  detailSaving: boolean
  detailError: string | null
  dialogOpen: boolean
}

const initialState: CustomerV2State = {
  listItems: [],
  listStepDistribution: [],
  listTotal: 0,
  listLoading: false,
  listError: null,
  lastListFetchParams: null,
  detail: null,
  detailForm: null,
  detailLoading: false,
  detailSaving: false,
  detailError: null,
  dialogOpen: false,
}

function cloneDetail(d: CustomerAdminDetail): CustomerAdminDetail {
  return JSON.parse(JSON.stringify(d)) as CustomerAdminDetail
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

export const fetchCustomerListAdminThunk = createAsyncThunk(
  "customerV2/fetchCustomerListAdmin",
  async (params: ListCustomersAdminParams, { rejectWithValue }) => {
    try {
      return await listCustomersAdmin(params)
    } catch (err: unknown) {
      return rejectWithValue(
        axiosMessage(err, "No se pudo cargar la lista de clientes.")
      )
    }
  }
)

export const fetchCustomerAdminDetailThunk = createAsyncThunk(
  "customerV2/fetchCustomerAdminDetail",
  async (customerId: string, { rejectWithValue }) => {
    try {
      return await getCustomerAdminDetail(customerId)
    } catch (err: unknown) {
      return rejectWithValue(
        axiosMessage(err, "No se pudo cargar el cliente.")
      )
    }
  }
)

export const updateCustomerAdminThunk = createAsyncThunk(
  "customerV2/updateCustomerAdmin",
  async (payload: { customerId: string; body: UpdateCustomerAdminBody }, { rejectWithValue }) => {
    try {
      return await updateCustomerAdmin(payload.customerId, payload.body)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo guardar el cliente."))
    }
  }
)

export const updateCustomerReferralThunk = createAsyncThunk(
  "customerV2/updateCustomerReferral",
  async (payload: { customerId: string; isReferral: boolean }, { rejectWithValue }) => {
    try {
      return await updateCustomerReferral(payload.customerId, payload.isReferral)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo actualizar estado de referido."))
    }
  }
)

const customerV2Slice = createSlice({
  name: "customerV2",
  initialState,
  reducers: {
    clearListErrorAct: (state) => {
      state.listError = null
    },
    closeCustomerDetailDialogAct: (state) => {
      state.dialogOpen = false
      state.detail = null
      state.detailForm = null
      state.detailError = null
      state.detailLoading = false
    },
    setCustomerDetailFormAct: (
      state,
      action: PayloadAction<Partial<CustomerAdminDetail>>
    ) => {
      if (state.detailForm === null) {
        return
      }
      state.detailForm = { ...state.detailForm, ...action.payload }
    },
    setCustomerDetailInterestedProjectsAct: (
      state,
      action: PayloadAction<CustomerAdminDetail["interestedProjects"]>
    ) => {
      if (state.detailForm === null) {
        return
      }
      state.detailForm.interestedProjects = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerListAdminThunk.pending, (state, action) => {
        state.listLoading = true
        state.listError = null
        state.lastListFetchParams = action.meta.arg
      })
      .addCase(fetchCustomerListAdminThunk.fulfilled, (state, action) => {
        state.listLoading = false
        state.listItems = action.payload.items
        state.listStepDistribution = action.payload.stepDistribution
        state.listTotal = action.payload.total
      })
      .addCase(fetchCustomerListAdminThunk.rejected, (state, action) => {
        state.listLoading = false
        state.listError =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo cargar la lista de clientes."
        state.listItems = []
        state.listStepDistribution = []
        state.listTotal = 0
      })
      .addCase(fetchCustomerAdminDetailThunk.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
        state.dialogOpen = true
      })
      .addCase(fetchCustomerAdminDetailThunk.fulfilled, (state, action) => {
        state.detailLoading = false
        state.detail = action.payload
        state.detailForm = cloneDetail(action.payload)
      })
      .addCase(fetchCustomerAdminDetailThunk.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo cargar el cliente."
      })
      .addCase(updateCustomerAdminThunk.pending, (state) => {
        state.detailSaving = true
        state.detailError = null
      })
      .addCase(updateCustomerAdminThunk.fulfilled, (state, action) => {
        state.detailSaving = false
        state.detailError = null
        state.detail = action.payload
        state.detailForm = cloneDetail(action.payload)
      })
      .addCase(updateCustomerAdminThunk.rejected, (state, action) => {
        state.detailSaving = false
        state.detailError =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo guardar el cliente."
      })
      .addCase(updateCustomerReferralThunk.pending, (state) => {
        state.detailSaving = true
        state.detailError = null
      })
      .addCase(updateCustomerReferralThunk.fulfilled, (state, action) => {
        state.detailSaving = false
        state.detailError = null
        state.detail = action.payload
        state.detailForm = cloneDetail(action.payload)
      })
      .addCase(updateCustomerReferralThunk.rejected, (state, action) => {
        state.detailSaving = false
        state.detailError =
          (action.payload as string) ??
          action.error.message ??
          "No se pudo actualizar estado de referido."
      })
  },
})

export const {
  clearListErrorAct,
  closeCustomerDetailDialogAct,
  setCustomerDetailFormAct,
  setCustomerDetailInterestedProjectsAct,
} = customerV2Slice.actions
export default customerV2Slice.reducer
