import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuditResumeFilter, AuditResumeState } from "./audit-resume.state"
import { getCurrenDateUtil } from "../../utils/date.utils"
import { getAuditResumeReq, getUserAuditResumeReq } from "../../app/services/reports.service"

const initialState: AuditResumeState = {
  loading: false,
  auditResume: [],
  currentResumeDate: {endDate: '', startDate: ""},
  auditFormFilter: {
    excludeDate: false,
    startDate: getCurrenDateUtil(),
    endDate: getCurrenDateUtil(),
    officeId: "",
    userId: "",
  },
}
export const getAuditResumeThunk = createAsyncThunk( "AuditResume/getAuditResumeThunk", async (params: AuditResumeFilter) =>  await getAuditResumeReq({param: params}))

export const getUserAuditResumeThunk = createAsyncThunk( "AuditResume/getUserAuditResumeThunk", async (params: {userId: string, startDate: string, endDate: string}) => await getUserAuditResumeReq(params))

export const AuditResumeSlice = createSlice({
  name: "AuditResume",
  initialState,
  reducers: {
    changeAuditFormInputAct: (state, action: PayloadAction<{name: string, val: string}>) => {
      state.auditFormFilter[action.payload.name] = action.payload.val
    },
    setCurrentResumeDatesAct: (state, action: PayloadAction<{startDate: string, endDate: string}>) => {
      state.currentResumeDate = action.payload
    },
    closeDialogUserAuditResumeAct: (state) => {
      state.auditUserResume = undefined
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAuditResumeThunk.fulfilled, (state, action) => {
      state.auditResume = action.payload
    }).addCase(getUserAuditResumeThunk.fulfilled, (state, action) => {
      state.auditUserResume = action.payload
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("AuditResume"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("AuditResume"), (state) => {
      state.loading = false
    })
  },
})
export const { changeAuditFormInputAct, setCurrentResumeDatesAct, closeDialogUserAuditResumeAct } =AuditResumeSlice.actions
export default AuditResumeSlice.reducer