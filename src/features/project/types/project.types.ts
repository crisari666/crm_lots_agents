export type ProjectAmenityRef = {
  _id: string
  title: string
}

/** Lot variant for sale (area e.g. m² and price) — API subdocuments without _id */
export type ProjectLotOption = {
  area: number
  price: number
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
  /** Separation between lots (product-defined unit, e.g. meters) */
  separation?: number
  lotOptions?: ProjectLotOption[]
  amenities?: ProjectAmenityRef[]
  images?: string[]
  /** Single listing card image filename */
  cardProject?: string
  /** Landscape gallery / banner image filenames */
  horizontalImages?: string[]
  /** Portrait promotional video filenames */
  verticalVideos?: string[]
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
  separation?: number
  lotOptions?: ProjectLotOption[]
  amenities?: string[]
  images?: string[]
  cardProject?: string
  horizontalImages?: string[]
  verticalVideos?: string[]
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
  separation?: number
  lotOptions?: ProjectLotOption[]
  amenities?: string[]
  images?: string[]
  cardProject?: string
  horizontalImages?: string[]
  verticalVideos?: string[]
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
  separation: number
  lotOptions: ProjectLotOption[]
  amenities: string[]
  cardProjectFile: File | null
  horizontalImageFiles: File[]
  imageFiles: File[]
  verticalVideoFiles: File[]
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
