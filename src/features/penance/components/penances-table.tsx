import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getPenancesThunk } from "../slice/penances.slice";
import { TableBody, TableCell, TableHead, TableRow, ThemeProvider } from "@mui/material";
import { Table } from "@mui/material";
import { themeCondense } from "../../../app/themes/theme-condense";
export default function PenancesTable() {
  const dispatch = useAppDispatch()
const {penances} = useAppSelector((state) => state.penance) 

  useEffect(() => {
    dispatch(getPenancesThunk())
  }, []) 
  return (
    <ThemeProvider theme={themeCondense}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Oficina</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {penances.map((el, i) => 
            <TableRow key={i}>
              <TableCell>{el.user.email}</TableCell>
              <TableCell>{el.customer.name}</TableCell>
              <TableCell>{el.user.office.name}</TableCell>
              <TableCell>{el.date}</TableCell>
            </TableRow>
          )}

        </TableBody>
      </Table>
    </ThemeProvider>
  )
}