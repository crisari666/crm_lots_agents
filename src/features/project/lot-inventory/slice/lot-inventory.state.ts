import {
  BulkUpdateLotStatusDto,
  GenerateProjectLotsDto,
  ImportLotsResult,
  LotInventoryViewMode,
  LotKindSummary,
  ProjectLotInventoryRow,
  ProjectLotKind,
  ProjectLotStatus,
  ProjectLotType,
  UpdateProjectLotDto,
  EMPTY_KIND_SUMMARY
} from "../types/lot-inventory.types"

export type LotInventoryState = {
  hubRows: ProjectLotInventoryRow[]
  hubLoading: boolean
  hubError: string | null
  hubSearch: string
  projectId: string | null
  lots: ProjectLotType[]
  summary: LotKindSummary
  lotsLoading: boolean
  lotsError: string | null
  kindFilter: ProjectLotKind
  statusFilter: ProjectLotStatus | "all"
  stageFilter: string | "all"
  searchNumber: string
  viewMode: LotInventoryViewMode
  selectedLotIds: string[]
  drawerLotId: string | null
  importResult: ImportLotsResult | null
  actionLoading: boolean
}
