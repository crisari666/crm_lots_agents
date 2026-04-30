import type {
  ReferralEligibleUser,
  ReferralSituationRow,
} from "../types/referral-follow-up.types"

export type ReferralFollowUpSliceState = {
  eligibleUsers: ReferralEligibleUser[]
  rows: ReferralSituationRow[]
  isLoadingEligible: boolean
  isLoadingRows: boolean
  isSubmitting: boolean
  error: string | null
}

export const referralFollowUpInitialState: ReferralFollowUpSliceState = {
  eligibleUsers: [],
  rows: [],
  isLoadingEligible: false,
  isLoadingRows: false,
  isSubmitting: false,
  error: null,
}
