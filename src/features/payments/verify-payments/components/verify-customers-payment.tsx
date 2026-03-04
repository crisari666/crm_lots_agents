import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListSubheader, Paper } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { dateUTCToFriendly } from "../../../../utils/date.utils"
import { ArrowDownward } from "@mui/icons-material"
import { FeeInterface } from "../../../../app/models/fee.interface"

export default function VerifyCustomerPaymentsHistory() {
  const { payments } = useAppSelector((state) => state.verifyCustomerPaymentsSlice) 
  return (
    <>
      {payments.length > 0 && <Paper sx={{padding: 1, marginBottom: 2}}> 
        {payments.map((payment) => 
          <Accordion key={payment._id}>
            <AccordionSummary expandIcon={<ArrowDownward />}>
            <ListSubheader>  </ListSubheader>
              Fecha proyectada: {dateUTCToFriendly(payment.dateExpected)} <br/>
              Pago: {payment.valuePayed} / {payment.valueExpected} <br/> Paso: {payment.step?.title}
            </AccordionSummary>
            <AccordionDetails sx={{paddingLeft: 7}}>
              <List>
              {payment.fees.map((fee ) => {
                const f = fee as FeeInterface
                return (
                  <ListItem key={f._id} disablePadding>
                    ${f.value} - {dateUTCToFriendly(f.date)}
                  </ListItem>
                )
              }) }
              </List>
            </AccordionDetails>
          </Accordion> 

        )}
        
    </Paper>}
    </>
  )
}

//scr820