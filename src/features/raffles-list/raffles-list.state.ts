import { RaffleInterface } from "../../app/models/raffle-interface";

export interface RafflesListState {
  raffles: RaffleInterface[]
  loading: boolean
}