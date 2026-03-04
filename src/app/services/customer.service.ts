import { CustomerWasTreatedType, NewCustomerFormI } from "../../features/customers/customers-list/customers.state";
import Api from "../axios";
import { CustomerInterface } from "../models/customer.interface";
import { CustomerRowCSVI } from "../models/customer-row-csv";
import { LeadsWithUsers } from "../models/leads-users-customer.interface";
import { PutUserToCustomerInterface } from "../models/put-user-to-customer";
import { CustomerCallActionsInterface } from "../models/customer-call-actions.interface";
import { FileUtils } from "../../utils/file.utils";
import { dateToInputDate } from "../../utils/date.utils";
import { CustomerCenterFilter } from "../../features/customers-center/components/customer-center.state";
import { ItemCustomerDatabase, RowCustomerDatabse, UserWithCustomersDatabaseType } from "../../features/customers-database/slice/customer-disabled.state";
import { getCallsResume } from "../../utils/customer.utils";
import { CustomerStepsFormFilter } from "../../features/customer-steps-log/customer-step-log.state";
import { CustomerDocPayType } from "../models/customer-doc-pay.type";
import { RecycleCustomerRowType } from "../../features/campaigns/campaign-customers/redux/campaign-customers-state";

export async function addCustomerReq({customerForm} : {customerForm : NewCustomerFormI}): Promise<CustomerInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `customers`, data: customerForm})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addCustomerReq');
    console.error({error});
    throw error;
  }
}
export async function updateCustomerReq({customerData, customerId} : {customerData : CustomerInterface, customerId: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/update/${customerId}`, data: customerData})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateCustomerReq');
    console.error({error});
    throw error;
  }
}
export async function getCustomersReq(): Promise<CustomerInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCustomersReq');
    console.error({error});
    throw error;
  }
}
export async function getActiveCustomersReq({office, lead, userId } : {office: string, lead: string, userId: string}): Promise<CustomerInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/filter-actives`, body: {office, lead, userId}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCustomersReq');
    console.error({error});
    throw error;
  }
}
export async function filterCustomersAdminReq({value, dateStart, dateEnd, office, userAssigned, excludeDate, type, step } : CustomerCenterFilter): Promise<CustomerInterface[]>  {
  try {
    const api = Api.getInstance()
    const body = {search: value, dateEnd: dateToInputDate(dateEnd.toISOString()), dateStart: dateToInputDate(dateStart.toISOString()), office, userAssigned, excludeDate, type, step}
    
    const response = await api.post({path: `customers/filter-customers`, data: body}) 
    
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCustomersReq');
    console.error({error});
    throw error;
  }
}
export async function getCustomersDatabaseReq({endDate, fromDate, limit, term} : {fromDate: string, endDate: string, limit: number, term?: string}): Promise<RowCustomerDatabse[]>{
  try {
    const api = Api.getInstance()
    const path = term && term.trim() !== '' 
      ? `customers/customers-database/from/${fromDate}/to/${endDate}/limit/${limit}/term/${encodeURIComponent(term.trim())}`
      : `customers/customers-database/from/${fromDate}/to/${endDate}/limit/${limit}`;
    
    const response = await api.get({path})
    const { error, result } : {error: any, result: ItemCustomerDatabase[] } = response
    if(error == null) {
      const rows: RowCustomerDatabse[] = result.map((r: ItemCustomerDatabase) => ({
        checked: false,
        email: r.email,
        name: r.name,
        date: r.dateAssigned ? dateToInputDate(r.dateAssigned) : null,
        nAssigned: r.historicalAssignations.length > 0 ? r.historicalAssignations[0].log.length : 0,
        nDisabled: r.historicalDisables.length > 0 ? r.historicalDisables[0].count : 0,
        phone: r.phone,
        _id: r._id,
        resumeCalls: getCallsResume(r),
        user: r.userCreator
      }) as RowCustomerDatabse)
      return rows
    } else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCustomersDatabaseReq');
    console.error({error});
    throw error;
  }
}
export async function getCustomerById({customerId} : {customerId : string}): Promise<CustomerInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/${customerId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCustomerById');
    console.error({error});
    throw error;
  }
}
export async function disableCustomerReq({customerId, motive} : {customerId : string, motive: string}): Promise<CustomerInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/disable/${customerId}`, data: {motive}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON disableCustomer');
    console.error({error});
    throw error;
  }
}
export async function uploadMultipleCustomerReq({customers} : {customers : CustomerRowCSVI[]}): Promise<CustomerInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `customers/customers-from-csv`, data: {customers}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON uploadMultipleCustomer');
    console.error({error});
    throw error;
  }
}
export async function updateCustomersWithUsersReq({leadUsersMap, campaignId, projectId} : {leadUsersMap: {[leadId: string]: LeadsWithUsers}, campaignId: string, projectId?: string}): Promise<boolean>  {
  try {
    const customers: PutUserToCustomerInterface[] = []
    console.log({leadUsersMap});
    
    for(const leadId in leadUsersMap) {
      const lead = leadUsersMap[leadId]

      const {officeCampaignId, office} = lead
      for(const userId in lead.users) {
        const user = lead.users[userId]
        for(const customer of user.customers) {
          customers.push({
            campaignId, 
            office,
            customerId: customer.customer!._id,
            leadId,
            officeCampaignId,
            userId,
            projectId
          })
        }
      }
    }
    const api = Api.getInstance()
    const response = await api.put({path: `customers/put-users-to-customers`, data: {customersData: customers}})
    const { error } = response
    if(error == null) {
      return true
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON METHOD');
    console.error({error});
    throw error;
  }
}
export async function logCustomerCallActionReq({customerId, callAction} : {customerId : string, callAction: number}): Promise<any>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/${customerId}/call-actions/${callAction}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON logCustomerCallAction');
    console.error({error});
    throw error;
  }
}
export async function logCustomerDontAnswerReq({customerId, file, note, time} : {customerId : string, file: any, note: string, time: string}): Promise<any>  {
  try {
    const api = Api.getInstance()
    const filesFormat = await file.map((file: any) => FileUtils.dataUrlToFile(file.src, file.name))
    const filesFormatted: Blob[] = await Promise.all(filesFormat)
  
    const formData = new FormData()
    for(const f of filesFormatted) {
      formData.append("image", f)
    }
    formData.append("note", note)
    formData.append("time", time)
    const response = await api.post({path: `customers/${customerId}/call-actions/dont-answer`, data: formData, isFormData: true})
 
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON logCustomerCallAction');
    console.error({error});
    throw error;
  }
}
export async function logCustomerAnswerReq({customerId, file, time} : {customerId : string, file: any, time: string}): Promise<any>  {
  try {
    const api = Api.getInstance()
    const filesFormat = await file.map((file: any) => FileUtils.dataUrlToFile(file.src, file.name))
    const filesFormatted: Blob[] = await Promise.all(filesFormat)
  
    const formData = new FormData()
    for(const f of filesFormatted) {
      formData.append("image", f)
    }
    formData.append("time", time)
     const response = await api.post({path: `customers/${customerId}/call-actions/answer`, data: formData, isFormData: true})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON logCustomerCallAction');
    console.error({error});
    throw error;
  }
}
export async function customerAnswerReq({customerId} : {customerId : string}): Promise<CustomerInterface>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/${customerId}/answer`})
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
export async function getCustomerCallActionsLogsReq({customerId} : {customerId : string}): Promise<CustomerCallActionsInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/${customerId}/calll-actions`})
  
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON get');
    console.error({error});
    throw error;
  }
}
export async function getNCustomersByUser({userId} : {userId : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/n-users-by-user/${userId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getNCustomersByUser');
    console.error({error});
    throw error;
  }
}
export async function assignCustomerDatabaseToUsersReq(param :  UserWithCustomersDatabaseType[]): Promise<number>{
  try {
    const api = Api.getInstance()
    // console.log({param});
    // return 1;
    const response = await api.patch({path: `customers/assign-customer-database-to-users`, data: param})
    const { error } = response
    if(error == null) {
      return response.result.length
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON assignCustomerDatabaseToUsersReq');
    console.error({error});
    throw error;
  }
}
export async function setUserToCustomerReq(data : {customerId: string, userId: string, officeId: string}): Promise<any>{
  try {
    console.log({data});
    
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/set-user-to-customer`, data})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setUserToCustomerReq');
    console.error({error});
    throw error;
  }
}
export async function customerResumeReq({customerId} : {customerId : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/resume/${customerId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON customerResumeReq');
    console.error({error});
    throw error;
  }
}
export async function checIfCustomerWasTreatedReq({customerId} : {customerId : string}): Promise<CustomerWasTreatedType>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/check-if-was-treated/${customerId}`})
    console.log('checIfCustomerWasTreated', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON checIfCustomerWasTreated');
    console.error({error});
    throw error;
  }
}
export async function getCustomersByStepLogReq({filter} : {filter : CustomerStepsFormFilter}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `customers/filter-by-steps`, data: filter})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCustomersByStepLogReq');
    console.error({error});
    throw error;
  }
}
export async function inactiveCustomerReq({customerId} : {customerId : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/inactive/${customerId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON inactiveCustomerReq');
    console.error({error});
    throw error;
  }
}

export async function uploadCustomerDocPayReq({customerId, file, step, value} : {customerId : string, file: File, step: string, value: number}): Promise<CustomerDocPayType>{
  try {
    const api = Api.getInstance()
    const formData = new FormData()
    formData.append('document', file)
    formData.append('customer', customerId)
    formData.append('step', step)
    formData.append('value', value.toString())
    const response = await api.post({path: `customers/upload-customer-document-pay/${customerId}`, data: formData, isFormData: true})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON uploadCustomerDocPayReq');
    console.error({error});
    throw error;
  }
}

export async function getCustomerDocPaysReq({customerId} : {customerId : string}): Promise<CustomerDocPayType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/doc-pays/${customerId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON uploadCustomerDocPayReq');
    console.error({error});
    throw error;
  }
}

export async function checkCustomerExistReq({phone} : {phone : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/check-lead-exist/${phone}`})
    console.log('checkCustomerExist', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON checkCustomerExist');
    console.error({error});
    throw error;
  }
}

export async function recycleCustomerReq({customerId} : {customerId : string}): Promise<boolean>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/recycle-customer/${customerId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON recycleCustomerReq');
    console.error({error});
    throw error;
  }
}

export async function loadReclycedCstomersReq(): Promise<RecycleCustomerRowType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `customers/load-recycle-customers`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON loadReclycedCstomersReq');
    console.error({error});
    throw error;
  }
}

export async function updateCustomerProspectReq({customerId, isProspect} : {customerId : string, isProspect: boolean}): Promise<CustomerInterface>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/${customerId}/prospect`, data: {isProspect}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON updateCustomerProspectReq');
    console.error({error});
    throw error;
  }
}

export async function reassignCustomerReq({customerId, isReassigned} : {customerId : string, isReassigned: boolean}): Promise<CustomerInterface>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customers/${customerId}/reassigned`, data: {reassigned: isReassigned}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON reassignCustomerReq');
    console.error({error});
    throw error;
  }
}

export async function analyzeCallLogReq({callSId} : {callSId: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `call-logs/analyze`, data: {callSId}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON analyzeCallLogReq');
    console.error({error});
    throw error;
  }
}