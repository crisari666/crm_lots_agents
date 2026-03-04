import { Button, Grid, Paper } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import AppTextField from "../../../../app/components/app-textfield"
import { addOfficeLevelThunk, updateOfficeLevelInputAct, updateOfficeLevelThunk } from "../slice/office-level.slice"

export default function OfficeLevelForm() {
  const dispatch = useAppDispatch()
  const { officeLevelForm, officeLevelToEdit } = useAppSelector((state) => state.officesLevel) 
  const { nCustomers, title, nCustomersDatabase } = officeLevelForm

  const changeInput = ( { name, val } : {name: string, val: any}) => {
    dispatch(updateOfficeLevelInputAct({key: name, value: val}))
  }

  const submitForm = (e: any) => {
    e.preventDefault()
    if(officeLevelToEdit !== '') {
      dispatch(updateOfficeLevelThunk({officeLevelForm, officeLevelToEdit}))
    } else {
      dispatch(addOfficeLevelThunk({officeLevelForm}))
    }
  }

  return (
    <>
      <Paper sx={{paddgin: 1}} elevation={1}>
        <form onSubmit={submitForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppTextField name="title"  required label='Titulo' value={title} onChange={changeInput} />
            </Grid>
            <Grid item xs={12}>
              <AppTextField required type="number" name="nCustomers" label='N Clientes' value={nCustomers} onChange={changeInput} />
            </Grid>
            <Grid item xs={12}>
              <AppTextField required type="number" name="nCustomersDatabase" label='N Clientes Base de datos' value={nCustomersDatabase} onChange={changeInput} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="outlined"> Guardar </ Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  )
}