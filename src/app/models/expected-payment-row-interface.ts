export type Customer  = {
  _id: string;
  name: string;
}

export type ExpectedPaymentRow = {
  _id: string;
  name: string;
  valueExpected: number;
  valuePayed: number;
  dateExpected: string;
  dateDone: string | null;
  customer: Customer[];
  user: string;
  fees: string[]
  __v: number;
}