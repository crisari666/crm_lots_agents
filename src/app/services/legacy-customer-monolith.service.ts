import Api from "../axios";
import { CustomerCallActionsInterface } from "../models/customer-call-actions.interface";

export async function recycleCustomerMonolithReq(params: { readonly customerId: string }): Promise<boolean> {
  try {
    const api = Api.getInstance();
    const response = await api.patch({ path: `customers/recycle-customer/${params.customerId}` });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON recycleCustomerMonolithReq");
    console.error({ error });
    throw error;
  }
}

export async function getCustomerCallActionsLogsMonolithReq(params: {
  readonly customerId: string;
}): Promise<CustomerCallActionsInterface[]> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `customers/${params.customerId}/calll-actions` });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON getCustomerCallActionsLogsMonolithReq");
    console.error({ error });
    throw error;
  }
}

export async function customerResumeMonolithReq(params: { readonly customerId: string }): Promise<unknown> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `customers/resume/${params.customerId}` });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON customerResumeMonolithReq");
    console.error({ error });
    throw error;
  }
}
