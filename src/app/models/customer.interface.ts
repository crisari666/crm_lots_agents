import { ItemListInterface } from "./item-list.inteface";
import { StepType } from "./step.type";
import UserInterface from "./user-interface";

export interface CustomerInterface {
  name: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  document: string;
  bornDate: string;
  status: number;
  userCreator: string | UserInterface;
  _id: string;
  createdAt: string;
  updatedAt: string;
  userAssigned: string | UserInterface[]
  __v: number;
  countryBirth: string,
  dateBirth: string,
  codeId: string,
  category: string,
  dateAssigned: string,
  sex: number,
  cardExpiries: string,
  residentSince: string
  office: {_id: string, name: string}
  answered: boolean
  situation: string | ItemListInterface[]
  situationDate?: string
  code: string
  step: string | StepType | StepType[]
  dateAsnwered: boolean
  isProspect: boolean
  reassigned: boolean
  [key: string]: any
}