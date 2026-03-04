import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, ThemeProvider } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { FeeResumeType, UserGoalResumeRow } from "../reports.state";
import { themeCondense } from "../../../app/themes/theme-condense";
import { useEffect, useState } from "react";
export default function UsersGoalsResults() {
  const dispatch = useAppDispatch()
  const { usersGoalsResume } = useAppSelector((state) => state.reports) 
  const [totalExpected, setTotalExpected] = useState<number>(0)
  const [totalGoal, setTotalGoal] = useState<number>(0)
  const [totalPayed, setTotalPayed] = useState<number>(0)
  const [totalTrusted, setTotalTrusted] = useState<number>(0)
  const [totalUntrusted, setRotalUntrusted] = useState<number>(0)
  const [totalPayments, setTotalPayments] = useState<number>(0)

  const resolveProjected = (userGoal: UserGoalResumeRow): {payed: number, expected: number} => {
    if(userGoal.payments.length === 0) return {expected: 0, payed: 0} 
    const {expected, payed} = userGoal.payments[0]
    return {expected, payed}
  }

  const resolvePayed = (userGoal: UserGoalResumeRow): FeeResumeType => {
    if(userGoal.fees.length === 0) return  {_id: null, totalPayments: 0, totalTrusted: 0, totalUntrusted: 0, totalDownloaded: 0}
    return userGoal.fees[0]
  }

  useEffect(() => {
    if(usersGoalsResume.length > 0 && totalGoal === 0)  {
      for(const row of usersGoalsResume) {
        const projected = resolveProjected(row)
        const payed = resolvePayed(row)
        setTotalExpected(total => total + projected.expected)
        setTotalGoal(total => total + (row.goal ?? 0))
        setTotalPayed(total => total + projected.payed)
        setTotalTrusted(total => total + payed.totalTrusted)
        setRotalUntrusted(total => total + payed.totalUntrusted)
        setTotalPayments(total => total + payed.totalPayments)
      }
    } else if(usersGoalsResume.length === 0) {
      setTotalExpected(0)
      setTotalGoal(0)
      setTotalPayed(0)
      setTotalTrusted(0)
      setRotalUntrusted(0)
      setTotalPayments(0)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersGoalsResume, dispatch])
  
  
  return (
    <ThemeProvider theme={themeCondense}>
      <Paper sx={{padding: 2, marginBottom: 2}}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell align="right">Meta</TableCell>
                <TableCell align="right">Proyectado</TableCell>
                <TableCell align="right">Recibido Confirmado</TableCell>
                <TableCell align="right">Recibido Sin confirmar</TableCell>
                <TableCell align="right">Recibido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {usersGoalsResume.map((userGoal, i) => {
                  const projected = resolveProjected(userGoal)
                  const payed = resolvePayed(userGoal)
                  return (
                      <TableRow>
                        <TableCell>{i}</TableCell>
                        <TableCell>{userGoal.email}</TableCell>
                        <TableCell align="right">{numberToCurrency(userGoal.goal ?? 0)}</TableCell>
                        <TableCell align="right">{numberToCurrency(projected.expected, 0)}/{numberToCurrency(projected.payed, 0)}</TableCell>
                        <TableCell align="right">{numberToCurrency(payed.totalTrusted, 0)}</TableCell>
                        <TableCell align="right">{numberToCurrency(payed.totalUntrusted, 0)}</TableCell>
                        <TableCell align="right">{numberToCurrency(payed.totalPayments, 0)}</TableCell>
                      </TableRow>
                    )
                }
                )}
            </TableBody>
            <TableFooter>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align="right">{numberToCurrency(totalGoal, 0)}</TableCell>
              <TableCell align="right">{numberToCurrency(totalExpected, 0)}/{numberToCurrency(totalPayed, 0)}</TableCell>
              <TableCell align="right">{numberToCurrency(totalTrusted, 0)}</TableCell>
              <TableCell align="right">{numberToCurrency(totalUntrusted, 0)}</TableCell>
              <TableCell align="right">{numberToCurrency(totalPayments, 0)}</TableCell>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </ThemeProvider>
  )
}