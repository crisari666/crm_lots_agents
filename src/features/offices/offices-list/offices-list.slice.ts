import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { OfficesStateI } from "./offices-list.state"
import { enableOfficeReq, getOfficesReq, getOfficeUsersReq, setMultipleOfficesSubadminReq, updateOfficeRentReq } from "../../../app/services/offices.service"
import { OfficeInterface } from "../../../app/models/office.inteface"
import UserInterface from "../../../app/models/user-interface"

const initialState: OfficesStateI = {
  offices: [],
  loading: false,
  gotOffices: false
}

export const usersForOfficeThunk = createAsyncThunk("OfficesSlice/usersForOfficeThunk", async ({ officeId } : { officeId : string}) =>  await getOfficeUsersReq({officeId}))

export const getOfficesThunk = createAsyncThunk("OfficesSlice/getOfficesThunk", async () =>  await getOfficesReq())

export const enableOfficeThunk = createAsyncThunk( "OfficesSlice/enableOfficeThunk", async (params: {officeId: string, enable: boolean}) => await enableOfficeReq(params))

export const setMultipleOfficesSubadminThunk = createAsyncThunk( "OfficesSlice/setMultipleOfficesSubadminThunk", async (params: {subadminId: string, officeIds: string[]}) => await setMultipleOfficesSubadminReq(params))

export const updateOfficeRentThunk = createAsyncThunk( "OfficesSlice/updateOfficeRentThunk", async (params: {officeId: string, rent: number}) => await updateOfficeRentReq(params))

export const OfficesSlice = createSlice({
  name: "OfficesSlice",
  initialState,
  reducers: {
    setLoadingOfficesAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearUsersForOfficeAct: (state) => {
      state.usersForOffice = undefined
    }
  },
  extraReducers(builder) {
    builder.addCase(getOfficesThunk.fulfilled, (state, action: PayloadAction<OfficeInterface[]>) => {
      state.offices = action.payload.filter((el) => el.enable)
      state.loading = false
      state.gotOffices = true
    }).addCase(usersForOfficeThunk.fulfilled, (state, action: PayloadAction<UserInterface[]>) => {
      state.usersForOffice = action.payload
      state.loading = false
    }).addCase(enableOfficeThunk.fulfilled, (state, action: PayloadAction<string>) => {
      const officeIndex = state.offices.findIndex((el) => el._id === action.payload)
      if(officeIndex !== -1) {
        state.offices[officeIndex].enable = !state.offices[officeIndex].enable
      }
    }).addCase(setMultipleOfficesSubadminThunk.fulfilled, (state, action: PayloadAction<OfficeInterface[]>) => {
      action.payload.forEach(updatedOffice => {
        const officeIndex = state.offices.findIndex((el) => el._id === updatedOffice._id)
        if(officeIndex !== -1) {
          state.offices[officeIndex] = updatedOffice
        }
      })
    }).addCase(updateOfficeRentThunk.fulfilled, (state, action: PayloadAction<OfficeInterface>) => {
      const officeIndex = state.offices.findIndex((el) => el._id === action.payload._id)
      if(officeIndex !== -1) {
        state.offices[officeIndex] = action.payload
      }
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("/OfficesSlice"), (state) => { 
      state.loading = true
     }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("/OfficesSlice"), (state) => { 
      state.loading = false
     })
  },
})

export const { setLoadingOfficesAct, clearUsersForOfficeAct } = OfficesSlice.actions

export default OfficesSlice.reducer