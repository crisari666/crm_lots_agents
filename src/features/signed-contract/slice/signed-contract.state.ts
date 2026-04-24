import type {
  SignedContractListItem,
  SignedContractSignStatusFilter,
} from "../types/signed-contract.types"

export type SignedContractState = {
  readonly items: SignedContractListItem[]
  readonly sentFrom: string
  readonly sentTo: string
  readonly groupRepeatedByEmail: boolean
  readonly signStatusFilter: SignedContractSignStatusFilter
  readonly isLoading: boolean
  readonly error: string | null
}
