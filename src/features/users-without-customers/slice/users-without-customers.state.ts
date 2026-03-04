import { UserWithNotCustomerResultType, WeekUserWithNotCustomersType } from "../../../app/models/users-withnot-customer-by-week.type"

export type UsersWithoutCustomersState  = {
  loading: boolean
  weeks: WeekUserWithNotCustomersType[]
  result?: UserWithNotCustomerResultType
}
