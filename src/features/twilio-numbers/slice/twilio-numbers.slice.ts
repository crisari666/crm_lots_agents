import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RelUserToNumberDialog, TwilioListFilter, TwilioNumbersForm, TwilioNumbersState } from "./twilio-numbers.state";
import { addTwilioNumberReq, getEnableUsersReq, getTwilioNumbersReq, relUserToTwilioNumberReq, updateTwilioNumberReq } from "../../../app/services/twilio-numbers-service"
const twilioNumberFormInit: TwilioNumbersForm = {
  friendlyNumber: '', number: "", PNID: ""
}


const relUserToNumberDialogInit: RelUserToNumberDialog = { twilioNumber: '', userId: ''  }

const twilioListFilterInit: TwilioListFilter = { officeId: '', search: '' }

const initialState: TwilioNumbersState = {
  loading: false,
  displayTwilioNumberForm: false,
  twilioNumberForm: twilioNumberFormInit,
  editingPNID: null,
  displayRelUserToNumberForm: false,
  twilioNumbers: [],
  users: [],
  relUserToNumberDialog: relUserToNumberDialogInit,
  twilioListFilter: twilioListFilterInit
}

export const getTwilioNumbersThunk = createAsyncThunk( "TwilioNumbers/getTwilioNumbersThunk", async () => await getTwilioNumbersReq())

export const getEnableUsersThunk = createAsyncThunk( "TwilioNumbers/getTwilioNumbers", async () => await getEnableUsersReq())

export const relUserToTwilioNumberThunk = createAsyncThunk( "TwilioNumbers/relUserToTwilioNumberThunk", async ({PNID, userId} : {userId: string, PNID: string}) =>
  await relUserToTwilioNumberReq({PNID, userId})
)

export const registerTwilioNumberThunk = createAsyncThunk( "TwilioNumbers/registerTwilioNumberThunk", async (params: {PNID: string, number: string, friendlyNumber: string}) =>
  await addTwilioNumberReq(params)
)

export const updateTwilioNumberThunk = createAsyncThunk( "TwilioNumbers/updateTwilioNumberThunk", async (params: {PNID: string, number: string, friendlyNumber: string}) =>
  await updateTwilioNumberReq(params)
)

export const twilioNumbersSlice = createSlice({
  name: "TwilioNumbers",
  initialState,
  reducers: {
    displayTwilioFormAct: (state, action: PayloadAction<boolean>) => {
      state.displayTwilioNumberForm = action.payload
      if (!action.payload) {
        state.twilioNumberForm = twilioNumberFormInit
        state.editingPNID = null
      }
    },
    openTwilioFormForEditAct: (state, action: PayloadAction<{ PNID: string, number: string, friendlyNumber: string }>) => {
      const { PNID, number, friendlyNumber } = action.payload
      state.twilioNumberForm = { PNID, number, friendlyNumber }
      state.editingPNID = PNID
      state.displayTwilioNumberForm = true
    },
    displayRelUserToNumberFormAct: (state, action: PayloadAction<boolean>) => {
      state.displayRelUserToNumberForm = action.payload
      if(!action.payload) {
        state.relUserToNumberDialog = relUserToNumberDialogInit
      }
    },
    updateInputTwilioNumberAct: (state, action: PayloadAction<{name: string, val: string}>) => {
      const { name, val } = action.payload
      state.twilioNumberForm[name] = val
    },
    changeUserToRelToNumberAct: (state, action: PayloadAction<{userId: string, twilioNumber: string}>) => {
      state.relUserToNumberDialog = action.payload
    },
    updateTwilioListFilterAct: (state, action: PayloadAction<{ key: keyof TwilioListFilter; value: string }>) => {
      const { key, value } = action.payload
      state.twilioListFilter[key] = value
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getTwilioNumbersThunk.fulfilled, (state, action) => {
      state.twilioNumbers = action.payload
    }).addCase(getEnableUsersThunk.fulfilled, (state, action) => {
      state.users = action.payload
    }).addCase(relUserToTwilioNumberThunk.fulfilled, (state, action) => {
      const index = state.twilioNumbers.findIndex((twilio) => twilio.PNID === action.payload.PNID)
      if (index !== -1) {
        state.twilioNumbers[index] = action.payload
      }
      state.displayRelUserToNumberForm = false
      state.relUserToNumberDialog = relUserToNumberDialogInit
    }).addCase(registerTwilioNumberThunk.fulfilled, (state, action) => {
      state.twilioNumbers.push(action.payload)
      state.displayTwilioNumberForm = false
      state.twilioNumberForm = twilioNumberFormInit
      state.editingPNID = null
    }).addCase(updateTwilioNumberThunk.fulfilled, (state, action) => {
      const index = state.twilioNumbers.findIndex((twilio) => twilio.PNID === action.payload.PNID)
      if (index !== -1) {
        state.twilioNumbers[index] = action.payload
      }
      state.displayTwilioNumberForm = false
      state.twilioNumberForm = twilioNumberFormInit
      state.editingPNID = null
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("TwilioNumbers"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("TwilioNumbers"), (state) => {
      state.loading = false
    })
  },
})
export const { displayTwilioFormAct, updateInputTwilioNumberAct, openTwilioFormForEditAct, displayRelUserToNumberFormAct, changeUserToRelToNumberAct, updateTwilioListFilterAct } = twilioNumbersSlice.actions
export default twilioNumbersSlice.reducer