export type ReferralSituationEventValue =
  | "callWhatsapp"
  | "chat"
  | "other"
  | "videoCall"

export type ReferralEligibleUser = {
  readonly _id: string
  readonly name: string
  readonly lastName: string
  readonly email: string
}

export type ReferralSituationRow = {
  readonly id: string
  readonly userId: string
  readonly userName: string
  readonly event: string
  readonly description: string
  readonly date: string
}

export type CreateReferralSituationPayload = {
  readonly userId: string
  readonly event: ReferralSituationEventValue
  readonly description: string
}

export const REFERRAL_SITUATION_EVENT_VALUES: readonly ReferralSituationEventValue[] =
  ["callWhatsapp", "chat", "other", "videoCall"] as const
