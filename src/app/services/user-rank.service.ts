import { OfficeLevelForm } from "../../features/offices/office-levels/slice/office-level.state";
import Api from "../axios";
import { OfficeLevelType } from "../models/office-level.type";

export async function updateUserLevelReq({userId, officeLevel} : {userId : string, officeLevel: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `offices/set-user-level/user/${userId}/level/${officeLevel}`})
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

export async function updateOfficeLevelReq({officeLevelId, officeLevelForm} : {officeLevelId : string, officeLevelForm: OfficeLevelForm}): Promise<OfficeLevelType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `offices/office-level/officeLevelId/${officeLevelId}`, data: officeLevelForm})
    console.log('updateOfficeLevelReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateOfficeLevelReq');
    console.error({error});
    throw error;
  }
}

export async function getOfficeLevels(): Promise<OfficeLevelType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `offices/levels`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getOfficeLevels');
    console.error({error});
    throw error;
  }
}

export async function addOfficeLevelReq({officeLevelForm} : {officeLevelForm : OfficeLevelForm}): Promise<OfficeLevelType>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `offices/add-office-level`, data: officeLevelForm})
    console.log('addOfficeLevelReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addOfficeLevelReq');
    console.error({error});
    throw error;
  }
}
