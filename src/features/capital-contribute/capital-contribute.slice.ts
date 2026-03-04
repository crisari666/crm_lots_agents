/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CapitalContributeInterface, CapitalContributeStateI } from "./domain/capital-contribute-state"
import { getCurrenDateUtil } from "../../utils/date.utils"
import { addCapitalContributeReq, getCapitalContributeByDateReq } from "../../app/services/capital.service"

const initialState: CapitalContributeStateI = {
  contributeCapitalForm: {
    name: "",
    value: 0,
  },
  history: [],
  loading: false,
  dateInputFilter: getCurrenDateUtil(),
  showModalForm: false,
}

export const addCapitalThunk = createAsyncThunk( "CapitalContribute/AddCapitalReq", async ({value, name} : {value: number, name: string}) => {
  const addCapital = await addCapitalContributeReq({ value, name })
  return addCapital
})

export const getCapitalByDateThunk = createAsyncThunk( "CapitalContribute/GetCapitalByDate", async ({date} : {date: string }) => {
  const getCapitals = await getCapitalContributeByDateReq({ date })
  return getCapitals
})

export const CapitalContributeSlice = createSlice({
  name: "CapitalContribute",
  initialState,
  reducers: {
    changeInputDateCapitalAction: (state, action: PayloadAction<string>) => {
      state.dateInputFilter = action.payload
    },
    updateInputContributeCapitalFormAction: (
      state,
      action: PayloadAction<{ key: string; value: string | number }>,
    ) => {
      state.contributeCapitalForm[action.payload.key] = action.payload.value
    },
    showModalContributeCapitalAction: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.showModalForm = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(addCapitalThunk.pending, (state) => {state.loading = true})
    builder.addCase(getCapitalByDateThunk.pending, (state) => {state.loading = true})
    builder.addCase(addCapitalThunk.fulfilled, (state, action: PayloadAction<CapitalContributeInterface>) => {
      state.loading = false
      state.showModalForm = false
      state.history.push(action.payload)
      state.contributeCapitalForm = {
        name: "", value: 0
      }
    })
    builder.addCase(getCapitalByDateThunk.fulfilled, (state, action: PayloadAction<CapitalContributeInterface[]>) => {
      state.loading = false;
      state.history = action.payload
    })
  },
})

export const {
  updateInputContributeCapitalFormAction,
  showModalContributeCapitalAction, changeInputDateCapitalAction
} = CapitalContributeSlice.actions

export default CapitalContributeSlice.reducer
