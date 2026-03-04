export type OfficePaymentsResume = {
  done: OfficeDonePaymentRow[]
  expected: OfficeDashboardPaymentExpectedRow[]
}


export type OfficeDashboardPaymentExpectedRow = {
  _id: string;
  name: string;
  valueExpected: number;
  valuePayed: number;
  dateExpected: string;
  dateDone: string | null;
  customer: {
    _id: string;
    name: string;
  }[];
  user: {
    _id: string;
    lastName: string;
    email: string;
  }[];
  fees: string[];
  __v: number;
};
export type OfficeDonePaymentRow = {
  _id: string;
  name: string;
  image: string;
  value: number;
  trusted: boolean;
  confirmed: boolean;
  received: boolean;
  date: string;
  paymentRequest: string;
  customer: {
    _id: string;
    name: string;
    userAssigned: {
      _id: string;
      lastName: string;
      email: string;
    }[];
  }[];
  __v: number;
};