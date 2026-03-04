import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { siginReq, updateFcmTokenForUserReq } from "../../app/services/users.service"
import { OmegaSoftConstants } from "../../app/khas-web-constants"
import { SigninStateI, UserPositionI } from "./sigin-state"
import "immer"


const initialState: SigninStateI = {
  loading: false, logout: false, endSession: false, endSessionForce: false, wrongCredential: false
}

export const signInUserThunk = createAsyncThunk( "siginslice/signin", async ({user, password, lat, lng}: {user: string, password: string, lat: number, lng: number}) => {
  const response = await siginReq({user, password, lat,lng})
  return response
},
)

export const setUserFCMTokenThunk = createAsyncThunk( "sigingslice/setUserFCMTokenThunk", async (fcm: string) =>
  await updateFcmTokenForUserReq({FCM: fcm}))

export const signinSlice = createSlice({
  name: "siginslice",
  initialState,
  reducers: {
    setLoadingSigin: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    endSessionForceUserAction: (state) => {
      state.endSessionForce = true
    },
    resetEndSessionForce: (state) => {
      state.endSessionForce = false
    },
    logoutAction: (state) => {
      localStorage.removeItem(OmegaSoftConstants.localstorageAuthKey);
      localStorage.removeItem(OmegaSoftConstants.localstorageTokenKey)
      state.endSessionForce = true
      state.logout = true
    },
    checkUserAtLocalStorageAction: (state) => {
      const dataUser = localStorage.getItem(OmegaSoftConstants.localstorageAuthKey);
      if(dataUser){
        state.currentUser = JSON.parse(dataUser);
      } else {
        state.endSession = true
      }
    },
    setUserPositionAct: (state, action: PayloadAction<UserPositionI | undefined>) => { 
      state.userPosition = action.payload
    },
    toggleWrongCredentials: (state, action: PayloadAction<boolean>) => {
      state.wrongCredential = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(signInUserThunk.pending, (state) => {state.loading = true})
    builder.addCase(signInUserThunk.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false
      const responseSigning = action.payload
      
      if(responseSigning === false){
        state.success = false
        state.wrongCredential = true
      }else {
        const { token } = responseSigning
        localStorage.setItem(OmegaSoftConstants.localstorageAuthKey, JSON.stringify(responseSigning));
        localStorage.setItem(OmegaSoftConstants.localstorageTokenKey, token)
        state.currentUser = responseSigning
        state.success = true
      }
  })
    
  },
})

export const { setLoadingSigin, logoutAction, checkUserAtLocalStorageAction, endSessionForceUserAction, resetEndSessionForce, toggleWrongCredentials, setUserPositionAct } = signinSlice.actions

export default signinSlice.reducer
