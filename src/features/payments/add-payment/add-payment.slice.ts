import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CardInterface } from "../../../app/models/card-interface"
import { addPaymentReq } from "../../../app/services/payments.service"

export interface AddPaymentSliceState {
  property: string
  showPaymentModal: boolean
  currentCard?: CardInterface
  successPayment: boolean
  inputValue: number
  payedToday: number
  loading: boolean
  disabledInput: boolean
}

const initialState: AddPaymentSliceState = {
  property: "",
  successPayment: false,
  inputValue: 0,
  payedToday: 0,
  loading: false,
  disabledInput: false,
  showPaymentModal: false,
}

export const addPaymentThunk = createAsyncThunk(
  "AddPaymentSlice/addPaymentReq",
  async ({ cardId, value }: { cardId: string; value: number }) => {
    const addPayment = await {}
    return addPayment
  },
)

export const AddPaymentSliceSlice = createSlice({
  name: "AddPaymentSlice",
  initialState,
  reducers: {
    showPaymentModalAction: (state, action: PayloadAction<boolean>) => {
      state.showPaymentModal = action.payload
    },
    setCardDatFromListAction: (state, action: PayloadAction<CardInterface>) => {
      state.currentCard = action.payload
    },
    setPayedTodayAction: (state, action: PayloadAction<number>) => {
      state.payedToday = action.payload
    },
    updateInputAddPaymentAction: (state, action: PayloadAction<number>) => {
      state.inputValue = action.payload
    },
    resetSuccessPaymentAction: (state) => {
      state.successPayment = false
      state.showPaymentModal = false
      state.inputValue = 0
      state.disabledInput = false
      state.currentCard = undefined
    }
  },
  extraReducers(builder) {
    builder.addCase(addPaymentThunk.pending, (state, action: PayloadAction<any>) => {
      console.log({action})
      state.disabledInput = true
      state.loading = true
    })
    // builder.addCase(
    //   addPaymentThunk.fulfilled,
    //   (state, action: PayloadAction<boolean>) => {
    //     if(action.payload === true){
    //       if(state.currentCard !== undefined){
    //         state.currentCard!.todayPaymentsTotal = Number(state.inputValue)
    //       }
    //       state.successPayment = true
    //       state.loading = false
    //     }
    //   },
    // )
  },
})

export const {
  showPaymentModalAction,
  setCardDatFromListAction,
  setPayedTodayAction,
  updateInputAddPaymentAction, resetSuccessPaymentAction
} = AddPaymentSliceSlice.actions

export default AddPaymentSliceSlice.reducer
