import { AuditResumeFilter } from "../../features/auditory-resume/audit-resume.state";
import { LeadPendingChecksRow } from "../../features/leads-auditory/leads-auditory.state";
import { ReportsFilterI, UserGoalResumeRow } from "../../features/reports/reports.state";
import Api from "../axios";
import { AuditCallLogType } from "../models/audit-call-mode.type";
import { AuditResumeItem } from "../models/audit-resume-item";
import { AuditCallLogSituationType } from "../models/audit-situation-log.type";
import { AuditUserResume } from "../models/audit-user-resume-item";
import { CustomerCallActionsInterface } from "../models/customer-call-actions.interface";
import { CustomerLogSituationsI } from "../models/customer-logs.inteface";
import { CustomerInterface } from "../models/customer.interface";
import { LeadChecksResumeDialogI } from "../models/leads-checks-resume-row";

export async function getReportsReq({filters} : {filters : ReportsFilterI}): Promise<any>  {
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports`, data: filters})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON METHOD');
    console.error({error});
    throw error;
  }
}

export async function getLeadsPendingChecksReq({endDate, startDate} : {startDate: string, endDate: string}): Promise<LeadPendingChecksRow[]>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/get-pending-checks-leads`, data: {startDate, endDate}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getLeadsPendingChecks');
    console.error({error});
    throw error;
  }
}

export async function getLeadCheckResumeForDialogReq({leadId, dateEnd, dateStart} : {leadId : string, dateStart: string, dateEnd: string}): Promise<LeadChecksResumeDialogI>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/get-pending-checks-leads/${leadId}`, data: {startDate: dateStart, endDate: dateEnd}})
    //console.log('getLeadCheckResumeForDialog', {response});
    const { error } = response
    if(error == null) {
      return  response.result.length > 0 ? response.result[0] : null
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getLeadCheckResumeForDialog');
    console.error({error});
    throw error;
  }
}

export async function getCallLogsResumeWithSituationsReq({callLogIds} : {callLogIds : string[]}): Promise<{callLogs: CustomerCallActionsInterface[], callNotes: CustomerLogSituationsI[], customer: CustomerInterface}>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/get-call-logs-by-id`, data: {callLogIds}})
    //console.log('getCallLogsResumeWithSituationsReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getCallLogsResumeWithSituationsReq');
    console.error({error});
    throw error;
  }
}

export async function auditCallReq({callId, checked} : {callId : string, checked: boolean}): Promise<{check: CustomerCallActionsInterface, log: AuditCallLogType}>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customer-logs/audit-call`, data: {callId, checked}})
    //console.log('auditCallReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON auditCallReq');
    console.error({error});
    throw error;
  }
}

export async function audtiCallNoteSituationReq({situationLogId, checked} : {situationLogId : string, checked: boolean}): Promise<{check: CustomerLogSituationsI, log: AuditCallLogSituationType}>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `customer-logs/audit-log-call-note`, data: {situationLogId, checked}})
    //console.log('auditCallReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON auditCallReq');
    console.error({error});
    throw error;
  }
}

export async function getAuditResumeReq({param} : {param : AuditResumeFilter}): Promise<AuditResumeItem[]>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/get-resume-audit`, data: param})
    //console.log('getAuditResume', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getAuditResume');
    console.error({error});
    throw error;
  }
}

export async function getUserAuditResumeReq(params : {userId: string, startDate: string, endDate: string}): Promise<AuditUserResume[]>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/get-resume-audit-user`, data: params})
    //console.log('getUserAuditResume', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserAuditResume');
    console.error({error});
    throw error;
  }
}

export async function getUserGoalsResumReq(office: string): Promise<UserGoalResumeRow[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `reports/users-goals/office/${office}`})
    //console.log('getUserAuditResume', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserAuditResume');
    console.error({error});
    throw error;
  }
}

export async function logCustomerNotCalledReq(params : {customer : string, userId: string, dateAssigned: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `reports/log-customer-did-not-call`, data: params})
    console.log('logCustomerNotCalledReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON logCustomerNotCalledReq');
    console.error({error});
    throw error;
  }
}