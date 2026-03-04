import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CustomerCallDialogState, CustomersFilter, CustomersState, DialogCallUser, DialogCustomerStep, DialogUpdateCustomerSituationI, NewCustomerFormI } from "./customers.state"
import { addCustomerReq, customerAnswerReq, getActiveCustomersReq, getCustomerCallActionsLogsReq, getCustomersReq, logCustomerAnswerReq, logCustomerCallActionReq, logCustomerDontAnswerReq, recycleCustomerReq } from "../../../app/services/customer.service"
import { CustomerInterface } from "../../../app/models/customer.interface"
import { getOfficeUsersReq } from "../../../app/services/offices.service"
import UserInterface from "../../../app/models/user-interface"
import { CustomerCallActionsEnum } from "../../../app/models/customer-call-actions.enum"
import { checkCodeExistReq, updateCustomerSituationReq } from "../../../app/services/situations.service"
import { getLeadsWithUsers } from "../../../app/services/users.service"
import { setCustomerStepReq } from "../../../app/services/steps.service"

const newCustomerForm: NewCustomerFormI = {
  name: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  office: "",
  userAssigned: ""
}

const customerCallDialogInit: CustomerCallDialogState = {
  answered: false,
  note: "",
  minutes: 0,
  seconds: 0
}
const customersFilterInit: CustomersFilter = { lead: "", office: "", user: "", date: "", step: ""}
const initialState: CustomersState = {
  customerCallActions: [],
  leads: [],
  loading: false,
  showFormCustomer: false,
  customers: [],
  users: [],
  customersOriginal: [],
  newCustomerForm,
  userByOfficeChose: [],
  loadingUsers: false,
  userAnswered: false,
  customersFilter: customersFilterInit,
  customerCallDialogState: customerCallDialogInit
}

export const addCustomerThunk = createAsyncThunk("CustomersSlice/addCustomerThunk", async ({ customerForm } : { customerForm : NewCustomerFormI}): Promise<CustomerInterface> =>  await addCustomerReq({customerForm}))

export const getCustomersThunk = createAsyncThunk("CustomersSlice/getCustomersThunk", async (): Promise<CustomerInterface[]> => await getCustomersReq())

export const getOfficeCustomersThunk = createAsyncThunk("CustomersSlice/getOfficeCustomers", async ({ officeId } : { officeId : string}): Promise<UserInterface[]> =>  await getOfficeUsersReq({officeId}))

export const logCustomerCallActionThunk = createAsyncThunk("CustomersSlilice/logCustomerCallActionThunk", async ({ customerId, callAction } : { customerId : string, callAction: CustomerCallActionsEnum}) => await logCustomerCallActionReq({callAction, customerId}))

export const setCustomerAsAnsweredThunk = createAsyncThunk("CustomersSlice/setCustomerAsAnswered", async ({ customerId } : { customerId : string}) => await customerAnswerReq({customerId}))

export const getCustomerCallActionsThunk = createAsyncThunk("CustomersSlices/getCustomerCallActions", async ({ customerId } : { customerId : string}) =>  await getCustomerCallActionsLogsReq({customerId}))

export const getActiveCustomerThunk = createAsyncThunk("CustomersSlice/getActiveCustomerThunk", async ({ office="", lead="", userId="" } : { office?: string, lead?: string, userId?: string}) => await getActiveCustomersReq({lead, office, userId}))

export const geLeadsWithUsersThunk = createAsyncThunk("CustomersSlice/geLeadsWithUsersThunk", async () => await getLeadsWithUsers())

export const checkCodeThunk = createAsyncThunk("CustomersSlice/checkCodeThunk", async (code: string) =>  await checkCodeExistReq({code}))

export const updateCustomerSituationThunk = createAsyncThunk("CustomersSlice/updateCustomerSituationThunk", async ({ situationId, customerId, code, date } : { situationId : string, customerId: string, code: string, date: string}) => await updateCustomerSituationReq({customerId, situationId, code, date}))

export const logCustomerDontAnswerThuhk = createAsyncThunk("CustomersSlice/logCustomerDontAnswerThuhk", async ({ customerId, file, note, time } : { customerId : string, file: any, note: string, time: string}) => await logCustomerDontAnswerReq({customerId, file, note, time}))

export const logCustomerAnswerThuhk = createAsyncThunk("CustomersSlice/logCustomerAnswerThuhk", async ({ customerId, file, time } : { customerId : string, file: any, time: string}) => await logCustomerAnswerReq({customerId, file, time}))

export const setCustomerStepThunk = createAsyncThunk("CustomersSlice/setCustomerStepThunk", async ({ customerId, stepId } : { customerId : string, stepId: string}) => await setCustomerStepReq({customerId, stepId}))



export const CustomersSlice = createSlice({
  name: "CustomersSlice",
  initialState,
  reducers: {
    setLoadingCustomersAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setShowCustomerAct: (state, action: PayloadAction<boolean>) => {
      state.showFormCustomer = action.payload
    },
    updateInputNewCustomerAct: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.newCustomerForm[action.payload.key] = action.payload.value
    },
    setDialogCallUserAct: (state, action: PayloadAction<DialogCallUser | undefined>) => {
      state.dialogCallUser = action.payload
      if(action.payload === undefined) state.userAnswered = false
    },
    clearDialogCallActionsAct: (state) => {
      state.customerCallActions = []
    },
    setDialogUpdateCustomerSituationAct: (state, action: PayloadAction<DialogUpdateCustomerSituationI | undefined>) => { 
      state.dialogUpdateCustomerSituation = action.payload
    },
    changeCustomerSituationAct: (state, action: PayloadAction<string>) => {
      state.dialogUpdateCustomerSituation!.newSitutation = action.payload 
    },
    changeDateCustomerSituationAct: (state, action: PayloadAction<string>) => {
      state.dialogUpdateCustomerSituation!.date = action.payload 
    },
    updateCustomerCodeInputAct: (state, action: PayloadAction<string>) => {
      state.dialogUpdateCustomerSituation!.code = action.payload
      if(action.payload.length < 13) state.dialogUpdateCustomerSituation!.statusCode = "unknown"
    },
    changeInputCustomerCallDialogAct: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.customerCallDialogState[action.payload.key] = action.payload.value
    },
    changeLeadCustomersFilterAct: (state, action: PayloadAction<string>) => {
      state.customersFilter.lead = action.payload
      if(action.payload === "") {

      } else {
        state.customers = state.customersOriginal.slice().filter((customer) => {
          if(customer.userAssigned !== undefined && customer.userAssigned !== null) {
            return  (customer.userAssigned[0] as any).lead === state.customersFilter.lead ||
            (customer.userAssigned[0] as any)._id === state.customersFilter.lead
          }
          return false
        })
      }
    },
    changeInputFilterCustomerAct: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.customersFilter[action.payload.key] = action.payload.value
      //console.log("Office Filter", {office: state.customersFilter.office});
      
      state.customers = state.customersOriginal.slice().filter(customer => {
        //console.log("Customer", JSON.parse(JSON.stringify(customer)));
        let show = true
        if(state.customersFilter.office !== "") {
          if(customer.userAssigned !== undefined && customer.userAssigned !== null && customer.userAssigned.length > 0) {
            //console.log("Office customer", {officeCustomer: (customer.userAssigned[0] as any).office})
            show = (customer.userAssigned[0] as any).office === state.customersFilter.office
          }
        }
        if(show && state.customersFilter.user !== "") {
          //console.log("Filter user");
          
          if(customer.userAssigned !== undefined && customer.userAssigned !== null && customer.userAssigned.length > 0) {
            show = (customer.userAssigned[0] as any)._id === state.customersFilter.user
          }
        }
        if(show && state.customersFilter.date !== "") {          
          //console.log("Filter date");
          show = customer.dateAssigned.includes(state.customersFilter.date) 
        }
        if(show && state.customersFilter.step !== "") {
          // Filter by step
          if(state.customersFilter.step === "no-step") {
            // Special case: filter customers with no step
            show = customer.step == null || !Array.isArray(customer.step) || customer.step.length === 0
          } else {
            // Filter by step ID
            if(customer.step && Array.isArray(customer.step) && customer.step.length > 0) {
              const step = customer.step[0] as any
              show = step._id === state.customersFilter.step
            } else {
              show = false
            }
          }
        }
        return show
      })
    },
    clearFiltersCustomerAct: (state) => {
      state.customersFilter = {
        date: "",
        lead: "",
        office: "",
        user: "",
        step: ""
      }
      state.customers = state.customersOriginal
    },
    setDialogCustomerStepAct: (state, action: PayloadAction<DialogCustomerStep | undefined>) => {
      state.dialogCustomerStep = action.payload
    },
    changeSelectStepCustomerAct: (state, action: PayloadAction<string>) => {
      state.dialogCustomerStep!.stepId = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(addCustomerThunk.fulfilled, (state, action:PayloadAction<CustomerInterface>) => {
      state.showFormCustomer = false
      state.newCustomerForm = newCustomerForm
      const c = action.payload
      if(typeof c.userAssigned === 'object') c.userAssigned = [c.userAssigned as unknown as UserInterface]
      state.customers.push(action.payload)
    }).addCase(getCustomersThunk.fulfilled, (state, action:PayloadAction<CustomerInterface[]>) => {
      state.customers = action.payload
    }).addCase(getActiveCustomerThunk.fulfilled, (state, action:PayloadAction<CustomerInterface[]>) => {
      state.customers = action.payload
      state.customersOriginal = action.payload
    }).addCase(setCustomerAsAnsweredThunk.fulfilled, (state, action) => {
      state.userAnswered = true
      const customeIndex = state.customers.findIndex((customer) => customer._id === action.payload._id)
      if(customeIndex !== -1) state.customers[customeIndex] = action.payload
    }).addCase(getCustomerCallActionsThunk.fulfilled, (state, action) => {
      state.customerCallActions = action.payload
    }).addCase(getOfficeCustomersThunk.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
      state.userByOfficeChose = action.payload
    }).addCase(updateCustomerSituationThunk.fulfilled, (state, action) => {
      const customerIndex = state.customers.findIndex((customer) => customer._id === action.payload._id)
      console.log({customerIndex});
      if(customerIndex !== -1) {
        state.customers[customerIndex] = action.payload
      }
      state.dialogUpdateCustomerSituation = undefined
    }).addCase(geLeadsWithUsersThunk.fulfilled, (state, action) => {
        state.leads = action.payload
    }).addCase(checkCodeThunk.pending, (state, action) => {
      state.dialogUpdateCustomerSituation!.statusCode = "checking"
    }).addCase(checkCodeThunk.fulfilled, (state, action) => {
      state.dialogUpdateCustomerSituation!.statusCode = !action.payload ? "valid" : "invalid"
    }).addCase(logCustomerDontAnswerThuhk.fulfilled, (state, action) => {
      const {customer, resumeCalls} = action.payload
      const customerIndexOriginal = state.customers.findIndex((c) => c._id === customer._id)
      const customerIndexFilters = state.customers.findIndex((c) => c._id === customer._id)

      if(resumeCalls.dontAnswer >= 3 && resumeCalls.answer === 0) {
        if(customerIndexOriginal !== -1) state.customersOriginal.splice(customerIndexOriginal, 1)
        if(customerIndexFilters !== -1) state.customers.splice(customerIndexFilters, 1)
      } else {
        if(customerIndexOriginal !== -1) state.customersOriginal[customerIndexOriginal] = customer
        if(customerIndexFilters !== -1) state.customers[customerIndexFilters] = customer
      }
    }).addCase(setCustomerStepThunk.fulfilled, (state, action) => {
      const customerIndexOriginal = state.customersOriginal.findIndex((customer) => customer._id === action.payload.customerId)
      const customerIndexFilters = state.customers.findIndex((customer) => customer._id === action.payload.customerId)
      if(customerIndexOriginal !== -1) state.customersOriginal[customerIndexOriginal].step = [action.payload.step]
      if(customerIndexFilters !== -1) state.customers[customerIndexFilters].step = [action.payload.step]
      state.dialogCustomerStep = undefined
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("CustomersSlice"), (state) => {
      state.loading = true
      state.loadingUsers = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("CustomersSlice"), (state) => {
      state.loadingUsers = false
      state.loading = false
    })
  }
})

export const { setLoadingCustomersAct, setShowCustomerAct, updateInputNewCustomerAct, setDialogCallUserAct, clearDialogCallActionsAct, setDialogUpdateCustomerSituationAct, changeCustomerSituationAct, changeInputCustomerCallDialogAct, changeLeadCustomersFilterAct, updateCustomerCodeInputAct, changeInputFilterCustomerAct, clearFiltersCustomerAct, setDialogCustomerStepAct, changeSelectStepCustomerAct, changeDateCustomerSituationAct} = CustomersSlice.actions

export default CustomersSlice.reducer