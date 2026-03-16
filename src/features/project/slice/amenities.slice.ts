import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { CreateAmenityDto, UpdateAmenityDto } from "../types/amenity.types"
import {
  fetchAmenitiesReq,
  createAmenityReq,
  updateAmenityReq
} from "../../../app/services/amenities.service"
import { AmenitiesState } from "./amenities.state"

const initialState: AmenitiesState = {
  amenities: [],
  isLoading: false,
  error: null
}

export const fetchAmenitiesThunk = createAsyncThunk(
  "amenities/fetchAmenities",
  async () => {
    return fetchAmenitiesReq()
  }
)

export const createAmenityThunk = createAsyncThunk(
  "amenities/createAmenity",
  async (data: CreateAmenityDto) => {
    return createAmenityReq({ data })
  }
)

export const updateAmenityThunk = createAsyncThunk(
  "amenities/updateAmenity",
  async ({ id, data }: { id: string; data: UpdateAmenityDto }) => {
    return updateAmenityReq({ id, data })
  }
)

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenitiesThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAmenitiesThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.amenities = action.payload
        state.error = null
      })
      .addCase(fetchAmenitiesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error fetching amenities"
      })
      .addCase(createAmenityThunk.fulfilled, (state, action) => {
        state.amenities.push(action.payload)
      })
      .addCase(updateAmenityThunk.fulfilled, (state, action) => {
        const idx = state.amenities.findIndex((a) => a._id === action.payload._id)
        if (idx !== -1) state.amenities[idx] = action.payload
      })
  }
})

export default amenitiesSlice.reducer
