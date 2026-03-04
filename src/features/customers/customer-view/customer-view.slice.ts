import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CustomerPaymentFormI, CustomerSituationFormI, CustomerViewStateI, DialogAddFeeI } from "./customer-view.state"
import { checIfCustomerWasTreatedReq, customerResumeReq, disableCustomerReq, getCustomerById, getCustomerCallActionsLogsReq, getCustomerDocPaysReq, inactiveCustomerReq, updateCustomerReq, uploadCustomerDocPayReq, updateCustomerProspectReq, reassignCustomerReq, analyzeCallLogReq } from "../../../app/services/customer.service"
import { CustomerInterface } from "../../../app/models/customer.interface"
import { getSituationsCallNoteReq } from "../../../app/services/situations.service"
import { SituationInterface } from "../../../app/models/situation-interface"
import { addCustomerLogReq, getCustomerLogsReq } from "../../../app/services/log-situations.service"
import { getDebtCollectorsReq } from "../../../app/services/users.service"
import { addFeePaymentReq, addPaymentReq, customerPaymentsReq } from "../../../app/services/payments.service"
import { getCurrenDateUtil } from "../../../utils/date.utils"
import { FeeInterface } from "../../../app/models/fee.interface"
import { setUsetToCustomerThunk } from "../../customers-center/customer-center.slice"
import { getCollectorsForUserReq } from "../../../app/services/collectors.service"
const formNewSituation: CustomerSituationFormI = {
  note: "",
  situation: ""

}
const formPayment: CustomerPaymentFormI = {
  date: getCurrenDateUtil(),
  paymentAlerted: false,
  debtCollector: "",
  done: false,
  value: 0, 
  step: ''
}
const initialState: CustomerViewStateI = {
  loading: false,
  customerDocPays: [],
  customerChangeUserForm: {office: '', user: ''},
  situations: [],
  formNewSituation,
  showDialogSureDisableCustomer: false,
  customerLogs: [],
  customerPaymentForm: formPayment,
  debtCollectors: [],
  customerPayments: [],
  imagePreview: "",
  imageSituationZoom: undefined,
  showDialogImageSituation: false,
  collectors: [],
  customerCallActions: [],
  openModalPayDocs: false
}

export const checkIfCustomerWasTreatedThunk = createAsyncThunk( "CustomerSlice/checkIfCustomerWasTreatedThunk", async (customerId: string) => await checIfCustomerWasTreatedReq({customerId}))

export const getDebtCollectorsThunk = createAsyncThunk("CustomerSlice/getDebtCollectorsThunk", async ({customerId} : {customerId: string}) => await getDebtCollectorsReq({customerId}))

export const getCustomerThunk = createAsyncThunk("CustomerSlice/getCustomerThunk", async ({ customerId } : { customerId : string}): Promise<CustomerInterface> => await getCustomerById({customerId}))

export const getSituationsCustomerThunk = createAsyncThunk("CustomerSlice/getSituations", async (): Promise<SituationInterface[]> =>  await getSituationsCallNoteReq())

export const getCustomerLogsThunk = createAsyncThunk("CustomerSlice/getCustomerLogsThunk", async ({ customerId } : { customerId : string}) => await getCustomerLogsReq({customerId}))

export const getCustomerPaymentsThunk = createAsyncThunk("CustomerSlice/customerPaymetns", async ({ customerId } : { customerId : string}) => await customerPaymentsReq({customerId}))

export const addCustomerLogThunk = createAsyncThunk("CustomerSlice/addCustomerLogThunk", async ({ customerId, customerLogForm, image } : { customerId : string, customerLogForm: CustomerSituationFormI, image: any}) => await addCustomerLogReq({customerId, customerLogForm, file: image}))

export const addCustomerPaymentThunk = createAsyncThunk("CustomerSlice/addCustomerPaymentThunk", async ({ customerId, form } : { customerId : string, form: CustomerPaymentFormI}) => await addPaymentReq({customerId, form}))

export const getSingleCustomerCallActionsThunk = createAsyncThunk("CustomerSlice/getSingleCustomerCallActionsThunk", async ({ customerId } : { customerId : string}) =>  await getCustomerCallActionsLogsReq({customerId}))

export const updateFeePaymentThunk = createAsyncThunk("CustomerSlice/updateFeePayment", async ({ customerId, image, paymentRequestId, value, collector } : { customerId : string, paymentRequestId: string, image: any, value: number, collector: string}) =>  await addFeePaymentReq({customerId, image, paymentRequestId, value, collector}))

export const disableCustomerThunk = createAsyncThunk("CustomerSlice/disableCustomerThunk", async ({ customerId, motive } : { customerId : string, motive: string}) => await disableCustomerReq({customerId, motive}))

export const getCustomerResumeThunk = createAsyncThunk( "CustomerSlice/getCustomerResumeThunk", async (customerId: string) => await customerResumeReq({customerId}))

export const updateCustomerThunk = createAsyncThunk( "CustomerSlice/updateCustomerThunk", async ({customerData, customerId} : {customerData: any, customerId: string}) => await updateCustomerReq({ customerData, customerId }))

export const inactiveCustomerThunk = createAsyncThunk( "CustomerSlice/inactiveCustomerThunk", async (customerId: string) => await inactiveCustomerReq({customerId}))

export const getCollectorsForUserThunk = createAsyncThunk( "CustomerSlice/getCollectorsForUser", async (userId: string) => await getCollectorsForUserReq({userId}))

export const uploadCustomerDocPayThunk = createAsyncThunk( "CustomerSlice/uploadCustomerDocPayThunk", async (PARAM: {customerId: string, file: File, value: number, step: string}) => await uploadCustomerDocPayReq(PARAM))

export const getCustomerPayDocsThunk = createAsyncThunk( "CustomerSlice/getCustomerPayDocsThunk", async (customerId: string) => await getCustomerDocPaysReq({customerId}))

export const updateCustomerProspectThunk = createAsyncThunk("CustomerSlice/updateCustomerProspectThunk",async ({customerId, isProspect} : {customerId: string, isProspect: boolean}) => await updateCustomerProspectReq({customerId, isProspect}))

export const reassignCustomerThunk = createAsyncThunk("CustomerSlice/reassignCustomerThunk",async ({customerId, isReassigned} : {customerId: string, isReassigned: boolean}) => await reassignCustomerReq({customerId, isReassigned}))

export const analyzeCallLogThunk = createAsyncThunk("CustomerSlice/analyzeCallLogThunk", async ({callSId} : {callSId: string}) => await analyzeCallLogReq({callSId}))

export const CustomerViewSlice = createSlice({
  name: "CustomerSlice",
  initialState,
  reducers: {
    setLoadingCustomerViewAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    resetLogSituationAct: (state) => {
      state.formNewSituation = formNewSituation
    },
    updateFormPaymentAct: (state, action: PayloadAction<{key: string, value: any}>) => {
      state.customerPaymentForm[action.payload.key] = action.payload.value
    },
    updateInputSituationFormAct: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.formNewSituation[action.payload.key] = action.payload.value
    },
    loadAddFeeDilaogAct: (state, action: PayloadAction<DialogAddFeeI>) => {
      state.dialogAddFee = action.payload
    },
    updateInputAddFeeAct: (state, action: PayloadAction<number>) => {
      state.dialogAddFee!.value = action.payload
    },
    pickCollectorAddFeeAct: (state, action: PayloadAction<string>) => {
      state.dialogAddFee!.collector = action.payload
    },
    openModalPayDocsAct: (state, action: PayloadAction<boolean>) => {
      state.openModalPayDocs = action.payload
    },
    closeAddFeeDialogAct: (state) => {
      state.dialogAddFee = undefined
    },
    setFeeHistoryDialogAct: (state, action: PayloadAction<FeeInterface[]>) => {
      state.feePaymentsHistory = {
        feePayment: action.payload
      }
    },
    updateCustomerDataAct: (state, action: PayloadAction<{name: string, val: any}>) => { 
      state.customerData![action.payload.name] = action.payload.val
    },
    closeDialogCustomerResumeAct: (state) => {
      state.customerResume = undefined
    },
    clearDialogFeeHistoryAct: (state) => {
      state.feePaymentsHistory = undefined
    },
    setImagePreviewAct: (state, action: PayloadAction<string>) => {
      state.imagePreview = action.payload
    },
    showDialogSureDisableCustomerAct: (state, action: PayloadAction<boolean>) => {
      state.showDialogSureDisableCustomer = action.payload
    },
    setShowDialogImageSituationAct: (state, action: PayloadAction<boolean>) => {
      state.showDialogImageSituation = action.payload
    },
    zoomImageCustomerAct: (state, action: PayloadAction<string | undefined>) => {
      state.imageSituationZoom = action.payload
    },
    updateInputChangeUserAct: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.customerChangeUserForm[action.payload.key] = action.payload.value
    }
  },
  extraReducers(builder) {
    builder.addCase(getCustomerThunk.fulfilled, (state, action) => {
      state.customerData = action.payload
    }).addCase(getSituationsCustomerThunk.fulfilled, (state, action) => {
      state.situations = action.payload;
    }).addCase(getCustomerLogsThunk.fulfilled, (state, action) => {
      state.customerLogs = action.payload
    }).addCase(addCustomerLogThunk.fulfilled, (state, action) => {
      state.formNewSituation = formNewSituation
      state.customerLogs.push(action.payload)
      state.showDialogImageSituation = false
    }).addCase(getDebtCollectorsThunk.fulfilled, (state, action) => {
      state.debtCollectors = action.payload
    }).addCase(getCustomerPaymentsThunk.fulfilled, (state, action) => {
      state.customerPayments = action.payload
    }).addCase(addCustomerPaymentThunk.fulfilled, (state, action) => {
      state.customerPayments.push(action.payload)
      state.customerPaymentForm = formPayment
    }).addCase(updateFeePaymentThunk.fulfilled, (state, action) => {
      state.loading = false
      state.dialogAddFee = undefined
      const indexPayment = state.customerPayments.findIndex(payment => payment._id === action.payload._id)
      if(indexPayment !== -1){
        state.customerPayments[indexPayment] = action.payload 
      }
    }).addCase(disableCustomerThunk.fulfilled, (state, action) => {
      state.customerData = action.payload
    }).addCase(getCustomerResumeThunk.fulfilled, (state, action) => {
      state.customerResume = action.payload
    }).addCase(checkIfCustomerWasTreatedThunk.fulfilled, (state, action) => {
      state.customerWasTreated = action.payload
    }).addCase(setUsetToCustomerThunk.fulfilled, (state, action) => {
      if(state.customerData !== undefined){
        state.customerData!.userAssigned = action.meta.arg.userId as any
        state.loading = false
      }
    }).addCase(setUsetToCustomerThunk.pending, (state) => {
      state.loading = true
    }).addCase(updateCustomerThunk.fulfilled, (state, action) => {
      state.customerData!.status = 2
      state.loading = false
    }).addCase(getCollectorsForUserThunk.fulfilled, (state, action) => {
      state.collectors = action.payload
    }).addCase(checkIfCustomerWasTreatedThunk.pending, (state, action) => {
      state.customerWasTreated = {
        calls: false,
        isFromDatabase: false
      }
    }).addCase(getSingleCustomerCallActionsThunk.fulfilled, (state, action) => {
      state.customerCallActions = action.payload
      }).addCase(uploadCustomerDocPayThunk.fulfilled, (state, action) => { 
      state.customerDocPays.push(action.payload)
    }).addCase(getCustomerPayDocsThunk.fulfilled, (state, action) => {
      state.customerDocPays = action.payload
    }).addCase(updateCustomerProspectThunk.fulfilled, (state, action) => {
      if(state.customerData !== undefined) {
        state.customerData.isProspect = action.payload.isProspect
      }
    }).addCase(reassignCustomerThunk.fulfilled, (state, action) => {
      if(state.customerData !== undefined) {
        state.customerData.reassigned = action.payload.reassigned
      }
    }).addCase(analyzeCallLogThunk.fulfilled, (state, action) => {
      if(state.customerResume !== undefined && state.customerResume.customer.length > 0) {
        const callLogs = state.customerResume.customer[0].calls_logs || []
        const index = callLogs.findIndex(log => log.callSId === action.payload.callSId)
        if(index !== -1) {
          callLogs[index] = action.payload
        }
      }
    })

    
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("CustomerSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CustomerSlice"), (state) => {
      state.loading = false
    })
  },
})

export const { setLoadingCustomerViewAct, updateInputSituationFormAct, updateFormPaymentAct, resetLogSituationAct, closeAddFeeDialogAct, loadAddFeeDilaogAct, updateInputAddFeeAct, clearDialogFeeHistoryAct, setFeeHistoryDialogAct, setImagePreviewAct,  showDialogSureDisableCustomerAct, setShowDialogImageSituationAct, zoomImageCustomerAct, closeDialogCustomerResumeAct, updateInputChangeUserAct, updateCustomerDataAct, pickCollectorAddFeeAct, openModalPayDocsAct} = CustomerViewSlice.actions

export default CustomerViewSlice.reducer