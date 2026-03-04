/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CardsListStateI, UpdateCardPayedActionI } from "./models/cards-list-interface.state"
import { fetchCardsByUserId, fetchUserCards, getCardResumeReq, updateCardsListSortReq } from "../../app/services/cards.service"
import { CardInterface } from "../../app/models/card-interface"
import { PositionInterface } from "../handle-card/models/handle-card-state"
import { Payload } from "recharts/types/component/DefaultLegendContent"

const initialState: CardsListStateI = {
  cards: [],
  loading: true,
  emptyList: false,
  showModalAddPayment: false,
  showMapListCards: false,
  cardsAtPreview: {}
}

export const fetchCardsThunk = createAsyncThunk( "CardsListSlice/fetchCards", async () => {
    const fetchCards = await fetchUserCards()
    return fetchCards
  },
)

export const fetchCardsByUserIdThunk = createAsyncThunk("CardsListSlice/fetchCardsByUserId", async ({ userId } : { userId : string}) => {
  const getUsersCards = await fetchCardsByUserId(userId)
  return getUsersCards
})

export const updateCardsSortThunk = createAsyncThunk( "CardsListSlice/updateCardSort", async (cards: string[]) => {
    const fetchCards = await updateCardsListSortReq({cards})
    return fetchCards
  },
)

export const getCardResumeThunk = createAsyncThunk("CardListSlice/getCardResume", async (cardId: string) => {
  const getCard = await getCardResumeReq(cardId)
  console.log({getCard});
  return getCard
})

export const CardsListSlice = createSlice({
  name: "CardsListSlice",
  initialState,
  reducers: {
    showModalAddPaymentCardsList: (state, action: PayloadAction<boolean>) => {
      state.showModalAddPayment = action.payload
    },
    setCoordMapModalCardsListAction: (state, action: PayloadAction<PositionInterface>) => {
      state.showMapListCards = true
      state.currentCoordsModalMap = action.payload
    },
    hideModelPosCardCardsListAction: (state) => {
      state.showMapListCards = false
      state.currentCoordsModalMap = undefined
    },
    setNewCardListSorted: (state, action: PayloadAction<CardInterface[]>) => {
      state.cards = action.payload
    },
    addCardToPreviewsAction: (state, action: PayloadAction<string>) => {
      state.cardsAtPreview[action.payload] = true
    },
    updateCardWithPaymentAdded: (state, action: PayloadAction<UpdateCardPayedActionI>) => {
      const cardIndex = state.cards.findIndex((card) => card._id === action.payload.cardId)
      if(cardIndex !== -1){
        state.cards[cardIndex].totalPayed = Number(action.payload.valuePayed) +  Number(state.cards[cardIndex].totalPayed ?? 0)
        state.cards[cardIndex].todayPaymentsTotal = Number(action.payload.valuePayed) +  Number(state.cards[cardIndex].todayPaymentsTotal ?? 0)
      }
    },
    setCardAtPreviewDataAction: (state, action: PayloadAction<CardInterface>) => {
      if(action.payload._id !== undefined && state.cardsAtPreview[action.payload._id] !== undefined){
        state.cardsAtPreview[action.payload._id] = action.payload
      }
    },
    removeCardFromPreviewsAction: (state, action: PayloadAction<string>) => {
      if(state.cardsAtPreview[action.payload] !== undefined){
        delete state.cardsAtPreview[action.payload]
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchCardsThunk.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateCardsSortThunk.pending, state => {state.loading = true})
    builder.addCase(updateCardsSortThunk.fulfilled, (state) => {state.loading = false})
    builder.addCase(fetchCardsByUserIdThunk.pending, (state) => {state.loading = true})
    builder.addCase(fetchCardsByUserIdThunk.fulfilled,
      (state, action: PayloadAction<CardInterface[]>) => {
      state.loading = false
      state.cards = action.payload
      state.emptyList = action.payload.length === 0
    })
    builder.addCase(fetchCardsThunk.fulfilled,
      (state, action: PayloadAction<CardInterface[]>) => {
      state.loading = false
      state.cards = action.payload
      state.emptyList = action.payload.length === 0
    })
    builder.addCase(getCardResumeThunk.fulfilled, (state, action: PayloadAction<CardInterface>) => {
      if(action.payload._id !== undefined){
        state.cardsAtPreview[action.payload._id] = action.payload
      }
    })
  },
})

export const { showModalAddPaymentCardsList, hideModelPosCardCardsListAction, setCoordMapModalCardsListAction, setNewCardListSorted, addCardToPreviewsAction, removeCardFromPreviewsAction, setCardAtPreviewDataAction, updateCardWithPaymentAdded } = CardsListSlice.actions

export default CardsListSlice.reducer
