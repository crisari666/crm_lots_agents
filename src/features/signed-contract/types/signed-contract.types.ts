export type SignedContractSignStatusFilter = "all" | "signed" | "unsigned"

export type SignedContractListItem = {
  readonly id: string
  readonly userId: string
  readonly userEmail: string
  /** From contract session at send time; may be empty for legacy rows. */
  readonly phone?: string
  readonly name: string
  readonly dateSent: string
  readonly dateSigned: string | null
  readonly signed: boolean
  readonly signedPdfLink: string | null
  /** Agent-app signing URL (resend if email missing). */
  readonly signUrl: string | null
  /** Present when row is grouped by email in UI. */
  readonly sendCount?: number
}
