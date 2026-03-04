import { Chip, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, ThemeProvider } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { dateToInputDate, dateUTCToFriendly } from "../../../../utils/date.utils"
import { numberToCurrency } from "../../../../utils/numbers.utils"
import { themeCondense } from "../../../../app/themes/theme-condense"

export default function ResultPaymentRequestsCP() {
  const {filter, paymentsRequestsResults} = useAppSelector((state: RootState) => state.reports)
  const resolveCustomer = (customer: any): string => {
    if(customer.length === 0) return ""
    return `${customer[0].name} ${customer[0].phone}`
  }

  const resolveUser = (user: any): string => {
    if(user.length === 0) return ""
    return `${user[0].name}`
  }

  const totalPayed = (): number => (paymentsRequestsResults ?? []).reduce((acc, pay) => acc + (pay.anulated ? 0 : pay.valuePayed), 0)
  const totalExpected = (): number => (paymentsRequestsResults ?? []).reduce((acc, pay) => acc + (pay.anulated || pay.waiting ? 0 : pay.valueExpected), 0)
  const totalWaiting = (): number => (paymentsRequestsResults ?? []).reduce((acc, pay) => acc + (pay.waiting ? pay.valueExpected : 0), 0)
  return(
      <ThemeProvider theme={themeCondense}>
         {(filter.type === "payments-requests" || filter.type === 'projected-payments' || filter.type === 'irregular-projections') && paymentsRequestsResults !== undefined && <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Creado</TableCell>
                <TableCell>Proyeccion</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Expected</TableCell>
                <TableCell>Pagado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentsRequestsResults.map((pay, i) => (
                <TableRow key={i}>
                  <TableCell>{dateUTCToFriendly(pay.createdAt)}</TableCell>
                  <TableCell>{dateToInputDate(pay.dateExpected)}</TableCell>
                  <TableCell>
                    {resolveCustomer(pay.customer)}
                    {[pay.anulated ? <Chip size="small" color="secondary" label="Anulado" /> : <></>]}
                    {[pay.waiting ? <Chip size="small" color="warning" label="En espera" /> : <></>]}

                  </TableCell>
                  <TableCell>{resolveUser(pay.user)}</TableCell>
                  <TableCell>${numberToCurrency(pay.valueExpected)}</TableCell>
                  <TableCell>${numberToCurrency(pay.valuePayed)}</TableCell>
                </TableRow>
              
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>En espera ${numberToCurrency(totalWaiting())}</TableCell>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell>${numberToCurrency(totalExpected())}</TableCell>
                <TableCell>${numberToCurrency(totalPayed())}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

      </>}
    </ThemeProvider>
    )
}