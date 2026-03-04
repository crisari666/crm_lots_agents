import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CampaignCustomersState, ReasonToNotAssignEnum } from "./campaign-customers-state";
import { getCampaignUsersDataReq } from "../../../../app/services/campaign.service";
import { addCustomerReq, checkCustomerExistReq, loadReclycedCstomersReq } from "../../../../app/services/customer.service";
import { NewCustomerFormI } from "../../../customers/customers-list/customers.state";
import { isOlderThan3Days } from "../../../../utils/date.utils";
import { getLeadCheckResumeForDialogReq } from "../../../../app/services/reports.service";

const initialState: CampaignCustomersState = {
  loading: false,
  usersCampaignData: [],
  showModalAddCustomers: false,
  listUpdated: false,
  showRecycledCustomersModal: false,
  allowToASign: false,
  reasonNotAssign: ReasonToNotAssignEnum.nothing,
  recycledCustomers: []
}

export const getCustomersCampaignDataThunk = createAsyncThunk( "CampaignCustomers/getCustomersCampaignDataThunk", async (campaignId: string) => await getCampaignUsersDataReq(campaignId))

export const assignNewLeadThunk = createAsyncThunk( "CampaignCustomers/assignNewLeadThunk", async ({customerData} : {customerData: NewCustomerFormI}) => await addCustomerReq({customerForm: customerData}))

export const assignCustomerRecycleThunk = createAsyncThunk( "CampaignCustomers/assignCustomerRecycleThunk", async ({customerData, index} : {customerData: NewCustomerFormI, index: number}) => await addCustomerReq({customerForm: customerData}))

export const checkCustomerExistThunk = createAsyncThunk( "CampaignCustomers/checkCustomerExist", async (phone: string) => await checkCustomerExistReq({phone}))

export const loadRecycledCustomersThunk = createAsyncThunk( "CampaignCustomers/loadRecycledCustomersThunk", async () => await loadReclycedCstomersReq())

export const campaignCustomersSlice = createSlice({
  name: "CampaignCustomers",
  initialState,
  reducers: {
    showModalAddCustomersAct: (state, action: PayloadAction<boolean>) => {
      state.showModalAddCustomers = action.payload
    },
    showRecycledCustomersModalAct: (state, action: PayloadAction<boolean>) => {
      state.showRecycledCustomersModal = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCustomersCampaignDataThunk.fulfilled, (state, action) => {
      console.log({action});
      
      state.usersCampaignData = action.payload.filter((u) =>Boolean(u.user.rank) && u.user.rank.title && !u.user.rank.title.includes('base')).sort((a, b) => a.user.rank.title.localeCompare(b.user.rank.title)).sort((a, b) => a.customers.length - b.customers.length)
    }).addCase(getCustomersCampaignDataThunk.pending, (state) => {
      state.listUpdated = false
    }).addCase(assignNewLeadThunk.fulfilled, (state) => {
      state.listUpdated = true
      state.customerResume = undefined
      state.showModalAddCustomers = false
      state.reasonNotAssign = ReasonToNotAssignEnum.nothing
    }).addCase(checkCustomerExistThunk.fulfilled, (state, action) => {
      state.customerResume = action.payload 
      state.allowToASign = true
      if(action.payload.customer && action.payload.customer.length > 0 && action.payload.customer[0].userAssigned.length > 0) {
        const customer = action.payload.customer[0]
        // console.log({customer}); 
        if((customer.historicalAssignations && customer.historicalAssignations.length > 0) && !isOlderThan3Days(customer.dateAssigned)) {
          state.allowToASign = false
          state.reasonNotAssign = ReasonToNotAssignEnum.recentlyAssigned
        }
        if(customer.payments && customer.payments.length > 0) {
          state.allowToASign = false
          state.reasonNotAssign = ReasonToNotAssignEnum.hasPayments
        }
        
      }
    }).addCase(checkCustomerExistThunk.pending, (state) => {
      state.customerResume = undefined
      state.reasonNotAssign = ReasonToNotAssignEnum.nothing
    }).addCase(loadRecycledCustomersThunk.fulfilled, (state, action) => {
      state.recycledCustomers = action.payload
    }).addCase(assignCustomerRecycleThunk.fulfilled, (state, action) => {
      state.listUpdated = true
      state.reasonNotAssign = ReasonToNotAssignEnum.nothing
      const indexC = action.meta.arg.index
      state.recycledCustomers.splice(indexC, 1)
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("CampaignCustomers"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CampaignCustomers"), (state) => {
      state.loading = false
    })
  },
})
export const { showModalAddCustomersAct, showRecycledCustomersModalAct } =campaignCustomersSlice.actions
export default campaignCustomersSlice.reducer