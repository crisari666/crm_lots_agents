import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ClientSituaionsState, SituationFormI } from "./client-situations.state"
import { addSitatuationReq, getAllSituationsReq, getSituationsCodeReq, setSituationIsCallNoteReq, updateSitatuationReq } from "../../../app/services/situations.service"
import { SituationInterface } from "../../../app/models/situation-interface"

const formInit = {
  title: "",
  titleEn: "",
  description: "",
  descriptionEn: "",
  order: 0,
}
const initialState: ClientSituaionsState = {
  loading: true,
  showAddForm: false,
  situations: [],
  situationForm: formInit,
  situationForEditId: "",
  situationsGot: false
}

export const getAllSituationsThunk = createAsyncThunk("ClientSituationsSlice/getAllSituationsThunk", async () => await getAllSituationsReq())

export const getCodeSituationsThunk = createAsyncThunk("ClientSituationsSlice/getCodeSituationsThunk", async () =>  await getSituationsCodeReq())

export const addSituationThunk = createAsyncThunk("ClientSituationsSlice/addSituationThunk", async ({ form } : { form : SituationFormI}) => await addSitatuationReq({situationForm: form}))

export const updateSituationThunk = createAsyncThunk("ClientSituationsSlice/UpdateSituationThunk", async ({ form, situationId } : { form : SituationFormI, situationId: string}) => await updateSitatuationReq({situationForm: form, situtationId: situationId}))

export const setIfSituationIsCallNoteThunk = createAsyncThunk( "ClientSituationsSlice/setIfSituationIsCallNoteThunk", async (params: {situationId: string, isCallNote: boolean}) => await setSituationIsCallNoteReq(params));

export const ClientSituaionsSlice = createSlice({
  name: "ClientSituationsSlice",
  initialState,
  reducers: {
    showLoadingSituationsAct: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    showAddFormAct: (state, action: PayloadAction<boolean>) => { 
      state.showAddForm = action.payload
      if(action.payload === false) state.situationForEditId = ""
    },
    updateFormSituationAct: (state, action: PayloadAction<{key: string, value: any}>) => {
      state.situationForm[action.payload.key] = action.payload.value
    },
    setTituationForEditAct: (state, action: PayloadAction<SituationInterface>) => { 
      const { title, description, order, descriptionEn, titleEn } = action.payload
      state.situationForm = { title, description, order, descriptionEn, titleEn }
      state.situationForEditId = action.payload._id
      state.showAddForm = true
      
    }
  },
  extraReducers(builder) {
    builder.addCase(getAllSituationsThunk.fulfilled, (state, action: PayloadAction<SituationInterface[]>) => {
      state.situations = action.payload
      state.situationsGot = true
    }).addCase(addSituationThunk.fulfilled, (state, action: PayloadAction<SituationInterface>) => {
      state.situationForm = formInit
      state.showAddForm = false
      state.situations.push(action.payload)
      state.situations.sort((a, b) => a.order - b.order)
    }).addCase(updateSituationThunk.fulfilled, (state, action: PayloadAction<SituationInterface>) => {
      state.showAddForm = false
      state.situationForEditId = ""
      const situationIndex = state.situations.findIndex((el: any) => el._id === action.payload._id)
      if(situationIndex !== -1) {
        state.situations[situationIndex] = action.payload
      }
    }).addCase(setIfSituationIsCallNoteThunk.fulfilled, (state, action: PayloadAction<SituationInterface>) => {
      const situationIndex = state.situations.findIndex((el: any) => el._id === action.payload._id)
      if(situationIndex !== -1) {
        state.situations[situationIndex] = action.payload
      }
    })


    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("ClientSituationsSlice"), (state) => {
      state.loading = false
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("ClientSituationsSlice"), (state) => {
      state.loading = false
    })
  },
})

export const { showLoadingSituationsAct, showAddFormAct, updateFormSituationAct, setTituationForEditAct } = ClientSituaionsSlice.actions

export default ClientSituaionsSlice.reducer
