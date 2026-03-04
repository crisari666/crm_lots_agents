import { Box, Button, Grid } from "@mui/material"
import AppTextField from "../../../../app/components/app-textfield"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { useNavigate, useParams } from "react-router-dom"
import { createOfficeThunk, getOfficeToEditThunk, updateFormOfficeAct, updateOfficeThunk } from "../handle-office.slice"
import { useEffect } from "react"

export default function OfficeForm() {
  const {currentOffice, officeSaved} = useAppSelector((state: RootState) => state.handleOffice)
  const {officeId} = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(officeId === undefined){
      dispatch(createOfficeThunk({officeForm: currentOffice}))
    }else {
      dispatch(updateOfficeThunk({name: currentOffice.name!, officeId: officeId, description: currentOffice.description!, timeOpen: currentOffice.timeOpen!}))
    }
  }
  useEffect(() => {
    if(officeId !== undefined) dispatch(getOfficeToEditThunk({officeId}))
  }, [])

  useEffect(() => {
    if(officeSaved === true) {
      navigate("/dashboard/offices-list")
    }
  }, [officeSaved])

  const onChangeOfficeInput = ({name, val} : {name?: string, val: any}) => {
    dispatch(updateFormOfficeAct({key: name!, value: val}))
  }

  const convertTime = (openTime?: number) => {
    if(openTime === undefined) return "00:00"
    const time = openTime.toString().padStart(4, '0')
    const hours = time.slice(0, 2)
    const minutes = time.slice(2)
    return `${hours}:${minutes}`
  }
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <AppTextField name="name" label="Name" onChange={onChangeOfficeInput} value={currentOffice.name}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField name="description" label="description" onChange={onChangeOfficeInput} value={currentOffice.description}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <AppTextField inputProps={{type: "time", step: "1", inputMode: "numeric", pattern: "[0-9]*"}} type="time" name="timeOpen" label="Hora de Apertura (24h)" onChange={onChangeOfficeInput} value={convertTime(currentOffice.timeOpen!)}/>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" fullWidth variant="contained"> GUARDAR </Button>
        </Grid>
      </Grid>
    </Box>
  )
}