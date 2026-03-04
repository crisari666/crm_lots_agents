import { OfficeInterface } from "../../../app/models/office.inteface";
import UserInterface from "../../../app/models/user-interface";

export interface OfficesStateI {
  offices: OfficeInterface[]
  usersForOffice?: UserInterface[]
  loading: boolean
  gotOffices: boolean
}