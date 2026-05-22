import Api from "../../../app/axios"
import type { SignedContractListItem } from "../types/signed-contract.types"

export async function fetchSignedContractHistoryReq(params: {
  readonly sentFrom?: string
  readonly sentTo?: string
}): Promise<SignedContractListItem[]> {
  const api = Api.getInstance()
  const query = new URLSearchParams()
  if (params.sentFrom != null && params.sentFrom.trim() !== "") {
    query.append("sentFrom", params.sentFrom.trim())
  }
  if (params.sentTo != null && params.sentTo.trim() !== "") {
    query.append("sentTo", params.sentTo.trim())
  }
  const suffix = query.size > 0 ? `?${query.toString()}` : ""
  const data = await api.get({
    path: `agent-contract-sign/admin/history${suffix}`,
  })
  if (!Array.isArray(data)) {
    return []
  }
  return data as SignedContractListItem[]
}

export type MarkSignedContractResult = {
  readonly signed: boolean
  readonly signedAt: string
  readonly signedPdfLink?: string
}

export async function markSignedContractByIdReq(
  id: string,
): Promise<MarkSignedContractResult> {
  const api = Api.getInstance()
  const data = await api.patch({
    path: `agent-contract-sign/admin/${id}/signed`,
  })
  const signedAtRaw = (data as MarkSignedContractResult)?.signedAt
  const signedAt =
    signedAtRaw instanceof Date
      ? signedAtRaw.toISOString()
      : typeof signedAtRaw === "string"
        ? signedAtRaw
        : new Date().toISOString()
  return {
    signed: true,
    signedAt,
    signedPdfLink:
      typeof (data as MarkSignedContractResult)?.signedPdfLink === "string"
        ? (data as MarkSignedContractResult).signedPdfLink
        : undefined,
  }
}
