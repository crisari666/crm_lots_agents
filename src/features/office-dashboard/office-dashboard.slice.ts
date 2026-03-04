import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { OfficeDashboardState } from "./office-dashboard.state";
import moment from "moment";
import { getOfficeActiceUserCustomers, getOfficeCustomersResumeDetailReq } from "../../app/services/user-customers.service";
import { getOfficePaymentsByDatesReq } from "../../app/services/payments.service";
import { OfficeInterface } from "../../app/models/office.inteface";
import { getOfficeReq } from "../../app/services/offices.service";

const initialState: OfficeDashboardState = {
  loading: false,
  currentOffice: undefined,
  customersResume: [],
  customersResumeActive: [],
  customersResumeFilter: {
    dateStart: moment.utc().startOf('w').toDate(), 
    dateEnd: moment.utc().endOf('w').toDate(), 
  },
  paymentResumeFilter: {
    dateStart: moment.utc().startOf('week').toDate(), 
    dateEnd: moment.utc().endOf('week').toDate(), 
  },
  paymentsResume: {
    done: [],
    expected: []
  }

}
export const getOfficeCustomersResumeThunk = createAsyncThunk( "OfficeDashboard/getOfficeCustomersResumeThunk", async (params : {officeId: string, dateStart: string, dateEnd: string}) => 
  await getOfficeCustomersResumeDetailReq(params)
)

export const getOfficePaymentsResumeThunk = createAsyncThunk( "OfficeDashboard/getOfficePaymentsResumeThunk", async (params : {officeId: string, dateStart: string, dateEnd: string}) => 
  await getOfficePaymentsByDatesReq(params)
)

export const getOfficeActiceUserCustomersThunk = createAsyncThunk( "OfficeDashboard/getOfficeActiceUserCustomersThunk", async (params : {officeId: string}) => 
  await getOfficeActiceUserCustomers(params)
)

export const getOfficeForDashboardThunk = createAsyncThunk( "OfficeDashboard/getOfficeForDashboardThunk", async (params : {officeId: string}) => 
  await getOfficeReq({officeId: params.officeId})
)


export const OfficeDashboardSlice = createSlice({
  name: "OfficeDashboard",
  initialState,
  reducers: {
    changeFilterCustomersResumeOfficeAct: (state, action: PayloadAction<{dateEnd: Date, dateStart: Date}>) => {
      state.customersResumeFilter = action.payload
    },
    changeFilterPaymentsResumeOfficeAct: (state, action: PayloadAction<{dateEnd: Date, dateStart: Date}>) => {
      state.paymentResumeFilter = action.payload
    },
    setCurrentOfficeDashboardAct: (state, action: PayloadAction<OfficeInterface | undefined>) => {
      state.currentOffice = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getOfficeCustomersResumeThunk.fulfilled, (state, action) => {
      state.customersResume = action.payload
    }).addCase(getOfficePaymentsResumeThunk.fulfilled, (state, action) => {
      state.paymentsResume = action.payload
    }).addCase(getOfficeActiceUserCustomersThunk.fulfilled, (state, action) => {
      state.customersResumeActive = action.payload
    }).addCase(getOfficeForDashboardThunk.fulfilled, (state, action) => {
      console.log('getOfficeForDashboardThunk', {action})
      state.currentOffice = action.payload
    })
    
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("OfficeDashboard"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("OfficeDashboard"), (state) => {
      state.loading = false
    })
  },
})
export const { changeFilterCustomersResumeOfficeAct, changeFilterPaymentsResumeOfficeAct, setCurrentOfficeDashboardAct } =OfficeDashboardSlice.actions
export default OfficeDashboardSlice.reducer