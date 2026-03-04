import { CardInterface } from "../../../app/models/card-interface"
import { PositionInterface } from "../../handle-card/models/handle-card-state"

export interface CardsListStateI {
  cards: CardInterface[]
  loading: boolean
  emptyList: boolean
  showModalAddPayment: boolean
  addPaymentState?: ModalAddPaymentInterface
  showMapListCards: boolean
  currentCoordsModalMap?: PositionInterface
  currentUserId?: string
  cardsAtPreview: CardAtPreviewI
}

export interface CardAtPreviewI {
  [_id: string]: boolean | CardInterface
}

export interface ModalAddPaymentInterface {
  cardId: string
  value: number
}

export interface UpdateCardPayedActionI {
  cardId: string
  valuePayed: number
}
