import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SettingForm, SettingsSliceState } from "./settings.state";
import { addSettingReq, getSettingsReq, updateSettingReq } from "../../../app/services/settings.service";
const settingFormInitStaTe: SettingForm = {
  title: "",
  type: "",
  value: ""
} 
const initialState: SettingsSliceState = {
  settingsGot: false,
  loading: false,
  settingForm: settingFormInitStaTe,
  settings: [],
  showDialog: false,
  settingForEdit: ""
}
export const getSettingsThunk = createAsyncThunk( "SettingsSlice/getSettingsThunk", async () => await getSettingsReq())

export const addSettingThunk = createAsyncThunk( "SettingsSlice/addSetting", async (setting: SettingForm) => await addSettingReq({setting}))

export const updateSettingThunk = createAsyncThunk( "SettingsSlice/updateSettingThunk", async ({setting, settingId} : {settingId: string, setting: SettingForm}) => await updateSettingReq({setting, settingId}))

export const settingsSlice = createSlice({
  name: "SettingsSlice",
  initialState,
  reducers: {
    displayDialogSettingAct: (state, action: PayloadAction<boolean>) => {
      state.showDialog = action.payload
      if(!action.payload) {
        state.settingForm = settingFormInitStaTe
        state.settingForEdit = ""
      }
    },
    updateSettingFormInputAct: (state, action: PayloadAction<{key: string, value: any}>) => {
      state.settingForm[action.payload.key] = action.payload.value
    },
    setSettingForEditAct: (state, action: PayloadAction<string>) => {
      state.settingForEdit = action.payload
      state.showDialog = true
      state.settingForm = state.settings.find((setting) => setting._id === action.payload) || settingFormInitStaTe
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSettingsThunk.fulfilled, (state, action) => {
      state.settings = action.payload
      state.settingsGot = true
    }).addCase(addSettingThunk.fulfilled, (state, action) => {
      state.settings.push(action.payload)
      state.showDialog = false
    }).addCase(updateSettingThunk.fulfilled, (state, action) => {
      const index = state.settings.findIndex((setting) => setting._id === action.payload._id)
      state.settings[index] = action.payload
      state.showDialog = false
      state.settingForEdit = ""
      state.settingForm = settingFormInitStaTe
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("SettingsSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("SettingsSlice"), (state) => {
      state.loading = false
    })
  },
})
export const { displayDialogSettingAct, updateSettingFormInputAct, setSettingForEditAct } = settingsSlice.actions
export default settingsSlice.reducer