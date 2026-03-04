export type PenancesState = {
  loading: boolean,
  penances: Penance[],
  penanceApplied: boolean,
}


export type Penance = {
  _id: string,
  user: {
    _id: string,
    email: string,
    office: {
      _id: string
      name: string
    }
  },
  customer: {
    _id: string,
    name: string
  },
  customerLogAssigned: string | null,
  date: string,
  charged: boolean,
  campaign: string | null,
  createdAt: string,
  updatedAt: string,
  __v: number,
}