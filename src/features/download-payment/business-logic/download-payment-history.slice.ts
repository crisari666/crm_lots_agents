import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DownloadedPaysLogsState, MainPartnersExpensesPercentageType, OfficesUtlityData } from "./download-payment-history.state"
import { getCampaignByIdReq, getCampaignsListReq, saveCampaignUtilityReq, getOfficesGoalsResumeReq } from "../../../app/services/campaign.service"
import { getPaymendDowloadedByCampaignReq, getWorkerLastCampaignsPaymentsReq } from "../../../app/services/payments.service"
import { totalExpensesByCampaignReq } from "../../../app/services/expenses.service"
import { AppAutocompleteOption } from "../../../app/components/app-autocomplete"
import { MultiplePercentageType } from "./download-payment.state"

export const thunkAsync = createAsyncThunk( "DownloadedPaysLogs/fetchCount", async (amount: number) => await setTimeout(() => {}, 2000))

const mainExpensePercentageInit: MainPartnersExpensesPercentageType = {main1: 80, main2: 20, expensesMain1: 0, expensesMain2: 0, utilityLeastExpenses: 0, platformPercentage: 5, platformUtility: 0, main1leastExpenses:0, main1PlatformPercentage: 0, main2leastExpenses: 0, main2PlatformPercentage: 0, main1WithoutPlatform: 0, main2WithoutPlatform: 0, main1WithoutPartners: 0, partnersExpense: 0, platformValue: 0, platformPercentageUtility: 0}

const initialState: DownloadedPaysLogsState = {
  loading: false,
  campaignPicked: '',
  campaignsHistory: [],
  paymentsLogs: [],
  totalUtility: 0,
  totalExpenses: 0,
  calculateExpenses: false,
  main1Pays: 0,
  main2Pays: 0,
  mainExpensesPercentage: mainExpensePercentageInit,
  partnersPercentage: [],
  showModalAddPartner: false,
  userSearch: "",
  userSearchTotal: 0,
  showResumeDialog: false,
  usersResume: {},
  usersResumeFiltered: {},
  officeSearch: "",
  campaignDownloaded: false, 
  officesUtility: {
    negativeValue: 0,
    utilityLeads: 0,
    officesUtility: {}
  },
  getUserData: false,
  partners: {
    after: 0, 
    before: 0,
    percentage: 0,
    userPercentageData: [],
    users: [],
    value: 0
  },
  officesGoalsResume: [],
  totalCustomersCreated: 0,
  workerPaymentsHistory: [],
}

export const getCampaignInfoThunk = createAsyncThunk( "DownloadedPaysLogs/getCampaignInfoThunk", async (campaignId: string) => await getCampaignByIdReq({campaignId}))

export const getCampaignsHistoryThunk = createAsyncThunk("DownloadedPaysLogs/getCampaignsHistory", async () => await getCampaignsListReq())

export const getPaymendDowloadedByCampaignThunk = createAsyncThunk("DownloadedPaysLogs/getPaymendDowloadedByCampaignThunk", async ({campaignId} : {campaignId: string}) => await getPaymendDowloadedByCampaignReq({campaignId}))

export const getTotalExpensesByCampaignThunk = createAsyncThunk( "DownloadedPaysLogs/totalExpensesByCampaign", async (campaignId: string) => await totalExpensesByCampaignReq({campaignId}))

export const saveCampaignUtilityThunk = createAsyncThunk( "DownloadedPaysLogs/saveCampaignUtilityThunk", async (params : {campaignId: string, mainUtility: number, partners: MultiplePercentageType, platform: number, negativeValue: number, utilityLeads: number, officesUtility: OfficesUtlityData}) => await saveCampaignUtilityReq(params))

export const getOfficesGoalsResumeThunk = createAsyncThunk("DownloadedPaysLogs/getOfficesGoalsResumeThunk",async (campaignId: string) => await getOfficesGoalsResumeReq({ campaignId }));

export const getWorkerLastCampaignsPaymentsThunk = createAsyncThunk(
  "DownloadedPaysLogs/getWorkerLastCampaignsPaymentsThunk",
  async () => await getWorkerLastCampaignsPaymentsReq()
);

export const downloadedPaysLogsSlice = createSlice({
  name: "DownloadedPaysLogs",
  initialState,
  reducers: {
    changeCampaignPaysLogsAct: (state, action: PayloadAction<string>) => {
      state.campaignPicked = action.payload
    },  
    changeMainExpensesPercentageAct: (state, action: PayloadAction<{main1: number, main2: number}>) => {
      const { main1, main2 } = action.payload
      if(main1 === state.mainExpensesPercentage.main1) {
        state.mainExpensesPercentage.main2 = main2
        state.mainExpensesPercentage.main1 = 100 - main2
      } else {
        state.mainExpensesPercentage.main1 = main1
        state.mainExpensesPercentage.main2 = 100 - main1

      }
      state.calculateExpenses = !state.calculateExpenses
    },
    changeOfficePaysHistoryAct: (state, action: PayloadAction<string>) => {
      state.officeSearch = action.payload
    },
    calculateExpensesPercentageAct: (state) => {
      const { main1, main2 } = state.mainExpensesPercentage

      const totalExpenses = state.totalExpenses + state.officesUtility.utilityLeads

      //Expenses
      state.mainExpensesPercentage.expensesMain1 = (totalExpenses * (main1 / 100))
      state.mainExpensesPercentage.expensesMain2 = (totalExpenses * (main2 / 100))
      state.mainExpensesPercentage.utilityLeastExpenses = state.totalUtility - totalExpenses
      state.mainExpensesPercentage.main1leastExpenses = state.main1Pays - state.mainExpensesPercentage.expensesMain1
      state.mainExpensesPercentage.main2leastExpenses = state.main2Pays - state.mainExpensesPercentage.expensesMain2

      //Partners
      let totalPartnersValue = 0
      const partnersPercentage = state.partnersPercentage.map(p => {
        const value = state.mainExpensesPercentage.main1leastExpenses * (p.percentage / 100)
        totalPartnersValue += value
        return {percentage: p.percentage, value, user: p.user, userNick: p.userNick}
      })
      state.partnersPercentage = partnersPercentage
      state.mainExpensesPercentage.partnersExpense = totalPartnersValue
      state.mainExpensesPercentage.main1WithoutPartners = state.mainExpensesPercentage.main1leastExpenses - totalPartnersValue


      //Platform
      const platformPercentage = state.mainExpensesPercentage.main1WithoutPartners * (state.mainExpensesPercentage.platformPercentage / 100)      
      const platFormUtility = Number(platformPercentage) + Number(state.mainExpensesPercentage.platformValue)
      state.mainExpensesPercentage.platformUtility = platFormUtility
      state.mainExpensesPercentage.platformPercentageUtility = platformPercentage
      state.mainExpensesPercentage.main1PlatformPercentage = state.mainExpensesPercentage.platformUtility  * (state.mainExpensesPercentage.main1/100)
      state.mainExpensesPercentage.main2PlatformPercentage = state.mainExpensesPercentage.platformUtility  * (state.mainExpensesPercentage.main2/100)
      state.mainExpensesPercentage.main1WithoutPlatform = state.mainExpensesPercentage.main1WithoutPartners - state.mainExpensesPercentage.main1PlatformPercentage
      state.mainExpensesPercentage.main2WithoutPlatform = state.mainExpensesPercentage.main2leastExpenses - state.mainExpensesPercentage.main2PlatformPercentage
    },
    showModalAddPatrnerPercentageAct: (state, action: PayloadAction<boolean>) => {
      state.showModalAddPartner = action.payload
    },
    setOfficesUtilityAct: (state, action: PayloadAction<OfficesUtlityData>) => {
      state.officesUtility = action.payload
    },
    changePlatformPercentageAct: (state, action: PayloadAction<number>) => {
      state.mainExpensesPercentage.platformPercentage = action.payload
      state.calculateExpenses = !state.calculateExpenses
    },
    changePlatformValueAct: (state, action: PayloadAction<number>) => {
      state.mainExpensesPercentage.platformValue = action.payload
      state.calculateExpenses = !state.calculateExpenses
    },
    addPartnerAct: (state, action: PayloadAction<AppAutocompleteOption>) => {
      state.partnersPercentage.push({percentage: 0, value: 0, user: action.payload._id, userNick: action.payload.name})
    },
    changePercentageSinglePartnersAct: (state, action: PayloadAction<{percentage: number, index: number}>) => {
      state.partnersPercentage[action.payload.index].percentage = action.payload.percentage
      state.calculateExpenses = !state.calculateExpenses
    },
    changeUserPaysHistoryAct: (state, action: PayloadAction<{userId: string}>) => {
      const { userId } = action.payload
      state.userSearch = action.payload.userId
      let total = 0
      state.paymentsLogs.forEach(p => {
        if(p.worker.user?._id === userId) total += p.worker.value
        if(p.leadWorker.user?._id === userId) total += p.leadWorker.value
        const officeLeads = p.officeLead.usersPercentage.filter((u) => u.user === userId)
        if(officeLeads.length > 0) {
          total += officeLeads[0].value
        }
        const subLeads = p.subleads.usersPercentage.filter((u) => u.user === userId)
        if(subLeads.length > 0) {
          total += subLeads[0].value
        }
      })
      state.userSearchTotal = total
    },
    showResumeDialogAct: (state, action: PayloadAction<boolean>) => {
      state.showResumeDialog = action.payload
    },
    changeOfficeUsersResumeAct: (state, action: PayloadAction<{office:string}>) => {

    }
  },
  extraReducers: (builder) => {
    builder.addCase(thunkAsync.fulfilled, (state, action) => {
    }).addCase(getCampaignsHistoryThunk.fulfilled, (state, action) => {
      state.campaignsHistory = action.payload
    }).addCase(getPaymendDowloadedByCampaignThunk.pending, (state, action) => {
      state.paymentsLogs = []
    })
    .addCase(getPaymendDowloadedByCampaignThunk.fulfilled, (state, action) => {
      state.getUserData = false
      state.paymentsLogs = action.payload
      state.main1Pays = action.payload.reduce((acc, p) => acc + p.main1, 0)
      state.main2Pays = action.payload.reduce((acc, p) => acc + p.main2, 0)
      state.totalUtility = state.main1Pays + state.main2Pays
      state.calculateExpenses = !state.calculateExpenses
      state.usersResume = {}

      state.paymentsLogs.forEach(p => {
        if(p.worker.user !== undefined) state.usersResume[p.worker.user._id] = {userId: p.worker.user._id, email: p.worker.user.email, office: p.worker.user.office, total: 0}
        if(p.leadWorker.user !== undefined)  state.usersResume[p.leadWorker.user._id] = {userId: p.leadWorker.user._id, email: p.leadWorker.user.email, office: p.leadWorker.user.office,  total: 0}
        p.officeLead.users.forEach((u) => state.usersResume[u._id] = {userId: u._id, email: u.email, total: 0, office: u.office})
        p.subleads.users.forEach((u) => state.usersResume[u._id] = {userId: u._id, email: u.email, total: 0, office: u.office})
      })

      for(const userId in state.usersResume) {
        let total = 0
        state.paymentsLogs.forEach(p => {
          if(p.worker.user?._id === userId) total += p.worker.value
          if(p.leadWorker.user?._id === userId) total += p.leadWorker.value
          const officeLeads = p.officeLead.usersPercentage.filter((u) => u.user === userId)
          if(officeLeads.length > 0) {
            total += officeLeads[0].value
          }
          const subLeads = p.subleads.usersPercentage.filter((u) => u.user === userId)
          if(subLeads.length > 0) {
            total += subLeads[0].value
          }
        })
        state.usersResume[userId].total = total
      }

      state.getUserData = true

    }).addCase(getTotalExpensesByCampaignThunk.fulfilled, (state, action) => {
      state.totalExpenses = action.payload.total
      state.calculateExpenses = !state.calculateExpenses
    }).addCase(saveCampaignUtilityThunk.fulfilled, (state, action) => {
      state.campaignDownloaded = true
    }).addCase(getCampaignInfoThunk.fulfilled, (state, action) => {
      state.currentCampaign = action.payload
      state.campaignDownloaded = action.payload.downloaded
      state.mainExpensesPercentage.platformUtility = action.payload.platform
    }).addCase(getCampaignInfoThunk.pending, (state, action) => {
      state.partnersPercentage = []
      state.currentCampaign = undefined
      state.campaignDownloaded = false
    }).addCase(getOfficesGoalsResumeThunk.fulfilled, (state, action) => {
      state.officesGoalsResume = action.payload.offices;
      state.totalCustomersCreated = action.payload.customersCreated;
    }).addCase(getWorkerLastCampaignsPaymentsThunk.fulfilled, (state, action) => {
      state.workerPaymentsHistory = action.payload;
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("DownloadedPaysLogs"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("DownloadedPaysLogs"), (state) => {
      state.loading = false
    })
  },
})
export const { changeCampaignPaysLogsAct, changeMainExpensesPercentageAct, calculateExpensesPercentageAct, changePlatformPercentageAct, showModalAddPatrnerPercentageAct, addPartnerAct, changePercentageSinglePartnersAct, changeUserPaysHistoryAct,  showResumeDialogAct, changeOfficePaysHistoryAct, changePlatformValueAct, changeOfficeUsersResumeAct, setOfficesUtilityAct} = downloadedPaysLogsSlice.actions
export default downloadedPaysLogsSlice.reducer