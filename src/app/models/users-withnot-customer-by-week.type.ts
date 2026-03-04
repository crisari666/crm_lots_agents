type StepWeekUserWithNotCustomersType = {
  _id: string;
  order: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type WeekUserWithNotCustomersType = {
  _id: string;
  startDate: string;
  endDate: string;
  step: StepWeekUserWithNotCustomersType;
  nWeek: number;
};

export type WeekUserWithNotCustomersWithUsersType = {
  usersWithCustomers: UserSimpleType[]
  usersWithoutCustomers: UserSimpleType[]
}

export type UserSimpleType = {
  _id: string
  name: string
  lastName: string
  email: string
  office: {
    _id: string
    name: string
  }
}

export type UserWithNotCustomerResultType = WeekUserWithNotCustomersType & WeekUserWithNotCustomersWithUsersType