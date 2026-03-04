import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getUsersWithoutCustomersByWeekReq, getUsersWithoutCustomersWeeksReq } from "../../../app/services/cron-jobs.service"
import { UsersWithoutCustomersState } from "./users-without-customers.state"
const initialState: UsersWithoutCustomersState = {
  loading: false,
  weeks: [], 
}
export const getWeeksThunk = createAsyncThunk( "UsersWithoutCustomers/getWeeksThunk", async () =>  await getUsersWithoutCustomersWeeksReq())

export const getUsersWithoutCustomersByWeekThunk = createAsyncThunk( "SLICE_NAME/getUsersWithoutCustomersByWeekThunk", async (reportId: string) => await getUsersWithoutCustomersByWeekReq(reportId))

export const usersWithoutCustomersSlice = createSlice({
  name: "UsersWithoutCustomers",
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<any>) => {
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWeeksThunk.fulfilled, (state, action) => {
      state.weeks = action.payload
    }).addCase(getUsersWithoutCustomersByWeekThunk.fulfilled, (state, action) => {
      state.result = action.payload
    })
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("UsersWithoutCustomers"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("UsersWithoutCustomers"), (state) => {
      state.loading = false
    })
  },
})
export const { incrementByAmount } =usersWithoutCustomersSlice.actions
export default usersWithoutCustomersSlice.reducer