import { RagApi } from "../axios"
import { CreateProjectDto, ProjectType, UpdateProjectDto } from "../../features/project/types/project.types"

export async function fetchProjectsReq(): Promise<ProjectType[]> {
  try {
    const api = RagApi.getInstance()
    const response = await api.get({ path: "projects" })
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
}): Promise<{ images: string[] }> {
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
      return { images: project?.images ?? result?.images ?? [] }
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON uploadProjectImageReq")
    console.error({ error })
    throw error
  }
}
