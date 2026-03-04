export interface ClosureStateInterface {
  closure: ClosureDataInterface
  date: string
  loading: boolean
}
export interface ClosureDataInterface {
  capital_added: number
  cash_init: number
  closure: number
  payments: number
  new_cards: number
  expenses: number
  done: boolean
}
