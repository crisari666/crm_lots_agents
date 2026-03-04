import { Button, FormControlLabel, Grid, Paper, Switch } from "@mui/material";
import AppTextField from "../../../app/components/app-textfield";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import CustomerCenterFilterRangeDate from "./customer-center-filter-range-date";
import { changeExcludeDateFilterAct, changeValueFilterAct, filterCustomersThunk } from "../customer-center.slice";
import CustomersCenterFilterUserSelector from "./customers-center-filter-user-selector";
import CustomerCenterOfficeFilterSelector from "./customer-center-office-filter-selector";
import { useEffect } from "react";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice";
import CustomerCenterSelectorStatus from "./customer-center-selector-status";

export default function CustomerCenterFilter() {
  const dispatch = useAppDispatch() 
  const { loading, filter } = useAppSelector((state) => state.customerCenter)
  const { currentUser } = useAppSelector((state) => state.login)
  const { gotUsers } = useAppSelector((state) => state.users)

  useEffect(() => {
    dispatch(getOfficesThunk())

    if(currentUser !== undefined && gotUsers === false && currentUser.level! <= 3) dispatch(fetchUsersThunk({enable: true}))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  const clickFilter = () => { 
    dispatch(filterCustomersThunk(filter))
  }
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{marginBottom: 1, padding: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <CustomerCenterSelectorStatus/>
          </Grid>
          <Grid item xs={6} md={3}>
            <AppTextField label="coincidencia" onChange={(d) => dispatch(changeValueFilterAct(d.val))}/>
          </Grid>
          <Grid item xs={6} md={2}>
            <CustomerCenterOfficeFilterSelector />
          </Grid>
          <Grid item xs={6} md={2}>
            <CustomersCenterFilterUserSelector />
          </Grid>
          <Grid item xs={6} md={5}>
            <CustomerCenterFilterRangeDate />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControlLabel control={<Switch />} label="Excluir fechas" onChange={(d, c) => dispatch(changeExcludeDateFilterAct(c))} />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button variant="outlined" fullWidth onClick={clickFilter}>
               Filtrar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}