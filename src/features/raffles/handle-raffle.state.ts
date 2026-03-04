import { PrizeInterface } from "../../app/models/prize-inteface"
import { RaffleInterface } from "../../app/models/raffle-interface"

export interface HandleRaffleState {
  property: string
  form: HandleRaffleForm
  prizeForm?: PrizeInterface
  raffleFound: boolean
  showLoading: boolean
  error: string
  successCreated: boolean
  currentRaffle: RaffleInterface | undefined
  showDialogAddImage: boolean
  prizeForImgs?: PrizeInterface | undefined
}

export interface HandleRaffleForm {
  name: string
  description: string
  datePrize: string
  code: string
  ticketPrice: number
  nTickets: number
  [key: string]: any,
}
