import Api from "../axios";
import { UnpaidInterface } from "../models/unpaid-interface";

const api = new Api()

export async function getCardUnpaidsReq ({cardId} : {cardId: string}):Promise<UnpaidInterface> {
  try {
    const unpaidsRes = await api.get({ path: `unpaids/get-card-unpaids/${cardId}` })
    const { error } = unpaidsRes
    if(error === null){
      return unpaidsRes.result
    }else {
      throw error
    }
  } catch (error) {
    console.error("Errro on getCardUnpaidsReq")
    console.error({ error })
    throw error;
  }
}