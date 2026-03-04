import { SituationInterface } from "./situation-interface";

export type CustomerLogSituationsI = {
  _id: string;
  name: string;
  user: any;
  customer: string;
  note: string;
  situation: string | SituationInterface;
  date: string;
  status: number;
  createdAt: string;
  image?: string | null | undefined
  updatedAt: string;
  confirmed: boolean;
  checked: boolean;
  dateChecked: string
  __v: number;
}

