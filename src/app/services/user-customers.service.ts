import { CustomerStepsFormFilter } from "../../features/customer-steps-log/customer-step-log.state";
import { CustomerResumeUsers, CustomerStepLogRow, UserResumeRow } from "../../features/user-customers/user-customers.state";
import Api from "../axios";
import { OfficeCustomersResumeRow } from "../models/office-customers-resume-row";

export async function gUserCustomersResumeReq({userId} : {userId : string}): Promise<CustomerResumeUsers>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `user-customers/n-customers-by-user/${userId}`},)
    //console.log('gUserCustomersResume', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON gUserCustomersResume');
    console.error({error});
    throw error;
  }
}

export async function getUserCustomersResumeDetailReq({dateEnd, dateStart, userId} : {userId: string, dateStart: string, dateEnd: string}): Promise<UserResumeRow[]>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `user-customers/user-customers-resume-detail/${userId}`, data: {dateEnd, dateStart}})
    //console.log('getUserCustomersResumeDetailReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserCustomersResumeDetailReq');
    console.error({error});
    throw error;
  }
}

export async function getOfficeCustomersResumeDetailReq({dateEnd, dateStart, officeId} : {officeId: string, dateStart: string, dateEnd: string}): Promise<OfficeCustomersResumeRow[]>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `user-customers/office-customers-resume-detail/${officeId}`, data: {dateEnd, dateStart}})
    //console.log('getOfficeCustomersResumeDetailReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserCustomersResumeDetailReq');
    console.error({error});
    throw error;
  }
}

export async function getOfficeActiceUserCustomers({officeId} : {officeId : string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `user-customers/office-users-active-customers/${officeId}`})
    console.log('getOfficeActiceUserCustomers', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getOfficeActiceUserCustomers');
    console.error({error});
    throw error;
  }
}

export async function getActiveCustomersByStepForOfficeReq({filter} : {filter : CustomerStepsFormFilter}): Promise<CustomerStepLogRow[]>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `user-customers/customers-step-log-by-office`, data: filter})
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

