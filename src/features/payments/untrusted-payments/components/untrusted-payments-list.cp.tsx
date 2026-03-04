import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useEffect } from "react";
import { getUnstrustedPaymentThunk } from "../untrusted-payments.slice";
import { dateUTCToFriendly } from "../../../../utils/date.utils";
import { numberToCurrency } from "../../../../utils/numbers.utils";
import { Image } from "@mui/icons-material";
import LoadingIndicator from "../../../../app/components/loading-indicator";

export default function UntrustedPaymentsListCP() {
  const {payments, loading} = useAppSelector(state => state.untrusted)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getUnstrustedPaymentThunk())
  }, [])
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 2}} elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>DATE</TableCell>
                <TableCell>VAL</TableCell>
                <TableCell>IMG</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{dateUTCToFriendly(payment.date)}</TableCell>
                  <TableCell>$ {numberToCurrency(payment.value)}</TableCell>
                  <TableCell>
                    {payment.image && <IconButton>
                      <Image />
                    </IconButton>}
                  </TableCell>
                </TableRow>
              
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}