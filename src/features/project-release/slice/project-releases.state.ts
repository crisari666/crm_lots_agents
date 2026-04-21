import type { ProjectRelease, ProjectReleaseListStatus } from "../types/project-release.types"

export type ProjectReleasesState = {
  items: ProjectRelease[]
  listTab: ProjectReleaseListStatus
  current: ProjectRelease | null
  isLoading: boolean
  error: string | null
}
