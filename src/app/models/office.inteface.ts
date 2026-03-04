import UserInterface from "./user-interface";

export interface OfficeInterface {
  _id?: string;
  user?: string | UserInterface;
  users?: string[] | UserInterface[];
  subadmin?: string;
  description?: string;
  rent?: number;
  name?: string;
  timeOpen?: number;
  enable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: any;
}