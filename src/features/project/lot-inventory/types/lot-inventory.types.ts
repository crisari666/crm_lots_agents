export type ProjectLotStatus = "available" | "sold" | "hold" | "locked"

export type ProjectLotKind = "lot" | "commercial"

export type LotStatusSummary = {
  available: number
  sold: number
  hold: number
  locked: number
  total: number
}

export type LotKindSummary = {
  lot: LotStatusSummary
  commercial: LotStatusSummary
}

export type ProjectLotType = {
  _id: string
  projectId: string
  kind: ProjectLotKind
  number: string
  area: number
  status: ProjectLotStatus
  price: number
  soldBy?: string
  ventorName?: string
  createdAt?: string
  updatedAt?: string
}

export type ProjectLotInventoryRow = {
  projectId: string
  title: string
  enabled: boolean
  nLots: number
  nCommercialSpaces: number
  baseLotArea: number
  baseCommercialArea: number
  summary: LotKindSummary
}

export type ListLotsResponse = {
  lots: ProjectLotType[]
  summary: LotKindSummary
}

export type UpdateProjectLotDto = {
  area?: number
  price?: number
  status?: ProjectLotStatus
  ventorName?: string
  soldBy?: string
}

export type BulkUpdateLotStatusDto = {
  lotIds: string[]
  status: ProjectLotStatus
  ventorName?: string
  soldBy?: string
}

export type GenerateProjectLotsDto = {
  nLots?: number
  nCommercialSpaces?: number
  baseLotArea?: number
  baseCommercialArea?: number
  defaultLotPrice?: number
  defaultCommercialPrice?: number
}

export type ImportLotsResult = {
  created: number
  updated: number
  skipped: number
  errors: string[]
}

export type LotInventoryViewMode = "board" | "table"

export const EMPTY_STATUS_SUMMARY: LotStatusSummary = {
  available: 0,
  sold: 0,
  hold: 0,
  locked: 0,
  total: 0
}

export const EMPTY_KIND_SUMMARY: LotKindSummary = {
  lot: { ...EMPTY_STATUS_SUMMARY },
  commercial: { ...EMPTY_STATUS_SUMMARY }
}
