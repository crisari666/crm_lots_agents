import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserCustomerFilterDate, UserCustomersState } from "./user-customers.state";
import { getActiveCustomersByStepForOfficeReq, getUserCustomersResumeDetailReq, gUserCustomersResumeReq } from "../../app/services/user-customers.service";
import moment from "moment";
import { getUserPaymentsByDatesReq } from "../../app/services/payments.service";
import { CustomerStepsFormFilter } from "../customer-steps-log/customer-step-log.state";

const initialState: UserCustomersState = {
  loading: false,
  activeCustomers: 0,
  customers: [],
  resumeUsers: {actives: 0, pendings: 0, success: 0},
  customerFilter: {dateStart: moment().toDate(), dateEnd: moment().toDate()},
  userPaymentsFilter: {dateStart: moment.utc().startOf('week').toDate(), dateEnd: moment.utc().endOf('week').toDate()},
  paymentsResume: {done: [], expected: []},
  customerStepLogs: []
}

export const getUserResumeCustomersThunk = createAsyncThunk( "UserCustomersSlice/getCustomerResumeUsers", async (userId: string) =>  await gUserCustomersResumeReq({userId}))

export const getUserCustomerResumeDetailThunk = createAsyncThunk( "UserCustomersSlice/getUserCustomerResumeDetailThunk", async ({dateEnd, dateStart, userId} : {userId: string, dateStart: string, dateEnd: string}) => await getUserCustomersResumeDetailReq({userId, dateEnd, dateStart}))

export const getUserPaymentsByDateThunk = createAsyncThunk( "UserCustomersSlice/getUserPaymentsByDateThunk", async ({userId, endDate, startDate} : {userId: string, startDate: string, endDate: string}) =>  await getUserPaymentsByDatesReq({endDate, startDate, userId}))

export const getActiveCustomersByStepForOfficeThunk = createAsyncThunk( "UserCustomersSlice/getActiveCustomersByStepForOfficeThunk", async ({filter} : {filter : CustomerStepsFormFilter}) =>  await getActiveCustomersByStepForOfficeReq({filter}))

export const UserCustomersSlice = createSlice({
  name: "UserCustomersSlice",
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<any>) => {
    },
    changeDateRangeUserCustomerResumeAct: (state, action: PayloadAction<UserCustomerFilterDate>) => {
      state.customerFilter = action.payload
    },
    changeDateRangeUserPaymentsAct: (state, action: PayloadAction<UserCustomerFilterDate>) => {
      state.userPaymentsFilter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserResumeCustomersThunk.fulfilled, (state, action) => {
      state.resumeUsers = action.payload
    }).addCase(getUserCustomerResumeDetailThunk.fulfilled, (state, action) => {
      state.customers = action.payload
    }).addCase(getUserPaymentsByDateThunk.fulfilled, (state, action) => {
      state.paymentsResume = action.payload
    }).addCase(getActiveCustomersByStepForOfficeThunk.fulfilled, (state, action) => {
      state.customerStepLogs = action.payload
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("UserCustomersSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("UserCustomersSlice"), (state) => {
      state.loading = false
    })
  },
})
export const { incrementByAmount, changeDateRangeUserCustomerResumeAct, changeDateRangeUserPaymentsAct } = UserCustomersSlice.actions
export default UserCustomersSlice.reducer