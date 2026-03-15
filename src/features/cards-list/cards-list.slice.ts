import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type CardsListState = Record<string, unknown>

const initialState: CardsListState = {}

const slice = createSlice({
  name: "cardsList",
  initialState,
  reducers: {
    updateCardWithPaymentAdded: (state, _action: PayloadAction<{ cardId: string; valuePayed: number }>) => {
      return state
    }
  }
})

export const { updateCardWithPaymentAdded } = slice.actions
export default slice.reducer
