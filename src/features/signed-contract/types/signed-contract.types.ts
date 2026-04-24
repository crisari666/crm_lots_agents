export type SignedContractListItem = {
  readonly id: string
  readonly userId: string
  readonly userEmail: string
  readonly name: string
  readonly dateSent: string
  readonly dateSigned: string | null
  readonly signed: boolean
  readonly signedPdfLink: string | null
  /** Present when row is grouped by email in UI. */
  readonly sendCount?: number
}
