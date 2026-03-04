import { CardInterface } from "../../../app/models/card-interface"

export interface HistoryCardStateI {
  inputDateValue: string
  cards: CardInterface[]
  loading: boolean
  totalValue: number
}
