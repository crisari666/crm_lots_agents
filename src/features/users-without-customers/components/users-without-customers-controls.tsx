import { Grid, Paper } from "@mui/material";
import AppSelector from "../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";
import { getUsersWithoutCustomersByWeekThunk, getWeeksThunk } from "../slice/users-without-customers.slice";
import { dateUTCToFriendly } from "../../../utils/date.utils";

export default function UsersWithoutCustomersControl() {
  const { weeks } = useAppSelector(s => s.usersWithoutCustomers)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getWeeksThunk())
  }, [])

  const options = weeks.map(w => ({
    name: `Week ${w.nWeek}: ${dateUTCToFriendly(w.startDate)} - ${dateUTCToFriendly(w.endDate)} [${w.step != null ? w.step.title : 'Not Step'}]`, 
    _id: w._id
  }))  
  return (
    <Paper sx={{padding: 1, marginBottom: 1}}>
      <Grid container>
        <Grid item xs={12}>
          <AppSelector options={options} label="Semana" onChange={(d) => dispatch(getUsersWithoutCustomersByWeekThunk(d.val))}/>
        </Grid>
      </Grid>
    </Paper>
  )

}