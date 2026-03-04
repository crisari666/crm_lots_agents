import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { StepForm, StepsSliceState } from "./steps.state";
import { addStepReq, getStepsReq, updateStepReq } from "../../app/services/steps.service";
const initialState: StepsSliceState = {
  loading: false,
  steps: [],
  showForm: false,
  stepForm: {
    order: 0,
    title: '',
    color: ''
  },
}

export const getStepsThunk = createAsyncThunk( "StepsSlice/getStep", async () => await getStepsReq())

export const createStepThunk = createAsyncThunk( "StepsSlice/createStepThunk", async (data: StepForm) => await addStepReq({param: data}))

export const updateStepThunk = createAsyncThunk( "StepsSlice/updateStepThunk", async ({data, stepId} : {data: StepForm, stepId: string}) => await updateStepReq({param: data, stepId}))

 
export const StepsSliceSlice = createSlice({
  name: "StepsSlice",
  initialState,
  reducers: {
    showFormStepAct: (state, action: PayloadAction<boolean>) => {
      state.showForm = action.payload 
      if(!action.payload) {
        state.stepToEdit = undefined
        state.stepForm = {
          order: 0,
          title: '',
          color: ''
        }
      }
    },
    updateInputStepFormAct: (state, action: PayloadAction<{name: string, value: any}>) => { 
      state.stepForm[action.payload.name] = action.payload.value
    },
    setStepIdForEditAct: (state, action: PayloadAction<string>) => {  
      state.stepToEdit = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getStepsThunk.fulfilled, (state, action) => {
      state.steps = action.payload  
    }).addCase(createStepThunk.fulfilled, (state, action) => {
      state.steps.push(action.payload)
      state.showForm = false
      state.stepForm = {
        order: 0,
        title: '',
        color: ''
      }
    }).addCase(updateStepThunk.fulfilled, (state, action) => {
      const index = state.steps.findIndex((step) => step._id === action.payload._id)
      state.steps[index] = action.payload
      state.showForm = false
      state.stepForm = {
        order: 0,
        title: '',
        color: ''
      }
    })
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("StepsSlice"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("StepsSlice"), (state) => {
      state.loading = false
    })
  },
})
export const { showFormStepAct, updateInputStepFormAct, setStepIdForEditAct } =StepsSliceSlice.actions
export default StepsSliceSlice.reducer