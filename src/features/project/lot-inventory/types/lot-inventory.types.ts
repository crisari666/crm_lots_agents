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
  holdUntil?: string | null
  stageKey?: string
  stageName?: string
  stageOrder?: number
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
  holdUntil?: string | null
  stageKey?: string
  stageName?: string
  stageOrder?: number
}

export type BulkUpdateLotStatusDto = {
  lotIds: string[]
  status: ProjectLotStatus
  ventorName?: string
  soldBy?: string
  holdUntil?: string | null
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

export type LotInventoryViewMode = "board" | "table" | "map"

export type LotMapFeatureProperties = {
  lotNumber: string
  stageKey: string
  stageName: string
  stageOrder: number
  status?: ProjectLotStatus | null
  lotId?: string | null
  area?: number | null
  price?: number | null
  ventorName?: string | null
  holdUntil?: string | null
  soldBy?: string | null
}

export type LotMapGeoJsonFeature = {
  type: "Feature"
  properties: LotMapFeatureProperties
  geometry: {
    type: "Polygon"
    coordinates: number[][][]
  }
}

export type LotMapGeoJson = {
  type: "FeatureCollection"
  features: LotMapGeoJsonFeature[]
}

export type LotMapPaintResponse = {
  projectId: string
  projectTitle: string
  lotsMapKml: string
  lotsMapGeojson: string
  geojson: LotMapGeoJson
  featureCount: number
  matchedCount: number
}

export type LotMapUploadResponse = {
  projectId: string
  lotsMapKml: string
  lotsMapGeojson: string
  featureCount: number
  createdLots: number
  stages: Array<{ stageKey: string; stageName: string; count: number }>
  swapStages: boolean
}

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
