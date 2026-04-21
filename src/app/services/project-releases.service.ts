import { RagApi } from "../axios"
import type {
  CreateProjectReleaseDto,
  ProjectRelease,
  UpdateProjectReleaseDto
} from "../../features/project-release/types/project-release.types"

type ApiEnvelope = { error?: unknown }

function throwIfError(response: unknown) {
  if (response && typeof response === "object" && "error" in response) {
    const { error } = response as ApiEnvelope
    if (error != null) throw error
  }
}

type ImageMutationResponse = {
  message?: string
  imageName?: string
  release?: ProjectRelease
}

function parseReleaseFromImageResponse(data: unknown): ProjectRelease {
  const r = data as ImageMutationResponse
  if (r?.release && r.release._id) return r.release
  throw new Error("Invalid image mutation response")
}

export async function fetchProjectReleasesReq(status: "enabled" | "disabled"): Promise<ProjectRelease[]> {
  const api = RagApi.getInstance()
  const response = await api.get({ path: "project-releases", data: { status } })
  throwIfError(response)
  if (!Array.isArray(response)) throw new Error("Invalid project releases list")
  return response as ProjectRelease[]
}

export async function getProjectReleaseByIdReq(id: string): Promise<ProjectRelease> {
  const api = RagApi.getInstance()
  const response = await api.get({ path: `project-releases/${id}` })
  throwIfError(response)
  return response as ProjectRelease
}

export async function createProjectReleaseReq(data: CreateProjectReleaseDto): Promise<ProjectRelease> {
  const api = RagApi.getInstance()
  const response = await api.post({ path: "project-releases", data })
  throwIfError(response)
  return response as ProjectRelease
}

export async function updateProjectReleaseReq(
  id: string,
  data: UpdateProjectReleaseDto
): Promise<ProjectRelease> {
  const api = RagApi.getInstance()
  const response = await api.patch({ path: `project-releases/${id}`, data })
  throwIfError(response)
  return response as ProjectRelease
}

export async function setProjectReleaseEnabledReq(id: string, enabled: boolean): Promise<ProjectRelease> {
  const api = RagApi.getInstance()
  const enableParam = enabled ? "true" : "false"
  const response = await api.patch({ path: `project-releases/${id}/enabled/${enableParam}` })
  throwIfError(response)
  return response as ProjectRelease
}

export async function uploadProjectReleaseImageReq({
  releaseId,
  file
}: {
  releaseId: string
  file: File
}): Promise<ProjectRelease> {
  const api = RagApi.getInstance()
  const formData = new FormData()
  formData.append("file", file)
  const response = await api.post({
    path: `project-releases/${releaseId}/images`,
    data: formData,
    isFormData: true
  })
  return parseReleaseFromImageResponse(response)
}

export async function deleteProjectReleaseImageReq({
  releaseId,
  imageName
}: {
  releaseId: string
  imageName: string
}): Promise<ProjectRelease> {
  const api = RagApi.getInstance()
  const path = `project-releases/${releaseId}/images/${encodeURIComponent(imageName)}`
  const response = await api.delete({ path })
  return parseReleaseFromImageResponse(response)
}
