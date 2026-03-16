import { AmenityType } from "../types/amenity.types"

export type AmenitiesState = {
  amenities: AmenityType[]
  isLoading: boolean
  error: string | null
}

export type AmenityForm = {
  title: string
}
