import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { PenancesState } from "./penances.state";
import { addPenanceToUserReq, getPenancesReq } from "../../../app/services/penance.service";
const initialState: PenancesState = {
  loading: false,
  penances: [],
  penanceApplied: false,
}

export const getPenancesThunk = createAsyncThunk( "Penances/getPenances", async () => await getPenancesReq())

export const addPenanceThunk = createAsyncThunk("Penances/addPenance", async ({user, customer}: {user: string, customer: string}) => 
  await addPenanceToUserReq({user, customer}))


export const penancesSlice = createSlice({
  name: "Penances",
  initialState,
  reducers: {
    resetPenanceAppliedAction: (state) => {
      state.penanceApplied = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPenancesThunk.fulfilled, (state, action) => {
      state.penances = action.payload
    }).addCase(addPenanceThunk.fulfilled, (state, action) => {
      console.log('addPenanceThunk.fulfilled', {action});
      state.penanceApplied = true
    }).addCase(addPenanceThunk.rejected, (state, action) => {
      alert('Este usuario ya tiene una multa por este cliente')
    })
    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("Penances"), (state) => {
      state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("Penances"), (state) => {
      state.loading = false
    })
  },
})
export const { resetPenanceAppliedAction } = penancesSlice.actions
export default penancesSlice.reducer