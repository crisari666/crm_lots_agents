export interface PrizeInterface {
  _id?: string;
  raffle?: string;
  name: string;
  description: string;
  images: string[];
  price: string;
  enable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [key: string]: any
}