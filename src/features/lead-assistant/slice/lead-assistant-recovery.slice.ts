import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { leadAssistantStrings as s } from "../../../i18n/locales/lead-assistant.strings"
import { formatOffsetHours, sortByOffset } from "../business-logic/recovery-axis-layout"
import {
  hasOffsetConflict,
  validateRecoveryStep,
  type RecoveryStepField,
} from "../business-logic/lead-assistant-validation"
import {
  getLeadAssistantErrorMessage,
  getLeadRecoverySequence,
  replaceLeadRecoverySequence,
} from "../services/lead-assistant.http"
import type {
  LeadAssistantLoadStatus,
  LeadRecoveryStep,
  LeadRecoveryStepBody,
  LeadTemplateRef,
} from "../types/lead-assistant.types"
import { fetchReadinessThunk, pushNoticeAct } from "./lead-assistant-setup.slice"

export const RECOMMENDED_RECOVERY_OFFSETS_HOURS: readonly number[] = [48, 96, 168]
const HOURS_IN_DAY = 24
const MAX_OFFSET_HOURS = 720

export type RecoveryStepDraft = {
  key: string
  id?: string
  label: string
  offsetHours: number
  enabled: boolean
  template: LeadTemplateRef | null
  sentCount: number
  repliedCount: number
}

export type LeadAssistantRecoveryState = {
  serverSteps: LeadRecoveryStep[]
  steps: RecoveryStepDraft[]
  status: LeadAssistantLoadStatus
  error: string | null
  saving: boolean
  drawerOpen: boolean
  isNewStep: boolean
  stepDraft: RecoveryStepDraft
  stepTouched: Partial<Record<RecoveryStepField, boolean>>
  stepError: string | null
  saveErrorSummary: string[]
  saveFailedToken: number
}

let temporaryStepCounter = 0

function createTemporaryKey(): string {
  temporaryStepCounter += 1
  return `new-${temporaryStepCounter}`
}

function createEmptyStepDraft(offsetHours: number): RecoveryStepDraft {
  return {
    key: createTemporaryKey(),
    label: s.recoveryDefaultLabel(formatOffsetHours(offsetHours)),
    offsetHours,
    enabled: true,
    template: null,
    sentCount: 0,
    repliedCount: 0,
  }
}

const initialState: LeadAssistantRecoveryState = {
  serverSteps: [],
  steps: [],
  status: "idle",
  error: null,
  saving: false,
  drawerOpen: false,
  isNewStep: true,
  stepDraft: createEmptyStepDraft(HOURS_IN_DAY * 2),
  stepTouched: {},
  stepError: null,
  saveErrorSummary: [],
  saveFailedToken: 0,
}

type ThunkState = { leadAssistant: { recovery: LeadAssistantRecoveryState } }

type SaveRejection = { readonly message: string; readonly summary: string[] }

function toDraftStep(step: LeadRecoveryStep): RecoveryStepDraft {
  return {
    key: step.id,
    id: step.id,
    label: step.label,
    offsetHours: step.offsetHours,
    enabled: step.enabled,
    template: step.template,
    sentCount: step.sentCount,
    repliedCount: step.repliedCount,
  }
}

function toComparable(steps: readonly { id?: string; label: string; offsetHours: number; enabled: boolean; template: LeadTemplateRef | null }[]): string {
  return JSON.stringify(
    sortByOffset(steps).map((step) => ({
      id: step.id ?? null,
      label: step.label,
      offsetHours: step.offsetHours,
      enabled: step.enabled,
      template: step.template,
    })),
  )
}

export function selectIsRecoveryDirty(state: {
  leadAssistant: { recovery: LeadAssistantRecoveryState }
}): boolean {
  const { serverSteps, steps } = state.leadAssistant.recovery
  return (
    toComparable(serverSteps.map((step) => toDraftStep(step))) !== toComparable(steps)
  )
}

function suggestNextOffsetHours(steps: readonly RecoveryStepDraft[]): number {
  const last = steps.reduce((max, step) => Math.max(max, step.offsetHours), 0)
  return Math.min(MAX_OFFSET_HOURS, Math.max(HOURS_IN_DAY * 2, last + HOURS_IN_DAY * 2))
}

function collectSaveProblems(steps: readonly RecoveryStepDraft[]): string[] {
  const problems: string[] = []
  steps.forEach((step) => {
    const label = step.label.trim().length > 0 ? step.label : formatOffsetHours(step.offsetHours)
    const fieldErrors = Object.values(validateRecoveryStep(step, s.recoveryValidation))
    fieldErrors.forEach((message) => problems.push(`${label}: ${message}`))
    if (step.template == null) {
      problems.push(`${label}: ${s.recoveryTemplateRequired}`)
    }
    if (hasOffsetConflict(steps, step)) {
      problems.push(`${label}: ${s.recoveryOffsetDuplicated}`)
    }
  })
  return [...new Set(problems)]
}

function toStepBody(step: RecoveryStepDraft): LeadRecoveryStepBody {
  return {
    ...(step.id != null ? { id: step.id } : {}),
    label: step.label.trim(),
    offsetHours: step.offsetHours,
    enabled: step.enabled,
    template: step.template as LeadTemplateRef,
  }
}

export const fetchRecoveryThunk = createAsyncThunk<
  LeadRecoveryStep[],
  void,
  { rejectValue: string }
>("leadAssistant/recovery/fetch", async (_, { rejectWithValue }) => {
  try {
    const sequence = await getLeadRecoverySequence()
    return [...sequence.steps]
  } catch (err) {
    return rejectWithValue(getLeadAssistantErrorMessage(err, s.recoveryLoadError))
  }
})

export const saveRecoveryThunk = createAsyncThunk<
  LeadRecoveryStep[],
  void,
  { rejectValue: SaveRejection }
>("leadAssistant/recovery/save", async (_, { getState, dispatch, rejectWithValue }) => {
  const { steps } = (getState() as ThunkState).leadAssistant.recovery
  const summary = collectSaveProblems(steps)
  if (summary.length > 0) {
    return rejectWithValue({ message: s.saveSummaryTitle, summary })
  }
  try {
    const sequence = await replaceLeadRecoverySequence(sortByOffset(steps).map(toStepBody))
    dispatch(pushNoticeAct({ severity: "success", message: s.recoverySaved }))
    void dispatch(fetchReadinessThunk())
    return [...sequence.steps]
  } catch (err) {
    const message = getLeadAssistantErrorMessage(err, s.recoverySaveError)
    return rejectWithValue({ message, summary: [message] })
  }
})

const recoverySlice = createSlice({
  name: "leadAssistantRecovery",
  initialState,
  reducers: {
    seedRecommendedStepsAct(state) {
      state.steps = RECOMMENDED_RECOVERY_OFFSETS_HOURS.map((offsetHours) =>
        createEmptyStepDraft(offsetHours),
      )
    },
    openCreateStepAct(state) {
      state.drawerOpen = true
      state.isNewStep = true
      state.stepDraft = createEmptyStepDraft(suggestNextOffsetHours(state.steps))
      state.stepTouched = {}
      state.stepError = null
    },
    openEditStepAct(state, action: PayloadAction<string>) {
      const step = state.steps.find((row) => row.key === action.payload)
      if (step == null) {
        return
      }
      state.drawerOpen = true
      state.isNewStep = false
      state.stepDraft = { ...step }
      state.stepTouched = {}
      state.stepError = null
    },
    closeStepDrawerAct(state) {
      state.drawerOpen = false
      state.stepTouched = {}
      state.stepError = null
    },
    patchDraftAct(state, action: PayloadAction<Partial<RecoveryStepDraft>>) {
      state.stepDraft = { ...state.stepDraft, ...action.payload }
      state.stepError = null
    },
    touchFieldAct(state, action: PayloadAction<RecoveryStepField>) {
      state.stepTouched[action.payload] = true
    },
    applyStepDraftAct(state) {
      const errors = validateRecoveryStep(state.stepDraft, s.recoveryValidation)
      const hasConflict = hasOffsetConflict(state.steps, state.stepDraft)
      if (Object.keys(errors).length > 0 || hasConflict) {
        state.stepTouched = { label: true, offset: true }
        state.stepError = hasConflict ? s.recoveryOffsetDuplicated : null
        return
      }
      const exists = state.steps.some((step) => step.key === state.stepDraft.key)
      state.steps = exists
        ? state.steps.map((step) => (step.key === state.stepDraft.key ? state.stepDraft : step))
        : [...state.steps, state.stepDraft]
      state.drawerOpen = false
      state.stepTouched = {}
      state.stepError = null
    },
    removeStepAct(state, action: PayloadAction<string>) {
      state.steps = state.steps.filter((step) => step.key !== action.payload)
      state.drawerOpen = false
    },
    toggleStepEnabledAct(state, action: PayloadAction<string>) {
      const step = state.steps.find((row) => row.key === action.payload)
      if (step != null) {
        step.enabled = !step.enabled
      }
    },
    discardChangesAct(state) {
      state.steps = state.serverSteps.map(toDraftStep)
      state.saveErrorSummary = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecoveryThunk.pending, (state) => {
        state.status = state.serverSteps.length === 0 && state.steps.length === 0 ? "loading" : state.status
        state.error = null
      })
      .addCase(fetchRecoveryThunk.fulfilled, (state, action) => {
        state.serverSteps = action.payload
        state.steps = action.payload.map(toDraftStep)
        state.status = "ready"
      })
      .addCase(fetchRecoveryThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload ?? s.recoveryLoadError
      })
      .addCase(saveRecoveryThunk.pending, (state) => {
        state.saving = true
        state.saveErrorSummary = []
      })
      .addCase(saveRecoveryThunk.fulfilled, (state, action) => {
        state.saving = false
        state.serverSteps = action.payload
        state.steps = action.payload.map(toDraftStep)
      })
      .addCase(saveRecoveryThunk.rejected, (state, action) => {
        state.saving = false
        state.saveErrorSummary = action.payload?.summary ?? [s.recoverySaveError]
        state.saveFailedToken += 1
      })
  },
})

export const {
  seedRecommendedStepsAct,
  openCreateStepAct,
  openEditStepAct,
  closeStepDrawerAct,
  patchDraftAct,
  touchFieldAct,
  applyStepDraftAct,
  removeStepAct,
  toggleStepEnabledAct,
  discardChangesAct,
} = recoverySlice.actions

export default recoverySlice.reducer
