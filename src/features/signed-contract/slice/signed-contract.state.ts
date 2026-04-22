import type { SignedContractListItem } from "../types/signed-contract.types"

export type SignedContractState = {
  readonly items: SignedContractListItem[]
  readonly sentFrom: string
  readonly sentTo: string
  readonly groupRepeatedByEmail: boolean
  readonly isLoading: boolean
  readonly error: string | null
}
