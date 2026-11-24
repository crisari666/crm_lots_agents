import { createAsyncThunk, createSlice, type Draft, type PayloadAction } from "@reduxjs/toolkit"
import { leadAssistantStrings as s } from "../../../i18n/locales/lead-assistant.strings"
import type { ProjectsState } from "../../project/slice/projects.state"
import {
  validateFaqDraft,
  type FaqField,
} from "../business-logic/lead-assistant-validation"
import {
  convertLeadUnansweredQuestion,
  createLeadFaq,
  deleteLeadFaq,
  dismissLeadUnansweredQuestion,
  getLeadAssistantErrorMessage,
  listLeadFaqs,
  listLeadUnansweredQuestions,
  updateLeadFaq,
} from "../services/lead-assistant.http"
import type {
  LeadAssistantLoadStatus,
  LeadFaq,
  LeadFaqBody,
  LeadFaqCategory,
  LeadFaqProjectAnswer,
  LeadUnansweredPage,
  LeadUnansweredQuestion,
} from "../types/lead-assistant.types"
import { fetchReadinessThunk, pushNoticeAct } from "./lead-assistant-setup.slice"

export const UNANSWERED_PAGE_SIZE = 10

export type FaqAnswerMode = "all" | "perProject"

export type FaqDraft = {
  question: string
  category: LeadFaqCategory | ""
  phrasingsText: string
  mode: FaqAnswerMode
  defaultAnswer: string
  projectAnswers: Record<string, string>
  enabled: boolean
}

export type LeadAssistantFaqState = {
  items: LeadFaq[]
  status: LeadAssistantLoadStatus
  error: string | null
  drawerOpen: boolean
  editingId: string | null
  convertingQuestionId: string | null
  draft: FaqDraft
  touched: Partial<Record<FaqField, boolean>>
  saving: boolean
  deleting: boolean
  saveErrorSummary: string[]
  saveFailedToken: number
  unanswered: LeadUnansweredPage
  unansweredStatus: LeadAssistantLoadStatus
  unansweredError: string | null
  unansweredBusyId: string | null
}

const emptyDraft = (): FaqDraft => ({
  question: "",
  category: "",
  phrasingsText: "",
  mode: "all",
  defaultAnswer: "",
  projectAnswers: {},
  enabled: true,
})

const initialState: LeadAssistantFaqState = {
  items: [],
  status: "idle",
  error: null,
  drawerOpen: false,
  editingId: null,
  convertingQuestionId: null,
  draft: emptyDraft(),
  touched: {},
  saving: false,
  deleting: false,
  saveErrorSummary: [],
  saveFailedToken: 0,
  unanswered: { items: [], total: 0, page: 0, limit: UNANSWERED_PAGE_SIZE },
  unansweredStatus: "idle",
  unansweredError: null,
  unansweredBusyId: null,
}

type ThunkState = {
  leadAssistant: { faq: LeadAssistantFaqState }
  projects: ProjectsState
}

type SaveRejection = { readonly message: string; readonly summary: string[] }

function toDraft(faq: LeadFaq): FaqDraft {
  return {
    question: faq.question,
    category: faq.category,
    phrasingsText: faq.alternativePhrasings.join("\n"),
    mode: faq.projectAnswers.length > 0 ? "perProject" : "all",
    defaultAnswer: faq.defaultAnswer ?? "",
    projectAnswers: Object.fromEntries(
      faq.projectAnswers.map((entry) => [entry.projectId, entry.answer] as const),
    ),
    enabled: faq.enabled,
  }
}

function resolveProjectTitle(
  projectId: string,
  state: ThunkState,
  existing: LeadFaq | undefined,
): string {
  const project = state.projects.projects.find((row) => row._id === projectId)
  if (project != null) {
    return project.title
  }
  return existing?.projectAnswers.find((entry) => entry.projectId === projectId)?.projectTitle ?? ""
}

function buildProjectAnswers(state: ThunkState, draft: FaqDraft): LeadFaqProjectAnswer[] {
  if (draft.mode === "all") {
    return []
  }
  const existing = state.leadAssistant.faq.items.find(
    (item) => item.id === state.leadAssistant.faq.editingId,
  )
  return Object.entries(draft.projectAnswers)
    .filter(([, answer]) => answer.trim().length > 0)
    .map(([projectId, answer]) => ({
      projectId,
      projectTitle: resolveProjectTitle(projectId, state, existing),
      answer: answer.trim(),
    }))
}

function buildFaqBody(state: ThunkState, draft: FaqDraft): LeadFaqBody {
  return {
    question: draft.question.trim(),
    category: draft.category as LeadFaqCategory,
    alternativePhrasings: draft.phrasingsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
    defaultAnswer: draft.defaultAnswer.trim(),
    projectAnswers: buildProjectAnswers(state, draft),
    enabled: draft.enabled,
  }
}

export const fetchFaqsThunk = createAsyncThunk<LeadFaq[], void, { rejectValue: string }>(
  "leadAssistant/faq/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await listLeadFaqs()
    } catch (err) {
      return rejectWithValue(getLeadAssistantErrorMessage(err, s.faqLoadError))
    }
  },
)

export const saveFaqThunk = createAsyncThunk<
  { faq: LeadFaq; convertedQuestionId: string | null },
  void,
  { rejectValue: SaveRejection }
>("leadAssistant/faq/save", async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState() as ThunkState
  const { draft, editingId, convertingQuestionId } = state.leadAssistant.faq
  const summary = Object.values(validateFaqDraft(draft, s.faqValidation))
  if (summary.length > 0) {
    return rejectWithValue({ message: s.saveSummaryTitle, summary })
  }
  const body = buildFaqBody(state, draft)
  try {
    if (convertingQuestionId != null) {
      const result = await convertLeadUnansweredQuestion(convertingQuestionId, body)
      dispatch(pushNoticeAct({ severity: "success", message: s.faqConverted }))
      void dispatch(fetchReadinessThunk())
      return { faq: result.faq, convertedQuestionId: convertingQuestionId }
    }
    const faq =
      editingId != null ? await updateLeadFaq(editingId, body) : await createLeadFaq(body)
    dispatch(pushNoticeAct({ severity: "success", message: s.faqSaved }))
    void dispatch(fetchReadinessThunk())
    return { faq, convertedQuestionId: null }
  } catch (err) {
    const message = getLeadAssistantErrorMessage(err, s.faqSaveError)
    return rejectWithValue({ message, summary: [message] })
  }
})

export const deleteFaqThunk = createAsyncThunk<string, string, { rejectValue: string }>(
  "leadAssistant/faq/delete",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await deleteLeadFaq(id)
      dispatch(pushNoticeAct({ severity: "success", message: s.faqDeleted }))
      void dispatch(fetchReadinessThunk())
      return id
    } catch (err) {
      const message = getLeadAssistantErrorMessage(err, s.faqDeleteError)
      dispatch(pushNoticeAct({ severity: "error", message }))
      return rejectWithValue(message)
    }
  },
)

export const fetchUnansweredThunk = createAsyncThunk<
  LeadUnansweredPage,
  number,
  { rejectValue: string }
>("leadAssistant/faq/fetchUnanswered", async (page, { rejectWithValue }) => {
  try {
    return await listLeadUnansweredQuestions({
      status: "open",
      page,
      limit: UNANSWERED_PAGE_SIZE,
    })
  } catch (err) {
    return rejectWithValue(getLeadAssistantErrorMessage(err, s.unansweredLoadError))
  }
})

export const dismissUnansweredThunk = createAsyncThunk<
  LeadUnansweredQuestion,
  string,
  { rejectValue: string }
>("leadAssistant/faq/dismissUnanswered", async (id, { dispatch, rejectWithValue }) => {
  try {
    const question = await dismissLeadUnansweredQuestion(id)
    dispatch(pushNoticeAct({ severity: "success", message: s.unansweredDismissed }))
    return question
  } catch (err) {
    const message = getLeadAssistantErrorMessage(err, s.unansweredDismissError)
    dispatch(pushNoticeAct({ severity: "error", message }))
    return rejectWithValue(message)
  }
})

export type OpenFromQuestionPayload = {
  readonly question: string
  readonly questionId?: string
}

function removeUnanswered(state: Draft<LeadAssistantFaqState>, id: string): void {
  const before = state.unanswered.items.length
  state.unanswered.items = state.unanswered.items.filter((item) => item.id !== id)
  if (state.unanswered.items.length < before) {
    state.unanswered.total = Math.max(0, state.unanswered.total - 1)
  }
}

const faqSlice = createSlice({
  name: "leadAssistantFaq",
  initialState,
  reducers: {
    openCreateDrawerAct(state) {
      state.drawerOpen = true
      state.editingId = null
      state.convertingQuestionId = null
      state.draft = emptyDraft()
      state.touched = {}
      state.saveErrorSummary = []
    },
    openEditDrawerAct(state, action: PayloadAction<LeadFaq>) {
      state.drawerOpen = true
      state.editingId = action.payload.id
      state.convertingQuestionId = null
      state.draft = toDraft(action.payload)
      state.touched = {}
      state.saveErrorSummary = []
    },
    openFromQuestionAct(state, action: PayloadAction<OpenFromQuestionPayload>) {
      state.drawerOpen = true
      state.editingId = null
      state.convertingQuestionId = action.payload.questionId ?? null
      state.draft = { ...emptyDraft(), question: action.payload.question }
      state.touched = {}
      state.saveErrorSummary = []
    },
    closeDrawerAct(state) {
      state.drawerOpen = false
      state.editingId = null
      state.convertingQuestionId = null
      state.draft = emptyDraft()
      state.touched = {}
      state.saveErrorSummary = []
    },
    patchDraftAct(state, action: PayloadAction<Partial<FaqDraft>>) {
      state.draft = { ...state.draft, ...action.payload }
    },
    patchProjectAnswerAct(
      state,
      action: PayloadAction<{ readonly projectId: string; readonly answer: string }>,
    ) {
      state.draft.projectAnswers[action.payload.projectId] = action.payload.answer
    },
    touchFieldAct(state, action: PayloadAction<FaqField>) {
      state.touched[action.payload] = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqsThunk.pending, (state) => {
        state.status = state.items.length === 0 ? "loading" : state.status
        state.error = null
      })
      .addCase(fetchFaqsThunk.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = "ready"
      })
      .addCase(fetchFaqsThunk.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload ?? s.faqLoadError
      })
      .addCase(saveFaqThunk.pending, (state) => {
        state.saving = true
        state.saveErrorSummary = []
      })
      .addCase(saveFaqThunk.fulfilled, (state, action) => {
        state.saving = false
        state.drawerOpen = false
        state.editingId = null
        state.convertingQuestionId = null
        state.draft = emptyDraft()
        state.touched = {}
        const index = state.items.findIndex((item) => item.id === action.payload.faq.id)
        if (index >= 0) {
          state.items[index] = action.payload.faq
        } else {
          state.items = [action.payload.faq, ...state.items]
        }
        if (action.payload.convertedQuestionId != null) {
          removeUnanswered(state, action.payload.convertedQuestionId)
        }
      })
      .addCase(saveFaqThunk.rejected, (state, action) => {
        state.saving = false
        state.saveErrorSummary = action.payload?.summary ?? [s.faqSaveError]
        state.saveFailedToken += 1
        state.touched = { question: true, category: true, answer: true }
      })
      .addCase(deleteFaqThunk.pending, (state) => {
        state.deleting = true
      })
      .addCase(deleteFaqThunk.fulfilled, (state, action) => {
        state.deleting = false
        state.drawerOpen = false
        state.editingId = null
        state.draft = emptyDraft()
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteFaqThunk.rejected, (state) => {
        state.deleting = false
      })
      .addCase(fetchUnansweredThunk.pending, (state) => {
        state.unansweredStatus = state.unanswered.items.length === 0 ? "loading" : state.unansweredStatus
        state.unansweredError = null
      })
      .addCase(fetchUnansweredThunk.fulfilled, (state, action) => {
        state.unanswered = action.payload
        state.unansweredStatus = "ready"
      })
      .addCase(fetchUnansweredThunk.rejected, (state, action) => {
        state.unansweredStatus = "failed"
        state.unansweredError = action.payload ?? s.unansweredLoadError
      })
      .addCase(dismissUnansweredThunk.pending, (state, action) => {
        state.unansweredBusyId = action.meta.arg
      })
      .addCase(dismissUnansweredThunk.fulfilled, (state, action) => {
        state.unansweredBusyId = null
        removeUnanswered(state, action.payload.id)
      })
      .addCase(dismissUnansweredThunk.rejected, (state) => {
        state.unansweredBusyId = null
      })
  },
})

export const {
  openCreateDrawerAct,
  openEditDrawerAct,
  openFromQuestionAct,
  closeDrawerAct,
  patchDraftAct,
  patchProjectAnswerAct,
  touchFieldAct,
} = faqSlice.actions

export default faqSlice.reducer
