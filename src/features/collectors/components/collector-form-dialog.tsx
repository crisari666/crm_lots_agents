import { Close, Save } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppTextField from "../../../app/components/app-textfield";
import { addCollectorThunk, showCollecotrFormAct, updateCollectorThunk, updateInputFormCollectorAct } from "../slice/collectors.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import AppSelector from "../../../app/components/app-select";
import { OmegaSoftConstants } from "../../../app/khas-web-constants";
import { useEffect } from "react";
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice";
export default function CollectorFormDialog() {
  const dispatch = useAppDispatch()
  const { showCollectorForm, collectorToEdit, collectorForm, loading } = useAppSelector((state) => state.collectors) 
  const { usersOriginal, gotUsers} = useAppSelector((state) => state.users) 

  const { limitMonth, limitWeek, limitYear, location, title, user } = collectorForm

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if(collectorToEdit ) {
      dispatch(updateCollectorThunk({collector: collectorForm, collectorId: collectorToEdit}))
    } else {
      dispatch(addCollectorThunk(collectorForm))

    }
  }

  useEffect(() => {
    if(!gotUsers) dispatch(fetchUsersThunk({enable: true}))
  }, [])

  const closeDialog = () => dispatch(showCollecotrFormAct(false))

  const updateInput = ({name, val} : {name: string, val: any}) => dispatch(updateInputFormCollectorAct({key: name, value: val}))

  const userOptions = usersOriginal.filter((user) => user.level! <= 3).map((user) => ({_id: user._id, name: `${user.email} | ${user.name} | ${user.lastName}`}))


  
  return (
    <>
      <LoadingIndicator open={loading} />
      <Dialog open={showCollectorForm}>
        <IconButton className="closeDialog" onClick={closeDialog}> <Close /></IconButton>
        <DialogTitle>
            {collectorToEdit ? "Editar" : "Crear"} Cobrador
          </DialogTitle>
          <form onSubmit={submitForm}>
            <DialogContent sx={{minWidth: 500}}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <AppTextField label="Nombre" name="title" value={title} onChange={updateInput} required={true}/>
                </Grid>
                <Grid item xs={12}>
                  <AppSelector options={userOptions} label="Usuario" name="user" value={user} onChange={updateInput} required={true}/>
                </Grid>
                <Grid item xs={12}>
                  <AppSelector options={OmegaSoftConstants.collectorLocationEnum} label="Locacion" name="location" value={location} onChange={updateInput} required={true}/>
                </Grid>
                <Grid item xs={12}>
                  <AppTextField label="Limite Semanal" name="limitWeek" value={limitWeek} onChange={updateInput} required={true}/>
                </Grid>
                <Grid item xs={12}>
                  <AppTextField label="Limite Mensual" name="limitMonth" value={limitMonth} onChange={updateInput} required={true}/>
                </Grid>
                <Grid item xs={12}>
                  <AppTextField label="Limite Anual" name="limitYear" value={limitYear} onChange={updateInput}  required={true}/>
                </Grid>
              </Grid>
              </DialogContent>
              <DialogActions sx={{paddingRight: 3, paddingBottom: 2}}>
                  <Button variant="outlined" type="submit" endIcon={<Save/>}> GUARDAR </Button>
              </DialogActions>
          </form>
      </Dialog>
    </>
  )
}