import { RagApi } from "../axios"
import type {
  CreateLocationPayload,
  ExperienceAssetType,
  ExperienceResourceType,
  PlaceAssetPayload,
  PoiDiscoveryResponse,
  ProjectExperienceAssetType,
  ProjectExperienceType,
  ProjectLocationCategory,
  ProjectLocationType,
  UpdateAssetPayload,
  UpdateExperiencePayload,
  UpdateLocationPayload,
  ExperienceSceneType
} from "../../features/project/project-3d-studio/types/project-experience.types"

export async function fetchProjectExperienceReq(
  projectId: string
): Promise<ProjectExperienceType> {
  const api = RagApi.getInstance()
  return api.get({ path: `projects/${projectId}/experience` })
}

export async function updateProjectExperienceReq(params: {
  projectId: string
  data: UpdateExperiencePayload
}): Promise<ProjectExperienceType> {
  const api = RagApi.getInstance()
  return api.patch({
    path: `projects/${params.projectId}/experience`,
    data: params.data
  })
}

export async function upsertExperienceScenesReq(params: {
  projectId: string
  scenes: ExperienceSceneType[]
}): Promise<ProjectExperienceType> {
  const api = RagApi.getInstance()
  return api.put({
    path: `projects/${params.projectId}/experience/scenes`,
    data: { scenes: params.scenes }
  })
}

export async function publishExperienceReq(
  projectId: string
): Promise<ProjectExperienceType> {
  const api = RagApi.getInstance()
  return api.post({
    path: `projects/${projectId}/experience/publish`,
    data: {}
  })
}

export async function disableExperienceReq(
  projectId: string
): Promise<ProjectExperienceType> {
  const api = RagApi.getInstance()
  return api.post({
    path: `projects/${projectId}/experience/disable`,
    data: {}
  })
}

export async function fetchExperienceLocationsReq(
  projectId: string
): Promise<ProjectLocationType[]> {
  const api = RagApi.getInstance()
  const response = await api.get({
    path: `projects/${projectId}/experience/locations`
  })
  return Array.isArray(response) ? response : []
}

export async function createExperienceLocationReq(params: {
  projectId: string
  data: CreateLocationPayload
}): Promise<ProjectLocationType> {
  const api = RagApi.getInstance()
  return api.post({
    path: `projects/${params.projectId}/experience/locations`,
    data: params.data
  })
}

export async function updateExperienceLocationReq(params: {
  projectId: string
  locationId: string
  data: UpdateLocationPayload
}): Promise<ProjectLocationType> {
  const api = RagApi.getInstance()
  return api.patch({
    path: `projects/${params.projectId}/experience/locations/${params.locationId}`,
    data: params.data
  })
}

export async function deleteExperienceLocationReq(params: {
  projectId: string
  locationId: string
}): Promise<{ deleted: true }> {
  const api = RagApi.getInstance()
  return api.delete({
    path: `projects/${params.projectId}/experience/locations/${params.locationId}`
  })
}

export async function verifyExperienceLocationReq(params: {
  projectId: string
  locationId: string
}): Promise<ProjectLocationType> {
  const api = RagApi.getInstance()
  return api.post({
    path: `projects/${params.projectId}/experience/locations/${params.locationId}/verify`,
    data: {}
  })
}

export async function uploadLocationGalleryReq(params: {
  projectId: string
  locationId: string
  files: File[]
}): Promise<ProjectLocationType> {
  const api = RagApi.getInstance()
  const formData = new FormData()
  params.files.forEach((file) => formData.append("files", file))
  return api.post({
    path: `projects/${params.projectId}/experience/locations/${params.locationId}/gallery`,
    data: formData,
    isFormData: true
  })
}

export async function discoverExperienceLocationsReq(params: {
  projectId: string
  radiusMeters: number
  categories?: ProjectLocationCategory[]
}): Promise<PoiDiscoveryResponse> {
  const api = RagApi.getInstance()
  const response = await api.post({
    path: `projects/${params.projectId}/experience/locations/discover`,
    data: {
      radiusMeters: params.radiusMeters,
      categories: params.categories
    }
  })
  return {
    provider: response?.provider ?? "overpass",
    candidates: Array.isArray(response?.candidates) ? response.candidates : [],
    warnings: Array.isArray(response?.warnings) ? response.warnings : []
  }
}

export async function importExperienceLocationsGeoJsonReq(params: {
  projectId: string
  file: File
}): Promise<{ created: number; locations: ProjectLocationType[] }> {
  const api = RagApi.getInstance()
  const formData = new FormData()
  formData.append("file", params.file)
  return api.post({
    path: `projects/${params.projectId}/experience/locations/import-geojson`,
    data: formData,
    isFormData: true
  })
}

export async function reorderExperienceLocationsReq(params: {
  projectId: string
  items: Array<{ locationId: string; sortOrder: number }>
}): Promise<ProjectLocationType[]> {
  const api = RagApi.getInstance()
  const response = await api.patch({
    path: `projects/${params.projectId}/experience/locations/reorder`,
    data: { items: params.items }
  })
  return Array.isArray(response) ? response : []
}

export async function fetchExperienceAssetsReq(
  projectId: string
): Promise<ExperienceAssetType[]> {
  const api = RagApi.getInstance()
  const response = await api.get({
    path: `projects/${projectId}/experience/assets`
  })
  return Array.isArray(response) ? response : []
}

export async function fetchExperienceResourcesReq(
  projectId: string
): Promise<ExperienceResourceType[]> {
  const api = RagApi.getInstance()
  const response = await api.get({
    path: `projects/${projectId}/experience/resources`
  })
  return Array.isArray(response) ? response : []
}

export async function uploadExperienceResourceReq(params: {
  projectId: string
  file: File
  type: ProjectExperienceAssetType
  name?: string
}): Promise<ExperienceResourceType> {
  const api = RagApi.getInstance()
  const formData = new FormData()
  formData.append("file", params.file)
  formData.append("type", params.type)
  if (params.name) formData.append("name", params.name)
  return api.post({
    path: `projects/${params.projectId}/experience/resources`,
    data: formData,
    isFormData: true
  })
}

export async function deleteExperienceResourceReq(params: {
  projectId: string
  resourceId: string
}): Promise<{ deleted: true; deletedPlacementIds?: string[] }> {
  const api = RagApi.getInstance()
  return api.delete({
    path: `projects/${params.projectId}/experience/resources/${params.resourceId}`
  })
}

export async function placeExperienceAssetReq(params: {
  projectId: string
  data: PlaceAssetPayload
}): Promise<ExperienceAssetType> {
  const api = RagApi.getInstance()
  return api.post({
    path: `projects/${params.projectId}/experience/assets/place`,
    data: params.data
  })
}

export async function uploadExperienceAssetReq(params: {
  projectId: string
  file: File
  type: ProjectExperienceAssetType
  name?: string
  longitude?: number
  latitude?: number
  altitude?: number | null
}): Promise<ExperienceAssetType> {
  const api = RagApi.getInstance()
  const formData = new FormData()
  formData.append("file", params.file)
  formData.append("type", params.type)
  if (params.name) formData.append("name", params.name)
  if (params.longitude !== undefined) {
    formData.append("longitude", String(params.longitude))
  }
  if (params.latitude !== undefined) {
    formData.append("latitude", String(params.latitude))
  }
  if (params.altitude !== undefined && params.altitude !== null) {
    formData.append("altitude", String(params.altitude))
  }
  return api.post({
    path: `projects/${params.projectId}/experience/assets`,
    data: formData,
    isFormData: true
  })
}

export async function updateExperienceAssetReq(params: {
  projectId: string
  assetId: string
  data: UpdateAssetPayload
}): Promise<ExperienceAssetType> {
  const api = RagApi.getInstance()
  return api.patch({
    path: `projects/${params.projectId}/experience/assets/${params.assetId}`,
    data: params.data
  })
}

export async function deleteExperienceAssetReq(params: {
  projectId: string
  assetId: string
}): Promise<{ deleted: true }> {
  const api = RagApi.getInstance()
  return api.delete({
    path: `projects/${params.projectId}/experience/assets/${params.assetId}`
  })
}
