export type ProjectAmenityRef = {
  _id: string
  title: string
}

/** Marketing amenity groups — matches RAG `amenitiesGroups` (icon id, title, label strings) */
export type ProjectAmenitiesGroup = {
  icon: string
  title: string
  amenities: string[]
}

/** Lot variant: area, COP `price`, optional USD reference `priceUsd` — API subdocuments without _id */
export type ProjectLotOption = {
  area: number
  price: number
  priceUsd?: number
}

export type ProjectType = {
  _id: string
  title: string
  /** URL-friendly unique identifier among non-deleted projects (kebab-case, max 120) */
  slug?: string
  description?: string
  location: string
  city?: string
  state?: string
  country?: string
  lat: number
  lng: number
  /** Primary list price in COP */
  priceSell: number
  /** Optional parallel list price in USD */
  priceSellUsd?: number
  deleted?: boolean
  enabled?: boolean
  commissionPercentage: number
  commissionValue: number
  /** Separation between lots (product-defined unit, e.g. meters) */
  separation?: number
  lotOptions?: ProjectLotOption[]
  /** Catalog-linked amenity documents (GET may populate) */
  amenities?: ProjectAmenityRef[]
  /** Marketing UI groups; PATCH replaces entire array when sent */
  amenitiesGroups?: ProjectAmenitiesGroup[]
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
  slug?: string
  description?: string
  location: string
  city?: string
  state?: string
  country?: string
  lat: number
  lng: number
  priceSell: number
  priceSellUsd?: number
  commissionPercentage: number
  commissionValue: number
  separation?: number
  lotOptions?: ProjectLotOption[]
  amenitiesGroups?: ProjectAmenitiesGroup[]
  images?: string[]
  cardProject?: string
  horizontalImages?: string[]
  verticalVideos?: string[]
}

export type UpdateProjectDto = {
  title?: string
  slug?: string
  description?: string
  location?: string
  city?: string
  state?: string
  country?: string
  lat?: number
  lng?: number
  priceSell?: number
  priceSellUsd?: number
  commissionPercentage?: number
  commissionValue?: number
  separation?: number
  lotOptions?: ProjectLotOption[]
  amenitiesGroups?: ProjectAmenitiesGroup[]
  images?: string[]
  cardProject?: string
  horizontalImages?: string[]
  verticalVideos?: string[]
}

export type ProjectFormState = {
  title: string
  slug: string
  description: string
  location: string
  city: string
  state: string
  country: string
  lat: number
  lng: number
  priceSell: number
  priceSellUsd: number
  commissionPercentage: number
  commissionValue: number
  separation: number
  lotOptions: ProjectLotOption[]
  amenitiesGroups: ProjectAmenitiesGroup[]
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
