export type AmenityType = {
  _id: string
  title: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export type CreateAmenityDto = {
  title: string
}

export type UpdateAmenityDto = {
  title?: string
}
