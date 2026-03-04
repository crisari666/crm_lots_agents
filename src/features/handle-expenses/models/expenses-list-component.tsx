import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Card, ThemeProvider } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { themeCondense } from "../../../app/themes/theme-condense"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import { numberToCurrency } from "../../../utils/numbers.utils"
import { OmegaSoftConstants } from "../../../app/khas-web-constants"

export default function ExpensesListComponent() {
  const {expenses, total} = useAppSelector((state: RootState) => state.expenses)

  return(
    <ThemeProvider theme={themeCondense}>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((el, i) => {
                return(
                  <TableRow key={`${el._id}`}>
                    <TableCell>{dateUTCToFriendly(el.date!)}</TableCell>
                    <TableCell>{el.name}</TableCell>
                    <TableCell>{el.type != null ? OmegaSoftConstants.expenseType[el.type].name : ''}</TableCell>
                    <TableCell align="right">$ {numberToCurrency(el.value)}</TableCell>
                  </TableRow>
                )
              })}
              <TableRow>
                <TableCell align="center" colSpan={3}>Total: </TableCell>
                <TableCell align="right">$ {numberToCurrency(total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </ThemeProvider>
  )

}