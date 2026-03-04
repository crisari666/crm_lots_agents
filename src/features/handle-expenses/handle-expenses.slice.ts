import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ExpensesStateI } from "./models/handle-expenses.models"
import { addExpenseReq, fetchUserExpensesReq, getExpensesByCampaignReq } from "../../app/services/expenses.service"
import { ExpenseInterface } from "../../app/models/expense-interface"

const initialState: ExpensesStateI = {
  expenses: [],
  loading: false,
  showFormModal: false,
  total: 0,
  campaignPicked: ''
}

export const fetchUserExpenseThunk = createAsyncThunk("ExpensesSlice/fetchUserExpenses", async () => await fetchUserExpensesReq())

export const addExpenseThunk = createAsyncThunk("ExpensesSlice/addExpense", async (expense: ExpenseInterface) => await addExpenseReq({expense}))

export const getExpensesByCampaignThunk = createAsyncThunk("ExpensesSlice/getExpensesByCamoaignThunk", async (campaigId: string) => await getExpensesByCampaignReq({campaigId}))


export const ExpensesSlice = createSlice({
  name: "ExpensesSlice",
  initialState,
  reducers: {
    showModalFormExpenseAction: (state, action: PayloadAction<boolean>) => {
      state.showFormModal = action.payload
    },
    sumTotalExpensesAction: (state) => {
      state.total = state.expenses.reduce((acumulator, currentValue) => acumulator + currentValue.value, 0)
    },
    changeCampaignPickedAct: (state, action: PayloadAction<string>) => { 
      state.campaignPicked = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchUserExpenseThunk.fulfilled, (state, action: PayloadAction<ExpenseInterface[]>) => {
      state.expenses = action.payload
      state.loading = false
    }).addCase(getExpensesByCampaignThunk.fulfilled, (state, action) => { 
      state.loading = true
      state.expenses = action.payload
    }).addCase(addExpenseThunk.fulfilled, (state, action: PayloadAction<ExpenseInterface>) => {
      state.expenses.push(action.payload)
      state.loading = false
      state.showFormModal = false
    })


    builder.addMatcher((action) => action.type.endsWith("/pending") && action.type.includes("ExpensesSlice"), 
      (state) => {
        state.loading = true
    }).addMatcher((action) => action.type.endsWith("/fulfilled") && action.type.includes("ExpensesSlice"), 
      (state) => {
      state.loading = false
    })
  },
})

export const { showModalFormExpenseAction, sumTotalExpensesAction, changeCampaignPickedAct } = ExpensesSlice.actions

export default ExpensesSlice.reducer
