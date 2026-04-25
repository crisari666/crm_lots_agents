export type SignupCampaignAdminItem = {
  readonly id: string
  readonly code: string
  readonly name: string
  readonly description: string
  readonly dateStart: string
  readonly dateEnd: string
  readonly enabled: boolean
  readonly createdAt: string
  readonly signupsCount: number
  readonly publicLink: string | null
}

export type SignupCampaignRegistrationItem = {
  readonly id: string
  readonly campaignId: string
  readonly userId: string
  readonly fullName: string
  readonly email: string
  readonly phone: string
  readonly document: string
  readonly city: string
  readonly dateSent: string
  readonly contractSent: boolean
  readonly signed: boolean
  readonly dateSigned: string | null
  readonly signUrl: string | null
  readonly signedPdfLink: string | null
}

export type CreateSignupCampaignReqBody = {
  readonly name: string
  readonly description?: string
  readonly dateStart: string
  readonly dateEnd: string
}

export type UpdateSignupCampaignReqBody = {
  readonly name?: string
  readonly description?: string
  readonly dateStart?: string
  readonly dateEnd?: string
  readonly enabled?: boolean
}
