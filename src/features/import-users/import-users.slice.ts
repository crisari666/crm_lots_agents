import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  importUsersReq,
  UserImportFirstStepType,
  UserImportRowPayload,
  UserImportResultItem
} from "../../app/services/users.service"
import { ImportUsersState, ImportUserRowPreview } from "./import-users.state"

const initialState: ImportUsersState = {
  previewRows: [],
  loading: false,
  fileLoaded: false
}

export const importUsersThunk = createAsyncThunk(
  "ImportUsers/importUsersThunk",
  async (
    {
      users,
      importFirstStep
    }: { users: UserImportRowPayload[]; importFirstStep: UserImportFirstStepType }
  ): Promise<UserImportResultItem[]> => {
    const result = await importUsersReq({ importFirstStep, users })
    if (result == null) throw new Error("Import failed")
    return result
  }
)

const importUsersSlice = createSlice({
  name: "ImportUsers",
  initialState,
  reducers: {
    setPreviewRowsAct: (state, action: PayloadAction<ImportUserRowPreview[]>) => {
      state.previewRows = action.payload
      state.fileLoaded = action.payload.length > 0
    },
    clearPreviewAct: (state) => {
      state.previewRows = []
      state.fileLoaded = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(importUsersThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(importUsersThunk.fulfilled, (state, action) => {
        state.loading = false
        const byEmail = new Map(action.payload.map((r) => [r.email, r]))
        state.previewRows = state.previewRows.map((row) => {
          const res = byEmail.get(row.email)
          if (res) {
            return { ...row, status: res.status, userId: res.userId }
          }
          return row
        })
      })
      .addCase(importUsersThunk.rejected, (state) => {
        state.loading = false
      })
  }
})

export const { setPreviewRowsAct, clearPreviewAct } = importUsersSlice.actions
export default importUsersSlice.reducer
