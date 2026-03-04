/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
} from "@mui/material"
import LoadingIndicator from "../../app/components/loading-indicator"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import ClosureItemComponent from "./components/closure-item-component"
import DateSelector from "../../app/components/date-selector"
import { useEffect } from "react"
import { getCurrentClosureThunk } from "./closure.slice"
import { numberToCurrency } from "../../utils/numbers.utils"

export default function ClosureView() {
  const dispatch = useAppDispatch()
  const { loading, date, closure } = useAppSelector((state: RootState) => state.closure)

  useEffect(() => {
    dispatch(getCurrentClosureThunk())
  }, [])
  return (
    <>
      <LoadingIndicator open={loading} />
      <Grid container justifyContent={"center"}>
        <Grid item xs={12} md={6} lg={4}>
          <DateSelector disabled={true} value={date} fullwidth={true} />
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{backgroundColor: "lightgreen"}}>
            <CardHeader
              titleTypographyProps={{ textAlign: "center" }}
              title={"Cuadre"}
            ></CardHeader>
            <CardContent>
              <ClosureItemComponent isRed={closure.cash_init < 0} label="CI" value={numberToCurrency(closure.cash_init)} />
              <ClosureItemComponent isRed={false} label="AC" value={numberToCurrency(closure.capital_added ?? 0)} />
              <Divider />
              <ClosureItemComponent isRed={false} label="Recogida" value={numberToCurrency(closure.payments)} />
              <ClosureItemComponent isRed={true} label="Prestamos" value={numberToCurrency(closure.new_cards ?? 0)} />
              <ClosureItemComponent isRed={true} label="Gastos" value={numberToCurrency(closure.expenses)} />
              <Divider />
              <ClosureItemComponent isRed={closure.closure < 0} label="Caja" value={numberToCurrency(closure.closure)} />
            </CardContent>
            <CardActions>
              <Button variant="contained" fullWidth color="success" disabled={closure.done === true}>
                CONFIMRAR CUADRE
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
