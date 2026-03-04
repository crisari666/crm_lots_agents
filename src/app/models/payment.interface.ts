import { CustomerInterface } from "./customer.interface";
import { FeeInterface } from "./fee.interface";
import UserInterface from "./user-interface";

export type CustomerPaymentInterface = {
  _id: string;
  name: string;
  valueExpected: number;
  valuePayed: number;
  dateExpected: string;
  dateDone: any;
  customer: string;
  user: string;
  step?: StepType
  anulated?: boolean
  fees: string[] | FeeInterface[]
  createdAt: string;
  updatedAt: string;
  waiting?: boolean;
  __v: number;
}

export type StepType = {
  _id: string
  title: string
}

export type PaymentProjectType =  CustomerPaymentInterface & {
  customer: CustomerInterface & {office: string}
  user: UserInterface
  step: StepType
}