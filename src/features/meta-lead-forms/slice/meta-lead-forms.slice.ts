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
  MetaLeadAdCampaignNestedAd,
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
  campaignId: string
  campaignName: string
  projectId: string
  projectTitle: string
  adId: string
  adName: string
  enabled: boolean
  notes: string
  previewAds: MetaLeadAdCampaignNestedAd[]
}

export type MetaLeadFormsState = {
  items: MetaLeadFormItem[]
  settings: MetaLeadFormSettings | null
  leadCountByFormId: Record<string, number>
  unregisteredForms: MetaLeadFormCampaignGroup[]
  adItems: MetaLeadAdCampaignItem[]
  leadCountByCampaignId: Record<string, number>
  adsByCampaignId: Record<string, MetaLeadAdCampaignNestedAd[]>
  unregisteredCampaigns: MetaLeadAdCampaignGroup[]
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
  campaignId: "",
  campaignName: "",
  projectId: "",
  projectTitle: "",
  adId: "",
  adName: "",
  enabled: true,
  notes: "",
  previewAds: [],
})

const initialState: MetaLeadFormsState = {
  items: [],
  settings: null,
  leadCountByFormId: {},
  unregisteredForms: [],
  adItems: [],
  leadCountByCampaignId: {},
  adsByCampaignId: {},
  unregisteredCampaigns: [],
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

function buildCampaignLeadCountMap(
  registered: ReadonlyArray<{ readonly campaignId: string; readonly leadCount: number }>,
  unregistered: ReadonlyArray<MetaLeadAdCampaignGroup>,
): Record<string, number> {
  const map: Record<string, number> = {}
  for (const row of registered) {
    map[row.campaignId] = row.leadCount
  }
  for (const row of unregistered) {
    map[row.campaignId] = row.leadCount
  }
  return map
}

function buildAdsByCampaignIdMap(
  registered: ReadonlyArray<{
    readonly campaignId: string
    readonly ads: readonly MetaLeadAdCampaignNestedAd[]
  }>,
  unregistered: ReadonlyArray<MetaLeadAdCampaignGroup>,
): Record<string, MetaLeadAdCampaignNestedAd[]> {
  const map: Record<string, MetaLeadAdCampaignNestedAd[]> = {}
  for (const row of registered) {
    map[row.campaignId] = [...row.ads]
  }
  for (const row of unregistered) {
    map[row.campaignId] = [...row.ads]
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
    leadCountByCampaignId: Record<string, number>
    adsByCampaignId: Record<string, MetaLeadAdCampaignNestedAd[]>
    unregisteredCampaigns: MetaLeadAdCampaignGroup[]
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
    const registeredCampaigns = stats.registeredCampaigns ?? []
    const unregisteredCampaigns = (stats.unregisteredCampaigns ?? []).map((row) => ({
      ...row,
      ads: [...row.ads],
    }))
    return {
      items,
      settings,
      leadCountByFormId: buildLeadCountMap(stats.registered, stats.unregisteredForms),
      unregisteredForms: [...stats.unregisteredForms],
      adItems,
      leadCountByCampaignId: buildCampaignLeadCountMap(
        registeredCampaigns,
        unregisteredCampaigns,
      ),
      adsByCampaignId: buildAdsByCampaignIdMap(registeredCampaigns, unregisteredCampaigns),
      unregisteredCampaigns,
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
    campaignId: adDraft.campaignId.trim(),
    campaignName: adDraft.campaignName.trim(),
    projectId: adDraft.projectId.trim(),
    projectTitle: adDraft.projectTitle.trim(),
    adId: adDraft.adId.trim() || undefined,
    adName: adDraft.adName.trim() || undefined,
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
      const payload = action.payload ?? {}
      state.adDraft = {
        ...emptyAdDraft(),
        ...payload,
        previewAds: [...(payload.previewAds ?? [])],
      }
      state.error = null
    },
    openEditAdPanelAct(state, action: PayloadAction<MetaLeadAdCampaignItem>) {
      const item = action.payload
      state.adPanelOpen = true
      state.adEditingId = item.id
      state.adDraft = {
        campaignId: item.campaignId,
        campaignName: item.campaignName,
        projectId: item.projectId,
        projectTitle: item.projectTitle,
        adId: item.adId ?? "",
        adName: item.adName ?? "",
        enabled: item.enabled,
        notes: item.notes,
        previewAds: [...(state.adsByCampaignId[item.campaignId] ?? [])],
      }
      state.error = null
    },
    closeAdPanelAct(state) {
      state.adPanelOpen = false
      state.adEditingId = null
      state.adDraft = emptyAdDraft()
    },
    patchAdDraftAct(state, action: PayloadAction<Partial<MetaLeadAdCampaignDraft>>) {
      const next = { ...state.adDraft, ...action.payload }
      if (action.payload.previewAds != null) {
        next.previewAds = [...action.payload.previewAds]
      }
      state.adDraft = next
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
        state.leadCountByCampaignId = action.payload.leadCountByCampaignId
        state.adsByCampaignId = action.payload.adsByCampaignId
        state.unregisteredCampaigns = action.payload.unregisteredCampaigns
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
        const savedCampaignId = action.payload.campaignId
        state.unregisteredCampaigns = state.unregisteredCampaigns.filter(
          (row) => row.campaignId !== savedCampaignId,
        )
        if (state.leadCountByCampaignId[savedCampaignId] == null) {
          state.leadCountByCampaignId[savedCampaignId] = 0
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
