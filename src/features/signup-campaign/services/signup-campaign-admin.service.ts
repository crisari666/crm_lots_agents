import Api from "../../../app/axios"
import type {
  CreateSignupCampaignReqBody,
  SignupCampaignAdminItem,
  SignupCampaignRegistrationItem,
  UpdateSignupCampaignReqBody,
} from "../types/signup-campaign.types"

export async function fetchSignupCampaignsReq(): Promise<SignupCampaignAdminItem[]> {
  const api = Api.getInstance()
  const data = await api.get({ path: "signup-campaigns" })
  if (!Array.isArray(data)) {
    return []
  }
  return data as SignupCampaignAdminItem[]
}

export async function createSignupCampaignReq(
  body: CreateSignupCampaignReqBody,
): Promise<SignupCampaignAdminItem | null> {
  const api = Api.getInstance()
  const data = await api.post({ path: "signup-campaigns", data: body })
  if (data == null || typeof data !== "object") {
    return null
  }
  return data as SignupCampaignAdminItem
}

export async function updateSignupCampaignReq(
  id: string,
  body: UpdateSignupCampaignReqBody,
): Promise<SignupCampaignAdminItem | null> {
  const api = Api.getInstance()
  const data = await api.patch({ path: `signup-campaigns/${id}`, data: body })
  if (data == null || typeof data !== "object") {
    return null
  }
  return data as SignupCampaignAdminItem
}

export async function fetchSignupCampaignRegistrationsReq(
  id: string,
): Promise<SignupCampaignRegistrationItem[]> {
  const api = Api.getInstance()
  const data = await api.get({ path: `signup-campaigns/${id}/registrations` })
  if (!Array.isArray(data)) {
    return []
  }
  return data as SignupCampaignRegistrationItem[]
}
