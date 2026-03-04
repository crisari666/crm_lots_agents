export type CustomersActivesSnapShotState = {
  loading: boolean
  customers: CustomersActivesRowType[]
  filterDate: string
}

export type CustomersActivesRowType = {
  _id: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  customer: {
    _id: string;
    name: string;
    phone: string;
    status: number;
  };
  step: {
    _id: string;
    title: string;
  };
};