import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HistoryCardStateI } from "./domain/history-cards-state"
import { getCurrenDateUtil } from "../../utils/date.utils"
import { getCardsByDateReq } from "../../app/services/cards.service"
import { CardInterface } from "../../app/models/card-interface"

const initialState: HistoryCardStateI = {
  cards: [],
  inputDateValue: getCurrenDateUtil(),
  loading: false,
  totalValue: 0,
}

export const getCardsByDateThunk = createAsyncThunk(
  "HistoryCards/getCardsByDate",
  async (date: string): Promise<CardInterface[]> => {
    const getCardsReq = await getCardsByDateReq(date)
    return getCardsReq
  },
)

export const HistoryCardsSlice = createSlice({
  name: "HistoryCards",
  initialState,
  reducers: {
    updateInputDateHistoryCardsAction: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.inputDateValue = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(getCardsByDateThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      getCardsByDateThunk.fulfilled,
      (state, action: PayloadAction<CardInterface[]>) => {
        state.loading = false
        state.cards = action.payload
        state.totalValue = state.cards.reduce(
          (previous, card) => previous + card.value,
          0,
        )
      },
    )
  },
})

export const { updateInputDateHistoryCardsAction } = HistoryCardsSlice.actions

export default HistoryCardsSlice.reducer
