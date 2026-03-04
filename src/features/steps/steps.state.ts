import { StepType } from "../../app/models/step.type";

export type StepsSliceState = {
  loading: boolean,
  steps: StepType[]
  showForm: boolean
  stepToEdit?: string
  stepForm: StepForm
}


export type StepForm = {
  order: number
  title: string
  color?: string
  [key: string]: any 
}
