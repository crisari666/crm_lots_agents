import { Grid, Paper, Typography } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import LoadingIndicator from "../../../app/components/loading-indicator";
import UsersListsWithOrWithoutCustomers from "./users-lists-with-or-without-customers";
import { dateUTCToFriendly } from "../../../utils/date.utils";

export default function UsersWithoutCustomersResult() {
  const { result, loading } = useAppSelector((s) => s.usersWithoutCustomers)
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 1}}>
        {result !== undefined && <>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{paddingLeft: 2}}>
                WeeK {result!.nWeek} - {dateUTCToFriendly(result!.startDate)} - {dateUTCToFriendly(result!.endDate)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <UsersListsWithOrWithoutCustomers users={result!.usersWithCustomers} />
            </Grid>
            <Grid item xs={6}>
              <UsersListsWithOrWithoutCustomers users={result!.usersWithoutCustomers} />
            </Grid>
          </Grid>
        </>}
      </Paper>
    </>
  )
}