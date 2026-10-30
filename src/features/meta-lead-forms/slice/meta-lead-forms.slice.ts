import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import {
  createMetaLeadForm,
  deleteMetaLeadForm,
  getMetaLeadFormSettings,
  listMetaLeadForms,
  updateMetaLeadForm,
  updateMetaLeadFormSettings,
} from "../services/meta-lead-forms.http"
import type {
  CreateMetaLeadFormBody,
  MetaLeadFormFlowStrategy,
  MetaLeadFormItem,
  MetaLeadFormSettings,
  UpdateMetaLeadFormBody,
} from "../types/meta-lead-forms.types"

export type MetaLeadFormDraft = {
  readonly formId: string
  readonly formName: string
  readonly flowStrategy: MetaLeadFormFlowStrategy
  readonly enabled: boolean
  readonly notes: string
}

export type MetaLeadFormsState = {
  items: MetaLeadFormItem[]
  settings: MetaLeadFormSettings | null
  loading: boolean
  saving: boolean
  error: string | null
  notice: string | null
  panelOpen: boolean
  editingId: string | null
  draft: MetaLeadFormDraft
  delayDraftMinutes: number
}

const emptyDraft = (): MetaLeadFormDraft => ({
  formId: "",
  formName: "",
  flowStrategy: "immediate_assign",
  enabled: true,
  notes: "",
})

const initialState: MetaLeadFormsState = {
  items: [],
  settings: null,
  loading: false,
  saving: false,
  error: null,
  notice: null,
  panelOpen: false,
  editingId: null,
  draft: emptyDraft(),
  delayDraftMinutes: 2,
}

type ThunkState = { metaLeadForms: MetaLeadFormsState }

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

export const fetchMetaLeadFormsThunk = createAsyncThunk<
  { items: MetaLeadFormItem[]; settings: MetaLeadFormSettings },
  void,
  { rejectValue: string }
>("metaLeadForms/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const [items, settings] = await Promise.all([
      listMetaLeadForms(),
      getMetaLeadFormSettings(),
    ])
    return { items, settings }
  } catch (err) {
    return rejectWithValue(axiosMessage(err, s.loadError))
  }
})

export const saveMetaLeadFormThunk = createAsyncThunk<
  MetaLeadFormItem,
  void,
  { rejectValue: string }
>("metaLeadForms/save", async (_, { getState, rejectWithValue }) => {
  const { draft, editingId } = (getState() as ThunkState).metaLeadForms
  const body: CreateMetaLeadFormBody | UpdateMetaLeadFormBody = {
    formId: draft.formId.trim(),
    formName: draft.formName.trim(),
    flowStrategy: draft.flowStrategy,
    enabled: draft.enabled,
    notes: draft.notes.trim(),
  }
  try {
    if (editingId != null) {
      return await updateMetaLeadForm(editingId, body)
    }
    return await createMetaLeadForm(body as CreateMetaLeadFormBody)
  } catch (err) {
    return rejectWithValue(axiosMessage(err, s.saveError))
  }
})

export const deleteMetaLeadFormThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("metaLeadForms/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteMetaLeadForm(id)
    return id
  } catch (err) {
    return rejectWithValue(axiosMessage(err, s.deleteError))
  }
})

export const saveMetaLeadFormSettingsThunk = createAsyncThunk<
  MetaLeadFormSettings,
  void,
  { rejectValue: string }
>("metaLeadForms/saveSettings", async (_, { getState, rejectWithValue }) => {
  const minutes = (getState() as ThunkState).metaLeadForms.delayDraftMinutes
  try {
    return await updateMetaLeadFormSettings(minutes)
  } catch (err) {
    return rejectWithValue(axiosMessage(err, s.settingsError))
  }
})

const metaLeadFormsSlice = createSlice({
  name: "metaLeadForms",
  initialState,
  reducers: {
    openCreatePanelAct(state) {
      state.panelOpen = true
      state.editingId = null
      state.draft = emptyDraft()
      state.error = null
    },
    openEditPanelAct(state, action: PayloadAction<MetaLeadFormItem>) {
      const item = action.payload
      state.panelOpen = true
      state.editingId = item.id
      state.draft = {
        formId: item.formId,
        formName: item.formName,
        flowStrategy: item.flowStrategy,
        enabled: item.enabled,
        notes: item.notes,
      }
      state.error = null
    },
    closePanelAct(state) {
      state.panelOpen = false
      state.editingId = null
      state.draft = emptyDraft()
    },
    patchDraftAct(state, action: PayloadAction<Partial<MetaLeadFormDraft>>) {
      state.draft = { ...state.draft, ...action.payload }
    },
    setDelayDraftMinutesAct(state, action: PayloadAction<number>) {
      state.delayDraftMinutes = action.payload
    },
    clearNoticeAct(state) {
      state.notice = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetaLeadFormsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMetaLeadFormsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.settings = action.payload.settings
        state.delayDraftMinutes = action.payload.settings.outboundDelayMinutes
      })
      .addCase(fetchMetaLeadFormsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? s.loadError
      })
      .addCase(saveMetaLeadFormThunk.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveMetaLeadFormThunk.fulfilled, (state, action) => {
        state.saving = false
        state.panelOpen = false
        state.editingId = null
        state.draft = emptyDraft()
        state.notice = s.saved
        const idx = state.items.findIndex((row) => row.id === action.payload.id)
        if (idx >= 0) {
          state.items[idx] = action.payload
        } else {
          state.items = [action.payload, ...state.items]
        }
      })
      .addCase(saveMetaLeadFormThunk.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? s.saveError
      })
      .addCase(deleteMetaLeadFormThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((row) => row.id !== action.payload)
        state.notice = s.deleted
      })
      .addCase(deleteMetaLeadFormThunk.rejected, (state, action) => {
        state.error = action.payload ?? s.deleteError
      })
      .addCase(saveMetaLeadFormSettingsThunk.fulfilled, (state, action) => {
        state.settings = action.payload
        state.delayDraftMinutes = action.payload.outboundDelayMinutes
        state.notice = s.settingsSaved
      })
      .addCase(saveMetaLeadFormSettingsThunk.rejected, (state, action) => {
        state.error = action.payload ?? s.settingsError
      })
  },
})

export const {
  openCreatePanelAct,
  openEditPanelAct,
  closePanelAct,
  patchDraftAct,
  setDelayDraftMinutesAct,
  clearNoticeAct,
} = metaLeadFormsSlice.actions

export default metaLeadFormsSlice.reducer
