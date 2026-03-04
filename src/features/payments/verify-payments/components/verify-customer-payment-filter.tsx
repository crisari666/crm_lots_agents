import { Button, Grid, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import AppTextField from "../../../../app/components/app-textfield";
import { useState } from "react";
import { getUserInfoThunk } from "../slice/verify-customer-payments.slice";
import LoadingIndicator from "../../../../app/components/loading-indicator";
export default function VerifyCustomerPaymentFilter() {
  const dispatch = useAppDispatch()
  const [customerId, setCustomerId] = useState<string>("")
  const { loading } = useAppSelector((state) => state.verifyCustomerPaymentsSlice) 

  const findCustomer = () => dispatch(getUserInfoThunk(customerId))
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container spacing={2}>
          <Grid item> 
            <AppTextField value={customerId} label="User id" onChange={(d) => setCustomerId(d.val)} />
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={findCustomer}>
              Buscar
            </Button>
          </Grid>
        </Grid>

      </Paper>
    </>
  )
}