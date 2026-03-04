import { List, ListItem, ListItemText, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { CustomerResumePaymenType } from "../../../../../app/models/customer-resume-model";
import { dateUTCToFriendly } from "../../../../../utils/date.utils";

export default function CustomerResumePayments({payments} : {payments: CustomerResumePaymenType[]}) {
  return (
    <>
      <Stepper>
        {payments.map((payment) => {
          return (
            <Step key={payment._id}>
              <StepLabel>
                { dateUTCToFriendly(payment.createdAt)} { payment.name} 
                <Typography variant="h6">
                  ${payment.valuePayed} de ${payment.valueExpected}
                </Typography>
                <List disablePadding>
                  {payment.fees.map((fee) => 
                    <ListItem key={fee._id} disablePadding>  
                      <ListItemText
                        primary={fee.value}
                        secondary={dateUTCToFriendly(fee.date)}
                      />
                    </ListItem>  
                  )}
                </List>
              </StepLabel>
            </Step>  
          )
        })} 
      </Stepper>
    </>
  )
}