import TableCell from "@mui/material/TableCell/TableCell"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import TableRow from "@mui/material/TableRow"
import TableHead from "@mui/material/TableHead"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import { RootState } from "../../../app/store"
import { TableContainer, TableFooter } from "@mui/material"
import { useEffect } from "react"
import { getCardsByDateThunk } from "../history-cards.slice"

export default function HistoryCardList() {
  const dispach = useAppDispatch()
  const { cards, totalValue, inputDateValue } = useAppSelector(
    (state: RootState) => state.historyCards,
  )

  useEffect(() => {
    if (inputDateValue !== "") {
      dispach(getCardsByDateThunk(inputDateValue))
    }
  }, [dispach, inputDateValue])

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>NOMBRE</TableCell>
              <TableCell>VALOR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((el, i) => {
              return (
                <TableRow key={el._id}>
                  <TableCell>{el._id}</TableCell>
                  <TableCell>{el.name}</TableCell>
                  <TableCell>{el.value}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}> TOTAL: </TableCell>
              <TableCell> {totalValue} </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}
