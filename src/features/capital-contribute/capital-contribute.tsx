/* eslint-disable prettier/prettier */
import { Button, Card, CardContent, CardHeader, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DateSelector from "../../app/components/date-selector"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store";
import { changeInputDateCapitalAction, getCapitalByDateThunk, showModalContributeCapitalAction } from "./capital-contribute.slice";
import AddCapitalModal from "./components/AddCapitalModal";
import { dateUTCToFriendly } from "../../utils/date.utils";
import { useEffect } from "react";
import LoadingIndicator from "../../app/components/loading-indicator";
import { CapitalContributeInterface } from "./domain/capital-contribute-state";
import { numberToCurrency } from "../../utils/numbers.utils";

export default function CapitalContribute() {

  const dispatch = useAppDispatch()
  const { dateInputFilter, history, loading } = useAppSelector((state: RootState) => state.capitalContribute)

  const showModalAddCapital = () => dispatch(showModalContributeCapitalAction(true))

  useEffect(() => {
    if(dateInputFilter !== ""){
      dispatch(getCapitalByDateThunk({date: dateInputFilter}))
    }
  }, [dateInputFilter, dispatch])

  const changeDate = (date: string) => dispatch(changeInputDateCapitalAction(date))

  const total = history.reduce((previous, current, index) =>  Number(previous) + Number(history[index].value) , 0)

  return (
    <>  
      <LoadingIndicator open={loading} />
      <AddCapitalModal />
      <Card>
        <CardContent>
          <Grid container>
            <Grid item>
              <DateSelector value={dateInputFilter} onChange={changeDate} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title="Aporte Capital"
          action={<Button variant="contained" onClick={showModalAddCapital}> Añadir </Button>}

        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> ID </TableCell>
                  <TableCell> FECHA </TableCell>
                  <TableCell> VALOR</TableCell>
                  <TableCell> DESC </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((el, i) => {
                  return (
                    <TableRow key={el._id}>
                      <TableCell>{el._id}</TableCell>
                      <TableCell>{dateUTCToFriendly(el.date)}</TableCell>
                      <TableCell>$ {numberToCurrency(el.value)}</TableCell>
                      <TableCell>{el.name}</TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell colSpan={2} align="center">TOTAL</TableCell>
                  <TableCell>$ {numberToCurrency(total)} </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  )
}