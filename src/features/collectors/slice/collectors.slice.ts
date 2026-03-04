import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CollectorForm, CollectorLocationEnum, CollectorOfficesDialog, CollectorsState } from "./collectors.state";
import { addCollectorReq, addOfficeToCollectorReq, fetchCollectorsReq, getCollectorByIdReq, removeOfficeFromCollectorReq, toggleEnableCollectorReq, updateCollectorReq } from "../../../app/services/collectors.service";

const collectorFormInit: CollectorForm = {
  limitMonth: 0,
  limitWeek: 0,
  limitYear: 0,
  location: CollectorLocationEnum.co,
  user: '',
  title: ""
}

const collectorOfficesDialogInit: CollectorOfficesDialog = {
  offices: [],
  collectorId: ''
}


const initialState: CollectorsState = {
  loading: false,
  collectorForm: collectorFormInit,
  showCollectorForm: false,
  collectors: [],
  collectorOfficesDialog: collectorOfficesDialogInit,
  showCollectorOfficesDialgo: false,
  showOnlyEnabled: true
}
export const fetchCollectorsThunk = createAsyncThunk("Collectors/fetchCollectorThunk", async () => {
  const response = fetchCollectorsReq()
  return response
},
)

export const updateCollectorThunk = createAsyncThunk("Collectors/updateCollectorThunk", async ({ collector, collectorId }: { collectorId: string, collector: CollectorForm }) =>
  await updateCollectorReq({ collectorId, collector })
)

export const collectorByIdThunk = createAsyncThunk("Collectors/collectorByIdThunk", async (collectorId: string) => await getCollectorByIdReq({ collectorId }))

export const addCollectorThunk = createAsyncThunk("Collectors/addCollectorThunk", async (collector: CollectorForm) => await addCollectorReq({ collector }))

export const addOfficeToCollectorThunk = createAsyncThunk("Collectors/addOfficeToCollectorThunk", async ({ collectorId, officeId }: { collectorId: string, officeId: string }) => await addOfficeToCollectorReq({ officeId, collectorId }))

export const removeOfficeFromCollectorThunk = createAsyncThunk("Collectors/removeOfficeFromCollectorThunk", async ({ collectorId, officeId }: { collectorId: string, officeId: string }) => await removeOfficeFromCollectorReq({ officeId, collectorId }))

export const toggleEnableCollectorThunk = createAsyncThunk("Collectors/toggleEnableCollectorThunk", async ({ collectorId, enable }: { collectorId: string, enable: boolean }) => await toggleEnableCollectorReq({ collectorId, enable }))

export const collectorsSlice = createSlice({
  name: "Collectors",
  initialState,
  reducers: {
    showCollecotrFormAct: (state, action: PayloadAction<boolean>) => {
      state.showCollectorForm = action.payload
      if (!action.payload) state.collectorForm = collectorFormInit
    },
    updateInputFormCollectorAct: (state, action: PayloadAction<{ key: string, value: string | number }>) => {
      state.collectorForm[action.payload.key] = action.payload.value
    },
    setCollectorToEditAct: (state, action: PayloadAction<string>) => {
      state.collectorToEdit = action.payload
    },
    displayCollectorOfficesDialogAct: (state, action: PayloadAction<boolean>) => {
      state.showCollectorOfficesDialgo = action.payload
      if (!action.payload) {
        state.collectorOfficesDialog = collectorOfficesDialogInit
      }
    },
    updateCollectorOfficesDialogAct: (state, action: PayloadAction<CollectorOfficesDialog>) => {
      state.collectorOfficesDialog = action.payload
    },
    toggleShowOnlyEnabledAct: (state, action: PayloadAction<boolean>) => {
      state.showOnlyEnabled = action.payload
    }

  },
  extraReducers: (builder) => {
    builder.addCase(fetchCollectorsThunk.fulfilled, (state, action) => {
      state.collectors = action.payload
    }).addCase(addCollectorThunk.fulfilled, (state, action) => {
      state.collectors.push(action.payload)
      state.showCollectorForm = false
      state.collectorForm = collectorFormInit
    }).addCase(collectorByIdThunk.fulfilled, (state, action) => {
      state.collectorForm = action.payload
      state.showCollectorForm = true
    }).addCase(updateCollectorThunk.fulfilled, (state, action) => {
      state.collectors = state.collectors.map((collector) => collector._id === action.payload._id ? action.payload : collector)
      state.showCollectorForm = false
      state.collectorForm = collectorFormInit
    }).addCase(addOfficeToCollectorThunk.fulfilled, (state, action) => {
      state.collectors = state.collectors.map((collector) => collector._id === action.payload._id ? { ...collector, offices: action.payload.offices } : collector)
      state.collectorOfficesDialog.offices = action.payload.offices
    }).addCase(removeOfficeFromCollectorThunk.fulfilled, (state, action) => {
      state.collectors = state.collectors.map((collector) => collector._id === action.payload._id ? { ...collector, offices: action.payload.offices } : collector)
      state.collectorOfficesDialog.offices = action.payload.offices
    }).addCase(toggleEnableCollectorThunk.fulfilled, (state, action) => {
      state.collectors = state.collectors.map((collector) => collector._id === action.payload._id ? { ...collector, enable: action.payload.enable } : collector)
    })

    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("Collectors"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("Collectors"), (state) => {
      state.loading = false
    })
  },
})
export const { showCollecotrFormAct, updateInputFormCollectorAct, setCollectorToEditAct, displayCollectorOfficesDialogAct, updateCollectorOfficesDialogAct, toggleShowOnlyEnabledAct } = collectorsSlice.actions
export default collectorsSlice.reducer