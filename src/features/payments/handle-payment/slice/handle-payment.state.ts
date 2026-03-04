export type HandlePaymentState = {
  loading: boolean
  payment?: PaymentSingleType
}

export type PaymentSingleType = {
  _id: string;
  name: string;
  valueExpected: number;
  valuePayed: number;
  dateExpected: string;
  dateDone: string | null;
  paymentAlerted: boolean;
  user: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
  };
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  },
  fees: FeePaymentType[];
  anulated: boolean
  waiting?: boolean;
  collector: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type FeePaymentType = {
  confirmed: boolean;
  received: boolean;
  downloaded: boolean;
  collector: string | null;
  done: boolean;
  _id: string;
  name: string;
  image: string;
  value: number;
  trusted: boolean;
  retained: boolean;
  date: string;
  paymentRequest: string;
  customer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}