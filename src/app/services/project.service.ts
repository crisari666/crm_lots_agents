import { RagApi } from "../axios"
import { CreateProjectDto, ProjectType, UpdateProjectDto } from "../../features/project/types/project.types"

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
    const { error, result } = response
    if (error == null) {
      const project = result?.project ?? result
      return (project && typeof project === "object" && "_id" in project
        ? project
        : { _id: projectId, images: result?.images ?? [] }) as ProjectType
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON uploadProjectImageReq")
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
    const { error, result } = response
    if (error == null) {
      const project = result?.project ?? result
      if (project && typeof project === "object" && "_id" in project) {
        return project as ProjectType
      }
      throw new Error("Invalid response")
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON deleteProjectImageReq")
    console.error({ error })
    throw error
  }
}
