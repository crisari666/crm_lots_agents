import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CollectorResumeRowType, ReportsFilterI, ReportsStateI } from "../reports.state"
import { getCurrenDateUtil, getCurrentDateTime } from "../../../utils/date.utils"
import { auditCallReq, audtiCallNoteSituationReq, getCallLogsResumeWithSituationsReq, getReportsReq, getUserGoalsResumReq, logCustomerNotCalledReq } from "../../../app/services/reports.service"
import { confirmLogSituationReq } from "../../../app/services/log-situations.service"
import { confirmImageFeePaymentReq, getAlertedPaymentsReq } from "../../../app/services/payments.service"
import { recycleCustomerReq } from "../../../app/services/customer.service"


const initialState: ReportsStateI = {
  loading: false,
  imageToPreview: undefined,
  callsReport: [],
  usersGoalsResume: [],
  alertedPayments: [],
  usersDidNotCallsReport: [],
  filter: {
    lead: "",
    office: "",
    type: "",
    user: "",
    endDate: getCurrentDateTime({endDate: true}),
    startDate: getCurrenDateUtil(),
    collector: undefined

  },
  filterAlertedPayments: {office: "", user: ""},
  imagePreviewPayment: "",
}

export const getReportsThunk = createAsyncThunk("ReportsSlice/getReportsThunk", async ({ filters } : { filters : ReportsFilterI}) =>  await getReportsReq({filters}))

export const confirImageFeePaymentThunk = createAsyncThunk("ReportsSlice/confirImageFeePaymentThunk", async ({ feePaymentId, index } : { feePaymentId : string, index: number}) =>  {
  await confirmImageFeePaymentReq({feePaymentId})
  return index
})

export const getCallLogByIdWittCallNotesRelatedThunk = createAsyncThunk("ReportsSlice/getCallLogByIdWittCallNotesRelated", async (callLogIds: string[]) => await getCallLogsResumeWithSituationsReq({callLogIds}))

export const confirmLogSituationThunk = createAsyncThunk("ReportsSlice/confirmLogSituation", async ({index, logSituadionId } : {index: number, logSituadionId : string}) => {
  const logSituation = await confirmLogSituationReq({logSituadionId})
  return {logSituation, index}
})

export const auditCallThunk = createAsyncThunk("ReportsSlice/auditCallThunk", async ({callId, checked} : {callId: string, checked: boolean}) => await auditCallReq({callId, checked}))

export const auditLogSituationThunk = createAsyncThunk("ReportsSlice/auditLogSituationThunk", async ({checked, situationLogId} : {situationLogId : string, checked: boolean}) => await audtiCallNoteSituationReq({situationLogId, checked}))

export const usersGoalsResumeThunk = createAsyncThunk("ReportsSlice/usersGoalsResumeThunk", async ({office} : {office: string}) => await getUserGoalsResumReq(office))

export const getAlertedPaysThunks = createAsyncThunk("ReportsSlice/getAlertedPaysThunks", async () => await getAlertedPaymentsReq())

export const recycleCustomerThunk = createAsyncThunk("ReportsSlice/recycleCustomerThunk", async ({customerId}: {customerId: string, index: number, typeReport: string}) => await recycleCustomerReq({customerId}))

export const logCustomerAtNotCalledThunk = createAsyncThunk( "Report/logCustomerAtNotCalledThunk", async (PARAM: {index: number, customer : string, userId: string, dateAssigned: string}) => await logCustomerNotCalledReq(PARAM))

export const ReportsSlice = createSlice({
  name: "ReportsSlice",
  initialState,
  reducers: {
    changeInputReportsAct:  (state, action: PayloadAction<{name: string, val: string}>) => {
      state.filter[action.payload.name] = action.payload.val
    },
    setCollectorFilterAct: (state, action: PayloadAction<CollectorResumeRowType | undefined>) => { 
      state.filter.collector = action.payload
    },
    setPaymentImagePreviewAct: (state, action: PayloadAction<string>) => {
      state.imagePreviewPayment = action.payload
    },
    setImageToPreviewReportsAct: (state, action: PayloadAction<string | undefined>) => {
      state.imageToPreview = action.payload
    },
    setFeePaymentConfirmImageDialogAct: (state, action: PayloadAction<{feePaymentId: string, value: number, index: number} | undefined>) => {
      if(action.payload === undefined) {
        state.confirFeePaymentImageDialog = undefined
      } else {
        state.confirFeePaymentImageDialog = {
          feePaymentId: action.payload.feePaymentId,
          value: action.payload.value,
          index: action.payload.index
        }
      }
    },
    setDialogCheckCallAct: (state, action: PayloadAction<{image: string, check: boolean, callId: string} | undefined>) => {
      if(action.payload === undefined) {
        state.dialogValidateCall = undefined
      } else {
        state.dialogValidateCall = action.payload
      }
    },
    updateCheckCallInputAct: (state, action: PayloadAction<boolean>) => {
      state.dialogValidateCall!.check = action.payload
    },
    updateCallAssignedCustomerProspectAct: (state, action: PayloadAction<{customerId: string, isProspect: boolean}>) => {
      const index = state.callAssignedCustomer?.findIndex((c) => c._id === action.payload.customerId)
      if(index !== -1) {
        state.callAssignedCustomer![index as number]!.isProspect = action.payload.isProspect
      }
    },
    closeDialogCallNotesResumeAct: (state) => {
      state.dialogCallAndNotesResume = undefined
    },
    setFeePaymentConfirmPayedDialogAct: (state, action: PayloadAction<{feePaymentId: string, value: number, index: number, percentage: number, remaining: number} | undefined>) => {
      if(action.payload === undefined) {
        state.confirmFeePaymentPayedDialog = undefined
      } else {
        state.confirmFeePaymentPayedDialog = {
          feePaymentId: action.payload.feePaymentId,
          value: action.payload.value,
          index: action.payload.index,
          percentage: 0,
          remaining:  action.payload.remaining
        }
      }
    },
    setDialogValidateCallNoteAct: (state, action: PayloadAction<{image: string, check: boolean, situationLogId: string} | undefined>) => {
      if(action.payload === undefined) {
        state.dialogValidateCallNote = undefined
      } else {
        state.dialogValidateCallNote = action.payload
      }
    },
    updateCheckCallNoteInputAct: (state, action: PayloadAction<boolean>) => {
      state.dialogValidateCallNote!.check = action.payload
    },  
    changeFilterAlertedPaymetnsAct: (state, action: PayloadAction<{name: string, val: string}>) => {
      if(action.payload.name === 'office') state.filterAlertedPayments.office = action.payload.val
      if(action.payload.name === 'user') state.filterAlertedPayments.user = action.payload.val
    }
  },
  extraReducers(builder) {
   
    builder.addCase(getReportsThunk.fulfilled, (state, action) => {
      if(state.filter.type === "situations") state.customerLogResults = action.payload
    if(state.filter.type === "payments-requests" || state.filter.type === "projected-payments" || state.filter.type === "irregular-projections") state.paymentsRequestsResults = action.payload
      if(state.filter.type === "payments-made") state.feePayments = action.payload
      if(state.filter.type === "calls") state.callsReport = action.payload
      if(state.filter.type === "call-customers-assigned") state.callAssignedCustomer = action.payload
      if(state.filter.type === "users-did-not-calls") state.usersDidNotCallsReport = action.payload
    }).addCase(confirmLogSituationThunk.fulfilled, (state, action) => {
      state.customerLogResults![action.payload.index].confirmed = true
    }).addCase(confirImageFeePaymentThunk.fulfilled, (state, action) => {
      state.feePayments![action.payload].trusted = true
      state.confirFeePaymentImageDialog = undefined
    }).addCase(getCallLogByIdWittCallNotesRelatedThunk.fulfilled, (state, action) => {
      console.log('getCallLogsResumeWithSituationsReq', {action});
      if(action.payload.customer !== null) {
        state.dialogCallAndNotesResume = action.payload
      }
    }).addCase(auditCallThunk.fulfilled, (state, action) => {
      state.dialogValidateCall = undefined
      const indexCall = state.dialogCallAndNotesResume!.callLogs.findIndex((c) => c._id === action.payload.check._id)
      console.log({indexCall});
      if(indexCall !== -1){
        state.dialogCallAndNotesResume!.callLogs[indexCall].checked = action.payload.check.checked
        state.dialogCallAndNotesResume!.callLogs[indexCall].checkedDate = action.payload.check.checkedDate
      }
    }).addCase(auditLogSituationThunk.fulfilled, (state, action) => {
      state.dialogValidateCallNote = undefined
      const indexNote = state.dialogCallAndNotesResume!.callNotes.findIndex((c) => c._id === action.payload.check._id)
      console.log({indexNote});
      if(indexNote !== -1){
        state.dialogCallAndNotesResume!.callNotes[indexNote].checked = action.payload.check.checked
        state.dialogCallAndNotesResume!.callNotes[indexNote].dateChecked = action.payload.check.dateChecked
      }
    }).addCase(usersGoalsResumeThunk.fulfilled, (state, action) => {
      state.usersGoalsResume = action.payload
    }).addCase(usersGoalsResumeThunk.pending, (state) => {
      state.usersGoalsResume = []
    }).addCase(getAlertedPaysThunks.fulfilled, (state, action) => {
      state.alertedPayments = action.payload
    }).addCase(recycleCustomerThunk.fulfilled, (state, action) => {      
      state.callAssignedCustomer![action.meta.arg.index].recycle = true
    }).addCase(logCustomerAtNotCalledThunk.fulfilled, (state, action) => {
      state.callAssignedCustomer![action.meta.arg.index].notCalled = true
    })
    
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("ReportsSlice"), (state) => {
      state.loading = true
     }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("ReportsSlice"), (state) => {
      state.loading = false
     })
  },
})

export const { changeInputReportsAct, setPaymentImagePreviewAct, setImageToPreviewReportsAct, setFeePaymentConfirmImageDialogAct, setFeePaymentConfirmPayedDialogAct, closeDialogCallNotesResumeAct, setDialogCheckCallAct, updateCheckCallInputAct, setDialogValidateCallNoteAct, updateCheckCallNoteInputAct, setCollectorFilterAct, changeFilterAlertedPaymetnsAct, updateCallAssignedCustomerProspectAct } 
  = ReportsSlice.actions

export default ReportsSlice.reducer