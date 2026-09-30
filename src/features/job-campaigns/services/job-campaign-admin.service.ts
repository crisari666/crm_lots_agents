import Api from "../../../app/axios"
import { WsCloudMsHttp } from "../../../app/ws-cloud-ms-http"
import type {
  CreateJobCampaignBody,
  CreateJobCampaignCandidateBody,
  CreateJobCampaignInterviewBody,
  JobCampaignAdminItem,
  JobCampaignCandidateItem,
  JobCampaignCandidateSort,
  JobCampaignInterviewItem,
  UpdateJobCampaignBody,
  UpdateJobCampaignCandidateBody,
} from "../types/job-campaign.types"

export async function fetchJobCampaignsReq(): Promise<JobCampaignAdminItem[]> {
  const api = Api.getInstance()
  const data = await api.get({ path: "job-campaigns" })
  return Array.isArray(data) ? (data as JobCampaignAdminItem[]) : []
}

export async function fetchJobCampaignReq(
  id: string,
): Promise<JobCampaignAdminItem | null> {
  const api = Api.getInstance()
  const data = await api.get({ path: `job-campaigns/${id}` })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignAdminItem
}

export async function createJobCampaignReq(
  body: CreateJobCampaignBody,
): Promise<JobCampaignAdminItem | null> {
  const api = Api.getInstance()
  const data = await api.post({ path: "job-campaigns", data: body })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignAdminItem
}

export async function updateJobCampaignReq(
  id: string,
  body: UpdateJobCampaignBody,
): Promise<JobCampaignAdminItem | null> {
  const api = Api.getInstance()
  const data = await api.patch({ path: `job-campaigns/${id}`, data: body })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignAdminItem
}

export async function activateJobCampaignReq(
  id: string,
): Promise<JobCampaignAdminItem | null> {
  const api = Api.getInstance()
  const data = await api.post({ path: `job-campaigns/${id}/activate`, data: {} })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignAdminItem
}

export async function fetchJobCampaignCandidatesReq(
  campaignId: string,
  status?: string,
  sort?: JobCampaignCandidateSort,
): Promise<JobCampaignCandidateItem[]> {
  const api = Api.getInstance()
  const params = new URLSearchParams()
  if (status != null && status.trim().length > 0) {
    params.set("status", status.trim())
  }
  if (sort === "score") {
    params.set("sort", "score")
  }
  const qs = params.toString().length > 0 ? `?${params.toString()}` : ""
  const data = await api.get({
    path: `job-campaigns/${campaignId}/candidates${qs}`,
  })
  return Array.isArray(data) ? (data as JobCampaignCandidateItem[]) : []
}

export async function fetchJobCampaignCandidateReq(
  campaignId: string,
  candidateId: string,
): Promise<JobCampaignCandidateItem | null> {
  const api = Api.getInstance()
  const data = await api.get({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}`,
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignCandidateItem
}

export async function retryJobCampaignVoiceReq(
  campaignId: string,
  candidateId: string,
): Promise<{
  readonly placed: boolean
  readonly candidate: JobCampaignCandidateItem
} | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}/retry-voice`,
    data: {},
  })
  if (data == null || typeof data !== "object") return null
  return data as {
    readonly placed: boolean
    readonly candidate: JobCampaignCandidateItem
  }
}

export async function startJobCampaignWhatsappReq(
  campaignId: string,
  candidateId: string,
): Promise<{
  readonly started: boolean
  readonly candidate: JobCampaignCandidateItem
} | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}/start-whatsapp`,
    data: {},
  })
  if (data == null || typeof data !== "object") return null
  return data as {
    readonly started: boolean
    readonly candidate: JobCampaignCandidateItem
  }
}

export async function promoteJobCampaignCandidateReq(
  campaignId: string,
  candidateId: string,
): Promise<{
  readonly userId: string
  readonly created: boolean
  readonly candidate: JobCampaignCandidateItem
} | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}/promote`,
    data: {},
  })
  if (data == null || typeof data !== "object") return null
  return data as {
    readonly userId: string
    readonly created: boolean
    readonly candidate: JobCampaignCandidateItem
  }
}

export async function rejectJobCampaignCandidateReq(
  campaignId: string,
  candidateId: string,
): Promise<JobCampaignCandidateItem | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}/reject`,
    data: {},
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignCandidateItem
}

export async function rescoreJobCampaignCandidateReq(
  campaignId: string,
  candidateId: string,
): Promise<JobCampaignCandidateItem | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}/rescore`,
    data: {},
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignCandidateItem
}

/** Browser URL for a recruiting CV/video stored in whatsapp_cloud_ms. */
export function buildRecruitingMediaUrl(whatsappMessageId: string): string {
  return WsCloudMsHttp.getInstance().resolveUrl(
    `whatsapp-cloud/recruiting/media/${encodeURIComponent(whatsappMessageId)}`,
  )
}

export async function assignJobCampaignInterviewReq(
  campaignId: string,
  candidateId: string,
): Promise<JobCampaignCandidateItem | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}/assign-interview`,
    data: {},
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignCandidateItem
}

export async function createJobCampaignCandidateReq(
  campaignId: string,
  body: CreateJobCampaignCandidateBody,
): Promise<JobCampaignCandidateItem | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/candidates`,
    data: body,
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignCandidateItem
}

export async function updateJobCampaignCandidateReq(
  campaignId: string,
  candidateId: string,
  body: UpdateJobCampaignCandidateBody,
): Promise<JobCampaignCandidateItem | null> {
  const api = Api.getInstance()
  const data = await api.patch({
    path: `job-campaigns/${campaignId}/candidates/${candidateId}`,
    data: body,
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignCandidateItem
}

export async function fetchJobCampaignInterviewsReq(
  campaignId: string,
): Promise<JobCampaignInterviewItem[]> {
  const api = Api.getInstance()
  const data = await api.get({ path: `job-campaigns/${campaignId}/interviews` })
  return Array.isArray(data) ? (data as JobCampaignInterviewItem[]) : []
}

export async function createJobCampaignInterviewReq(
  campaignId: string,
  body: CreateJobCampaignInterviewBody,
): Promise<JobCampaignInterviewItem | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/${campaignId}/interviews`,
    data: body,
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignInterviewItem
}

export async function cancelJobCampaignInterviewReq(
  interviewId: string,
): Promise<JobCampaignInterviewItem | null> {
  const api = Api.getInstance()
  const data = await api.post({
    path: `job-campaigns/interviews/${interviewId}/cancel`,
    data: {},
  })
  if (data == null || typeof data !== "object") return null
  return data as JobCampaignInterviewItem
}
