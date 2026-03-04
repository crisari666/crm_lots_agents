/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HandleCardState, PositionInterface } from "./models/handle-card-state"
import { createCardReq } from "../../app/services/cards.service"

const initialState: HandleCardState = {
  loading: false,
  showMap: false,
  geoPosAllowed: false,
  createdCard: false,
  user: undefined
}

export const createCardThunk = createAsyncThunk("handleCard/create", async ({card, lat, lng} :{ card: any, lat: number, lng: number}) => {
  const createCard = await createCardReq({card, lat, lng})
  return createCard
})

export const HandelCardSlice = createSlice({
  name: "handleCard",
  initialState,
  reducers: {
    changeUserCreateCardAction: (state, action: PayloadAction<string>) => {
      state.user = action.payload
    },
    clearStateCreateCardAction: (state) => {
      state.createdCard = false
    },
    clearUserAction: (state) => {
      state.user = undefined
    },
    setLoadingHandleCardAction: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setPositionHandleCardAction: (state, action: PayloadAction<PositionInterface>) => {
      state.position = action.payload
    },
    setShowMapAction: (state, action: PayloadAction<boolean>) => {
      state.showMap = action.payload
    },
    setGeoPosAllowedHandleCardAction: (state, action: PayloadAction<boolean>) => {
      state.geoPosAllowed = action.payload
    },


  },
  extraReducers(builder) {
    builder.addCase(createCardThunk.pending, (state) => {state.loading = true})
    builder.addCase(createCardThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
      state.loading = false;
      state.createdCard = true
    })
  },
})

export const { setLoadingHandleCardAction, setPositionHandleCardAction, setShowMapAction, setGeoPosAllowedHandleCardAction, changeUserCreateCardAction, clearStateCreateCardAction } = HandelCardSlice.actions

export default HandelCardSlice.reducer
