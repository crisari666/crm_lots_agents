import Api from "../axios"

export type CeoOperationsSummaryResult = {
  range: { fromIso: string; toIso: string }
  metaLeadsTotal: number
  metaLeadsDistinctUserTotal: number
  contractsSentTotal: number
  contractsSignedTotal: number
  trainingAttendeesTotal: number
}

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
