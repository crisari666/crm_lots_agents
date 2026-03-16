import { RagApi } from "../axios"
import { AmenityType, CreateAmenityDto, UpdateAmenityDto } from "../../features/project/types/amenity.types"

export async function fetchAmenitiesReq(): Promise<AmenityType[]> {
  try {
    const api = RagApi.getInstance()
    const response = await api.get({ path: "amenities" })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON fetchAmenitiesReq")
    console.error({ error })
    throw error
  }
}

export async function getAmenityByIdReq({ id }: { id: string }): Promise<AmenityType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.get({ path: `amenities/${id}` })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON getAmenityByIdReq")
    console.error({ error })
    throw error
  }
}

export async function createAmenityReq({ data }: { data: CreateAmenityDto }): Promise<AmenityType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.post({ path: "amenities", data })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON createAmenityReq")
    console.error({ error })
    throw error
  }
}

export async function updateAmenityReq({
  id,
  data
}: {
  id: string
  data: UpdateAmenityDto
}): Promise<AmenityType> {
  try {
    const api = RagApi.getInstance()
    const response = await api.patch({ path: `amenities/${id}`, data })
    const { error } = response
    if (error == null) {
      return response
    } else {
      throw error
    }
  } catch (error) {
    console.error("ERROR ON updateAmenityReq")
    console.error({ error })
    throw error
  }
}
