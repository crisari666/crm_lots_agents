import { Box, Button, Grid, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import AppSelector from "../../../app/components/app-select";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { loadPayedGraphThunk, loadPaysGraphThunk } from "../store/statistics.slice";
import { Check } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
export default function PayGraph() {
  const [office, setOffice] = useState<string>('')  
  const [dateStart, setDateStart] = useState<Moment>(moment().startOf('day'))
  const [dateEnd, setDateEnd] = useState<Moment>(moment().endOf('day'))
  const dispatch = useAppDispatch()
  const {offices} = useAppSelector((state) => state.offices) 
  const {graphPayments, graphPayed} = useAppSelector((state) => state.statistics) 

  const loadGraph = (e: any) => {
    e.preventDefault()
    dispatch(loadPaysGraphThunk({startDate: dateStart.format('YYYY-MM-DD HH:mm:ss'), endDate: dateEnd.format('YYYY-MM-DD HH:mm:ss'), office, userId: ""}))
    dispatch(loadPayedGraphThunk({startDate: dateStart.format('YYYY-MM-DD HH:mm:ss'), endDate: dateEnd.format('YYYY-MM-DD HH:mm:ss'), office, userId: ""}))
  }
  useEffect(() => {
    dispatch(getOfficesThunk())
  }, [])
  return (
    <Paper sx={{padding: 2, maxWidth: '100vw'}}>
      <Grid container component={'form'} spacing={0.5} onSubmit={loadGraph}>
        <Grid item xs={6}>
          <DateTimePicker maxDateTime={dateEnd} label="Fecha inicio" sx={{width: '100%'}} value={dateStart} onChange={(v) => setDateStart(v!) } />
        </Grid>
        <Grid item xs={6}>
          <DateTimePicker minDateTime={dateStart} label="Fecha fin" sx={{width: '100%'}} value={dateEnd} onChange={(v) => setDateEnd(v!) }/>
        </Grid>
        <Grid item xs={4}>
          <AppSelector label="Oficina" name="office" value={office} options={offices} onChange={(e) => setOffice(e.val)} />
        </Grid>
        <Grid item xs={3}>
          <Button type="submit"> <Check/> </Button>
        </Grid>
      </Grid>
      <Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['Proyeccion de Pago'] }]}
            dataset={graphPayments}
            series={[
              { dataKey: 'projected', label: "Proyectado"},
              { dataKey: 'payed', label: "Recibido en proyecciones"},
              { dataKey: 'confirmed', label: "Confirmado"},
              { dataKey: 'downloaded', label: "Pagado"},
              { dataKey: 'projectedIrregular', label: "Proyectado irregular"},
              { dataKey: 'payedIrregular', label: "Recibido en proyecciones irregular"},
            ]}
            width={600}
            sx={{maxWidth: '100%'}}
            height={350}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <BarChart
            xAxis={[{ scaleType: 'band', data: ['Pagos recibidos'] }]}
            dataset={graphPayed}
            series={[
              { dataKey: 'totalPayments', label: "Total Registrado"},
              { dataKey: 'totalTrusted', label: "Verificado Lidered"},
              { dataKey: 'totalUntrusted', label: "Sin Verificar"},
              { dataKey: 'totalDownloaded', label: "Pagado cuadre"},
              { dataKey: 'retained', label: "Retenido"},
            ]}
            width={600}
            height={350}
          />
        </Grid>
      </Grid>
      </Box>
    </Paper>
  )
}