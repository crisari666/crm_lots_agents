import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getAlertedPaysThunks } from "../../reports/reports-view/reports.slice";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, ThemeProvider } from "@mui/material";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { themeCondense } from "../../../app/themes/theme-condense";
export default function AlertedPaysList() {
  const dispatch = useAppDispatch()
  const { alertedPayments, loading, filterAlertedPayments} = useAppSelector((state) => state.reports) 
  const { office } = filterAlertedPayments

  useEffect(() => {
    dispatch(getAlertedPaysThunks())
  }, [])

  const resolveUserAssigned = (user: any): string => user.email
  
  const resolveOffice = (user: any): string => user.office.name

  const filterPays = () => alertedPayments.filter((p) => office === '' ? true : 
  p.customer.office === office
)

  const totalExpected = () => filterPays().reduce((acc, p) => acc + p.valueExpected, 0)
  const totalPayed = () => filterPays().reduce((acc, p) => acc + p.valuePayed, 0)

  return (
    <>
      <LoadingIndicator open={loading}/>
      <ThemeProvider theme={themeCondense}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell> _id </TableCell>
                <TableCell align="right"> Proyectado </TableCell>
                <TableCell align="right"> Pagado </TableCell>
                <TableCell align="right"> Cliente </TableCell>
                <TableCell align="right"> Usuario  </TableCell>
                <TableCell align="right"> Oficina  </TableCell>
                <TableCell align="right"> Creador pago </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterPays().map((payment) => (
                <TableRow>
                  <TableCell> {payment._id} </TableCell>
                
                  <TableCell align="right"> {numberToCurrency(payment.valueExpected)} </TableCell>
                  <TableCell align="right"> {numberToCurrency(payment.valuePayed)} </TableCell>
                  <TableCell align="right"> {payment.customer.name}/{payment.customer.phone} </TableCell>
                  <TableCell align="right"> {resolveUserAssigned(payment.customer.userAssigned)} </TableCell>
                  <TableCell align="right"> {resolveOffice(payment.customer.userAssigned)} </TableCell>
                  <TableCell align="right"> {payment.user.name}/{payment.user.email}/{(payment.user.office as any).name} </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total:</TableCell>
                <TableCell align="right">{numberToCurrency(totalExpected())}</TableCell>
                <TableCell align="right">{numberToCurrency(totalPayed())}</TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  )
}