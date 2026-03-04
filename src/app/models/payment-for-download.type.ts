export type PaymentRequest = {
  _id: string;
  user: {
    _id: string
    name: string
    lastName: string
    email: string
    percentage: number
  };
};

export type Customer = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: number;
  reassigned: boolean;
};

export type PaymentForDownloadType = {
  _id: string;
  name: string;
  image: string;
  value: number;
  trusted: boolean;
  confirmed: boolean;
  received: boolean;
  date: string;
  paymentRequest: PaymentRequest;
  customer: Customer;
  createdAt: string;
  updatedAt: string;
  collector: {_id: string, title: string}
  __v: number;
};