export type SituationInner = {
  _id: string;
  title: string;
};

export type Situation = {
  _id: string;
  situation: SituationInner[];
  date: string;
};

export type Fees = {
  _id: string;
  payments: number;
};

export type OfficeCustomersResumeRow = {
  _id: string;
  name: string;
  status: number;
  userAssigned: OfficeDashboardUserAssigned[];
  answered: boolean;
  dateAssigned: string;
  situation: Situation[];
  fees: Fees[];
  'payments-expected': Fees[];
};

export type OfficeDashboardUserAssigned = {
  _id: string;
  lastName: string;
  email: string;
  
};