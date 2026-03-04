import { Done, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, Typography } from "@mui/material";
import AppDateRangeSelector from "../../../app/components/app-date-range-selector";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeDateRangeUserPaymentsAct, getUserPaymentsByDateThunk } from "../user-customer.slice";
import TabHandler from "../../../app/components/tab-handler";
import ExpectedPaymentsTable from "./expected-payments-table";
import { useParams } from "react-router-dom";
import { dateToInputDate } from "../../../utils/date.utils";
import UserDonePaymentsTable from "./user-done-payment-table";

export default function UserPaymentsResume() {
  const dispatch = useAppDispatch()
  const { userPaymentsFilter } = useAppSelector((state) => state.userCustomer)
  const { dateEnd, dateStart } = userPaymentsFilter
  const { userId } = useParams()
  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
        >
          <Typography variant="h6">Payments</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <AppDateRangeSelector dateEnd={dateEnd} dateStart={dateStart} id="userPaymentFIlter" 
                onChange={() => dispatch(changeDateRangeUserPaymentsAct({dateEnd: userPaymentsFilter.dateEnd, dateStart: userPaymentsFilter.dateStart}))} 
              />
            </Grid>
            <Grid item xs={2}>
              <Button size="small" variant="outlined" onClick={() => dispatch(getUserPaymentsByDateThunk({endDate: dateToInputDate(dateEnd.toISOString()), startDate: dateToInputDate(dateStart.toISOString()), userId: userId!}))}> <Done/> </Button>
            </Grid>
          </Grid>
          <TabHandler
            tabNames={['Expected', 'Done']}
            tabComponents={[
              <ExpectedPaymentsTable />,
              <UserDonePaymentsTable />
            ]}
           /> 
        </AccordionDetails>
      </Accordion>
    </>
  )
}