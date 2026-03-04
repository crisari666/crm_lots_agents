import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LogArriveSliceState, LogArriveStepEnum } from "./log-arrive.state";
import { getOfficeUsersReq } from "../../app/services/offices.service";
import { getAuthFaceReq, logFaceAuthReq } from "../../app/services/auth-face.service";
const initialState: LogArriveSliceState = {
  loading: false,
  users: [],
  showDialogNotRegisteredFaceId: false,
  logArriveStep: LogArriveStepEnum.initial,
  userChoose: "",
  successFaceAuth: false
}
export const logArriveFetchUsersThunk = createAsyncThunk( "LogArriveSlice/LogArriveFetchUsersThunk", async (officeId: string) =>  await getOfficeUsersReq({officeId}))

export const getUserForAuthFaceThunk = createAsyncThunk( "LogArriveSlice/getUserForAuthFaceThunk", async (userId: string) => await getAuthFaceReq({userId}))

export const logFaceAuthThunk = createAsyncThunk( "LogArriveSlice/logFaceAuthThunk", async (params: {userId: string, lat: number, lng: number}) => await logFaceAuthReq(params))

export const LogArriveSlice = createSlice({
  name: "LogArriveSlice",
  initialState,
  reducers: {
    changeUserPickedAct: (state, action: PayloadAction<string>) => {
      state.userChoose = action.payload
    },
    updateStepLogArriveViewAct: (state, action: PayloadAction<LogArriveStepEnum>) => {
      state.logArriveStep = action.payload
    },
    closeDialogNotFoundFaceIdAct: (state) => {
      state.logArriveStep = LogArriveStepEnum.initial
      state.showDialogNotRegisteredFaceId = false
    },
    hideSuccesFaceAuthDialogAct: (state) => {
      state.successFaceAuth = false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logArriveFetchUsersThunk.fulfilled, (state, action) => {
      state.users = action.payload
    }).addCase(getUserForAuthFaceThunk.fulfilled, (state, action) => {
      console.log({action});
      if(action.payload == null) {
        state.showDialogNotRegisteredFaceId = true
      }else {
        const descriptor = []
        for(let i in action.payload.descriptor) {
          const n = action.payload.descriptor[i]
          descriptor.push(n)
        }
        state.logArriveStep = LogArriveStepEnum.scanFace
        state.userPickedDescriptor = Float32Array.from(descriptor) 
      }
      
    }).addCase(logFaceAuthThunk.fulfilled, (state, action) => {
      state.successFaceAuth = true
      state.userChoose = ""
      state.logArriveStep = LogArriveStepEnum.initial
     })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("LogArriveSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("LogArriveSlice"), (state) => {
      state.loading = false
    })
  },
})
export const { changeUserPickedAct, updateStepLogArriveViewAct, closeDialogNotFoundFaceIdAct, hideSuccesFaceAuthDialogAct } = LogArriveSlice.actions
export default LogArriveSlice.reducer