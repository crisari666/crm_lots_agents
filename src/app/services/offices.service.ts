import Api from "../axios";
import { OfficeLeadsWithUsers } from "../models/office-leads-with-users.interface";
import { OfficeInterface } from "../models/office.inteface";
import UserInterface from "../models/user-interface";


export async function getOfficesReq(): Promise<any>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `offices`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getOfficesReq');
    console.error({error});
    throw error;
  }
}

export async function getOfficeUsersReq({officeId} : {officeId : string}): Promise<UserInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `offices/${officeId}/users`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getOfficeUsers');
    console.error({error});
    throw error;
  }
}

export async function createOfficeReq({name, description, enable, timeOpen} : {name : string, description: string, enable: boolean, timeOpen: number}): Promise<any>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `offices`, data: {name, description, enable, timeOpen} })
    console.log('createOffice', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON createOffice');
    console.error({error});
    throw error;
  }
}

export async function updateOfficeReq({officeId, name, description, timeOpen} : {officeId: string, name : string, description: string, timeOpen: number}): Promise<OfficeInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.put({path: `offices/${officeId}`, data: {name, description, timeOpen} })
    console.log('updateOffice', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateOffice');
    console.error({error});
    throw error;
  }
}

export async function getOfficeReq({officeId} : {officeId : string}): Promise<OfficeInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `offices/${officeId}`})
    console.log('getOffice', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getOffice');
    console.error({error});
    throw error;
  }
}

export async function getOfficeLeadWithUsersReq(): Promise<OfficeLeadsWithUsers[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `offices/office-leads-with-users`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getOfficeLeadWithUsers');
    console.error({error});
    throw error;
  }
}

export async function enableOfficeReq({officeId, enable} : {officeId : string, enable: boolean}): Promise<string>{
  try {
    const api = Api.getInstance()
    const response = await api.put({path: `offices/enable-office/${officeId}/${enable}`})
    console.log('enableOffice', {response});
    const { error } = response
    if(error == null) {
      //return response.result
      return officeId
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON enableOffice');
    console.error({error});
    throw error;
  }
}

export async function setMultipleOfficesSubadminReq({subadminId, officeIds} : {subadminId : string, officeIds: string[]}): Promise<OfficeInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `offices/set-multiple-offices-subadmin`, data: {subadminId, officeIds}})
    console.log('setMultipleOfficesSubadmin', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setMultipleOfficesSubadmin');
    console.error({error});
    throw error;
  }
}

export async function updateOfficeRentReq({officeId, rent} : {officeId : string, rent: number}): Promise<OfficeInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `offices/update-office-rent/${officeId}`, data: {rent}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateOfficeRent');
    console.error({error});
    throw error;
  }
}
