import { ExpenseInterface } from "../../../app/models/expense-interface"

export interface ExpensesStateI {
  expenses: ExpenseInterface[]
  showFormModal: boolean
  loading: boolean
  total: number
  campaignPicked: string
}
