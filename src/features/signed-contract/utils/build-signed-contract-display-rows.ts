import type {
  SignedContractListItem,
  SignedContractSignStatusFilter,
} from "../types/signed-contract.types"
import { groupSignedContractsByEmail } from "./group-signed-contracts-by-email"

export function buildSignedContractDisplayRows(input: {
  readonly items: readonly SignedContractListItem[]
  readonly signStatusFilter: SignedContractSignStatusFilter
  readonly groupRepeatedByEmail: boolean
}): SignedContractListItem[] {
  const filteredItems =
    input.signStatusFilter === "signed"
      ? input.items.filter((item) => item.signed)
      : input.signStatusFilter === "unsigned"
        ? input.items.filter((item) => !item.signed)
        : [...input.items]
  if (input.groupRepeatedByEmail) {
    return groupSignedContractsByEmail(filteredItems)
  }
  return filteredItems
}
