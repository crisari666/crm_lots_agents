import { RagApi } from "../axios"
import type {
  BulkUpdateLotStatusDto,
  GenerateProjectLotsDto,
  ImportLotsResult,
  ListLotsResponse,
  ProjectLotInventoryRow,
  ProjectLotKind,
  ProjectLotType,
  UpdateProjectLotDto
} from "../../features/project/lot-inventory/types/lot-inventory.types"

export async function fetchLotInventoryHubReq(): Promise<ProjectLotInventoryRow[]> {
  const api = RagApi.getInstance()
  const response = await api.get({ path: "projects/lot-inventory" })
  if (Array.isArray(response)) return response
  throw new Error("Failed to load lot inventory hub")
}

export async function fetchProjectLotsReq({
  projectId,
  kind = "all"
}: {
  projectId: string
  kind?: ProjectLotKind | "all"
}): Promise<ListLotsResponse> {
  const api = RagApi.getInstance()
  const response = await api.get({
    path: `projects/${projectId}/lots`,
    data: { kind }
  })
  if (response?.lots && response?.summary) return response
  throw new Error("Failed to load project lots")
}

export async function updateProjectLotReq({
  projectId,
  lotId,
  data
}: {
  projectId: string
  lotId: string
  data: UpdateProjectLotDto
}): Promise<ProjectLotType> {
  const api = RagApi.getInstance()
  return api.patch({ path: `projects/${projectId}/lots/${lotId}`, data })
}

export async function bulkUpdateLotStatusReq({
  projectId,
  data
}: {
  projectId: string
  data: BulkUpdateLotStatusDto
}): Promise<{ modifiedCount: number }> {
  const api = RagApi.getInstance()
  return api.patch({ path: `projects/${projectId}/lots/bulk-status`, data })
}

export async function generateProjectLotsReq({
  projectId,
  data
}: {
  projectId: string
  data: GenerateProjectLotsDto
}): Promise<{
  createdLots: number
  createdCommercial: number
}> {
  const api = RagApi.getInstance()
  return api.post({ path: `projects/${projectId}/lots/generate`, data })
}

export async function importProjectLotsExcelReq({
  projectId,
  file,
  kind = "lot"
}: {
  projectId: string
  file: File
  kind?: ProjectLotKind
}): Promise<ImportLotsResult> {
  const api = RagApi.getInstance()
  const formData = new FormData()
  formData.append("file", file)
  return api.post({
    path: `projects/${projectId}/lots/import?kind=${kind}`,
    data: formData,
    isFormData: true
  })
}
