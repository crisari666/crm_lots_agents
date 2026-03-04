import { PrizeInterface } from "./prize-inteface";

export interface RaffleInterface {
  name: string;
  description: string;
  code: string;
  images: any[];
  datePrize: string;
  status: number;
  cost: number;
  ticketPrice: number;
  prizes: PrizeInterface[]
  numberWinner: string;
  nTickets: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}