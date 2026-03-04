import { Button, Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import { clearFiltersCustomerAct, geLeadsWithUsersThunk } from "../customers.slice";
import OfficeFilterSelector from "./office-filter-selector";
//import CustomersLeadFilterSelector from "./customers-lead-filter-selector";
import CustomersFilterUserSelector from "./customers-filter-user-selector";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import CustomerFilterDate from "./customers-filter-date";
import { RemoveCircle } from "@mui/icons-material";

export default function CustomersFlterCP() {
  const { currentUser } = useAppSelector((state: RootState) => state.login)
  const dispatch = useAppDispatch()
  
  

  useEffect(() => {
    if(currentUser?.level && currentUser.level <= 3) {
      dispatch(geLeadsWithUsersThunk())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  
  return (
    <Paper sx={{padding: 2, marginBottom: 2}}>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="outlined" onClick={() => dispatch(clearFiltersCustomerAct())}>
            <RemoveCircle />
          </Button>
        </Grid>
        {currentUser?.level === 0 && <Grid item xs={12} sm={3}> <OfficeFilterSelector/> </Grid>}
        {/* <Grid item xs={12} sm={4}> <CustomersLeadFilterSelector/> </Grid> */}
        {currentUser?.level! <= 3 && <Grid item xs={12} sm={3}> <CustomersFilterUserSelector/> </Grid>}
        <Grid item xs={12} sm={4}>
          <CustomerFilterDate/>
        </Grid>
      </Grid>
    </Paper>
  )
}