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

type MarkSignedContractApiResponse = {
  readonly signed?: boolean
  readonly signedAt?: string | Date
  readonly signedPdfLink?: string
}

function normalizeSignedAt(value: string | Date | undefined): string {
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === "string" && value.trim() !== "") {
    return value
  }
  return new Date().toISOString()
}

export async function markSignedContractByIdReq(
  id: string,
): Promise<MarkSignedContractResult> {
  const api = Api.getInstance()
  const data = (await api.patch({
    path: `agent-contract-sign/admin/${id}/signed`,
  })) as MarkSignedContractApiResponse
  return {
    signed: true,
    signedAt: normalizeSignedAt(data.signedAt),
    signedPdfLink:
      typeof data.signedPdfLink === "string" ? data.signedPdfLink : undefined,
  }
}
