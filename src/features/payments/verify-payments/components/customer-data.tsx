import { Grid, Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import AppTextField from "../../../../app/components/app-textfield"
import { useEffect } from "react"
import { getUserPaymentsThunk } from "../slice/verify-customer-payments.slice"

export default function CustomerDataCP() {
  const dispatch = useAppDispatch()
  const { customer } = useAppSelector((state) => state.verifyCustomerPaymentsSlice) 

  useEffect(() => {
    if(customer !== undefined) {
      dispatch(getUserPaymentsThunk(customer._id))
    }
  }, [customer])
  return (
    <>
      {customer !== undefined && <Paper sx={{padding: 1, marginBottom: 2}}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <AppTextField 
              disabled
              readonly
              startCompontent="Nombre"
              value={customer!.name}
              />
          </Grid>
          <Grid item xs={6}>
            <AppTextField 
              disabled
              readonly
              startCompontent="Correo"
              value={customer!.email}
            />
          </Grid>

        </Grid>
      </Paper>}
    </>
  )
}