import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { metaLeadFormsStrings as s } from "../../../i18n/locales/meta-lead-forms.strings"
import {
  createMetaLeadAdCampaign,
  createMetaLeadForm,
  deleteMetaLeadAdCampaign,
  deleteMetaLeadForm,
  getMetaLeadFormSettings,
  getMetaLeadFormStats,
  listMetaLeadAdCampaigns,
  listMetaLeadForms,
  updateMetaLeadAdCampaign,
  updateMetaLeadForm,
  updateMetaLeadFormSettings,
} from "../services/meta-lead-forms.http"
import type {
  CreateMetaLeadAdCampaignBody,
  CreateMetaLeadFormBody,
  MetaLeadAdCampaignGroup,
  MetaLeadAdCampaignItem,
  MetaLeadFormCampaignGroup,
  MetaLeadFormFlowStrategy,
  MetaLeadFormItem,
  MetaLeadFormSettings,
  UpdateMetaLeadAdCampaignBody,
  UpdateMetaLeadFormBody,
} from "../types/meta-lead-forms.types"

export type MetaLeadFormDraft = {
  readonly formId: string
  readonly formName: string
  readonly flowStrategy: MetaLeadFormFlowStrategy
  readonly enabled: boolean
  readonly notes: string
}

export type MetaLeadAdCampaignDraft = {
  readonly adId: string
  readonly adName: string
  readonly campaignId: string
  readonly campaignName: string
  readonly projectId: string
  readonly projectTitle: string
  readonly enabled: boolean
  readonly notes: string
}

export type MetaLeadFormsState = {
  items: MetaLeadFormItem[]
  settings: MetaLeadFormSettings | null
  leadCountByFormId: Record<string, number>
  unregisteredForms: MetaLeadFormCampaignGroup[]
  adItems: MetaLeadAdCampaignItem[]
  leadCountByAdId: Record<string, number>
  unregisteredAds: MetaLeadAdCampaignGroup[]
  loading: boolean
  saving: boolean
  adSaving: boolean
  error: string | null
  notice: string | null
  panelOpen: boolean
  editingId: string | null
  draft: MetaLeadFormDraft
  adPanelOpen: boolean
  adEditingId: string | null
  adDraft: MetaLeadAdCampaignDraft
  delayDraftMinutes: number
}

const emptyDraft = (): MetaLeadFormDraft => ({
  formId: "",
  formName: "",
  flowStrategy: "immediate_assign",
  enabled: true,
  notes: "",
})

const emptyAdDraft = (): MetaLeadAdCampaignDraft => ({
  adId: "",
  adName: "",
  campaignId: "",
  campaignName: "",
  projectId: "",
  projectTitle: "",
  enabled: true,
  notes: "",
})

const initialState: MetaLeadFormsState = {
  items: [],
  settings: null,
  leadCountByFormId: {},
  unregisteredForms: [],
  adItems: [],
  leadCountByAdId: {},
  unregisteredAds: [],
  loading: false,
  saving: false,
  adSaving: false,
  error: null,
  notice: null,
  panelOpen: false,
  editingId: null,
  draft: emptyDraft(),
  adPanelOpen: false,
  adEditingId: null,
  adDraft: emptyAdDraft(),
  delayDraftMinutes: 2,
}

function buildLeadCountMap(
  registered: ReadonlyArray<{ readonly formId: string; readonly leadCount: number }>,
  unregistered: ReadonlyArray<MetaLeadFormCampaignGroup>,
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const row of registered) {
    map[row.formId] = row.leadCount
  }
  for (const row of unregistered) {
    map[row.formId] = row.leadCount
  }
  return map
}

function buildAdLeadCountMap(
  registered: ReadonlyArray<{ readonly adId: string; readonly leadCount: number }>,
  unregistered: ReadonlyArray<MetaLeadAdCampaignGroup>,
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const row of registered) {
    map[row.adId] = row.leadCount
  }
  for (const row of unregistered) {
    map[row.adId] = row.leadCount
  }
  return map
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
  {
    items: MetaLeadFormItem[]
    settings: MetaLeadFormSettings
    leadCountByFormId: Record<string, number>
    unregisteredForms: MetaLeadFormCampaignGroup[]
    adItems: MetaLeadAdCampaignItem[]
    leadCountByAdId: Record<string, number>
    unregisteredAds: MetaLeadAdCampaignGroup[]
  },
  void,
  { rejectValue: string }
>("metaLeadForms/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const [items, settings, stats, adItems] = await Promise.all([
      listMetaLeadForms(),
      getMetaLeadFormSettings(),
      getMetaLeadFormStats(),
      listMetaLeadAdCampaigns(),
    ])
    return {
      items,
      settings,
      leadCountByFormId: buildLeadCountMap(stats.registered, stats.unregisteredForms),
      unregisteredForms: [...stats.unregisteredForms],
      adItems,
      leadCountByAdId: buildAdLeadCountMap(
        stats.registeredAds ?? [],
        stats.unregisteredAds ?? [],
      ),
      unregisteredAds: [...(stats.unregisteredAds ?? [])],
    }
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

export const saveMetaLeadAdCampaignThunk = createAsyncThunk<
  MetaLeadAdCampaignItem,
  void,
  { rejectValue: string }
>("metaLeadForms/saveAd", async (_, { getState, rejectWithValue }) => {
  const { adDraft, adEditingId } = (getState() as ThunkState).metaLeadForms
  const body: CreateMetaLeadAdCampaignBody | UpdateMetaLeadAdCampaignBody = {
    adId: adDraft.adId.trim(),
    adName: adDraft.adName.trim(),
    campaignId: adDraft.campaignId.trim() || undefined,
    campaignName: adDraft.campaignName.trim() || undefined,
    projectId: adDraft.projectId.trim(),
    projectTitle: adDraft.projectTitle.trim(),
    enabled: adDraft.enabled,
    notes: adDraft.notes.trim(),
  }
  try {
    if (adEditingId != null) {
      return await updateMetaLeadAdCampaign(adEditingId, body)
    }
    return await createMetaLeadAdCampaign(body as CreateMetaLeadAdCampaignBody)
  } catch (err) {
    return rejectWithValue(axiosMessage(err, s.adsSaveError))
  }
})

export const deleteMetaLeadAdCampaignThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("metaLeadForms/deleteAd", async (id, { rejectWithValue }) => {
  try {
    await deleteMetaLeadAdCampaign(id)
    return id
  } catch (err) {
    return rejectWithValue(axiosMessage(err, s.adsDeleteError))
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
    openCreateAdPanelAct(
      state,
      action: PayloadAction<Partial<MetaLeadAdCampaignDraft> | undefined>,
    ) {
      state.adPanelOpen = true
      state.adEditingId = null
      state.adDraft = { ...emptyAdDraft(), ...(action.payload ?? {}) }
      state.error = null
    },
    openEditAdPanelAct(state, action: PayloadAction<MetaLeadAdCampaignItem>) {
      const item = action.payload
      state.adPanelOpen = true
      state.adEditingId = item.id
      state.adDraft = {
        adId: item.adId,
        adName: item.adName,
        campaignId: item.campaignId ?? "",
        campaignName: item.campaignName ?? "",
        projectId: item.projectId,
        projectTitle: item.projectTitle,
        enabled: item.enabled,
        notes: item.notes,
      }
      state.error = null
    },
    closeAdPanelAct(state) {
      state.adPanelOpen = false
      state.adEditingId = null
      state.adDraft = emptyAdDraft()
    },
    patchAdDraftAct(state, action: PayloadAction<Partial<MetaLeadAdCampaignDraft>>) {
      state.adDraft = { ...state.adDraft, ...action.payload }
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
        state.leadCountByFormId = action.payload.leadCountByFormId
        state.unregisteredForms = action.payload.unregisteredForms
        state.adItems = action.payload.adItems
        state.leadCountByAdId = action.payload.leadCountByAdId
        state.unregisteredAds = action.payload.unregisteredAds
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
        const savedFormId = action.payload.formId
        state.unregisteredForms = state.unregisteredForms.filter(
          (row) => row.formId !== savedFormId,
        )
        if (state.leadCountByFormId[savedFormId] == null) {
          state.leadCountByFormId[savedFormId] = 0
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
      .addCase(saveMetaLeadAdCampaignThunk.pending, (state) => {
        state.adSaving = true
        state.error = null
      })
      .addCase(saveMetaLeadAdCampaignThunk.fulfilled, (state, action) => {
        state.adSaving = false
        state.adPanelOpen = false
        state.adEditingId = null
        state.adDraft = emptyAdDraft()
        state.notice = s.adsSaved
        const idx = state.adItems.findIndex((row) => row.id === action.payload.id)
        if (idx >= 0) {
          state.adItems[idx] = action.payload
        } else {
          state.adItems = [action.payload, ...state.adItems]
        }
        const savedAdId = action.payload.adId
        state.unregisteredAds = state.unregisteredAds.filter((row) => row.adId !== savedAdId)
        if (state.leadCountByAdId[savedAdId] == null) {
          state.leadCountByAdId[savedAdId] = 0
        }
      })
      .addCase(saveMetaLeadAdCampaignThunk.rejected, (state, action) => {
        state.adSaving = false
        state.error = action.payload ?? s.adsSaveError
      })
      .addCase(deleteMetaLeadAdCampaignThunk.fulfilled, (state, action) => {
        state.adItems = state.adItems.filter((row) => row.id !== action.payload)
        state.notice = s.adsDeleted
      })
      .addCase(deleteMetaLeadAdCampaignThunk.rejected, (state, action) => {
        state.error = action.payload ?? s.adsDeleteError
      })
  },
})

export const {
  openCreatePanelAct,
  openEditPanelAct,
  closePanelAct,
  patchDraftAct,
  openCreateAdPanelAct,
  openEditAdPanelAct,
  closeAdPanelAct,
  patchAdDraftAct,
  setDelayDraftMinutesAct,
  clearNoticeAct,
} = metaLeadFormsSlice.actions

export default metaLeadFormsSlice.reducer
