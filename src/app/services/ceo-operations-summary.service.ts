import Api from "../axios"
import type {
  CeoLeadResumeResult,
  CeoOperationsSummaryResult,
} from "./ceo-operations-summary.types"

export async function getCeoOperationsSummaryReq(params: {
  from: string
  to: string
}): Promise<CeoOperationsSummaryResult> {
  const api = Api.getInstance()
  const response = (await api.get({
    path: "ceo-operations-summary",
    data: { from: params.from, to: params.to },
  })) as CeoOperationsSummaryResult | undefined
  if (response === undefined) {
    throw new Error("No se pudo cargar el resumen operativo")
  }
  return response
}

export async function getCeoLeadsResumeReq(params: {
  from: string
  to: string
  includeDetails: boolean
}): Promise<CeoLeadResumeResult> {
  const api = Api.getInstance()
  const response = (await api.get({
    path: "ceo-operations-summary/leads-resume",
    data: {
      from: params.from,
      to: params.to,
      includeDetails: params.includeDetails,
    },
  })) as CeoLeadResumeResult | undefined
  if (response === undefined) {
    throw new Error("No se pudo cargar el resumen de leads")
  }
  return response
}
