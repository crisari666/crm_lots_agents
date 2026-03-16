import { ProjectType } from "../types/project.types"

export type ProjectsState = {
  projects: ProjectType[]
  currentProject: ProjectType | null
  isLoading: boolean
  error: string | null
}
