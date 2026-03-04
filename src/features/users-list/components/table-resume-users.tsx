import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";

export default function TableResumeUsers(){
  const { users } = useAppSelector((state) => state.users)
  return (
    <>
      <TableContainer>
        <Table padding="none">
          <TableHead>
            <TableRow>
              <TableCell> Leads </TableCell>
              <TableCell> Ventors </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{ users.reduce((previous, current, i) => (current.level === 2 || current.level === 3 ? previous + 1 : previous), 0)  }</TableCell>
              <TableCell>{ users.reduce((previous, current, i) => (current.level === 4 ? previous + 1 : previous), 0)  }</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}