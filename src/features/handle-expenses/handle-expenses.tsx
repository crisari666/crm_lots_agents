import { Box, Button, Grid, Paper,} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import LoadingIndicator from "../../app/components/loading-indicator"
import ExpenseFormModal from "./components/expense-form-modal"
import { changeCampaignPickedAct, fetchUserExpenseThunk, getExpensesByCampaignThunk, showModalFormExpenseAction, sumTotalExpensesAction } from "./handle-expenses.slice"
import { useEffect } from "react"
import ExpensesListComponent from "./models/expenses-list-component"
import AppSelector from "../../app/components/app-select"
import { dateToInputDate } from "../../utils/date.utils"
import { getCampaignsHistoryThunk } from "../download-payment/business-logic/download-payment-history.slice"

export default function HandleExpensesView() {
  const dispatch = useAppDispatch()
  const { campaignsHistory } = useAppSelector((state) => state.downloadPaysHistory) 
  const { expenses, loading, campaignPicked} = useAppSelector((state: RootState) => state.expenses)
  useEffect(() => {
    dispatch(getCampaignsHistoryThunk())
  }, [])

  useEffect(() => {
    dispatch(sumTotalExpensesAction())
  }, [expenses])
  return (
    <>
      <LoadingIndicator open={loading} />
      <ExpenseFormModal />
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container>
          <Grid item>
            <Button variant="contained" color="success" onClick={() => dispatch(showModalFormExpenseAction(true))} > AGREGAR GASTO</Button>
          </Grid>
          <Grid item xs={4}>
            <AppSelector options={campaignsHistory.map((e) => ({_id: e._id, name: `${dateToInputDate(e.dateStart)} / ${dateToInputDate(e.dateEnd)}`}))} 
                value={campaignPicked}
                onChange={(d) => {
                  dispatch(changeCampaignPickedAct(d.val))
                  dispatch(getExpensesByCampaignThunk(d.val))
                }}
              />
          </Grid>
        </Grid>
        <Box marginBottom={3}>
        </Box>

      </Paper>
      <ExpensesListComponent />
    </>
  )
  
}