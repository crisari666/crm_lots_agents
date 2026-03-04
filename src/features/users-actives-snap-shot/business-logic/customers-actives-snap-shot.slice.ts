import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CustomersActivesSnapShotState } from "./customers-actives-snap-shot.state";
import { fetchSnapShotCustomersActivesByDateReq } from "../../../app/services/cron-jobs.service";
import { getCurrenDateUtil } from "../../../utils/date.utils";
const initialState: CustomersActivesSnapShotState = {
  loading: false,
  customers: [],
  filterDate: getCurrenDateUtil()
}
export const fetchSnapShotCustomersActivesByDateThunk = createAsyncThunk( "fetchSnapShotCustomersActivesByDateThunk/fetchCount", async (date: string) =>  await fetchSnapShotCustomersActivesByDateReq({date}))

export const CustomersActivesSnapShotSlice = createSlice({
  name: "CustomersActivesSnapShot",
  initialState,
  reducers: {
    changeDateFilterValAct: (state, action: PayloadAction<string>) => {
      state.filterDate = action.payload
    },  
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSnapShotCustomersActivesByDateThunk.fulfilled, (state, action) => {
      state.customers = action.payload
    })


    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("CustomersActivesSnapShot"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CustomersActivesSnapShot"), (state) => {
      state.loading = false
    })
  },
})
export const { changeDateFilterValAct } =CustomersActivesSnapShotSlice.actions
export default CustomersActivesSnapShotSlice.reducer