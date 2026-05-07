import Api from "../axios";
import { PaymentProjectType } from "../models/payment.interface";
import { PaymentResumeI } from "../../features/user-customers/user-customers.state";
import { OfficePaymentsResume } from "../models/office-dashboard-payment-row";

export async function confirmImageFeePaymentReq(params: { readonly feePaymentId: string }): Promise<boolean> {
  try {
    const api = Api.getInstance();
    const response = await api.patch({ path: `payments/confirm-image-payment/${params.feePaymentId}` });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON confirmImageFeePayment");
    console.error({ error });
    throw error;
  }
}

export async function getUserPaymentsByDatesReq(params: {
  readonly userId: string;
  readonly endDate: string;
  readonly startDate: string;
}): Promise<PaymentResumeI> {
  try {
    const api = Api.getInstance();
    const response = await api.post({
      path: `payments/get-payments-by-user/${params.userId}`,
      data: { endDate: params.endDate, startDate: params.startDate },
    });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON getUserPaymentsByDates");
    console.error({ error });
    throw error;
  }
}

export async function getOfficePaymentsByDatesReq(params: {
  readonly officeId: string;
  readonly dateStart: string;
  readonly dateEnd: string;
}): Promise<OfficePaymentsResume> {
  try {
    const api = Api.getInstance();
    const response = await api.post({
      path: `payments/get-payments-by-office/${params.officeId}`,
      data: { endDate: params.dateEnd, startDate: params.dateStart },
    });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON getOfficePaymentsByDatesReq");
    console.error({ error });
    throw error;
  }
}

export async function getAlertedPaymentsReq(): Promise<PaymentProjectType[]> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `payments/alerted-payments` });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON getAlertedPaymentsReq");
    console.error({ error });
    throw error;
  }
}
