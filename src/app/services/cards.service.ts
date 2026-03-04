import Api from "../axios";
import { CardInterface } from "../models/card-interface";

const api = Api.getInstance()

export async function createCardReq({card, lat, lng} : {card: any, lat: number, lng: number})  {
  try {
    const data = {
      ...card,
      value: Number(card.value),
      lat,
      lng,
    }
    const query = await api.post({ path: "cards/add", data })
    return query
  } catch (error) {
    throw error
  }
}

export async function fetchUserCards() {
  try {
    const cardsRequest = await api.get({path: "cards/getUserCards"})
    const { error } = cardsRequest
    if(error == null){
      return cardsRequest.result
    }else {
      throw error
    }
  } catch (error) {
    throw error;
  }
}

export async function getCardResumeReq(cardId:string) {
  try {
    const cardResume = await api.get({path: `cards/card-resume/${cardId}`})
    console.log({cardResume});
    const {error} = cardResume
    if(error == null){
      if(cardResume.result.length === 1){
        const card: CardInterface = cardResume.result[0]
        card.cardResume = {
          nPayed: card.payments!.length,
          payed: card.totalPayed ?? 0,
          pendingPayments: card.nPayments - (card.payments!.length),
          remainingValue: card.total - (card.totalPayed ?? 0)
        }
        return card
      } else {
        throw Error("Errro getting card resume")
      }
    }else{
      throw error
    }
  } catch (error) {
    throw error
  }
}

export async function getCardsByDateReq(date: string): Promise<CardInterface[]> {
  try {
    const getCards = await api.get({path: `cards/get-cards-history/${date}`})
    const { error } = getCards 
    if(error === null){
      return getCards.result
    } else {
      throw error
    }
  } catch (error) {
    throw error
  }
}

export async function fetchCardsByUserId(userId: string) {
  try {
    const cardsRequest = await api.get({path: `cards/getCardsByUserId/${userId}`})
    const { error } = cardsRequest
    if(error == null){
      return cardsRequest.result
    }else {
      throw error
    }
  } catch (error) {
    throw error;
  }
}

export async function updateCardsListSortReq({cards} : {cards : string[]}) {
  try {
    const updateSort = await api.post({path: "cards/update-list-sort", data: {cards: cards}})
    console.log({updateSort});
  } catch (error) {
    throw error
  }
}
