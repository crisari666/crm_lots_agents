import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Close } from "@mui/icons-material";
import AppTextField from "../../../app/components/app-textfield";
import { createStepThunk, showFormStepAct, updateInputStepFormAct, updateStepThunk } from "../steps.slice";

export default function DialogStepForm() {
  const {showForm, stepToEdit, stepForm} = useAppSelector((state) => state.steps)
  const dispatch = useAppDispatch()
  const closeDialog = () => dispatch(showFormStepAct(false))

  const changeInput = (data: {name: string, val: string}) => {
    dispatch(updateInputStepFormAct({name: data.name, value: data.val}))
  }

  const sendStep = () => {
    if(stepToEdit === undefined)  {
      dispatch(createStepThunk(stepForm))
    } else {
      dispatch(updateStepThunk({ data: stepForm, stepId: stepToEdit}))

    }
  }
  return (
    <>
      <Dialog open={showForm}>
        <IconButton className="closeDialog" onClick={closeDialog}> <Close/> </IconButton>
        <DialogTitle sx={{marginRight: 3}}>
          {stepToEdit ? 'Edit Step' : 'Add Step'}
        </DialogTitle>
        <DialogContent sx={{minWidth: '400px'}}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <AppTextField type="number" name='order' label="Paso" value={stepForm.order} onChange={changeInput}/>
            </Grid>
            <Grid item xs={12}>
              <AppTextField name="title"  label="Titulo" value={stepForm.title} onChange={changeInput}/>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  name="color"
                  value={stepForm.color || ''}
                  label="Color"
                  onChange={(e) => changeInput({name: 'color', val: e.target.value})}
                >
                  <MenuItem value="">Sin color</MenuItem>
                  <MenuItem value="#f44336">Rojo</MenuItem>
                  <MenuItem value="#e91e63">Rosa</MenuItem>
                  <MenuItem value="#9c27b0">Púrpura</MenuItem>
                  <MenuItem value="#673ab7">Púrpura profundo</MenuItem>
                  <MenuItem value="#3f51b5">Índigo</MenuItem>
                  <MenuItem value="#2196f3">Azul</MenuItem>
                  <MenuItem value="#03a9f4">Azul claro</MenuItem>
                  <MenuItem value="#00bcd4">Cian</MenuItem>
                  <MenuItem value="#009688">Teal</MenuItem>
                  <MenuItem value="#4caf50">Verde</MenuItem>
                  <MenuItem value="#8bc34a">Verde claro</MenuItem>
                  <MenuItem value="#cddc39">Lima</MenuItem>
                  <MenuItem value="#ffeb3b">Amarillo</MenuItem>
                  <MenuItem value="#ffc107">Ámbar</MenuItem>
                  <MenuItem value="#ff9800">Naranja</MenuItem>
                  <MenuItem value="#ff5722">Naranja profundo</MenuItem>
                  <MenuItem value="#795548">Marrón</MenuItem>
                  <MenuItem value="#607d8b">Azul gris</MenuItem>
                  <MenuItem value="#9e9e9e">Gris</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeDialog}> CANCELAR </Button>
          <Button variant="outlined" onClick={sendStep} color="success"> AGREAR </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}