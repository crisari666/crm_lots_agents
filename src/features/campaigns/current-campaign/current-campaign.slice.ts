import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CurrentCampaignStateI } from "./current-campaign.state"
import { createCampaignReq, getCurrentCampaignReq, switchCampaignReq, toggleAllowModifyOfficeCampaignDatabaseReq, toggleAllowModifyOfficeCampaignReq, toggleAutomaticModeReq, toggleEnableCampaignDatabaseReq, toggleSingleUserFromCampaignDatabaseReq, toggleSingleUserFromCampaignReq } from "../../../app/services/campaign.service"
import { getOfficeLeadWithUsersReq } from "../../../app/services/offices.service"

const initialState: CurrentCampaignStateI = {
  currentCampaignGot: false,
  officesCampaigns: [],
  offices: [],
  loading: true
}

export const getCurrentCampaignThunk  = createAsyncThunk("CurrentCampaign/getCurrentCampaignThunk", async () => await getCurrentCampaignReq())

export const createCampaignThunk = createAsyncThunk("CurrentCampaign/createCampaignThunk", async () => await createCampaignReq())

export const getOfficeLeadsWithUsersThunk = createAsyncThunk("CurrentCampaign/getOfficeLeadsWithUsersThunk", async () => await getOfficeLeadWithUsersReq())

export const switchCurrentCampaignThunk = createAsyncThunk("CurrentCampaign/switchCurrentCampaignThunk", async ({ enable } : { enable : boolean}) => {
  const campaign = await switchCampaignReq({enable})
  return campaign
})

export const toggleCampaignDatabaseThunk = createAsyncThunk( "CurrentCampaign/toggleCampaignDatabase", async (params: {campaignGlobalId: string, enable:boolean}) =>
  await toggleEnableCampaignDatabaseReq({campaignId: params.campaignGlobalId, enable: params.enable})
)

export const toggleUserFromCampaignThunk = createAsyncThunk("CurrentCampaign/toggleUserFromCampaig", async ({index, userId, officeCampaignId} : {index: number, userId : string, officeCampaignId: string}) => {
  const officeCampaign = await toggleSingleUserFromCampaignReq({userId, officeCampaignId})
  return {officeCampaign, index}
})
export const toggleUserFromCampaignDatabaseThunk = createAsyncThunk("CurrentCampaign/toggleUserFromCampaig", async ({index, userId, officeCampaignId} : {index: number, userId : string, officeCampaignId: string}) => {
  const officeCampaign = await toggleSingleUserFromCampaignDatabaseReq({userId, officeCampaignId})
  return {officeCampaign, index}
})

export const toggleAllowModifyOfficeCampaingThunk = createAsyncThunk( "CurrentCampaign/toggleAllowModifyOfficeCampaingThunk", async (params: {officeId: string, allow: boolean, officeIndex: number}) => 
  await toggleAllowModifyOfficeCampaignReq(params)  
)
export const toggleAllowModifyOfficeCampaingDatabaseThunk = createAsyncThunk( "CurrentCampaign/toggleAllowModifyOfficeCampaingDatabaseThunk", async (params: {officeId: string, allow: boolean, officeIndex: number}) => 
  await toggleAllowModifyOfficeCampaignDatabaseReq(params)  
)

export const toggleAutomaticModeThunk = createAsyncThunk( "CurrentCampaign/toggleAutomaticModeThunk", async (params: {officeId: string, automaticMode: boolean, officeIndex: number}) => {
  const officeCampaign = await toggleAutomaticModeReq({officeId: params.officeId, automaticMode: params.automaticMode})
  return {officeCampaign, officeIndex: params.officeIndex}
})

export const CurrentCampaingSlice = createSlice({
  name: "CurrentCampaing",
  initialState,
  reducers: {
    setLoadingCurrentCampaingAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getCurrentCampaignThunk.fulfilled, (state, action) => {
      state.currentCampaign = action.payload.campaign
      state.officesCampaigns = action.payload.officesCampaigns
      state.currentCampaignGot = true
      state.loading = false
    }).addCase(createCampaignThunk.fulfilled, (state, action) => {
      state.loading = false
      state.currentCampaign = action.payload
      state.currentCampaignGot = true
    }).addCase(getOfficeLeadsWithUsersThunk.fulfilled, (state, action) => {
      state.offices = action.payload
    }).addCase(switchCurrentCampaignThunk.fulfilled, (state, action) => {
      state.currentCampaign = action.payload
      state.loading = false
    }).addCase(toggleUserFromCampaignThunk.fulfilled, (state, action) => {      
      state.offices[action.payload.index].leads[0].officeCampaign[0] = action.payload.officeCampaign
    }).addCase(toggleAllowModifyOfficeCampaingThunk.fulfilled, (state, action) => {
      state.offices[action.payload.officeIndex].leads[0].officeCampaign[0] = action.payload.officeCampaign
    }).addCase(toggleCampaignDatabaseThunk.fulfilled, (state, action) => {
      state.currentCampaign = action.payload
    }).addCase(toggleAllowModifyOfficeCampaingDatabaseThunk.fulfilled, (state, action) => {
      state.offices[action.payload.officeIndex].leads[0].officeCampaign[0] = action.payload.officeCampaign
    }).addCase(toggleAutomaticModeThunk.fulfilled, (state, action) => {
      state.offices[action.payload.officeIndex].leads[0].officeCampaign[0] = action.payload.officeCampaign
    })


    builder.addMatcher((action) => {
      return action.type.endsWith("/pending") && action.type.includes("CurrentCampaign")
    }, (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CurrentCampaign"), (state) => {
      state.loading = false
    })

  },
})

export const { setLoadingCurrentCampaingAct } = CurrentCampaingSlice.actions

export default CurrentCampaingSlice.reducer