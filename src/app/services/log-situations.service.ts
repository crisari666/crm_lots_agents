import { CustomerSituationFormI } from "../../features/customers/customer-view/customer-view.state";
import { FileUtils } from "../../utils/file.utils";
import Api from "../axios";
import { CustomerLogSituationsI } from "../models/customer-logs.inteface";

export async function getCustomerLogsReq({customerId} : {customerId : string}): Promise<CustomerLogSituationsI[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customer-logs/${customerId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCustomerLogs');
    console.error({error});
    throw error;
  }
}

export async function addCustomerLogReq({customerId, customerLogForm, file} : {customerId : string, customerLogForm: CustomerSituationFormI, file: any}): Promise<CustomerLogSituationsI>  {
  try {
    const api = Api.getInstance()
    const data = {
      customer: customerId,
      situation: customerLogForm.situation,
      note: customerLogForm.note
    }

    const filesFormat = await file.map((file: any) => FileUtils.dataUrlToFile(file.src, file.name))
    const filesFormatted: Blob[] = await Promise.all(filesFormat)

    console.log({filesFormatted});
    
  
    const formData = new FormData()
    for(const f of filesFormatted) {
      formData.append("image", f)
    }
    formData.append("customer", customerId)
    formData.append("situation", customerLogForm.situation)
    formData.append("note", customerLogForm.note)

    const response = await api.post({path: `customer-logs/${customerLogForm.situation}`, data: formData, isFormData: true});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addCustomerLog');
    console.error({error});
    throw error;
  }
}

export async function confirmLogSituationReq({logSituadionId} : {logSituadionId : string}): Promise<CustomerLogSituationsI>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customer-logs/${logSituadionId}/true`})
    console.log('confirmLogSituation', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON confirmLogSituation');
    console.error({error});
    throw error;
  }
}