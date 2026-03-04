import { CustomerPaymentFormI } from "../../features/customers/customer-view/customer-view.state";
import Api from "../axios"
import { CustomerPaymentInterface, PaymentProjectType } from "../models/payment.interface";
import { FileUtils } from "../../utils/file.utils";
import { FeePaymentsResultI } from "../models/fee-payment-result-inteface";
import { PaymentResumeI } from "../../features/user-customers/user-customers.state";
import { OfficePaymentsResume } from "../models/office-dashboard-payment-row";
import { FilterPaymentsType } from "../models/filter-payments.type";
import { PaymentForDownloadType } from "../models/payment-for-download.type";
import { PaymentRouteType, WorkerPaymentHistoryItem } from "../../features/download-payment/business-logic/download-payment.state";
import { AdminPercentage, PaymentRouteModel, PercentageData } from "../models/download-payment-req.types";
import { DownloadedPaymentLogItemexportType } from "../models/download-payment-log-item.type";
import { OmegaSoftConstants } from "../khas-web-constants";
import { PaymentDownloadedDb } from "../models/payment-dowload-db.type";
import { PaymentSingleType } from "../../features/payments/handle-payment/slice/handle-payment.state";

const api = new Api()

export async function addPaymentReq({form, customerId} : {form: CustomerPaymentFormI, customerId: string}): Promise<CustomerPaymentInterface> {
  try {
    const data = {
      customer: customerId,
      valueExpected: Number(form.value),
      valuePayed: 0,
      paymentAlerted: form.paymentAlerted,
      dateExpected: form.date,
      step: form.step,
    }
    const addPayment = await api.post({  path: `payments`, data,})
    const { error } = addPayment
    if (error == null) {
      return addPayment.result
    } else {
      throw new Error(addPayment)
    }
  } catch (error) {
    throw error
  }
}

export async function customerPaymentsReq({customerId} : {customerId : string}): Promise<CustomerPaymentInterface[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `payments/${customerId}`})
    //console.log('customerPayments', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON customerPayments');
    console.error({error});
    throw error;
  }
}

export async function addFeePaymentReq({ customerId, image, paymentRequestId, value, collector } : { customerId : string, paymentRequestId: string, image: any[], value: number, collector: string}): Promise<CustomerPaymentInterface>  {
  try {
    const api = Api.getInstance()
    const filesFormat = await image.map((file: any) => FileUtils.dataUrlToFile(file.src, file.name))
    const filesFormatted: Blob[] = await Promise.all(filesFormat)
  
    const formData = new FormData()
    for(const f of filesFormatted) {
      formData.append("image", f)
    }
    formData.append("value", String(value))
    formData.append("paymentRequest", paymentRequestId)
    formData.append("customer", customerId)
    formData.append("collector", collector)
    
    const response = await api.post({path: `payments/fee-payment`, data: formData, isFormData: true})
    console.log('addFeePaymentReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addFeePaymentReq');
    console.error({error});
    throw error;
  }
}

export async function getUnstrustedPaymentsReq(): Promise<FeePaymentsResultI[]>  {
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `payments/untrusted-payments`})
    console.log('getUnstrustedPaymentsReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUnstrustedPaymentsReq');
    console.error({error});
    throw error;
  }
}

export async function confirmImageFeePaymentReq({feePaymentId} : {feePaymentId: string}): Promise<boolean>  {
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `payments/confirm-image-payment/${feePaymentId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON confirmImageFeePayment');
    console.error({error});
    throw error;
  }
}

export async function getUserPaymentsByDatesReq({userId, endDate, startDate} : {userId : string, endDate: string, startDate: string}): Promise<PaymentResumeI>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `payments/get-payments-by-user/${userId}`, data: {endDate, startDate}})
    //console.log('getUserPaymentsByDates', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserPaymentsByDates');
    console.error({error});
    throw error;
  }
}

export async function getOfficePaymentsByDatesReq({officeId, dateStart, dateEnd} : {officeId : string, dateStart: string, dateEnd: string}): Promise<OfficePaymentsResume>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `payments/get-payments-by-office/${officeId}`, data: {endDate: dateEnd, startDate: dateStart}})
    //console.log('getOfficePaymentsByDatesReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserPaymentsByDates');
    console.error({error});
    throw error;
  }
}

export async function filterMadePaymentsReq(filter : FilterPaymentsType): Promise<PaymentForDownloadType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `payments/filter-fee-payments`, data: filter})
  
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON filterPaymentReq');
    console.error({error});
    throw error;
  }
}

export async function downloadPaymentReq({data, paymentId} : {data : PaymentRouteType, paymentId: string}): Promise<boolean>{
  try {
    console.log('downloadPaymentReq', {data});
    const {collector, copTotal, leadWorker, mainPartner, officeLead, partner, subLead, usdPrice, worker} = data;
    const officeLeadUserPercentages: PercentageData[] = officeLead.userPercentageData.map((up) => ({user: up.user, value: up.value, percentage: up.percentage}) as PercentageData)
    const partnerUserPercentages: PercentageData[] = partner.userPercentageData.map((up) => ({user: up.user, value: up.value, percentage: up.percentage}))
    const subLeadUserPercentages: PercentageData[] = subLead.userPercentageData.map((up) => ({user: up.user, value: up.value, percentage: up.percentage}))
    const dowloadPaymentData: PaymentRouteModel = {
      payment: paymentId,
      collector: {beforeVal: collector.before, user: collector.user!, afterVal: collector.after, value: collector.value!, percentage: collector.percentage},
      copValue: copTotal,
      usdPrice,
      worker: {beforeVal: worker.before, user: worker.user!, afterVal: worker.after, value: worker.value!, percentage: worker.percentage},
      leadWorker: {beforeVal: leadWorker.before, user: leadWorker.user!, afterVal: leadWorker.after, value: leadWorker.value!, percentage: leadWorker.percentage},

      officeLead: {beforeVal: officeLead.before, percentage: officeLead.percentage, value: officeLead.value, usersPercentage: officeLeadUserPercentages, afterVal: officeLead.after, users: officeLead.users!},
      partners: {beforeVal: partner.before, percentage: partner.percentage, value: partner.value, usersPercentage: partnerUserPercentages, afterVal: partner.after, users: partner.users!},
      subleads: {beforeVal: subLead.before, percentage: subLead.percentage, value: subLead.value, usersPercentage: subLeadUserPercentages, afterVal: subLead.after, users: subLead.users!},
      admins: mainPartner.userPercentageData.map((up) => ({user: up.user, value: up.value, percentage: up.percentage}) as AdminPercentage)
    }
    
    const api = Api.getInstance()
    const response = await api.put({path: `payments/downloadPayment`, data: dowloadPaymentData})
    const { error } = response
    if(error == null) {
      return true
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON downloadPaymentReq');
    console.error({error});
    throw error;
  }
}

export async function getPaymendDowloadedByCampaignReq({campaignId} : {campaignId : string}): Promise<DownloadedPaymentLogItemexportType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `payments/downloaded-payments/campaign/${campaignId}`})
    const { error } = response
    console.log("Ids", OmegaSoftConstants.alcatronId, OmegaSoftConstants.arsanId)
    if(error == null) {
      return (response.result as DownloadedPaymentLogItemexportType[]).map((el) => {
        const indexM1 = el.admins.findIndex((m) => m.user === OmegaSoftConstants.alcatronId)
        const indexM2 = el.admins.findIndex((m) => m.user === OmegaSoftConstants.arsanId)

        const main1 = indexM1 !== -1 ? el.admins[indexM1].value : 0
        const main2 = indexM2 !== -1 ? el.admins[indexM2].value : 0
        return {...el, main1, main2} as DownloadedPaymentLogItemexportType
      })
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getPaymendDowloadedByCampaign');
    console.error({error});
    throw error;
  }
}

export async function getUserLastPaymentDownloadedReq({userId} : {userId : string}): Promise<PaymentDownloadedDb | null>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `payments/user-last-payment-downloaded/userId/${userId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getUserLastPaymentDownloaded');
    console.error({error});
    throw error;
  }
}

export async function fetchPaymentByIdReq(paymentId: string): Promise<PaymentSingleType>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `payments/by-id/${paymentId}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON fetchPaymentById');
    console.error({error});
    throw error;
  }
}
export async function changePaymentUserReq({user, payment} : {user : string, payment: string}): Promise<PaymentSingleType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `payments/change-user`, data: {user, payment}})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON changePaymentUser');
    console.error({error});
    throw error;
  }
}

export async function anulatePaymentReq(payment: string): Promise<PaymentSingleType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `payments/anulate/${payment}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON anulatePaymentReq');
    console.error({error});
    throw error;
  }
}

export async function getAlertedPaymentsReq(): Promise< PaymentProjectType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `payments/alerted-payments`})
    console.log('getAlertedPaymentsReq', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getAlertedPaymentsReq');
    console.error({error});
    throw error;
  }
}

export async function setRatainedFeePaymentReq({feePaymentId, retained} : {feePaymentId : string, retained: boolean}): Promise<PaymentSingleType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `payments/retained-payment/${feePaymentId}/${retained}`})
    console.log('setRatainedFeePaymentRequest', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setRatainedFeePaymentRequest');
    console.error({error});
    throw error;
  }
}

export async function changePaymentCollectorReq({payment, collector} : {payment : string, collector: string}): Promise<any>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `payments/change-payment-collector/${payment}/${collector}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON ChangePaymentCollector');
    console.error({error});
    throw error;
  }
}

export async function setPaymentAlertReq({paymentId, alerted} : {paymentId : string, alerted: boolean}): Promise<PaymentSingleType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `payments/set-payment-alert/${paymentId}/${alerted}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setPaymentAlertReq');
    console.error({error});
    throw error;
  }
}

export async function setPaymentWaitingReq({paymentId, waiting} : {paymentId : string, waiting: boolean}): Promise<PaymentSingleType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `payments/set-payment-waiting/${paymentId}/${waiting}`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setPaymentWaitingReq');
    console.error({error});
    throw error;
  }
}

/**
 * Fetches the worker's payment history for the last campaigns.
 * @returns {Promise<WorkerPaymentHistoryItem[]>}
 */
export async function getWorkerLastCampaignsPaymentsReq(): Promise<WorkerPaymentHistoryItem[]> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `payments/worker-last-campaigns` });
    const { error } = response;
    if (error == null) {
      return response.result as WorkerPaymentHistoryItem[];
    } else {
      throw error;
    }
  } catch (error) {
    console.error('ERROR ON getWorkerLastCampaignsPaymentsReq');
    console.error({ error });
    throw error;
  }
}