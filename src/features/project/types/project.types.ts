export type ProjectAmenityRef = {
  _id: string
  title: string
}

export type ProjectType = {
  _id: string
  title: string
  description?: string
  location: string
  city?: string
  state?: string
  country?: string
  lat: number
  lng: number
  priceSell: number
  deleted?: boolean
  enabled?: boolean
  commissionPercentage: number
  commissionValue: number
  amenities?: ProjectAmenityRef[]
  images?: string[]
  reelVideo?: string
  plane?: string
  brochure?: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export type CreateProjectDto = {
  title: string
  description?: string
  location: string
  city?: string
  state?: string
  country?: string
  lat: number
  lng: number
  priceSell: number
  commissionPercentage: number
  commissionValue: number
  amenities?: string[]
  images?: string[]
}

export type UpdateProjectDto = {
  title?: string
  description?: string
  location?: string
  city?: string
  state?: string
  country?: string
  lat?: number
  lng?: number
  priceSell?: number
  commissionPercentage?: number
  commissionValue?: number
  amenities?: string[]
  images?: string[]
}

export type ProjectFormState = {
  title: string
  description: string
  location: string
  city: string
  state: string
  country: string
  lat: number
  lng: number
  priceSell: number
  commissionPercentage: number
  commissionValue: number
  amenities: string[]
  imageFiles: File[]
  reelVideoFile: File | null
  planeFile: File | null
  brochureFile: File | null
}

export type ProjectPreviewMediaKind = "image" | "video" | "pdf"

export type ProjectPreviewItem = {
  kind: ProjectPreviewMediaKind
  src: string
  title?: string
}
