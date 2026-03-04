import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { HandleRaffleState } from "./handle-raffle.state"
import { dateToInputDate, getCurrenDateUtil } from "../../utils/date.utils"
import { getRaffleByIdReq, removeImgFromRaffleReq, sendRaffleHeadFormReq, uploadRaffleImagesReq } from "../../app/services/raffle.service"
import { RaffleInterface } from "../../app/models/raffle-interface"
import { PrizeInterface } from "../../app/models/prize-inteface"
import { removeImgFromPrizeReq, sendRafflePrizeReq, uploadPrizeImagesReq } from "../../app/services/prize.service"


const raffleInitialstate: HandleRaffleState = {
  form: {
    code: "",
    description: "",  
    name: "",
    datePrize: getCurrenDateUtil(),
    ticketPrice: 0,
    nTickets: 0,
  },
  currentRaffle: undefined, 
  successCreated: false,
  showLoading: false,
  raffleFound: false,
  prizeForm: undefined,
  property: "",
  error: "",
  showDialogAddImage: false
}

export const sendRaffleHeadFormThunk = createAsyncThunk("faffleSlice/sendRaffleHeadForm", async ({ raffleHeadForm, raffleId } : { raffleHeadForm : any, raffleId?: string}) => {
  const sendRaffleHeadForm: RaffleInterface = await sendRaffleHeadFormReq({raffleForm: raffleHeadForm, raffleId})
  return sendRaffleHeadForm
})

export const getRaffleByIdThunk = createAsyncThunk("raffleSlice/getRaffleById", async ({ raffleId } : { raffleId : string}) => {
  const raffle = await getRaffleByIdReq({raffleId})
  return raffle
})

export const uploadRaffleImgsThunk = createAsyncThunk("raffleSlice/uploadRaffleImgsThunk", async ({ raffleId, files } : { raffleId : string, files: any}) => {
  const raffle: RaffleInterface = await uploadRaffleImagesReq({raffleId, files})
  return raffle
})

export const uploadPrizeImgsThunk = createAsyncThunk("raffleSlice/uploadPrizeImgsThunk", async ({ prizeId, files } : { prizeId : string, files: any}) => {
  const upldateImagePrize: PrizeInterface = await uploadPrizeImagesReq({prizeId, files})
  console.log({upldateImagePrize});
  return upldateImagePrize
})

export const removeRaffleImgThunk = createAsyncThunk("raffleSlice/removeRaffleImgThunk", async ({ raffleId, img } : { raffleId : string, img: string}) => {
  const raffle: RaffleInterface = await removeImgFromRaffleReq({raffleId, raffleImg: img});
  return raffle
})

export const removePrizeImgThunk = createAsyncThunk("raffleSlice/removePrizeImgThunk", async ({ prizeId, img } : { prizeId : string, img: string}) => {
  const removePrizeImg: PrizeInterface = await removeImgFromPrizeReq({prizeId, prizeImg: img});
  console.log({removePrizeImg});
  return removePrizeImg
})

export const sendPrizeRaffleThunk = createAsyncThunk("raffleSlice/sendPrizeRaffleThunk", async ({ prize } : { prize : PrizeInterface}) => {
  const prizes: PrizeInterface[] = await sendRafflePrizeReq({prize})
  return prizes
})

export const RaffleSlice = createSlice({
name: "RaffleSlice",
  initialState: raffleInitialstate,
  reducers: {
    clearCurrentRaffleAct: (state) => {
      state.currentRaffle = undefined
      state.successCreated = false
    },
    reducerName: (state, action: PayloadAction<string>) => {
      state.property = action.payload
    },
    showLoading: (state, action: PayloadAction<boolean>) => {
      state.showLoading = action.payload
    },
    updateinputRaffleAction: (state, action: PayloadAction<{name: string, value: any}>) => {
      state.form[action.payload.name] = action.payload.value
    },
    showDialogAddImageAct: (state, action: PayloadAction<boolean>) => {
      state.showDialogAddImage = action.payload
    },
    setPrizeFormRaffleAct: (state, action: PayloadAction<PrizeInterface>) => {
      state.prizeForm = action.payload
    },
    clearPrizeFormAct: (state) => {
      state.prizeForm = undefined
    },
    updateInputPrizeForm: (state, action: PayloadAction<{key: string, value: any}>) => {
      state.prizeForm![action.payload.key] = action.payload.value
    },
    setPrizeForImagsAct: (state, action: PayloadAction<PrizeInterface | undefined>) => {
      state.prizeForImgs = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(sendRaffleHeadFormThunk.pending, (state) => {
      state.showLoading = true
    })
    builder.addCase(sendRaffleHeadFormThunk.fulfilled, (state, action: PayloadAction<RaffleInterface>) => {
      if(state.currentRaffle === undefined) {
        state.successCreated = true
        state.currentRaffle = action.payload
      }
      state.showLoading = false
    })
    builder.addCase(sendRaffleHeadFormThunk.rejected, (state) => {
      state.showLoading = false
    })
    builder.addCase(getRaffleByIdThunk.pending, (state) => {
      state.showLoading = true
    })
    builder.addCase(getRaffleByIdThunk.fulfilled, (state, action: PayloadAction<RaffleInterface>) => {
      state.currentRaffle = action.payload
      console.log({action});
      state.form = {
        code: action.payload.code,
        description: action.payload.description,  
        name: action.payload.name,
        datePrize: dateToInputDate(action.payload.datePrize) ,
        ticketPrice: action.payload.ticketPrice,
        nTickets: action.payload.nTickets,
      }
      state.showLoading = false
    })
    builder.addCase(uploadRaffleImgsThunk.pending, (state) => {
      state.showLoading = true
    })
    builder.addCase(uploadRaffleImgsThunk.fulfilled, (state, action: PayloadAction<RaffleInterface>) => {
      state.showLoading = false
      state.currentRaffle!.images = action.payload.images
      state.showDialogAddImage = false
    })
    builder.addCase(removeRaffleImgThunk.pending, (state) => {
      state.showLoading = true
    })
    builder.addCase(removeRaffleImgThunk.fulfilled, (state, action: PayloadAction<RaffleInterface>) => {
      state.showLoading = false
      state.currentRaffle = action.payload
    })
    builder.addCase(sendPrizeRaffleThunk.pending,(state) => {
      state.showLoading = true
    })
    builder.addCase(sendPrizeRaffleThunk.fulfilled, (state, action: PayloadAction<PrizeInterface[]>) => {
      state.currentRaffle!.prizes = action.payload
      state.showLoading = false
      state.currentRaffle!.cost = Number(state.currentRaffle?.cost) + Number(state.prizeForm?.price)
       state.prizeForm = undefined
    })
    builder.addCase(removePrizeImgThunk.pending, (state) => {
      state.showLoading = true
    })
    builder.addCase(removePrizeImgThunk.fulfilled, (state, action: PayloadAction<PrizeInterface>) => {
      state.showLoading = false
      state.prizeForImgs!.images = action.payload.images
    })
    builder.addCase(uploadPrizeImgsThunk.pending, (state) => {
      state.showLoading = true
    })
    builder.addCase(uploadPrizeImgsThunk.fulfilled, (state, action: PayloadAction<PrizeInterface>) => {
      state.showLoading = false
      state.prizeForImgs = undefined
      const indexCurrentPrize = state.currentRaffle!.prizes.findIndex((el) => el._id === action.payload._id)  
      if(indexCurrentPrize !== -1) {
        state.currentRaffle!.prizes[indexCurrentPrize] = action.payload
      }
      //state.show = false
    })
  }
})

export const { reducerName, showLoading, updateinputRaffleAction, clearCurrentRaffleAct, showDialogAddImageAct, setPrizeFormRaffleAct, clearPrizeFormAct, updateInputPrizeForm, setPrizeForImagsAct } = RaffleSlice.actions

export default RaffleSlice.reducer