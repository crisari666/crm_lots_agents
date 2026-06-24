import Api from "../axios";
import { TwilioNumberType } from "../models/twilio-number.type";
import UserInterface from "../models/user-interface";


export async function getTwilioNumbersReq(): Promise<TwilioNumberType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `twilio-numbers`})
    console.log('getTwilioNumbersReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getTwilioNumbersReq');
    console.error({error});
    throw error;
  }
}


export async function getEnableUsersReq(): Promise<UserInterface[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `users/enables`})
    console.log('getEnableUsers', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getEnableUsers');
    console.error({error});
    throw error;
  }
}

export async function relUserToTwilioNumberReq({
  userId,
  PNID,
}: {
  PNID: string
  userId?: string
}): Promise<TwilioNumberType> {
  try {
    const api = Api.getInstance()
    const data =
      userId !== undefined && userId !== ''
        ? { userId, PNID }
        : { PNID }
    const response = await api.patch({ path: `twilio-numbers/rel-user-to-number`, data })
    console.log('relUserToTwilioNumber', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON relUserToTwilioNumber');
    console.error({error});
    throw error;
  }
}

export async function addTwilioNumberReq({PNID, friendlyNumber, number} : {PNID : string, number: string, friendlyNumber: string}): Promise<TwilioNumberType>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `twilio-numbers`, data: {PNID, number, friendlyNumber}})
    console.log('addTwilioNumbers', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addTwilioNumbers');
    console.error({error});
    throw error;
  }
}

export async function updateTwilioNumberReq({PNID, friendlyNumber, number}: {PNID: string, number: string, friendlyNumber: string}): Promise<TwilioNumberType> {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `twilio-numbers`, data: {PNID, number, friendlyNumber}})
    const { error } = response
    if (error == null) {
      return response.result
    }
    throw error
  } catch (error) {
    console.error('ERROR ON updateTwilioNumberReq')
    console.error({error})
    throw error
  }
}

export async function toggleInternationalNumberReq(PNID: string): Promise<TwilioNumberType> {
  try {
    const api = Api.getInstance()
    const response = await api.patch({
      path: `twilio-numbers/toggle-international`,
      data: { PNID },
    })
    const { error } = response
    if (error == null) {
      return response.result
    }
    throw error
  } catch (error) {
    console.error('ERROR ON toggleInternationalNumberReq')
    console.error({ error })
    throw error
  }
}

export async function toggleTwilioNumberPurposeReq(PNID: string): Promise<TwilioNumberType> {
  try {
    const api = Api.getInstance()
    const response = await api.patch({
      path: `twilio-numbers/toggle-number-purpose`,
      data: { PNID },
    })
    const { error } = response
    if (error == null) {
      return response.result
    }
    throw error
  } catch (error) {
    console.error('ERROR ON toggleTwilioNumberPurposeReq')
    console.error({ error })
    throw error
  }
}

export async function deleteTwilioNumberReq(PNID: string): Promise<{ PNID: string }> {
  try {
    const api = Api.getInstance()
    const response = await api.delete({ path: `twilio-numbers/${encodeURIComponent(PNID)}` })
    const { error } = response
    if (error == null) {
      return response.result
    }
    throw new Error(typeof error === 'string' ? error : 'Failed to delete Twilio number')
  } catch (error) {
    console.error('ERROR ON deleteTwilioNumberReq')
    console.error({ error })
    throw error
  }
}