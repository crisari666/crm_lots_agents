import { Button, Card, CardContent, Chip, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material"; 
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { dateUTCToFriendly, getCurrenDateUtil } from "../../../utils/date.utils";

import AppSelector from "../../../app/components/app-select";
import { useEffect, useState } from "react";
import { Download, Visibility } from "@mui/icons-material";
import { getActiveCustomersByStepForOfficeThunk } from "../../user-customers/user-customer.slice";
import { getStepsThunk } from "../../steps/steps.slice";
import { Link, useParams } from "react-router-dom";
import { numberToCurrency } from "../../../utils/numbers.utils";

export default function OfficeDashboarPaymentsResume() {
  const {steps} = useAppSelector(state => state.steps)
  const {customerStepLogs} = useAppSelector(state => state.userCustomer)
  const dispatch = useAppDispatch()
  const [dateStart] = useState<string>(getCurrenDateUtil())
  const [dateEnd] = useState<string>(getCurrenDateUtil())
  const {officeId} = useParams()
  const [excludeDate] = useState<boolean>(false)
  const [step, setStep] = useState<string>('')

  useEffect(() => {
    dispatch(getStepsThunk())
  }, [])
  

  const submitForm = () => {
    console.log('submitForm', {dateStart, dateEnd, step, excludeDate})
    dispatch(getActiveCustomersByStepForOfficeThunk({filter: {dateStart, dateEnd, step, excludeDate, office: officeId!}}))
  }


  return(
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">Pasos de clientes</Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <AppSelector size="small" value={step} options={steps} name="step" label="Step" propOptionName="title" onChange={({name, val}) => setStep(val)}/>
            </Grid>
            <Grid item xs={4}>
              <Button size="small" fullWidth variant="outlined" onClick={submitForm}> <Download/> </Button>
            </Grid>
          </Grid>
          <List>
            {customerStepLogs.map((customerStepLog) => (
              <ListItem key={customerStepLog._id}
                secondaryAction={
                  <Chip variant="outlined"  color="secondary" label={
                    `$ ${numberToCurrency(customerStepLog.payments.reduce((acc, payment) => acc + payment.valuePayed, 0))}`
                  } />
                }
                divider
              >
                <ListItemAvatar>
                  <IconButton component={Link} to={`/dashboard/customer/${customerStepLog.customer}`}>
                    <Visibility/>
                  </IconButton>
                </ListItemAvatar>
                <ListItemText primary={`${customerStepLog.customerData.name} | ${customerStepLog.customerData.phone}`} secondary={dateUTCToFriendly(customerStepLog.date)} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  )
}