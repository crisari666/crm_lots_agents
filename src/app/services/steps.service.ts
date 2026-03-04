import { StepForm } from "../../features/steps/steps.state";
import Api from "../axios";
import { StepType } from "../models/step.type";

export async function addStepReq({param} : {param : StepForm}): Promise<StepType>{
  try {
    const api = Api.getInstance()
    const response = await api.post({path: `steps`, data: param})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addStep');
    console.error({error});
    throw error;
  }
}

export async function updateStepReq({param, stepId} : {param : StepForm, stepId: string}): Promise<StepType>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `steps/${stepId}`, data: param})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addStep');
    console.error({error});
    throw error;
  }
}

export async function getStepsReq(): Promise<StepType[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `steps`})
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON addStep');
    console.error({error});
    throw error;
  }
}

export async function setCustomerStepReq({customerId, stepId} : {customerId : string, stepId: string}): Promise<{customerId: string, step: StepType}>{
  try {
    const api = Api.getInstance()
    const response = await api.patch({path: `steps/set-customer-step/${customerId}/${stepId}`})
    const { error } = response
    if(error == null) {
      return {customerId, step: response.result.step}
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON setCustomerStepReq');
    console.error({error});
    throw error;
  }
}

