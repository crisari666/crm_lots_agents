export enum ReasonToNotAssignEnum {
  nothing,
  recentlyAssigned,
  hasPayments
}

export type CampaignCustomersState = {
  loading: boolean
  usersCampaignData: UserCustomersCampaignDataType[]
  showModalAddCustomers: boolean,
  listUpdated: boolean
  customerResume?: any
  allowToASign: boolean
  reasonNotAssign: ReasonToNotAssignEnum
  showRecycledCustomersModal: boolean
  recycledCustomers: RecycleCustomerRowType[]
}


export type UserCustomersCampaignDataType = {
  _id: string;
  user: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    office: {
      name: string
      _id: string
    }
    rank: {
      _id: string;
      title: string;
      nCustomers: number;
      nCustomersDatabase: number;
    };
  };
  customers: any[];
  newCustomers: NewCustomerData[]
  customersDatabae: any[];
  campaign: string;
  createdAt: string;
  updatedAt: string;
  automaticMode: boolean;
  __v: number;

};


export type NewCustomerData = {
  name: string
  phone: string
  email: string
}

export type RecycleCustomerRowType = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: number;
  lead: string;
  userAssigned: {
    _id: string;
    lastName: string;
    email: string;
  };
  answered: boolean;
  dateAssigned: string;
  situation: string | null;
  step: string;
  office: {
    _id: string;
    name: string;
  };
  createdAt: string;
};

// ...existing code...

// ...existing code...