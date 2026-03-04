import { CustomerCallActionsEnum } from "./customer-call-actions.enum";

export type CustomerCallActionsInterface = {
  _id: string;
  name: string;
  customer: string;
  user: string;
  date: string;
  status: CustomerCallActionsEnum;
  createdAt: string;
  updatedAt: string;
  image: string;
  checked: boolean
  checkedDate: string
  __v: number;
}