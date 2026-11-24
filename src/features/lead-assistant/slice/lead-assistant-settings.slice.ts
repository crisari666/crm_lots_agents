import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { leadAssistantStrings as s } from "../../../i18n/locales/lead-assistant.strings"
import { updateMetaLeadForm } from "../../meta-lead-forms/services/meta-lead-forms.http"
import { listMetaLeadForms } from "../../meta-lead-forms/services/meta-lead-forms.http"
import type {
  MetaLeadFormFlowStrategy,
  MetaLeadFormItem,
} from "../../meta-lead-forms/types/meta-lead-forms.types"
import {
  validateIdentityDraft,
  type IdentityField,
} from "../business-logic/lead-assistant-validation"
import {
  getLeadAssistantErrorMessage,
  getLeadAssistantSettings,
  updateLeadAssistantSettings,
} from "../services/lead-assistant.http"
import type {
  LeadAssistantLoadStatus,
  LeadAssistantSettings,
  LeadFlowVersion,
  LeadPricePolicy,
  LeadTemplateRef,
  UpdateLeadAssistantSettingsBody,
} from "../types/lead-assistant.types"
import { fetchReadinessThunk, pushNoticeAct } from "./lead-assistant-setup.slice"

export type SettingsScope = "identity" | "activation"

export type SettingsDraft = {
  assistantName: string
  businessName: string
  greeting: string
  pricePolicy: LeadPricePolicy
  welcomeTemplate: LeadTemplateRef | null
  defaultInboundFlow: LeadFlowVersion
}

export type LeadAssistantSettingsState = {
  server: LeadAssistantSettings | null
  draft: SettingsDraft | null
  status: LeadAssistantLoadStatus
  error: string | null
  saving: boolean
  killSwitchSaving: boolean
  touched: Partial<Record<IdentityField, boolean>>
  saveErrorSummary: string[]
  saveFailedToken: number
  forms: MetaLeadFormItem[]
  formsStatus: LeadAssistantLoadStatus
  formsError: string | null
  formSavingId: string | null
}

const initialState: LeadAssistantSettingsState = {
  server: null,
  draft: null,
  status: "idle",
  error: null,
  saving: false,
  killSwitchSaving: false,
  touched: {},
  saveErrorSummary: [],
  saveFailedToken: 0,
  forms: [],
  formsStatus: "idle",
  formsError: null,
  formSavingId: null,
}

type ThunkState = { leadAssistant: { settings: LeadAssistantSettingsState } }

type SaveRejection = { readonly message: string; readonly summary: string[] }

function toDraft(server: LeadAssistantSettings): SettingsDraft {
  return {
    assistantName: server.assistantName,
    businessName: server.businessName,
    greeting: server.greeting,
    pricePolicy: server.pricePolicy,
    welcomeTemplate: server.welcomeTemplate ?? null,
    defaultInboundFlow: server.defaultInboundFlow,
  }
}

const isSameTemplate = (first: LeadTemplateRef | null, second: LeadTemplateRef | null): boolean =>
  JSON.stringify(first) === JSON.stringify(second)

function isIdentityChanged(server: SettingsDraft, draft: SettingsDraft): boolean {
  return (
    server.assistantName !== draft.assistantName ||
    server.businessName !== draft.businessName ||
    server.greeting !== draft.greeting ||
    server.pricePolicy !== draft.pricePolicy ||
    !isSameTemplate(server.welcomeTemplate, draft.welcomeTemplate)
  )
}

const isActivationChanged = (server: SettingsDraft, draft: SettingsDraft): boolean =>
  server.defaultInboundFlow !== draft.defaultInboundFlow

type SettingsSelectorState = { leadAssistant: { settings: LeadAssistantSettingsState } }

export function selectIsIdentityDirty(state: SettingsSelectorState): boolean {
  const { server, draft } = state.leadAssistant.settings
  return server != null && draft != null && isIdentityChanged(toDraft(server), draft)
}

export function selectIsActivationDirty(state: SettingsSelectorState): boolean {
  const { server, draft } = state.leadAssistant.settings
  return server != null && draft != null && isActivationChanged(toDraft(server), draft)
}

function buildScopeBody(
  scope: SettingsScope,
  draft: SettingsDraft,
): UpdateLeadAssistantSettingsBody {
  if (scope === "activation") {
    return { defaultInboundFlow: draft.defaultInboundFlow }
  }
  return {
    assistantName: draft.assistantName.trim(),
    businessName: draft.businessName.trim(),
    greeting: draft.greeting.trim(),
    pricePolicy: draft.pricePolicy,
    welcomeTemplate: draft.welcomeTemplate,
  }
}

function applyServerToScope(
  draft: SettingsDraft,
  server: LeadAssistantSettings,
  scope: SettingsScope,
): SettingsDraft {
  const fresh = toDraft(server)
  if (scope === "activation") {
    return { ...draft, defaultInboundFlow: fresh.defaultInboundFlow }
  }
  return {
    ...draft,
    assistantName: fresh.assistantName,
    businessName: fresh.businessName,
    greeting: fresh.greeting,
    pricePolicy: fresh.pricePolicy,
    welcomeTemplate: fresh.welcomeTemplate,
  }
}

export const fetchSettingsThunk = createAsyncThunk<
  LeadAssistantSettings,
  void,
  { rejectValue: string }
>("leadAssistant/settings/fetch", async (_, { rejectWithValue }) => {
  try {
    return await getLeadAssistantSettings()
  } catch (err) {
    return rejectWithValue(getLeadAssistantErrorMessage(err, s.settingsLoadError))
  }
})

export const saveSettingsThunk = createAsyncThunk<
  { settings: LeadAssistantSettings; scope: SettingsScope },
  SettingsScope,
  { rejectValue: SaveRejection }
>("leadAssistant/settings/save", async (scope, { getState, dispatch, rejectWithValue }) => {
  const { draft } = (getState() as ThunkState).leadAssistant.settings
  if (draft == null) {
    return rejectWithValue({ message: s.settingsSaveError, summary: [s.settingsSaveError] })
  }
  if (scope === "identity") {
    const errors = validateIdentityDraft(draft, s.identityValidation)
    const summary = Object.values(errors)
    if (summary.length > 0) {
      return rejectWithValue({ message: s.saveSummaryTitle, summary })
    }
  }
  try {
    const settings = await updateLeadAssistantSettings(buildScopeBody(scope, draft))
    dispatch(pushNoticeAct({ severity: "success", message: s.settingsSaved }))
    void dispatch(fetchReadinessThunk())
    return { settings, scope }
  } catch (err) {
    const message = getLeadAssistantErrorMessage(err, s.settingsSaveError)
    return rejectWithValue({ message, summary: [message] })
  }
})

export const setAssistantEnabledThunk = createAsyncThunk<
  LeadAssistantSettings,
  boolean,
  { rejectValue: string }
>("leadAssistant/settings/setEnabled", async (enabled, { dispatch, rejectWithValue }) => {
  try {
    const settings = await updateLeadAssistantSettings({ enabled })
    dispatch(
      pushNoticeAct({
        severity: "success",
        message: enabled ? s.killSwitchOnDone : s.killSwitchOffDone,
      }),
    )
    void dispatch(fetchReadinessThunk())
    return settings
  } catch (err) {
    const message = getLeadAssistantErrorMessage(err, s.settingsSaveError)
    dispatch(pushNoticeAct({ severity: "error", message }))
    return rejectWithValue(message)
  }
})

export const fetchActivationFormsThunk = createAsyncThunk<
  MetaLeadFormItem[],
  void,
  { rejectValue: string }
>("leadAssistant/settings/fetchForms", async (_, { rejectWithValue }) => {
  try {
    return await listMetaLeadForms()
  } catch (err) {
    return rejectWithValue(getLeadAssistantErrorMessage(err, s.formsLoadError))
  }
})

export const setFormFlowThunk = createAsyncThunk<
  MetaLeadFormItem,
  { readonly id: string; readonly flowStrategy: MetaLeadFormFlowStrategy },
  { rejectValue: string }
>("leadAssistant/settings/setFormFlow", async (input, { dispatch, rejectWithValue }) => {
  try {
    const item = await updateMetaLeadForm(input.id, { flowStrategy: input.flowStrategy })
    dispatch(pushNoticeAct({ severity: "success", message: s.formFlowSaved }))
    void dispatch(fetchReadinessThunk())
    return item
  } catch (err) {
    const message = getLeadAssistantErrorMessage(err, s.formFlowError)
    dispatch(pushNoticeAct({ severity: "error", message }))
    return rejectWithValue(message)
  }
})

const settingsSlice = createSlice({
  name: "leadAssistantSettings",
  initialState,
  reducers: {
    patchDraftAct(state, action: PayloadAction<Partial<SettingsDraft>>) {
      if (state.draft != null) {
        state.draft = { ...state.draft, ...action.payload }
      }
    },
    touchFieldAct(state, action: PayloadAction<IdentityField>) {
      state.touched[action.payload] = true
    },
    discardScopeAct(state, action: PayloadAction<SettingsScope>) {
      if (state.server != null && state.draft != null) {
        state.draft = applyServerToScope(state.draft, state.server, action.payload)
      }
      state.touched = {}
      state.saveErrorSummary = []
    },
    clearSaveErrorsAct(state) {
      state.saveErrorSummary = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettingsThunk.pending, (state) => {
        state.status = state.server == null ? "loading" : state.status
        state.error = null
      })
      .addCase(fetchSettingsThunk.fulfilled, (state, action) => {
        state.server = action.payload
        state.draft = state.draft ?? toDraft(action.payload)
        state.status = "ready"
      })
      .addCase(fetchSettingsThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload ?? s.settingsLoadError
      })
      .addCase(saveSettingsThunk.pending, (state) => {
        state.saving = true
        state.saveErrorSummary = []
      })
      .addCase(saveSettingsThunk.fulfilled, (state, action) => {
        state.saving = false
        state.server = action.payload.settings
        if (state.draft != null) {
          state.draft = applyServerToScope(state.draft, action.payload.settings, action.payload.scope)
        }
        state.touched = {}
      })
      .addCase(saveSettingsThunk.rejected, (state, action) => {
        state.saving = false
        state.saveErrorSummary = action.payload?.summary ?? [s.settingsSaveError]
        state.saveFailedToken += 1
        state.touched = { assistantName: true, businessName: true, greeting: true }
      })
      .addCase(setAssistantEnabledThunk.pending, (state) => {
        state.killSwitchSaving = true
      })
      .addCase(setAssistantEnabledThunk.fulfilled, (state, action) => {
        state.killSwitchSaving = false
        state.server = action.payload
      })
      .addCase(setAssistantEnabledThunk.rejected, (state) => {
        state.killSwitchSaving = false
      })
      .addCase(fetchActivationFormsThunk.pending, (state) => {
        state.formsStatus = state.forms.length === 0 ? "loading" : state.formsStatus
        state.formsError = null
      })
      .addCase(fetchActivationFormsThunk.fulfilled, (state, action) => {
        state.forms = action.payload
        state.formsStatus = "ready"
      })
      .addCase(fetchActivationFormsThunk.rejected, (state, action) => {
        state.formsStatus = "failed"
        state.formsError = action.payload ?? s.formsLoadError
      })
      .addCase(setFormFlowThunk.pending, (state, action) => {
        state.formSavingId = action.meta.arg.id
      })
      .addCase(setFormFlowThunk.fulfilled, (state, action) => {
        state.formSavingId = null
        state.forms = state.forms.map((form) =>
          form.id === action.payload.id ? action.payload : form,
        )
      })
      .addCase(setFormFlowThunk.rejected, (state) => {
        state.formSavingId = null
      })
  },
})

export const { patchDraftAct, touchFieldAct, discardScopeAct, clearSaveErrorsAct } =
  settingsSlice.actions

export default settingsSlice.reducer
