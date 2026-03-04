type DateId = {
  date: string;
};

type Situation = {
  _id: DateId;
  confirmed: number;
  unconfirmed: number;
};

type Payment = {
  _id: DateId;
  trusted: number;
  untrusted: number;
};

type Id = {
  _id: string;
  name: string;
  lastName: string;
  level: number;
  office: string;
};

export type LeadChecksResumeDialogI = {
  _id: Id;
  situations: Situation[];
  payments: Payment[];
};