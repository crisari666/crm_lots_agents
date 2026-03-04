import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { OfficeLevelForm, OfficesLevelState } from "./office-level.state";
import { addOfficeLevelReq, getOfficeLevels, updateOfficeLevelReq } from "../../../../app/services/user-rank.service";
const officeLevelFormInitial: OfficeLevelForm = {
  title: "",
  nCustomers: 0,
  nCustomersDatabase: 0
}
const initialState: OfficesLevelState = {
  loading: false,
  officeLevelForm: officeLevelFormInitial,
  officeLevelToEdit: '',
  officeLevels: [],
}
export const getOfficeLevelsThunk = createAsyncThunk( "OfficesLevel/getOfficeLevelsThunk", async () =>
  await getOfficeLevels()
)

export const addOfficeLevelThunk = createAsyncThunk( "OfficesLevelsSlice/addOfficeLevel", async ({ officeLevelForm } : {officeLevelForm: OfficeLevelForm}) =>
  await addOfficeLevelReq({officeLevelForm})
)

export const updateOfficeLevelThunk = createAsyncThunk( "OfficesLevelsSlice/updateOfficeLevelThunk", async ({officeLevelForm, officeLevelToEdit} : {officeLevelForm: OfficeLevelForm, officeLevelToEdit: string}) => await updateOfficeLevelReq({officeLevelForm, officeLevelId: officeLevelToEdit}))


export const OfficesLevelSlice = createSlice({
  name: "OfficesLevel",
  initialState,
  reducers: {
    updateOfficeLevelInputAct: (state, action: PayloadAction<{key: string, value: any}>) => {
      state.officeLevelForm[action.payload.key] = action.payload.value
    },
    setOfficeLevelToEditAct: (state, action: PayloadAction<string>) => {
      state.officeLevelToEdit = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getOfficeLevelsThunk.fulfilled, (state, action) => {
      state.officeLevels = action.payload
    }).addCase(addOfficeLevelThunk.fulfilled, (state, action) => { 
      state.officeLevels.push(action.payload)
      state.officeLevelForm = officeLevelFormInitial
     }).addCase(updateOfficeLevelThunk.fulfilled, (state, action) => {
      state.officeLevels = state.officeLevels.map((officeLevel) => {
        if(officeLevel._id === action.payload._id) {
          return action.payload
        }else {
          return officeLevel
        }
      })
      state.officeLevelToEdit = ''
      state.officeLevelForm = officeLevelFormInitial
     })
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("OfficesLevel"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("OfficesLevel"), (state) => {
      state.loading = false
    })
  },
})
export const { updateOfficeLevelInputAct, setOfficeLevelToEditAct } =OfficesLevelSlice.actions
export default OfficesLevelSlice.reducer