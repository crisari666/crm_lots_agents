import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getOfficesThunk, usersForOfficeThunk } from "../../offices/offices-list/offices-list.slice";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { getUserArriveLogsThunk, setOfficeQrSlice } from "../slice/qr-arrive.slice";
import { OfficeInterface } from "../../../app/models/office.inteface";

export default function UserArriveLogFilter() {
  const { offices } = useAppSelector(state => state.offices)
  const [office, setOffice] = useState<string | null>(null)
  const { loading } = useAppSelector(state => state.qrArrive)
  const { usersForOffice } = useAppSelector(state => state.offices)
  const [date, setDate] = useState<Date | null>(null)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getOfficesThunk())
  }, [])

  const changeOffice = (event: SelectChangeEvent<string>) => {
    dispatch(setOfficeQrSlice(offices.find(office => office._id === event.target.value)!))
    dispatch(usersForOfficeThunk({officeId: event.target.value}))
  }

  const findLogs = () => {
    dispatch(getUserArriveLogsThunk({date: date!.toISOString(), users: usersForOffice!.map(user => user!._id) as string[]}))
  }
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Oficina</InputLabel>
                <Select value={office ?? ""} onChange={changeOffice} label="Oficina">
                  {offices.map(office => (
                    <MenuItem key={`filterOfficeLog-${office._id}`} value={office._id}>{office.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <DatePicker sx={{width: '100%'}} label="Fecha" onChange={(d) => setDate(d!.toDate())}/>
            </Grid>
            <Grid item xs={3} display={'flex'} justifyContent={'center'}>
              <Button fullWidth variant="outlined" color="primary" onClick={findLogs}>Buscar</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}