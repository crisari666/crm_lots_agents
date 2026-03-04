import { Visibility } from "@mui/icons-material";
import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ThemeProvider } from "@emotion/react";
import { themeCondense } from "../../../app/themes/theme-condense";
import { getCustomerResumeThunk } from "../../customers/customer-view/customer-view.slice";

export default function CustomersActivesSnapShotResult() {
  const { customers } = useAppSelector(state => state.customerActivesSnapShot)
  const dispatch = useAppDispatch()
  return(
    <ThemeProvider theme={themeCondense}>
      <Paper sx={{padding: 2}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> <Visibility/> </TableCell>
              <TableCell> Customer </TableCell>
              <TableCell> Step </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => 
              <TableRow>
              <TableCell> <IconButton onClick={() => dispatch(getCustomerResumeThunk(customer.customer._id))}> <Visibility/> </IconButton>  </TableCell>
                <TableCell> {customer.customer.name} </TableCell>
                <TableCell> {customer.step.title} </TableCell>
              </TableRow>
            )
            }
          </TableBody>
        </Table>
      </Paper>
    </ThemeProvider>
  )
}