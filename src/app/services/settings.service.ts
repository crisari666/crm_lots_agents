import { SettingForm } from "../../features/settings/slice/settings.state";
import Api from "../axios";
import { SettingType } from "../models/setting.type";

export async function addSettingReq({setting} : {setting : SettingForm}): Promise<SettingType>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `app-settings`, data: setting})
    console.log('addSettings', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addSettings');
    console.error({error});
    throw error;
  }
}

export async function updateSettingReq({setting, settingId} : {setting : SettingForm, settingId: string}): Promise<SettingType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `app-settings/setting/${settingId}`, data: setting})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON update');
    console.error({error});
    throw error;
  }
}

export async function getSettingsReq(): Promise<SettingType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `app-settings`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getSettingsReq');
    console.error({error});
    throw error;
  }
}