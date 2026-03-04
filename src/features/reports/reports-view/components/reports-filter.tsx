import { Button, Grid, Paper } from "@mui/material";
import AppSelector from "../../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { changeInputReportsAct, getReportsThunk, setImageToPreviewReportsAct } from "../reports.slice";
import LoadingIndicator from "../../../../app/components/loading-indicator";
import ImageShowerCP from "../../../../app/components/image-shower.cp";
import React, { useEffect } from "react";
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice";
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice";
import { DateTimePicker} from '@mui/x-date-pickers';
import moment, { Moment } from "moment";
import { OfficeInterface } from "../../../../app/models/office.inteface";

const options = [
  {name: "Situaciones", _id: "situations"},
  {name: "Solicitudes de Pagos", _id: "payments-requests"},
  {name: "Pagos realizados", _id: "payments-made"},
  {name: "Proyecciones de Pago", _id: "projected-payments"},
  {name: "Llamadas", _id: "calls"},
  {name: "Llamadas asignados", _id: "call-customers-assigned"},
  {name: "Usuarios que no llaman", _id: "users-did-not-calls"},
  {name: "Proyecciones irregulares", _id: "irregular-projections"},
  
]

export default function ReportFiltersCP() {
  const { filter, loading, imageToPreview } = useAppSelector(state => state.reports) 
  const { currentUser } = useAppSelector(state => state.login) 
  const [endDate, setEndDate] = React.useState<Moment | null>(moment().endOf('day'));
  const [startDate, setStartDate] = React.useState<Moment | null>(moment().startOf('day'));

  const {offices, gotOffices} = useAppSelector(state => state.offices)
  const {usersOriginal, gotUsers} = useAppSelector(state => state.users)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
    if(!gotUsers) {
      dispatch(fetchUsersThunk({enable: true}))
    }
  }, [])
  const changeInput = ({name, val} : {name: string, val: string}) => {
    dispatch(changeInputReportsAct({name, val}))
  }  

  const officeOptions = (): OfficeInterface[] => {
    const ofs: OfficeInterface[] = []    
    for(const o of offices) {
      if(currentUser?.level === 0 || currentUser?.level === 1 || (currentUser?.office === o._id && currentUser?.level !== 0)) {
        ofs.push(o)
      }
    }
    return ofs
  }


  const submitForm = (e: React.FormEvent) => {    
    e.preventDefault()
    if(filter.type === "") return
    dispatch(getReportsThunk({
      filters: {...filter, 
        startDate : startDate ? startDate.format("YYYY-MM-DD HH:mm:ss") : "",
        endDate : endDate ? endDate.format("YYYY-MM-DD HH:mm:ss") : ""
      }}
    ))
  }

  return(
    <>
      <LoadingIndicator open={loading}/>
      <ImageShowerCP imgUrl={imageToPreview} onClose={() => dispatch(setImageToPreviewReportsAct(undefined))}/>
      <Paper sx={{padding: 2}}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <AppSelector options={options} name="type" label="Tipo reporte"   value={filter.type} onChange={changeInput} required={true}/>
            </Grid>
            <Grid item xs={12} md={4}>
              <AppSelector label='Office' name="office" options={officeOptions()} value={filter.office} onChange={changeInput} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppSelector label='User' name="user" value={filter.user} options={usersOriginal.filter((u) => u.office && (u.office as any)._id === filter.office).map((u) => ({_id: u._id, name: `${u.name}|${u.lastName}`}))} onChange={changeInput} />
            </Grid>
            <Grid item xs={4}>
              <DateTimePicker maxDateTime={endDate!} label="Fecha inicio" sx={{width: '100%'}} value={startDate} onChange={(v) => setStartDate(v) } />
            </Grid>
            <Grid item xs={4}>
              <DateTimePicker minDateTime={startDate!} label="Fecha fin" sx={{width: '100%'}} value={endDate} onChange={(v) => setEndDate(v) }/>
            </Grid>
            <Grid item xs={3}>
              <Button type="submit" variant="contained" onClick={submitForm} fullWidth> GENERAR </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  )
}