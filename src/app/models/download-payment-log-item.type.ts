export type User = {
  _id: string;
  email: string;
  name?: string;
  office: string
  lastName?: string;
};

export type PaymentRequest = {
  _id: string;
  user: User;
};

export type Payment = {
  _id: string;
  value: number;
  date: string;
  paymentRequest: PaymentRequest;
};

export type Collector = {
  beforeVal: number;
  user: User;
  afterVal: number;
  value: number;
  percentage: number;
};

export type Worker = {
  beforeVal: string | number;
  user: User;
  afterVal: number;
  value: number;
  percentage: number;
};

export type LeadWorker = {
  beforeVal: number;
  user: User;
  afterVal: number;
  value: number;
  percentage: number;
};

export type OfficeLead = {
  beforeVal: number;
  percentage: number;
  value: number;
  usersPercentage: {
    user: string;
    value: number;
    percentage: number;
  }[];
  afterVal: number;
  users: User[];
};

export type Subleads = {
  beforeVal: number;
  percentage: number;
  value: number;
  usersPercentage: {
    user: string;
    value: number;
    percentage: number;
  }[];
  afterVal: number;
  users: User[];
};

export type Partners = {
  beforeVal: number;
  percentage: number;
  value: number;
  usersPercentage: {
    user: string;
    value: number;
    percentage: number;
  }[];
  afterVal: number;
  users: User[];
};

export type Admins = {
  user: string;
  value: number;
  percentage: number;
}[];

export type AdminsData = User[];

export type DownloadedPaymentLogItemexportType = {
  _id: string;
  userId: string;
  payment: Payment;
  campaign: string;
  collector: Collector;
  copValue: number;
  usdPrice: number;
  worker: Worker;
  leadWorker: LeadWorker;
  officeLead: OfficeLead;
  subleads: Subleads;
  partners: Partners;
  admins: Admins;
  createdAt: string;
  updatedAt: string;
  __v: number;
  adminsData: AdminsData;
  main1: number
  main2: number
};