import Api from "../axios"
import { ExpenseInterface } from "../models/expense-interface"
import { TotalExpensesType } from "../models/total-expenses.type"

const api = new Api()
export async function fetchUserExpensesReq() {
  try {
    const fetchCards = await api.get({ path: "expenses/get-user-expenses" })
    const { error } = fetchCards
    if (error === null) {
      const { result } = fetchCards
      return result
    } else {
      throw error
    }
  } catch (error) {
    throw error
  }
}

export async function addExpenseReq({ expense }: { expense: ExpenseInterface }) {
  try {
    const addExpense = await api.post({ path: "expenses/add-expense", data: expense, })
    const { error } = addExpense
    if (error === null) {
      const { result } = addExpense
      return result
    } else {
      throw error
    }
  } catch (error) {
    throw error
  }
}

export async function totalExpensesByCampaignReq({campaignId} : {campaignId : string}): Promise<TotalExpensesType>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `expenses/total-expenses-by-campaign/${campaignId}`})
    const { error } = response
    if(error == null) {
      return response.result.length > 0 ? response.result[0] : { _id: campaignId, total: 0 }
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON totalExpensesByCampaign');
    console.error({error});
    throw error;
  }
}

export async function getExpensesByCampaignReq({campaigId} : {campaigId : string}): Promise<ExpenseInterface[]>{
  try {
    const api = Api.getInstance()
    const response = await api.get({path: `expenses/campaign/${campaigId}`})
    console.log('getExpensesByCampaign', {response});
    const { error } = response
    if(error == null) {
      return response.result
    }else {
      throw error
    }
  } catch (error) {
    console.error('ERROR ON getExpensesByCampaign');
    console.error({error});
    throw error;
  }
}