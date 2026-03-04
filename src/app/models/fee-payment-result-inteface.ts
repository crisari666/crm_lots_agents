export interface UserI {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  office: {name: string, _id: string}[]
}

export interface PaymentRequestI {
  _id: string;
  user: UserI[];
  anulated: boolean
}

export interface CustomerI {
  _id: string;
  name: string;
  phone: string;
  status: number;
}

export type FeePaymentsResultI = {
  _id: string;
  name: string;
  value: number;
  date: string;
  image: string
  trusted: boolean
  confirmed: boolean
  downloaded: boolean
  user: UserI[];
  collector: {_id: string, title: string}
  received: boolean
  retained: boolean
  paymentRequest: PaymentRequestI;
  customer: CustomerI[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}