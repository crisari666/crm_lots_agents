import { SituationFormI } from "../../features/customer-situations/client-situations/client-situations.state";
import Api from "../axios";
import { CustomerInterface } from "../models/customer.interface";
import { SituationInterface } from "../models/situation-interface";

export async function getAllSituationsReq(): Promise<SituationInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `situations`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getSituations');
    console.error({error});
    throw error;
  }
}

export async function getSituationsCallNoteReq(): Promise<SituationInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `situations/call-note`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getSituations');
    console.error({error});
    throw error;
  }
}

export async function getSituationsCodeReq(): Promise<SituationInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `situations/code-update`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getSituations');
    console.error({error});
    throw error;
  }
}

export async function addSitatuationReq({situationForm} : {situationForm : SituationFormI}): Promise<SituationInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `situations`, data: situationForm})
    console.log('addSitatuation', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addSitatuation');
    console.error({error});
    throw error;
  }
}

export async function getSituationsByCode({situationForm} : {situationForm : SituationFormI}): Promise<SituationInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `situations`, data: situationForm})
    console.log('addSitatuation', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getSituationsByCode');
    console.error({error});
    throw error;
  }
}

export async function checkCodeExistReq({code} : {code : string}): Promise<boolean>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customer-logs/check-code/${code}`,  })
    console.log('checkCodeExistReq', {response});
    const { error } = response
    if(error == null) {
      return response.result.exist
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON checkCodeExistReq');
    console.error({error});
    throw error;
  }
}

export async function updateSitatuationReq({situationForm, situtationId} : {situationForm : SituationFormI, situtationId: string}): Promise<SituationInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `situations/${situtationId}`, data: situationForm})
    console.log('addSitatuation', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addSitatuation');
    console.error({error});
    throw error;
  }
}

export async function updateCustomerSituationReq({customerId, situationId, code, date} : {customerId : string, situationId: string, code: string, date: string}): Promise<CustomerInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customer-logs/customer-situation/${customerId}`, data: {situationId, code, date}})
    console.log('updateCustomerSituation', {response});
    const { error } = response
    if(error == null) {
      return response.result[0]
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateCustomerSituation');
    console.error({error});
    throw error;
  }
}

export async function customerAnswerReq({param} : {param : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `PATH`, data: param})
    console.log('customerAnswerReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON customerAnswerReq');
    console.error({error});
    throw error;
  }
}

export async function setSituationIsCallNoteReq({situationId, isCallNote} : {situationId : string, isCallNote: boolean}): Promise<SituationInterface>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `situations/set-situation-is-call-note/${situationId}/${isCallNote}`})
    console.log('setSituationIsCallNoteReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setSituationIsCallNoteReq');
    console.error({error});
    throw error;
  }
}