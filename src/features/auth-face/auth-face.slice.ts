import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getAuthFaceReq, setAuthFaceReq, uploadFaceAuthReq } from "../../app/services/auth-face.service"
import { AuthFaceSliceState } from "./auth-face.state"

const initialState: AuthFaceSliceState = {
  loading: false,
  modelsLoaded: false,
  camStarted: false,
  closeFaceToCam: false,
  showSetAuthFaceDialog: false,
  uploadingFile: false,
  showDialogRegisterAuthFace: false,
  successAuthFaceRegister: false
}
export const setAuthFaceThunk = createAsyncThunk( "AuthFaceSlice/fetchCount", async (descriptor: Float32Array) => await setAuthFaceReq({descriptor}))

export const getAuthFaceThunk = createAsyncThunk( "AuthFaceSlice/getAuthFaceThunk", async ({userId} :{userId: string}) => await getAuthFaceReq({userId}))

export const uploadFaceAutThunk = createAsyncThunk( "AuthFaceSlice/uploadFaceAutThunk", async ({descriptor, image} : {descriptor: Float32Array, image: any}) =>
  await uploadFaceAuthReq({descriptor, image})
)

export const AuthFaceSliceSlice = createSlice({
  name: "AuthFaceSlice",
  initialState,
  reducers: {
    setModelsLoadedAct: (state, action: PayloadAction<boolean>) => {
      state.modelsLoaded = action.payload
    },
    setCamStartedAct: (state, action: PayloadAction<boolean>) => {
      state.camStarted = action.payload
    },
    setCloseFaceToCamAct: (state, action: PayloadAction<boolean>) => {
      state.closeFaceToCam = action.payload
    },
    setUploadFileAct: (state, action: PayloadAction<boolean>) => {
      state.uploadingFile = action.payload
    },
    closeDialogFaceRegisterAct: (state) => {
      state.showDialogRegisterAuthFace = false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAuthFaceThunk.fulfilled, (state, action) => {
      if(action.payload === null) {
        state.showDialogRegisterAuthFace = true
      } else {
        const descriptor = []
        for(let i in action.payload.descriptor) {
          const n = action.payload.descriptor[i]
          descriptor.push(n)
        }
        state.descriptorFromBack = Float32Array.from(descriptor)
      }
    }).addCase(uploadFaceAutThunk.pending, (state) => { 
      state.uploadingFile = true
    }).addCase(uploadFaceAutThunk.fulfilled, (state) => {
      state.successAuthFaceRegister = true
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("AuthFaceSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("AuthFaceSlice"), (state) => {
      state.loading = false
    })
  },
})
export const { setModelsLoadedAct, setCamStartedAct, setCloseFaceToCamAct, setUploadFileAct, closeDialogFaceRegisterAct } =AuthFaceSliceSlice.actions
export default AuthFaceSliceSlice.reducer