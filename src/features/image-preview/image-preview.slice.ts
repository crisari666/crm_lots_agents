import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ImagePreviewState } from "./image-preview.state";

const initialState: ImagePreviewState = {
  loading: false,
}
export const thunkAsync = createAsyncThunk( "ImagePreview/fetchCount", async (amount: number) => { 
    const response = await setTimeout(() => {}, 2000);
    return response
  },
)
export const ImagePreviewSlice = createSlice({
  name: "ImagePreview",
  initialState,
  reducers: {
    setImagePreviewerAct: (state, action: PayloadAction<string | undefined>) => {
      state.image = action.payload
    },
  },
  extraReducers: (builder) => {
    
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("ImagePreview"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("ImagePreview"), (state) => {
      state.loading = false
    })
  },
})
export const { setImagePreviewerAct } =ImagePreviewSlice.actions
export default ImagePreviewSlice.reducer