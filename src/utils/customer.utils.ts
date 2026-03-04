import { blue, green, red, yellow, grey, purple, brown } from "@mui/material/colors"
import { ItemListInterface } from "../app/models/item-list.inteface"
import { CallsResumeI } from "../app/models/calls-resumet.interface"
import { CustomerInterface } from "../app/models/customer.interface"
import { CallLogResumeAudit, CallResumeAudit } from "../app/models/call-resume-audit"
import { Call, CallLog } from "../app/models/audit-resume-item"
import { CallNoteUserAudit, CallUserResume } from "../app/models/audit-user-resume-item"

export const determineCustomerColorStatus = (status: number, answered: boolean = false, step: any = null, isProspect: boolean = false, customerResumeBasedOnStepsColors: boolean = false): string => {
  
  switch(status){
    case 0:
      if(step !== null && step !== undefined && step !== "" && step.length > 0){
        return step[0].color || green[500]
      }
      if(isProspect) return purple[500]
      if(customerResumeBasedOnStepsColors) return brown.A700
      return answered ? blue[500] : yellow[500]
    case 1:
      return grey[500]
    case 2:
      return red[500]
    default:
      return "info"
  }
}

export const determineCustomerColorStatusObj = ({status, answered = false, step = null, hasSituation, isProspect} : {status: number, answered?: boolean, step?: any, hasSituation: boolean, isProspect: boolean}): string => {
  switch(status){
    case 0:
      if(step !== null && step !== undefined && step !== "" && step.length > 0) return green[500]
      if(isProspect) return purple[500]
      return answered || hasSituation ? blue[500] : yellow[500]
    case 1:
      return grey[500]
    case 2:
      return red[500]
    default:
      return "info"
  }
}

export const resolveCustomerUser = (c: CustomerInterface): string => {
  if(c.userAssigned === null || c.userAssigned === undefined) return ""
  if(typeof c.userAssigned === 'string') return c.userAssigned;
  if(c.userAssigned.length === 0) return ""
  if(c.userAssigned[0].lastName) return c.userAssigned[0].lastName
  return ""
}

export const resolveCustomerStep = (step: any): string => {
  if(step === null || step === undefined) return ""
  if(typeof step === 'string') return step
  if(typeof step === 'object' && step.length > 0) return step[0].title
  return ""

}
export const resolveCustomerStepId = (step: any): string => {
  if(step === null || step === undefined) return ""
  if(typeof step === 'string') return step
  if(typeof step === 'object' && step.length > 0) return step[0]._id
  return ""

}


export const resolveCustomerSituation = (situation: string | ItemListInterface[]): string => {
  if(situation === null) return ""

  if(typeof situation === "string") return situation

  if(typeof situation === "object" && situation.length > 0)  return situation[0].title!

  return "---"
}

export const resolveNCalls = (customer: any): string => {
  if(!customer.calls) return '--'
  if(customer.calls.length  > 0) return customer.calls[0].calls
  return '0'
}

export const getCallsResume = (customer: any): CallsResumeI => {
  let resume: CallsResumeI = {
    answer: 0,
    push: 0,
    unanswer: 0
  }
  const calls: any[] = customer.calls ?? []
  const indexPush = calls.findIndex(call => call._id === 1) 
  if(indexPush !== -1) resume.push = (calls[indexPush] as any).count
  const indexAnswer = calls.findIndex(call => call._id === 3) 
  if(indexAnswer !== -1) resume.answer = (calls[indexAnswer] as any).count
  const indexUnanswer = calls.findIndex(call => call._id === 2) 
  if(indexUnanswer !== -1) resume.unanswer = (calls[indexUnanswer] as any).count
  return resume
}

export const getCallsResumeAudit = (calls: Call[] | CallUserResume[]): CallResumeAudit => {
  let resume: CallResumeAudit = {
    rc_checked: 0,
    rc_notChecked: 0, 
    rnc_checked: 0,
    rnc_notChecked: 0
  }
  for(let i = 0; i < calls.length; i++){
    const call = calls[i]
    if(call.status === 3 && call.checked ) resume.rc_checked = call.n
    if(call.status === 3 && !call.checked ) resume.rc_notChecked = call.n
    if(call.status === 2 && call.checked ) resume.rnc_checked = call.n
    if(call.status === 2 && !call.checked ) resume.rnc_notChecked = call.n
  }
  return resume;
}

export const buildCallLogsResumeAudit = (logs: CallLog[] | CallNoteUserAudit[]): CallLogResumeAudit => {
  let resume: CallLogResumeAudit = {
    checked: 0,
    not_checked: 0
  }
  for(let i = 0; i < logs.length; i++){
    const log = logs[i]
    if(log._id.checked ) resume.checked = log.n
    if(!log._id.checked ) resume.not_checked = log.n

  }
  return resume;
}
