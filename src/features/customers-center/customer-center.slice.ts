import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CustomerCenterFilter, CustomersCenterState, DialogChangeCustomerUser } from "./components/customer-center.state";
import { filterCustomersAdminReq, setUserToCustomerReq } from "../../app/services/customer.service";
import { setCustomerStepThunk } from "../customers/customers-list/customers.slice";

const initialState: CustomersCenterState = {
  loading: false,
  customers: [],
  filter: {
    type: '',
    value: "",
    excludeDate: false, 
    dateStart: new Date(),
    dateEnd: new Date(),
    step: '',
    office: '',
    userAssigned: ''
  }
}
export const filterCustomersThunk = createAsyncThunk( "CustomersCenter/filterCustomers", async (filter : CustomerCenterFilter) => await filterCustomersAdminReq(filter))

export const setUsetToCustomerThunk = createAsyncThunk( "CustomersCenter/setUsetToCustomerThunk", async (params: {customerId: string, userId: string, officeId: string}) =>
  await setUserToCustomerReq(params)
)

export const CustomersCenterSlice = createSlice({
  name: "CustomersCenter",
  initialState,
  reducers: {
    incrementByAmount: (state, action: PayloadAction<any>) => {
    },
    changeDateFilterAct: (state, action: PayloadAction<{dateStart: Date, dateEnd: Date}>) => {
      state.filter.dateStart = action.payload.dateStart
      state.filter.dateEnd = action.payload.dateEnd
    },
    changeValueFilterAct: (state, action: PayloadAction<string>) => {
      state.filter.value = action.payload
    },
    changeExcludeDateFilterAct: (state, action: PayloadAction<boolean>) => { 
      state.filter.excludeDate = action.payload
    },
    changeOfficeCustomerCenterFilterAct: (state, action: PayloadAction<string>) => {  
      state.filter.office = action.payload
    },
    changeUserCustomerCenterFilterAct: (state, action: PayloadAction<string>) => {
      state.filter.userAssigned = action.payload
    },
    changeTypeFilterAct: (state, action: PayloadAction<string>) => {
      state.filter.type = action.payload
    }, 
    changeStepFilterAct: (state, action: PayloadAction<string>) => {
      state.filter.step = action.payload
    },
    setDialogChangeCustomerUserAct: (state, action: PayloadAction<DialogChangeCustomerUser | undefined>) => {
      state.dialogChangeCustomerUser = action.payload
    },
    changeInputOfficeCustomerAct: (state, action: PayloadAction<string>) => {
      state.dialogChangeCustomerUser!.officeId = action.payload
    },
    changeInputUserCustomerAct: (state, action: PayloadAction<string>) => {
      state.dialogChangeCustomerUser!.newUserId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(filterCustomersThunk.fulfilled, (state, action) => {
      state.customers = action.payload
    }).addCase(setCustomerStepThunk.fulfilled, (state, action) => {
      const customerIndex = state.customers.findIndex((customer) => customer._id === action.payload.customerId)      
      if(customerIndex !== -1) state.customers[customerIndex].step = [action.payload.step]
    }).addCase(setUsetToCustomerThunk.fulfilled, (state, action) => {
      state.dialogChangeCustomerUser = undefined

    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("CustomersCenter"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CustomersCenter"), (state) => {
      state.loading = false
    })
  },
})
export const { incrementByAmount, changeDateFilterAct, changeValueFilterAct, changeOfficeCustomerCenterFilterAct, changeUserCustomerCenterFilterAct, changeExcludeDateFilterAct, changeTypeFilterAct, setDialogChangeCustomerUserAct, changeInputOfficeCustomerAct, changeInputUserCustomerAct, changeStepFilterAct } =CustomersCenterSlice.actions
export default CustomersCenterSlice.reducer