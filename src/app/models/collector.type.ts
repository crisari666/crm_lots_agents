export type CollectorType = {
  _id: string;
  name: string;
  title: string;
  user: CollectorUser
  location: string;
  users: any[];
  offices: any[];
  enable: boolean;
  limitWeek: number;
  limitMonth: number;
  limitYear: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  week: SumPaidsCollector[]
  month: SumPaidsCollector[]
  year: SumPaidsCollector[]
};


export type CollectorUser = {
  _id: string;
  email: string
}

export type SumPaidsCollector = {
  _id: string
  total: number
}