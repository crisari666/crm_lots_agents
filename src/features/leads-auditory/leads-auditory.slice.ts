import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getLeadCheckResumeForDialogReq, getLeadsPendingChecksReq } from "../../app/services/reports.service"
import { LeadsAuditoryState } from "./leads-auditory.state"

const initialState: LeadsAuditoryState = {
  loading: false,
  rows: [],
  filterDate: {
    startDate: new Date(),
    endDate: new Date()
  },
  leadResumeDetail: null
}
export const getTotalPendingsChecksThunk = createAsyncThunk( "LeadsAuditory/getTotalPendingsChecksThunk", async ({endDate, startDate} : {endDate: string, startDate: string}) => await getLeadsPendingChecksReq({endDate, startDate}))

export const getLeadResumeDetailThunk = createAsyncThunk( "LeadsAuditory/getLeadResumeDetailThunk", async (params: {dateStart: string, dateEnd: string, leadId: string}) => 
  await getLeadCheckResumeForDialogReq(params)
)

export const LeadsAuditorySlice = createSlice({
  name: "LeadsAuditory",
  initialState,
  reducers: {
    changeDateRangeAct: (state, action: PayloadAction<{startDate: Date, endDate: Date}>) => {
      state.filterDate = action.payload
    },
    closeResumeLeadDialogAct: (state) => {
      state.leadResumeDetail = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTotalPendingsChecksThunk.fulfilled, (state, action) => {
      state.rows = action.payload
    }).addCase(getLeadResumeDetailThunk.fulfilled, (state, action) => {
      state.leadResumeDetail = action.payload
    })


    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("LeadsAuditory"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("LeadsAuditory"), (state) => {
      state.loading = false
    })
  },
})
export const { changeDateRangeAct, closeResumeLeadDialogAct } = LeadsAuditorySlice.actions
export default LeadsAuditorySlice.reducer