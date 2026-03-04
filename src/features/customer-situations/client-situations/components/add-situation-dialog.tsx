import { Button, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import AppTextField from "../../../../app/components/app-textfield";
import { addSituationThunk, showAddFormAct, updateFormSituationAct, updateSituationThunk } from "../client-situations-slice";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AddSituationDialog() {
  const {showAddForm, situationForm, situationForEditId} = useAppSelector((state:RootState) => state.situations);
  const dispatch = useAppDispatch()
  const submitForm = (e: any) => {  
    e.preventDefault()
    if(situationForEditId !== ''){
      dispatch(updateSituationThunk({form: situationForm, situationId: situationForEditId}))
    } else {
      dispatch(addSituationThunk({form: situationForm}))
    }
  }
  const changeInput = ({name, val} : {name: string, val: any}) => {
    dispatch(updateFormSituationAct({key: name, value: val}))
  }
  return(
    <Dialog open={showAddForm} onClose={() => dispatch(showAddFormAct(false))}>
    <DialogTitle> Formulario situacion </DialogTitle>
      <DialogContent sx={{minWidth: "550px"}}>
        <form onSubmit={submitForm}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppTextField type={"number"} name="order" label="Position" value={situationForm.order} onChange={changeInput}/>
            </Grid>
            <Grid item xs={12}>
              <AppTextField label="Titulo" name="title" value={situationForm.title} onChange={changeInput}/>
            </Grid>
            <Grid item xs={12}>
              <AppTextField label="Title" name="titleEn" value={situationForm.titleEn} onChange={changeInput}/>
            </Grid>
            <Grid item xs={12} minHeight={"300px"}>
              <ReactQuill style={{height: "85%"}}  theme="snow" value={situationForm.description ?? ""} onChange={(value, delta, source, editor) => {
                changeInput({name: "description", val: value})
              }} />
            </Grid>
            <Grid item xs={12} minHeight={"300px"}>
              <ReactQuill style={{height: "85%"}}  theme="snow" value={situationForm.descriptionEn ?? ""} onChange={(value, delta, source, editor) => {
                changeInput({name: "descriptionEn", val: value})
              }} />
            </Grid>
            <Grid item xs={4}> <Button type="submit" variant="contained"> GUARDAR </Button> </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}