import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DialogPercentageType, DownloadPaymentState, FilterPaymentsForm, PaymentRouteType, SinglePercentageData, TypePercentageEnum, UserPercentageDataType } from "./download-payment.state";
import { getCurrenDateUtil } from "../../../utils/date.utils";
import { downloadPaymentReq, filterMadePaymentsReq, getUserLastPaymentDownloadedReq } from "../../../app/services/payments.service";
import { PaymentForDownloadType } from "../../../app/models/payment-for-download.type";
import { AppAutocompleteOption } from "../../../app/components/app-autocomplete";
import { OmegaSoftConstants } from "../../../app/khas-web-constants";
import { store } from "../../../app/store";
import { pushAlertAction } from "../../dashboard/dashboard.slice";
const paymentRouteInitState: PaymentRouteType = {
  collector: { after: 0, before: 0, percentage: 13, value: 0, user: OmegaSoftConstants.collectorIdDefault, userNick: "13% | COLECTOR"},
  worker: { after: 0, before: 0, percentage: 0, value: 0},
  leadWorker: { after: 0, before: 0, percentage: 0, value: 0},
  officeLead: {after: 0, before: 0, userPercentageData: [], percentage: 0, value: 0, users: []},
  subLead: {after: 0, before: 0, userPercentageData: [], percentage: 0, value: 0, users: []},  
  partner: {after: 0, before: 0, userPercentageData: [], percentage: 0, value: 0, users: []},
  mainPartner: {after: 0, before: 0, userPercentageData: [
    {after: 0, before: 0, percentage: 0, value: 0, user: OmegaSoftConstants.alcatronId, userNick: "MAIN 1"},
    {after: 0, before: 0, percentage: 0, value: 0, user: OmegaSoftConstants.arsanId, userNick: "MAIN 2"}
  ], percentage: 0, value: 0, users: []},
  copTotal: 0, usdPrice: 0
}
const filterPaymentFormInit: FilterPaymentsForm = {
  collector: "",
  dateEnd: getCurrenDateUtil(),
  dateInit: getCurrenDateUtil(),
  office: "",
  downloaded: false,
  userId: "",
}

const userPercentageDataInit: DialogPercentageType = {
  percentage: 0,
  user: {name: "", _id: ""},
  users: [],
  usersAdded: []
}

const initialState: DownloadPaymentState = {
  loading: false,
  foundPayments: [],
  recalculate: false,
  showFindPaymentDialog: false,
  dialogPercentage: userPercentageDataInit,
  filterPaymentForm: filterPaymentFormInit,
  paymentRouteCalc: paymentRouteInitState,
  showDialogPickPercentage: false,
  typePercentageToPick: TypePercentageEnum.empty
}
export const findPaymentsThunk = createAsyncThunk("DownloadPayment/findPaymentsThunk", async (filter: FilterPaymentsForm) => await filterMadePaymentsReq(filter))

export const downloadPaymentThunk = createAsyncThunk( "DownloadPayment/downloadPaymentThunk", async (params : {data: PaymentRouteType, paymentId: string}) => {
  const dowloadPaymentReq = await downloadPaymentReq(params)
  if(dowloadPaymentReq === true) store.dispatch(pushAlertAction({
    title: "Pago descargado",
    message: "El pago ha sido descargado correctamente",
    type: "succes"
  }))
  return dowloadPaymentReq
})

export const getLastUserPaymentDownloadedThunk = createAsyncThunk( "DownloadPayment/getLastUserPaymentDownloadedThunk", async (userId: string) => await getUserLastPaymentDownloadedReq({userId}))

export const downloadPaymentSlice = createSlice({
  name: "downloadPayment",
  initialState,
  reducers: {
    showDialogFindPaymentAct: (state, action: PayloadAction<boolean>) => {
      state.showFindPaymentDialog = action.payload
    },
    updateInputFilterPaymentAct: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.filterPaymentForm[action.payload.key] = action.payload.value
    },
    pickPaymentForDownloadAct: (state, action: PayloadAction<PaymentForDownloadType>) => {
      state.pickedPayment = action.payload
      state.paymentRouteCalc.collector!.before = action.payload.value
    },
    setTypePercentageToPickDPAct: (state, action: PayloadAction<TypePercentageEnum>) => {
      state.typePercentageToPick = action.payload
    },
    showDialogPickPercentageDPAct: (state, action: PayloadAction<boolean>) => {
      state.showDialogPickPercentage = action.payload
      if(!action.payload) {
        state.dialogPercentage = userPercentageDataInit 
      }
    },
    changeSinglePercentageForPaymentStepAct: (state, action: PayloadAction<{type: TypePercentageEnum, user: string, percentage: number, userNick: string}>) => {
      if(action.payload.type === TypePercentageEnum.collector || action.payload.type === TypePercentageEnum.worker || action.payload.type === TypePercentageEnum.leadWorker) {
        const {percentage, type, user, userNick} = action.payload
        state.paymentRouteCalc[type]!.user = user
        state.paymentRouteCalc[type]!.percentage = percentage
        state.paymentRouteCalc[type]!.userNick = userNick
      }
      state.recalculate = !state.recalculate
    },
    changeMultiplePercentageForPaymentAct: (state, action: PayloadAction<{type: TypePercentageEnum}>) => {
      if(action.payload.type === TypePercentageEnum.officeLead || action.payload.type === TypePercentageEnum.subLead || action.payload.type === TypePercentageEnum.partner || action.payload.type === TypePercentageEnum.mainPartner) {
        state.paymentRouteCalc[action.payload.type]!.userPercentageData = state.dialogPercentage.usersAdded.map((e) => {
          return {
            after: 0, 
            before: 0,  
            percentage: e.percentage,
            value: 0,
            user: e.userId,
            userNick: `${e.percentage}%|${e.userNick}`
          } as SinglePercentageData
        })
        state.paymentRouteCalc[action.payload.type].users = state.dialogPercentage.usersAdded.map((u) => u.userId)
      }
      state.recalculate = !state.recalculate
    },
    calculateRoutePercentagesAct: (state) => {
      _calculateRoutePercentages(state)
    },
    changeCopTotalValueAct: (state, action: PayloadAction<number>) => {
      state.paymentRouteCalc.copTotal = action.payload
      state.recalculate = !state.recalculate
    },
    changeUserDialogPercentageAct: (state, action: PayloadAction<{user: AppAutocompleteOption}>) => {
      state.dialogPercentage.user = action.payload.user
    },
    changeUsersDialogPercentageAct: (state, action: PayloadAction<AppAutocompleteOption[]>) => {
      state.dialogPercentage.users = action.payload
      if(action.payload.length > 0) {
        const prevAdded = state.dialogPercentage.usersAdded;
        state.dialogPercentage.usersAdded = action.payload.map((u) => {
          const indexPrev = prevAdded.findIndex((p) => p.userId === u._id);
          const percentage = indexPrev !== -1 ? prevAdded[indexPrev].percentage : 0
          return {percentage, userId: u._id,  userNick: u.name.split('|')[0].trim()} as UserPercentageDataType;
        })
      }
    },
    changePercentageOfUserGroupPercentage: (state, action: PayloadAction<{percentage: number, index?: number, userId?: string}>) => {
      const { userId } = action.payload
      if(userId !== undefined) {
        const index = state.dialogPercentage.usersAdded.findIndex((u) => u.userId === userId)
        if(index !== -1) {
          state.dialogPercentage.usersAdded[index].percentage = action.payload.percentage
        }
      } else {
        state.dialogPercentage.usersAdded[action.payload.index!].percentage = action.payload.percentage
      }
    },
    changePercentageDialogPercentageAct: (state, action: PayloadAction<number>) => {
      state.dialogPercentage.percentage = action.payload
    },
    changePercentageMainPartnerAct: (state, action: PayloadAction<{index: number, percentage: number}>) => {
      state.paymentRouteCalc.mainPartner.userPercentageData[action.payload.index].percentage = action.payload.percentage
      state.recalculate = !state.recalculate
    }
  },
  extraReducers: (builder) => {
    builder.addCase(findPaymentsThunk.fulfilled, (state, action) => {
      state.foundPayments = action.payload
      state.pickedPayment = undefined
    }).addCase(downloadPaymentThunk.fulfilled, (state) => {
      state.paymentRouteCalc = paymentRouteInitState
      const indexFeePayment = state.foundPayments.findIndex((p) => p._id === state.pickedPayment!._id)
      if(indexFeePayment !== -1) state.foundPayments.splice(indexFeePayment, 1)
      state.pickedPayment = undefined
      state.lastUserPaymentDownloaded = undefined
    }).addCase(getLastUserPaymentDownloadedThunk.fulfilled, (state, action) => {
      state.lastUserPaymentDownloaded = action.payload === null ? undefined : action.payload
    })



    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("DownloadPayment"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("DownloadPayment"), (state) => {
      state.loading = false
    })
  },
})

const _calculateRoutePercentages = (state: DownloadPaymentState) => {
  const {collector, worker, copTotal, usdPrice, leadWorker, officeLead, subLead, mainPartner, partner} = state.paymentRouteCalc
  if(collector.percentage !== undefined) {
    collector.before = state.pickedPayment?.value ?? 0
    collector.value = (state.pickedPayment?.value ?? 0) * (collector.percentage / 100)
    collector.after = collector.before - collector.value
  }
  if(copTotal !== 0) {
    state.paymentRouteCalc.usdPrice = state.paymentRouteCalc.copTotal / collector.after
  }
  if(copTotal > 0 && usdPrice > 0 && worker.value !== undefined) {
    worker.before = copTotal
    worker.value = worker.before * (worker.percentage / 100)
    worker.after = worker.before - worker.value
  }

  //Lead Worker
  leadWorker.before = worker.after
  leadWorker.value = leadWorker.before * (leadWorker.percentage / 100)
  leadWorker.after = leadWorker.before - leadWorker.value


  //Office Lead
  officeLead.before = leadWorker.after
  const pOffdiceLead = officeLead.userPercentageData.reduce((acc, p) => acc + p.percentage, 0)
  officeLead.percentage = pOffdiceLead;
  officeLead.value = officeLead.before * (pOffdiceLead / 100)
  for(const i in officeLead.userPercentageData) {
    const userPercentage = officeLead.userPercentageData[i]
    officeLead.userPercentageData[i].before = officeLead.before
    officeLead.userPercentageData[i].value = userPercentage.before * (userPercentage.percentage / 100)
    officeLead.userPercentageData[i].after = userPercentage.before - userPercentage.percentage
  }

  officeLead.after = officeLead.before - officeLead.value

  //SubLeads
  subLead.before = officeLead.after
  const pSubLead = subLead.userPercentageData.reduce((acc, p) => acc + p.percentage, 0)
  subLead.percentage = pSubLead;
  subLead.value = subLead.before * (pSubLead / 100)
  for(const i in subLead.userPercentageData) {
    const userPercentage = subLead.userPercentageData[i]
    subLead.userPercentageData[i].before = subLead.before
    subLead.userPercentageData[i].value = userPercentage.before * (userPercentage.percentage / 100)
    subLead.userPercentageData[i].after = userPercentage.before - userPercentage.value
  }
  subLead.after = subLead.before - subLead.value

  //Partners
  partner.before = subLead.after
  const pParners = partner.userPercentageData.reduce((acc, p) => acc + p.percentage, 0)
  partner.value = partner.before * (pParners / 100)
  partner.percentage = pParners
  for(const i in partner.userPercentageData) {
    const userPercentage = partner.userPercentageData[i]
    partner.userPercentageData[i].before = partner.before
    partner.userPercentageData[i].value = userPercentage.before * (userPercentage.percentage / 100)
    partner.userPercentageData[i].after = userPercentage.before - userPercentage.percentage
  }
  partner.after = partner.before - partner.value

  //Mains
  mainPartner.before = partner.after
  const pMainPartners = mainPartner.userPercentageData.reduce((acc, p) => acc + p.percentage, 0)
  mainPartner.percentage = pMainPartners
  mainPartner.value = mainPartner.before * (pMainPartners / 100)
  for(const i in mainPartner.userPercentageData) {
    const userPercentage = mainPartner.userPercentageData[i]
    mainPartner.userPercentageData[i].before = mainPartner.before
    mainPartner.userPercentageData[i].value = userPercentage.before * (userPercentage.percentage / 100)
    mainPartner.userPercentageData[i].after = userPercentage.before - userPercentage.percentage
  }
  mainPartner.after = mainPartner.before - mainPartner.value
}

export const { showDialogFindPaymentAct, updateInputFilterPaymentAct, pickPaymentForDownloadAct, showDialogPickPercentageDPAct, setTypePercentageToPickDPAct, changeSinglePercentageForPaymentStepAct, calculateRoutePercentagesAct, changeCopTotalValueAct, changeMultiplePercentageForPaymentAct, changeUserDialogPercentageAct, changePercentageDialogPercentageAct, changePercentageOfUserGroupPercentage, changeUsersDialogPercentageAct, changePercentageMainPartnerAct } = downloadPaymentSlice.actions

export default downloadPaymentSlice.reducer