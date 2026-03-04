import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { QrArriveState } from "./qr-arrive.state";
import { generateQrForUserReq } from "../../../app/services/log-arrive.service";
import { store } from "../../../app/store";
import { pushAlertAction } from "../../dashboard/dashboard.slice";
import { getArriveForUsersAndDateReq } from "../../../app/services/user-logs.service";
import { OfficeInterface } from "../../../app/models/office.inteface";
const initialState: QrArriveState = {
  loading: false,
  qrCode: "",
  registeringArrive: false,
  userPicked: "",
  errorMessage: '',
  usersArriveLogs: {}
}
export const generateQrCodeForUserThunk = createAsyncThunk( "QrArrive/fetchCount", async (params :{userId: string, officeId: string}) => {
  const qrCode = await generateQrForUserReq(params)
  if(typeof qrCode === 'object' && qrCode.trustedDate != null) {
    store.dispatch(pushAlertAction({
      title: 'Registro realizado',
      type: "warning",
      message: 'Este usuario ya registro su llegada',
    }))
  }
  return qrCode;
})

export const getUserArriveLogsThunk = createAsyncThunk( "QrArrive/getUserArriveLogs", async (PARAM: {users: string[], date: string}) =>
  await getArriveForUsersAndDateReq(PARAM))

export const qrArriveSlice = createSlice({
  name: "QrArrive",
  initialState,
  reducers: {
    displayRegisteringAct: (state, action: PayloadAction<boolean>) => {
      state.registeringArrive = action.payload
      if(action.payload === false) {
        state.qrCode = ""
        state.userPicked = ""
      }
    },
    setOfficeQrSlice: (state, action: PayloadAction<OfficeInterface>) => {
      state.office = action.payload
    }
  },
  extraReducers: (builder) => {

    builder.addCase(generateQrCodeForUserThunk.fulfilled, (state, action) => {
      if(typeof action.payload === 'string') {
        state.errorMessage = action.payload
      } else {
        if(action.payload.trustedDate == null)  {
          state.qrCode = action.payload.code
          state.userPicked = action.payload.user
        } else {
          state.registeringArrive = false
          state.qrCode = ""
          state.userPicked = ""
        }
      }
    }).addCase(generateQrCodeForUserThunk.pending, (state, action) => {
      state.qrCode = ""
    }).addCase(getUserArriveLogsThunk.fulfilled, (state, action) => {
      state.usersArriveLogs = action.payload
    })
    
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("QrArrive"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("QrArrive"), (state) => {
      state.loading = false
    })
  },
})
export const { displayRegisteringAct, setOfficeQrSlice } = qrArriveSlice.actions
export default qrArriveSlice.reducer