export type ProjectReleaseListStatus = "enabled" | "disabled"

export type ProjectRelease = {
  _id: string
  title: string
  googleMapLocation: string
  location: string
  description: string
  images: string[]
  enabled: boolean
  status: ProjectReleaseListStatus
  createdAt?: string
  updatedAt?: string
}

export type CreateProjectReleaseDto = {
  title: string
  googleMapLocation: string
  location: string
  description?: string
  images?: string[]
  enabled?: boolean
}

export type UpdateProjectReleaseDto = Partial<{
  title: string
  googleMapLocation: string
  location: string
  description: string
  images: string[]
  enabled: boolean
}>
