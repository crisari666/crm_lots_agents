import type {
  JobCampaignAdminItem,
  JobCampaignCandidateItem,
  JobCampaignCandidateSort,
  JobCampaignInterviewItem,
} from "../types/job-campaign.types"

export type JobCampaignState = {
  items: JobCampaignAdminItem[]
  itemsLoading: boolean
  itemsError: string | null
  selectedCampaignId: string | null
  selectedCampaign: JobCampaignAdminItem | null
  candidates: JobCampaignCandidateItem[]
  candidatesLoading: boolean
  candidatesError: string | null
  selectedCandidate: JobCampaignCandidateItem | null
  candidateSort: JobCampaignCandidateSort
  rescoreStatus: "idle" | "loading" | "failed"
  interviews: JobCampaignInterviewItem[]
  interviewsLoading: boolean
  interviewsError: string | null
  createStatus: "idle" | "loading" | "succeeded" | "failed"
  createError: string | null
  detailTab: number
}

export const initialJobCampaignState: JobCampaignState = {
  items: [],
  itemsLoading: false,
  itemsError: null,
  selectedCampaignId: null,
  selectedCampaign: null,
  candidates: [],
  candidatesLoading: false,
  candidatesError: null,
  selectedCandidate: null,
  candidateSort: "recent",
  rescoreStatus: "idle",
  interviews: [],
  interviewsLoading: false,
  interviewsError: null,
  createStatus: "idle",
  createError: null,
  detailTab: 0,
}
