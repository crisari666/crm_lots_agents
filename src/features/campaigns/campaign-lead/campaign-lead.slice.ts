import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CampaignLeadState } from "./campaign-lead.state"
import { addUsersDatabase, addUsersToCampaignReq, getCampaignForLeadReq } from "../../../app/services/campaign.service"

const initialState: CampaignLeadState = {
  loading: false,
  campaigGot: false,
  officeUsers: [],
  usersChose: [],
  userChoseDatabase: [],
  showAlertSureSaveCampaign: false,
  showAlertSureSaveCampaignDatabase: false
}

export const getOfficeCampaignThunk = createAsyncThunk("CampaignLead/getOfficeCampaign", async () => {
  const campaign = await getCampaignForLeadReq()
  console.log({campaign});
  
  return campaign
})

export const addUsersToCampaignThunk = createAsyncThunk("CampaignLead/addUsersToCampaignThunk", async ({ users } : { users : string[]}) => 
  await addUsersToCampaignReq({users})
)

export const addUsersToCampaignDatabaeThunk = createAsyncThunk( "CampaignLead/addUsersToCampaignDatabaeThunk", async (users: string[]) => await addUsersDatabase({users}))

export const CampaignLeadSlice = createSlice({
  name: "CampaignLead",
  initialState,
  reducers: {
    setLoadingCampaignLeadAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    chooseUseToCampaignrAct: (state, action: PayloadAction<string>) => {
      state.usersChose.push(action.payload)
    },
    removeUserFromCampaignAct: (state, action: PayloadAction<string>) => {
      state.usersChose = state.usersChose.filter((user) => user !== action.payload)
    },
    chooseUserToCombineDatabaseAdsAct: (state, action: PayloadAction<string>) => {
      state.userChoseDatabase.push(action.payload)
    },
    removeUserFromCompileDatabaseAppsAct: (state, action: PayloadAction<string>) => {
      state.userChoseDatabase = state.userChoseDatabase.filter((user) => user !== action.payload)
    },
    showAlertSureSaveCampaignAct: (state, action: PayloadAction<boolean>) => {
      state.showAlertSureSaveCampaign = action.payload
    },
    showAlertSureSaveCampaignDatabaseAct: (state, action: PayloadAction<boolean>) => {
      state.showAlertSureSaveCampaignDatabase = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getOfficeCampaignThunk.fulfilled, (state, action) => {
      state.campaigGot = true
      if(action.payload.officeCampaign !== null && action.payload.campaign !== null) {
        state.officeCampaign = action.payload.officeCampaign
        state.campaign = action.payload.campaign
      }
    }).addCase(addUsersToCampaignThunk.pending, (state) => {
      state.showAlertSureSaveCampaign = false
      state.officeCampaign!.allow = false
    }).addCase(addUsersToCampaignThunk.fulfilled, (state, action) => {
      state.officeCampaign = action.payload
      state.usersChose = []
    }).addCase(addUsersToCampaignDatabaeThunk.pending, (state) => {
      state.userChoseDatabase = []
      state.officeCampaign!.allowDatabase = false
      state.showAlertSureSaveCampaignDatabase = false
    }).addCase(addUsersToCampaignDatabaeThunk.fulfilled, (state, action) => {
      state.userChoseDatabase = []
      state.officeCampaign = action.payload
    })

    builder.addMatcher((action) => action.type.endsWith("pending"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("fulfilled"), (state) => {
      state.loading = false
    })
    
  },
})

export const { setLoadingCampaignLeadAct, chooseUseToCampaignrAct, removeUserFromCampaignAct, showAlertSureSaveCampaignAct,chooseUserToCombineDatabaseAdsAct,removeUserFromCompileDatabaseAppsAct, showAlertSureSaveCampaignDatabaseAct } = CampaignLeadSlice.actions

export default CampaignLeadSlice.reducer