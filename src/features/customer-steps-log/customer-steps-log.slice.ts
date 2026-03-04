import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CustomerStepsFormFilter, CustomerStepsLogState } from "./customer-step-log.state";
import { getCurrenDateUtil } from "../../utils/date.utils";
import { getCustomersByStepLogReq } from "../../app/services/customer.service";
const initialState: CustomerStepsLogState = {
  loading: false,
  formFitler: {
    dateStart: getCurrenDateUtil(),
    dateEnd: getCurrenDateUtil(),
    excludeDate: false,
    step: "",
  },
  customers: []
}


export const fetchUsersByStepsThunk = createAsyncThunk( "CystomerStepsLog/fetchUsersBySteps", async (filter: CustomerStepsFormFilter) => await getCustomersByStepLogReq({filter}))

export const CustomerStepsLogSlice = createSlice({
  name: "CustomerStepsLog",
  initialState,
  reducers: {
    updateInputFormUserLogStepAct: (state, action: PayloadAction<{name: string, val: any}>) => {
      state.formFitler[action.payload.name] = action.payload.val
    },

  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsersByStepsThunk.fulfilled, (state, action) => {
      state.customers = action.payload
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("CustomerStepsLog"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CustomerStepsLog"), (state) => {
      state.loading = false
    })
  },
})
export const { updateInputFormUserLogStepAct } =CustomerStepsLogSlice.actions
export default CustomerStepsLogSlice.reducer