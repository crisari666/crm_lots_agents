import type {
  SignupCampaignAdminItem,
  SignupCampaignRegistrationItem,
} from "../types/signup-campaign.types"

export type SignupCampaignCreateStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"

export type SignupCampaignState = {
  readonly items: SignupCampaignAdminItem[]
  readonly itemsLoading: boolean
  readonly itemsError: string | null
  readonly selectedCampaignId: string | null
  readonly registrations: SignupCampaignRegistrationItem[]
  readonly registrationsLoading: boolean
  readonly registrationsError: string | null
  readonly createStatus: SignupCampaignCreateStatus
  readonly createError: string | null
  readonly updatingCampaignId: string | null
}
