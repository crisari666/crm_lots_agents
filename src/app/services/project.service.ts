import { RagApi } from "../axios"
import {
  CreateProjectDto,
  ProjectAmenitiesGroup,
  ProjectType,
  UpdateProjectDto
} from "../../features/project/types/project.types"

const AMENITIES_GROUPS_MAX = 50
const AMENITIES_GROUP_LABELS_MAX = 100

/** Aligns payload with RAG `amenitiesGroups` limits (see `projects-endpoints.md`). */
export function sanitizeAmenitiesGroupsPayload(
  groups: ProjectAmenitiesGroup[] | undefined
): ProjectAmenitiesGroup[] | undefined {
  if (groups === undefined) return undefined
  return groups
    .slice(0, AMENITIES_GROUPS_MAX)
    .map((g) => ({
      icon:
        typeof g.icon === "string" && g.icon.trim().length > 0
          ? g.icon.trim()
          : "category",
      title: String(g.title ?? "").trim(),
      amenities: (Array.isArray(g.amenities) ? g.amenities : [])
        .map((a) => String(a).trim())
        .filter(Boolean)
        .slice(0, AMENITIES_GROUP_LABELS_MAX)
    }))
    .filter((g) => g.title.length > 0)
}

function withSanitizedAmenitiesGroups<T extends { amenitiesGroups?: ProjectAmenitiesGroup[] }>(
  data: T
): T {
  if (data.amenitiesGroups === undefined) return data
  return {
    ...data,
    amenitiesGroups: sanitizeAmenitiesGroupsPayload(data.amenitiesGroups)
  }
}

function parseProjectStrict(data: unknown): ProjectType | null {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>
    const nested = d.project
    if (nested && typeof nested === "object" && nested !== null && "_id" in nested) {
      return nested as ProjectType
    }
    if ("_id" in d) {
      return d as ProjectType
    }
  }
  return null
}

function parseProjectFromUploadResponse(data: unknown, fallbackProjectId: string): ProjectType {
  const parsed = parseProjectStrict(data)
  if (parsed) return parsed
  return {
    _id: fallbackProjectId,
    title: "",
    location: "",
    lat: 0,
    lng: 0,
    priceSell: 0,
    commissionPercentage: 0,
    commissionValue: 0,
    images: []
  }
}

export async function fetchProjectsReq(): Promise<ProjectType[]> {
  try {
    const api = RagApi.getInstance()
    const response = await api.get({ path: "projects", data: { enable: "all" } })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON fetchProjectsReq")
    console.error({ error })
    throw error
  }
}

export async function setProjectEnabledReq({
  id,
  enabled
}: {
  id: string
  enabled: boolean
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const enableParam = enabled ? "true" : "false"
    const response = await api.patch({ path: `projects/${id}/enabled/${enableParam}` })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON setProjectEnabledReq")
    console.error({ error })
    throw error
  }
}

export async function getProjectByIdReq({ id }: { id: string }): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.get({ path: `projects/${id}` })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON getProjectByIdReq")
    console.error({ error })
    throw error
  }
}

export async function createProjectReq({ data }: { data: CreateProjectDto }): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.post({ path: "projects", data: withSanitizedAmenitiesGroups(data) })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON createProjectReq")
    console.error({ error })
    throw error
  }
}

export async function updateProjectReq({
  id,
  data
}: {
  id: string
  data: UpdateProjectDto
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.patch({ path: `projects/${id}`, data: withSanitizedAmenitiesGroups(data) })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON updateProjectReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectReq({ id }: { id: string }): Promise<void> {
  try {
    const api = RagApi.getInstance()
    const response = await api.delete({ path: `projects/${id}` })
    const { error } = response
    if (error != null) {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON deleteProjectReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectImageReq({
  projectId,
  file
}: {
  projectId: string
  file: File
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    formData.append("file", file)
    const response = await api.post({
      path: `projects/${projectId}/images`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectImageReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectImagesMultipleReq({
  projectId,
  files
}: {
  projectId: string
  files: File[]
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    files.forEach((f) => formData.append("files", f))
    const response = await api.post({
      path: `projects/${projectId}/images/multiple`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectImagesMultipleReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectCardImageReq({
  projectId,
  file
}: {
  projectId: string
  file: File
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    formData.append("file", file)
    const response = await api.post({
      path: `projects/${projectId}/card-project`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectCardImageReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectCardImageReq({
  projectId
}: {
  projectId: string
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.delete({ path: `projects/${projectId}/card-project` })
    const project = parseProjectStrict(response)
    if (!project) throw new Error("Invalid response")
    return project
  } catch (error) {
    console.error("ERROR ON deleteProjectCardImageReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectHorizontalImagesMultipleReq({
  projectId,
  files
}: {
  projectId: string
  files: File[]
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    files.forEach((f) => formData.append("files", f))
    const response = await api.post({
      path: `projects/${projectId}/horizontal-images/multiple`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectHorizontalImagesMultipleReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectHorizontalImageReq({
  projectId,
  imageName
}: {
  projectId: string
  imageName: string
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const path = `projects/${projectId}/horizontal-images/${encodeURIComponent(imageName)}`
    const response = await api.delete({ path })
    const project = parseProjectStrict(response)
    if (!project) throw new Error("Invalid response")
    return project
  } catch (error) {
    console.error("ERROR ON deleteProjectHorizontalImageReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectVerticalVideosMultipleReq({
  projectId,
  files
}: {
  projectId: string
  files: File[]
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    files.forEach((f) => formData.append("files", f))
    const response = await api.post({
      path: `projects/${projectId}/vertical-videos/multiple`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectVerticalVideosMultipleReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectVerticalVideoReq({
  projectId,
  videoName
}: {
  projectId: string
  videoName: string
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const path = `projects/${projectId}/vertical-videos/${encodeURIComponent(videoName)}`
    const response = await api.delete({ path })
    const project = parseProjectStrict(response)
    if (!project) throw new Error("Invalid response")
    return project
  } catch (error) {
    console.error("ERROR ON deleteProjectVerticalVideoReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectReelVideoReq({
  projectId,
  file
}: {
  projectId: string
  file: File
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    formData.append("file", file)
    const response = await api.post({
      path: `projects/${projectId}/reel-video`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectReelVideoReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectReelVideoReq({
  projectId
}: {
  projectId: string
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.delete({ path: `projects/${projectId}/reel-video` })
    const project = parseProjectStrict(response)
    if (!project) throw new Error("Invalid response")
    return project
  } catch (error) {
    console.error("ERROR ON deleteProjectReelVideoReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectPlaneReq({
  projectId,
  file
}: {
  projectId: string
  file: File
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    formData.append("file", file)
    const response = await api.post({
      path: `projects/${projectId}/plane`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectPlaneReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectPlaneReq({
  projectId
}: {
  projectId: string
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.delete({ path: `projects/${projectId}/plane` })
    const project = parseProjectStrict(response)
    if (!project) throw new Error("Invalid response")
    return project
  } catch (error) {
    console.error("ERROR ON deleteProjectPlaneReq")
    console.error({ error })
    throw error
  }
}

export async function uploadProjectBrochureReq({
  projectId,
  file
}: {
  projectId: string
  file: File
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const formData = new FormData()
    formData.append("file", file)
    const response = await api.post({
      path: `projects/${projectId}/brochure`,
      data: formData,
      isFormData: true
    })
    return parseProjectFromUploadResponse(response, projectId)
  } catch (error) {
    console.error("ERROR ON uploadProjectBrochureReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectBrochureReq({
  projectId
}: {
  projectId: string
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.delete({ path: `projects/${projectId}/brochure` })
    const project = parseProjectStrict(response)
    if (!project) throw new Error("Invalid response")
    return project
  } catch (error) {
    console.error("ERROR ON deleteProjectBrochureReq")
    console.error({ error })
    throw error
  }
}

export async function deleteProjectImageReq({
  projectId,
  imageName
}: {
  projectId: string
  imageName: string
}): Promise<ProjectType> {
  try {
    const api = RagApi.getInstance()
    const path = `projects/${projectId}/images/${encodeURIComponent(imageName)}`
    const response = await api.delete({ path })
    const project = parseProjectStrict(response)
    if (!project) throw new Error("Invalid response")
    return project
  } catch (error) {
    console.error("ERROR ON deleteProjectImageReq")
    console.error({ error })
    throw error
  }
}
