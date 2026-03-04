import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getCurrenDateUtil, numberToTime } from "../../../utils/date.utils"
import { getLoginUserLogsReq, getUserArrieTimeReq, updateUserTimeArriveReq } from "../../../app/services/user-logs.service"
import { UserSesionLogInterface } from "./user-sessions.state"

const initialState: UserSesionLogInterface = {
  userId: "",
  userName: "",
  loading: false,
  userTimeForm: {
    time: "15:00"
  },
  logs: [],
  form: {
    start: getCurrenDateUtil(),
    end: getCurrenDateUtil(),
  }
}

export const getUserSessionsLogsThunk = createAsyncThunk("userSessionsLogSlice/getUserSessionsLogs", async ({end, start, userId} : {start: string, end: string, userId: string}) => 
   await getLoginUserLogsReq({end, start, userId})
)

export const getUserArriveTimeThunk = createAsyncThunk( "userSessionsLogSlice/getUserArriveTimeThunk", async (userId: string) =>
  await getUserArrieTimeReq({userId})
)
export const updateUserArriveTimeThunk = createAsyncThunk( "userSessionsLogSlice/getUserArrieTimeReq", async ({userId, time} : {userId: string, time: number}) =>
  await updateUserTimeArriveReq({userId, time})
)



export const eventsGatewaySlice = createSlice({
  name: "userSessionsLogSlice",
  initialState,
  reducers: {
    setUserIdSessionsLogAct: (state, action: PayloadAction<string>)  => {
     state.userId = action.payload
    },
    updateFormInputUserLogsAct: (state, action: PayloadAction<{key: string, value: string}>) => {
      const { key, value } = action.payload
      state.form[key] = value 
    },
    changeUserArriveTimeInputAct: (state, action: PayloadAction<string>) => {
      state.userTimeForm.time = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(getUserSessionsLogsThunk.fulfilled, (state, action) => {
      state.logs = action.payload
    }).addCase(getUserArriveTimeThunk.fulfilled, (state, action) => {
      state.userTimeForm.time = numberToTime(action.payload.time)
    })
    
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("userSessionsLogSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("userSessionsLogSlice"), (state) => {
      state.loading = false
    })
  },
})

export const { setUserIdSessionsLogAct, updateFormInputUserLogsAct, changeUserArriveTimeInputAct, } = eventsGatewaySlice.actions

export default eventsGatewaySlice.reducer
