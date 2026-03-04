import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, ThemeProvider } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { themeCondense } from "../../../../app/themes/theme-condense"

export default function ReportUsersDidNotCalls() {
  const { filter, usersDidNotCallsReport } = useAppSelector((state) => state.reports) 
  return (
    <ThemeProvider theme={themeCondense}>
      {filter.type === 'users-did-not-calls' && <>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Sede</TableCell>
                <TableCell>Cliente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersDidNotCallsReport.map((row, index) => (
                <TableRow>
                  <TableCell>{row.user.name}</TableCell>
                  <TableCell>{row.user.office.name}</TableCell>
                  <TableCell>{row.customer.name } || {row.customer.phone}</TableCell>
                </TableRow>
              )

              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>}
    </ThemeProvider>
  )
}