import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  assignCustomerAssignee,
  importCustomersAdmin,
} from "../customer-v2/services/customers-ms-admin-customer.http"
import type {
  ImportCustomerAdminResultItem,
  ImportCustomerRowPayload,
} from "../customer-v2/services/customers-ms-admin-customer.types"
import {
  ImportCustomerRowPreview,
  ImportCustomersState,
} from "./import-customers.state"
import { normalizeImportPhone } from "./utils/normalize-import-phone.util"

const initialState: ImportCustomersState = {
  previewRows: [],
  loading: false,
  fileLoaded: false,
  distributeUserIds: [],
  assigneePatchLoadingByPhone: {},
}

export const importCustomersThunk = createAsyncThunk(
  "ImportCustomers/importCustomersThunk",
  async (customers: ImportCustomerRowPayload[]): Promise<ImportCustomerAdminResultItem[]> => {
    const response = await importCustomersAdmin({ customers })
    return response.results
  },
)

export const assignCustomerAssigneeThunk = createAsyncThunk(
  "ImportCustomers/assignCustomerAssigneeThunk",
  async ({
    customerId,
    assignedTo,
    phoneKey,
  }: {
    customerId: string
    assignedTo: string
    phoneKey: string
  }): Promise<{ phoneKey: string; assignedTo: string }> => {
    await assignCustomerAssignee(customerId, assignedTo)
    return { phoneKey, assignedTo }
  },
)

const importCustomersSlice = createSlice({
  name: "ImportCustomers",
  initialState,
  reducers: {
    setPreviewRowsAct: (state, action: PayloadAction<ImportCustomerRowPreview[]>) => {
      state.previewRows = action.payload.map((row) => ({
        ...row,
        status: "pending" as const,
        customerId: undefined,
        errorMessage: undefined,
      }))
      state.fileLoaded = action.payload.length > 0
    },
    clearPreviewAct: (state) => {
      state.previewRows = []
      state.fileLoaded = false
      state.distributeUserIds = []
      state.assigneePatchLoadingByPhone = {}
    },
    setDistributeUserIdsAct: (state, action: PayloadAction<string[]>) => {
      state.distributeUserIds = action.payload
    },
    updateRowAssigneeAct: (
      state,
      action: PayloadAction<{ phone: string; assignedTo: string }>,
    ) => {
      const phoneKey = normalizeImportPhone(action.payload.phone)
      state.previewRows = state.previewRows.map((row) => {
        if (normalizeImportPhone(row.phone) !== phoneKey) {
          return row
        }
        return { ...row, assignedTo: action.payload.assignedTo || undefined }
      })
    },
    applyDistributeAct: (state) => {
      const pool = state.distributeUserIds
      if (pool.length === 0) {
        return
      }
      state.previewRows = state.previewRows.map((row, index) => ({
        ...row,
        assignedTo: pool[index % pool.length],
      }))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importCustomersThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(importCustomersThunk.fulfilled, (state, action) => {
        state.loading = false
        const byPhone = new Map(
          action.payload.map((result) => [normalizeImportPhone(result.phone), result]),
        )
        state.previewRows = state.previewRows.map((row) => {
          const key = normalizeImportPhone(row.phone)
          const res = byPhone.get(key)
          if (res == null) {
            return row
          }
          if (res.status === "error") {
            return {
              ...row,
              status: "error",
              errorMessage: res.message,
            }
          }
          return {
            ...row,
            status: res.status,
            customerId: res.customerId,
            errorMessage: undefined,
          }
        })
      })
      .addCase(importCustomersThunk.rejected, (state) => {
        state.loading = false
      })
      .addCase(assignCustomerAssigneeThunk.pending, (state, action) => {
        const phoneKey = action.meta.arg.phoneKey
        state.assigneePatchLoadingByPhone[phoneKey] = true
      })
      .addCase(assignCustomerAssigneeThunk.fulfilled, (state, action) => {
        const { phoneKey, assignedTo } = action.payload
        delete state.assigneePatchLoadingByPhone[phoneKey]
        state.previewRows = state.previewRows.map((row) => {
          if (normalizeImportPhone(row.phone) !== phoneKey) {
            return row
          }
          return { ...row, assignedTo: assignedTo || undefined }
        })
      })
      .addCase(assignCustomerAssigneeThunk.rejected, (state, action) => {
        const phoneKey = action.meta.arg.phoneKey
        delete state.assigneePatchLoadingByPhone[phoneKey]
      })
  },
})

export const {
  setPreviewRowsAct,
  clearPreviewAct,
  setDistributeUserIdsAct,
  updateRowAssigneeAct,
  applyDistributeAct,
} = importCustomersSlice.actions
export default importCustomersSlice.reducer
