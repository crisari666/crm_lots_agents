import Api from "../../app/axios";
import { StepType } from "../../app/models/step.type";
import { StepForm } from "./step-metadata.state";

export async function addStepReq(params: { readonly param: StepForm }): Promise<StepType> {
  try {
    const api = Api.getInstance();
    const response = await api.post({ path: `steps`, data: params.param });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON addStep");
    console.error({ error });
    throw error;
  }
}

export async function updateStepReq(params: {
  readonly param: StepForm;
  readonly stepId: string;
}): Promise<StepType> {
  try {
    const api = Api.getInstance();
    const response = await api.patch({ path: `steps/${params.stepId}`, data: params.param });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON updateStep");
    console.error({ error });
    throw error;
  }
}

export async function getStepsReq(): Promise<StepType[]> {
  try {
    const api = Api.getInstance();
    const response = await api.get({ path: `steps` });
    const { error } = response;
    if (error == null) {
      return response.result;
    }
    throw error;
  } catch (error) {
    console.error("ERROR ON getStepsReq");
    console.error({ error });
    throw error;
  }
}
