import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import {
  activateJobCampaignReq,
  assignJobCampaignInterviewReq,
  cancelJobCampaignInterviewReq,
  createJobCampaignInterviewReq,
  createJobCampaignCandidateReq,
  createJobCampaignReq,
  updateJobCampaignCandidateReq,
  fetchJobCampaignCandidateReq,
  fetchJobCampaignCandidatesReq,
  fetchJobCampaignInterviewsReq,
  fetchJobCampaignReq,
  fetchJobCampaignsReq,
  promoteJobCampaignCandidateReq,
  rejectJobCampaignCandidateReq,
  rescoreJobCampaignCandidateReq,
  retryJobCampaignVoiceReq,
  startJobCampaignWhatsappReq,
  updateJobCampaignReq,
} from "../services/job-campaign-admin.service"
import type {
  CreateJobCampaignBody,
  CreateJobCampaignCandidateBody,
  CreateJobCampaignInterviewBody,
  JobCampaignAdminItem,
  JobCampaignCandidateItem,
  JobCampaignCandidateSort,
  UpdateJobCampaignBody,
  UpdateJobCampaignCandidateBody,
} from "../types/job-campaign.types"
import {
  initialJobCampaignState,
  type JobCampaignState,
} from "./job-campaign.state"

export const fetchJobCampaignsThunk = createAsyncThunk(
  "jobCampaign/fetchAll",
  async () => fetchJobCampaignsReq(),
)

export const fetchJobCampaignDetailThunk = createAsyncThunk(
  "jobCampaign/fetchDetail",
  async (id: string) => fetchJobCampaignReq(id),
)

export const createJobCampaignThunk = createAsyncThunk(
  "jobCampaign/create",
  async (body: CreateJobCampaignBody) => createJobCampaignReq(body),
)

export const updateJobCampaignThunk = createAsyncThunk(
  "jobCampaign/update",
  async (input: { readonly id: string; readonly body: UpdateJobCampaignBody }) =>
    updateJobCampaignReq(input.id, input.body),
)

export const activateJobCampaignThunk = createAsyncThunk(
  "jobCampaign/activate",
  async (id: string) => activateJobCampaignReq(id),
)

export const fetchJobCampaignCandidatesThunk = createAsyncThunk<
  JobCampaignCandidateItem[],
  { readonly campaignId: string; readonly status?: string },
  { state: RootState }
>("jobCampaign/fetchCandidates", async (input, { getState }) =>
  fetchJobCampaignCandidatesReq(
    input.campaignId,
    input.status,
    getState().jobCampaign.candidateSort,
  ),
)

export const rescoreJobCampaignCandidateThunk = createAsyncThunk(
  "jobCampaign/rescoreCandidate",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
  }) => rescoreJobCampaignCandidateReq(input.campaignId, input.candidateId),
)

export const createJobCampaignCandidateThunk = createAsyncThunk(
  "jobCampaign/createCandidate",
  async (input: {
    readonly campaignId: string
    readonly body: CreateJobCampaignCandidateBody
  }) => createJobCampaignCandidateReq(input.campaignId, input.body),
)

export const updateJobCampaignCandidateThunk = createAsyncThunk(
  "jobCampaign/updateCandidate",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
    readonly body: UpdateJobCampaignCandidateBody
  }) =>
    updateJobCampaignCandidateReq(
      input.campaignId,
      input.candidateId,
      input.body,
    ),
)

export const fetchJobCampaignCandidateThunk = createAsyncThunk(
  "jobCampaign/fetchCandidate",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
  }) => fetchJobCampaignCandidateReq(input.campaignId, input.candidateId),
)

export const promoteJobCampaignCandidateThunk = createAsyncThunk(
  "jobCampaign/promoteCandidate",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
  }) => promoteJobCampaignCandidateReq(input.campaignId, input.candidateId),
)

export const retryJobCampaignVoiceThunk = createAsyncThunk(
  "jobCampaign/retryVoice",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
  }) => retryJobCampaignVoiceReq(input.campaignId, input.candidateId),
)

export const startJobCampaignWhatsappThunk = createAsyncThunk(
  "jobCampaign/startWhatsapp",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
  }) => startJobCampaignWhatsappReq(input.campaignId, input.candidateId),
)

export const rejectJobCampaignCandidateThunk = createAsyncThunk(
  "jobCampaign/rejectCandidate",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
  }) => rejectJobCampaignCandidateReq(input.campaignId, input.candidateId),
)

export const assignJobCampaignInterviewThunk = createAsyncThunk(
  "jobCampaign/assignInterview",
  async (input: {
    readonly campaignId: string
    readonly candidateId: string
  }) => assignJobCampaignInterviewReq(input.campaignId, input.candidateId),
)

export const fetchJobCampaignInterviewsThunk = createAsyncThunk(
  "jobCampaign/fetchInterviews",
  async (campaignId: string) => fetchJobCampaignInterviewsReq(campaignId),
)

export const createJobCampaignInterviewThunk = createAsyncThunk(
  "jobCampaign/createInterview",
  async (input: {
    readonly campaignId: string
    readonly body: CreateJobCampaignInterviewBody
  }) => createJobCampaignInterviewReq(input.campaignId, input.body),
)

export const cancelJobCampaignInterviewThunk = createAsyncThunk(
  "jobCampaign/cancelInterview",
  async (interviewId: string) => cancelJobCampaignInterviewReq(interviewId),
)

const jobCampaignSlice = createSlice({
  name: "jobCampaign",
  initialState: initialJobCampaignState,
  reducers: {
    selectJobCampaignAct: (state, action: PayloadAction<string | null>) => {
      state.selectedCampaignId = action.payload
      if (action.payload == null) {
        state.selectedCampaign = null
        state.candidates = []
        state.selectedCandidate = null
        state.interviews = []
      }
    },
    setJobCampaignDetailTabAct: (state, action: PayloadAction<number>) => {
      state.detailTab = action.payload
    },
    clearSelectedCandidateAct: (state) => {
      state.selectedCandidate = null
    },
    setJobCampaignCandidateSortAct: (
      state,
      action: PayloadAction<JobCampaignCandidateSort>,
    ) => {
      state.candidateSort = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobCampaignsThunk.pending, (state) => {
        state.itemsLoading = true
        state.itemsError = null
      })
      .addCase(fetchJobCampaignsThunk.fulfilled, (state, action) => {
        state.itemsLoading = false
        state.items = action.payload
      })
      .addCase(fetchJobCampaignsThunk.rejected, (state, action) => {
        state.itemsLoading = false
        state.itemsError = action.error.message ?? "Error al cargar campañas"
      })
      .addCase(fetchJobCampaignDetailThunk.fulfilled, (state, action) => {
        state.selectedCampaign = action.payload
        if (action.payload != null) {
          state.selectedCampaignId = action.payload.id
          const idx = state.items.findIndex((c) => c.id === action.payload!.id)
          if (idx >= 0) state.items[idx] = action.payload
        }
      })
      .addCase(createJobCampaignThunk.pending, (state) => {
        state.createStatus = "loading"
        state.createError = null
      })
      .addCase(createJobCampaignThunk.fulfilled, (state, action) => {
        state.createStatus = action.payload != null ? "succeeded" : "failed"
        if (action.payload != null) {
          state.items = [action.payload, ...state.items]
        } else {
          state.createError = "No se pudo crear la campaña"
        }
      })
      .addCase(createJobCampaignThunk.rejected, (state, action) => {
        state.createStatus = "failed"
        state.createError = action.error.message ?? "Error al crear"
      })
      .addCase(updateJobCampaignThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        upsertCampaign(state, action.payload)
      })
      .addCase(activateJobCampaignThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.items = state.items.map((c) => ({
          ...c,
          isActive: c.id === action.payload!.id,
        }))
        upsertCampaign(state, { ...action.payload, isActive: true })
      })
      .addCase(fetchJobCampaignCandidatesThunk.pending, (state) => {
        state.candidatesLoading = true
        state.candidatesError = null
      })
      .addCase(fetchJobCampaignCandidatesThunk.fulfilled, (state, action) => {
        state.candidatesLoading = false
        state.candidates = action.payload
      })
      .addCase(fetchJobCampaignCandidatesThunk.rejected, (state, action) => {
        state.candidatesLoading = false
        state.candidatesError =
          action.error.message ?? "Error al cargar candidatos"
      })
      .addCase(updateJobCampaignCandidateThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.selectedCandidate = action.payload
        replaceCandidate(state, action.payload)
      })
      .addCase(createJobCampaignCandidateThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.candidates = [action.payload, ...state.candidates]
        state.selectedCandidate = action.payload
      })
      .addCase(fetchJobCampaignCandidateThunk.fulfilled, (state, action) => {
        state.selectedCandidate = action.payload
        if (action.payload != null) replaceCandidate(state, action.payload)
      })
      .addCase(promoteJobCampaignCandidateThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.selectedCandidate = action.payload.candidate
        replaceCandidate(state, action.payload.candidate)
      })
      .addCase(retryJobCampaignVoiceThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.selectedCandidate = action.payload.candidate
        replaceCandidate(state, action.payload.candidate)
      })
      .addCase(startJobCampaignWhatsappThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.selectedCandidate = action.payload.candidate
        replaceCandidate(state, action.payload.candidate)
      })
      .addCase(rejectJobCampaignCandidateThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.selectedCandidate = action.payload
        replaceCandidate(state, action.payload)
      })
      .addCase(rescoreJobCampaignCandidateThunk.pending, (state) => {
        state.rescoreStatus = "loading"
      })
      .addCase(rescoreJobCampaignCandidateThunk.fulfilled, (state, action) => {
        state.rescoreStatus = action.payload != null ? "idle" : "failed"
        if (action.payload == null) return
        state.selectedCandidate = action.payload
        replaceCandidate(state, action.payload)
      })
      .addCase(rescoreJobCampaignCandidateThunk.rejected, (state) => {
        state.rescoreStatus = "failed"
      })
      .addCase(assignJobCampaignInterviewThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.selectedCandidate = action.payload
        replaceCandidate(state, action.payload)
      })
      .addCase(fetchJobCampaignInterviewsThunk.pending, (state) => {
        state.interviewsLoading = true
        state.interviewsError = null
      })
      .addCase(fetchJobCampaignInterviewsThunk.fulfilled, (state, action) => {
        state.interviewsLoading = false
        state.interviews = action.payload
      })
      .addCase(fetchJobCampaignInterviewsThunk.rejected, (state, action) => {
        state.interviewsLoading = false
        state.interviewsError =
          action.error.message ?? "Error al cargar entrevistas"
      })
      .addCase(createJobCampaignInterviewThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.interviews = [...state.interviews, action.payload].sort((a, b) =>
          a.scheduledAt.localeCompare(b.scheduledAt),
        )
      })
      .addCase(cancelJobCampaignInterviewThunk.fulfilled, (state, action) => {
        if (action.payload == null) return
        state.interviews = state.interviews.map((i) =>
          i.id === action.payload!.id ? action.payload! : i,
        )
      })
  },
})

function upsertCampaign(
  state: JobCampaignState,
  campaign: JobCampaignAdminItem,
): void {
  const idx = state.items.findIndex((c) => c.id === campaign.id)
  if (idx >= 0) state.items[idx] = campaign
  else state.items = [campaign, ...state.items]
  if (state.selectedCampaignId === campaign.id) {
    state.selectedCampaign = campaign
  }
}

function replaceCandidate(
  state: JobCampaignState,
  candidate: JobCampaignCandidateItem,
): void {
  state.candidates = state.candidates.map((c) =>
    c.id === candidate.id ? candidate : c,
  )
}

export const {
  selectJobCampaignAct,
  setJobCampaignDetailTabAct,
  clearSelectedCandidateAct,
  setJobCampaignCandidateSortAct,
} = jobCampaignSlice.actions

export const selectJobCampaignState = (state: RootState): JobCampaignState =>
  state.jobCampaign

export default jobCampaignSlice.reducer
