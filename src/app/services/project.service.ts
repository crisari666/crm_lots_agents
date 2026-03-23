import { RagApi } from "../axios"
import { CreateProjectDto, ProjectType, UpdateProjectDto } from "../../features/project/types/project.types"

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
    const response = await api.post({ path: "projects", data })
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
    const response = await api.patch({ path: `projects/${id}`, data })
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
