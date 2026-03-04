import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getStepStatsReq, graphPayedReq, graphPaymentsReq, stepsByWeeksGraphReq } from "../../../app/services/stats.service"
import { StatisticsState } from "./statistics.state"
const initialState: StatisticsState = {
  loading: false,
  graphPayments: [{payed: 0, projected: 0, confirmed: 0, downloaded: 0, projectedIrregular: 0, payedIrregular: 0}],
  graphPayed: [{totalDownloaded: 0, totalPayments: 0, totalTrusted: 0, totalUntrusted: 0}],
  loadingStepStats: false,
  formStepStats: {
    stepId: "",
    office: "",
    period: "day",
    userId: "",
  },
  stepGraphData: {x: [], y: []},
  groupsStepwByWeekGraph: [],
  stepsByWeeksGraph: [],
}
export const getStepStatsThunk = createAsyncThunk( "Statistics/getStepStatsThunk", async ({stepId, office, period, userId} : {stepId : string, userId: string, office: string, period: "day" | "week" | "month"}) =>  await getStepStatsReq({stepId, office, period, userId}))

export const loadPaysGraphThunk = createAsyncThunk( "Statistics/loadPaysGraphThunk", async (PARAM: {startDate: string, endDate: string, office: string, userId: string}) => await graphPaymentsReq(PARAM))

export const loadPayedGraphThunk = createAsyncThunk( "Statistics/loadPayedGraphThunk", async (PARAM: {startDate: string, endDate: string, office: string, userId: string}) => await graphPayedReq(PARAM))

export const stepByWeeksGraphThunk = createAsyncThunk( "Statistics/stepByWeeksGraph", async (PARAM: any) => await stepsByWeeksGraphReq(PARAM))



export const statisticsSlice = createSlice({
  name: "Statistics",
  initialState,
  reducers: {
    changeInputStepStatsAct: (state, action: PayloadAction<{name: string, val: string}>) => {
      state.formStepStats[action.payload.name] = action.payload.val
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStepStatsThunk.fulfilled, (state, action) => {
      state.stepGraphData = action.payload
    }).addCase(loadPaysGraphThunk.fulfilled, (state, action) => {
      console.log({action});
      
      state.graphPayments = action.payload
    }).addCase(stepByWeeksGraphThunk.fulfilled, (state, action) => {
      state.stepsByWeeksGraph = action.payload.data
      state.groupsStepwByWeekGraph = action.payload.groups
    }).addCase(loadPayedGraphThunk.fulfilled, (state, action) => {
      state.graphPayed = action.payload
    })
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("Statistics"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("Statistics"), (state) => {
      state.loading = false
    })
  },
})
export const { changeInputStepStatsAct } =statisticsSlice.actions
export default statisticsSlice.reducer