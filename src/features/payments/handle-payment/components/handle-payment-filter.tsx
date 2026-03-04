import { Button, Grid, Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { useState } from "react"
import AppTextField from "../../../../app/components/app-textfield"
import { getPaymentByIdThunk } from "../slice/handle-payment.slice"

export default function HandlePaymentFilter() {
  const dispatch = useAppDispatch()
  const [paymentId, setPaymentId] = useState<string>("")
  const handleSubmit = (e: any) => { 
    e.preventDefault()
    if(paymentId !== "") {
      dispatch(getPaymentByIdThunk(paymentId))
    }
  }
  return (
    <>
      <Paper sx={{marginBottom: 2, padding: 2}}>
        <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
          <Grid item xs={8}>
            <AppTextField  value={paymentId} onChange={(e) => setPaymentId(e.val)} label="Payment id"/>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" type="submit">LOAD</Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}