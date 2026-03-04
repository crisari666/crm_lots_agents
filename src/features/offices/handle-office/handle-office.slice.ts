import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HandleOfficeState } from "./handle-office.state"
import { OfficeInterface } from "../../../app/models/office.inteface"
import { createOfficeReq, getOfficeReq, updateOfficeReq } from "../../../app/services/offices.service"

const initialState: HandleOfficeState = {
  loading: false,
  currentOffice: {
    name: "",
    description: "",
    timeOpen: 0
  },
  officeSaved: false
}

export const createOfficeThunk = createAsyncThunk("HandleOffice/createOfficeThunk", async ({ officeForm } : { officeForm : OfficeInterface}) => {
  const office = await createOfficeReq({name: officeForm.name!, description: officeForm.description!, enable: true, timeOpen: officeForm.timeOpen!})  
  return office
})

export const updateOfficeThunk = createAsyncThunk("HandleOffice/updateOfficeThunk", async ({ name, officeId, description, timeOpen } : { name : string, officeId: string, description: string, timeOpen: number}) => {
  const office = await updateOfficeReq({officeId, name, description, timeOpen})
  return office
})

export const getOfficeToEditThunk = createAsyncThunk("HandleOffice/getOfficeToEditThunk", async ({ officeId } : { officeId : string}) => {
  const office = await getOfficeReq({officeId})
  return office
})

export const HandleOfficeSlice = createSlice({
  name: "HandleOffice",
  initialState,
  reducers: {
    setLoadingHandleOfficeAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    updateFormOfficeAct: (state, action: PayloadAction<{key: string, value: string}>) => { 
      
      if(action.payload.key === 'timeOpen') {
        const splitted = action.payload.value.split(":")
        state.currentOffice.timeOpen = Number(splitted[0]+splitted[1])
      } else {
        state.currentOffice[action.payload.key] = action.payload.value
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(createOfficeThunk.fulfilled, (state, action) => {
      state.currentOffice = {
        name: "",
        description: "",
      }
      
    }).addCase(updateOfficeThunk.fulfilled, (state, action) => {
      state.currentOffice = {
        name: "",
        description: "",
      }
      state.officeSaved = true
    }).addCase(getOfficeToEditThunk.fulfilled, (state, action) => {
      state.currentOffice = action.payload
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("HandleOffice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("HandleOffice"), (state) => {
      state.loading = false
    })
  },
})

export const { setLoadingHandleOfficeAct, updateFormOfficeAct } = HandleOfficeSlice.actions

export default HandleOfficeSlice.reducer