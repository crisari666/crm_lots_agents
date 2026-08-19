import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  bulkUpdateLotStatusReq,
  deleteLotsMapReq,
  deleteProjectLotsReq,
  fetchLotInventoryHubReq,
  fetchLotsMapReq,
  fetchLotHistoryReq,
  fetchProjectLotsReq,
  desistProjectLotReq,
  generateProjectLotsReq,
  importProjectLotsExcelReq,
  updateProjectLotReq,
  uploadLotsMapKmlReq
} from "../../../../app/services/project-lots.service"
import {
  BulkUpdateLotStatusDto,
  EMPTY_KIND_SUMMARY,
  GenerateProjectLotsDto,
  LotInventoryViewMode,
  ProjectLotKind,
  ProjectLotStatus,
  UpdateProjectLotDto
} from "../types/lot-inventory.types"
import { LotInventoryState } from "./lot-inventory.state"

const initialState: LotInventoryState = {
  hubRows: [],
  hubLoading: false,
  hubError: null,
  hubSearch: "",
  projectId: null,
  lots: [],
  summary: EMPTY_KIND_SUMMARY,
  lotsLoading: false,
  lotsError: null,
  kindFilter: "lot",
  statusFilter: "all",
  stageFilter: "all",
  searchNumber: "",
  viewMode: "board",
  selectedLotIds: [],
  drawerLotId: null,
  importResult: null,
  actionLoading: false,
  mapPaint: null,
  mapLoading: false,
  mapError: null,
  mapUploadResult: null,
  historyLogs: [],
  historyLoading: false
}

export const fetchLotInventoryHubThunk = createAsyncThunk(
  "lotInventory/fetchHub",
  async () => fetchLotInventoryHubReq()
)

export const fetchProjectLotsThunk = createAsyncThunk(
  "lotInventory/fetchLots",
  async ({
    projectId,
    kind
  }: {
    projectId: string
    kind?: ProjectLotKind | "all"
  }) => fetchProjectLotsReq({ projectId, kind: kind ?? "all" })
)

export const updateProjectLotThunk = createAsyncThunk(
  "lotInventory/updateLot",
  async (params: {
    projectId: string
    lotId: string
    data: UpdateProjectLotDto
  }) => updateProjectLotReq(params)
)

export const bulkUpdateLotStatusThunk = createAsyncThunk(
  "lotInventory/bulkStatus",
  async (params: { projectId: string; data: BulkUpdateLotStatusDto }) => {
    const result = await bulkUpdateLotStatusReq(params)
    return { ...result, ...params }
  }
)

export const generateProjectLotsThunk = createAsyncThunk(
  "lotInventory/generate",
  async (params: { projectId: string; data: GenerateProjectLotsDto }) => {
    const result = await generateProjectLotsReq(params)
    return { ...result, projectId: params.projectId }
  }
)

export const importProjectLotsExcelThunk = createAsyncThunk(
  "lotInventory/importExcel",
  async (params: {
    projectId: string
    file: File
    kind?: ProjectLotKind
  }) => importProjectLotsExcelReq(params)
)

export const fetchLotsMapThunk = createAsyncThunk(
  "lotInventory/fetchMap",
  async (projectId: string) => fetchLotsMapReq({ projectId })
)

export const uploadLotsMapKmlThunk = createAsyncThunk(
  "lotInventory/uploadMapKml",
  async (params: {
    projectId: string
    file: File
    swapStages?: boolean
  }) => uploadLotsMapKmlReq(params)
)

export const deleteLotsMapThunk = createAsyncThunk(
  "lotInventory/deleteMap",
  async (projectId: string) => {
    await deleteLotsMapReq({ projectId })
    return projectId
  }
)

export const deleteProjectLotsThunk = createAsyncThunk(
  "lotInventory/deleteLots",
  async (params: { projectId: string; kind?: ProjectLotKind | "all" }) => {
    const result = await deleteProjectLotsReq(params)
    return { ...result, projectId: params.projectId }
  }
)

export const fetchLotHistoryThunk = createAsyncThunk(
  "lotInventory/fetchHistory",
  async (params: { projectId: string; lotId: string }) => fetchLotHistoryReq(params)
)

export const desistProjectLotThunk = createAsyncThunk(
  "lotInventory/desistLot",
  async (params: {
    projectId: string
    lotId: string
    files: File[]
    note?: string
  }) => desistProjectLotReq(params)
)

const lotInventorySlice = createSlice({
  name: "lotInventory",
  initialState,
  reducers: {
    setHubSearchAct(state, action: PayloadAction<string>) {
      state.hubSearch = action.payload
    },
    setKindFilterAct(state, action: PayloadAction<ProjectLotKind>) {
      state.kindFilter = action.payload
      state.selectedLotIds = []
    },
    setStatusFilterAct(
      state,
      action: PayloadAction<ProjectLotStatus | "all">
    ) {
      state.statusFilter = action.payload
    },
    setStageFilterAct(state, action: PayloadAction<string | "all">) {
      state.stageFilter = action.payload
    },
    setSearchNumberAct(state, action: PayloadAction<string>) {
      state.searchNumber = action.payload
    },
    setViewModeAct(state, action: PayloadAction<LotInventoryViewMode>) {
      state.viewMode = action.payload
    },
    toggleLotSelectedAct(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.selectedLotIds.includes(id)) {
        state.selectedLotIds = state.selectedLotIds.filter((x) => x !== id)
      } else {
        state.selectedLotIds.push(id)
      }
    },
    clearLotSelectionAct(state) {
      state.selectedLotIds = []
    },
    setDrawerLotIdAct(state, action: PayloadAction<string | null>) {
      state.drawerLotId = action.payload
      if (!action.payload) {
        state.historyLogs = []
      }
    },
    clearImportResultAct(state) {
      state.importResult = null
    },
    clearMapUploadResultAct(state) {
      state.mapUploadResult = null
    },
    resetWorkspaceAct(state) {
      state.projectId = null
      state.lots = []
      state.summary = EMPTY_KIND_SUMMARY
      state.selectedLotIds = []
      state.drawerLotId = null
      state.searchNumber = ""
      state.statusFilter = "all"
      state.stageFilter = "all"
      state.importResult = null
      state.lotsError = null
      state.mapPaint = null
      state.mapError = null
      state.mapUploadResult = null
      state.historyLogs = []
      state.historyLoading = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLotInventoryHubThunk.pending, (state) => {
        state.hubLoading = true
        state.hubError = null
      })
      .addCase(fetchLotInventoryHubThunk.fulfilled, (state, action) => {
        state.hubLoading = false
        state.hubRows = action.payload
      })
      .addCase(fetchLotInventoryHubThunk.rejected, (state, action) => {
        state.hubLoading = false
        state.hubError = action.error.message ?? "Error"
      })
      .addCase(fetchProjectLotsThunk.pending, (state) => {
        state.lotsLoading = true
        state.lotsError = null
      })
      .addCase(fetchProjectLotsThunk.fulfilled, (state, action) => {
        state.lotsLoading = false
        state.lots = action.payload.lots
        state.summary = action.payload.summary
        state.projectId = action.meta.arg.projectId
      })
      .addCase(fetchProjectLotsThunk.rejected, (state, action) => {
        state.lotsLoading = false
        state.lotsError = action.error.message ?? "Error"
      })
      .addCase(updateProjectLotThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(updateProjectLotThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const updated = action.payload
        const idx = state.lots.findIndex((l) => l._id === updated._id)
        if (idx >= 0) state.lots[idx] = updated
      })
      .addCase(updateProjectLotThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(bulkUpdateLotStatusThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(bulkUpdateLotStatusThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const { lotIds, status, ventorName, soldBy } = action.payload.data
        const idSet = new Set(lotIds)
        state.lots = state.lots.map((lot) => {
          if (!idSet.has(lot._id)) return lot
          return {
            ...lot,
            status,
            ...(ventorName !== undefined ? { ventorName } : {}),
            ...(soldBy !== undefined ? { soldBy } : {})
          }
        })
        state.selectedLotIds = []
      })
      .addCase(bulkUpdateLotStatusThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(generateProjectLotsThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(generateProjectLotsThunk.fulfilled, (state) => {
        state.actionLoading = false
      })
      .addCase(generateProjectLotsThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(importProjectLotsExcelThunk.pending, (state) => {
        state.actionLoading = true
        state.importResult = null
      })
      .addCase(importProjectLotsExcelThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.importResult = action.payload
      })
      .addCase(importProjectLotsExcelThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(fetchLotsMapThunk.pending, (state) => {
        state.mapLoading = true
        state.mapError = null
      })
      .addCase(fetchLotsMapThunk.fulfilled, (state, action) => {
        state.mapLoading = false
        state.mapPaint = action.payload
      })
      .addCase(fetchLotsMapThunk.rejected, (state, action) => {
        state.mapLoading = false
        state.mapPaint = null
        state.mapError = action.error.message ?? "Error"
      })
      .addCase(uploadLotsMapKmlThunk.pending, (state) => {
        state.actionLoading = true
        state.mapUploadResult = null
      })
      .addCase(uploadLotsMapKmlThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        state.mapUploadResult = action.payload
      })
      .addCase(uploadLotsMapKmlThunk.rejected, (state, action) => {
        state.actionLoading = false
        state.mapError = action.error.message ?? "Error"
      })
      .addCase(deleteLotsMapThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(deleteLotsMapThunk.fulfilled, (state) => {
        state.actionLoading = false
        state.mapPaint = null
        state.mapUploadResult = null
      })
      .addCase(deleteLotsMapThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(deleteProjectLotsThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(deleteProjectLotsThunk.fulfilled, (state) => {
        state.actionLoading = false
        state.lots = []
        state.summary = EMPTY_KIND_SUMMARY
        state.selectedLotIds = []
        state.drawerLotId = null
        state.historyLogs = []
      })
      .addCase(deleteProjectLotsThunk.rejected, (state) => {
        state.actionLoading = false
      })
      .addCase(fetchLotHistoryThunk.pending, (state) => {
        state.historyLoading = true
      })
      .addCase(fetchLotHistoryThunk.fulfilled, (state, action) => {
        state.historyLoading = false
        state.historyLogs = action.payload
      })
      .addCase(fetchLotHistoryThunk.rejected, (state) => {
        state.historyLoading = false
        state.historyLogs = []
      })
      .addCase(desistProjectLotThunk.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(desistProjectLotThunk.fulfilled, (state, action) => {
        state.actionLoading = false
        const updated = action.payload
        const idx = state.lots.findIndex((l) => l._id === updated._id)
        if (idx >= 0) state.lots[idx] = updated
      })
      .addCase(desistProjectLotThunk.rejected, (state) => {
        state.actionLoading = false
      })
  }
})

export const {
  setHubSearchAct,
  setKindFilterAct,
  setStatusFilterAct,
  setStageFilterAct,
  setSearchNumberAct,
  setViewModeAct,
  toggleLotSelectedAct,
  clearLotSelectionAct,
  setDrawerLotIdAct,
  clearImportResultAct,
  clearMapUploadResultAct,
  resetWorkspaceAct
} = lotInventorySlice.actions

export default lotInventorySlice.reducer
