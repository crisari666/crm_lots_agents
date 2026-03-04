import { Button, Grid, Paper } from "@mui/material";
import AppSelector from "../../../../app/components/app-select";
import { RootState } from "../../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { addCustomerLogThunk, setShowDialogImageSituationAct, updateInputSituationFormAct } from "../customer-view.slice";
import AppTextField from "../../../../app/components/app-textfield";
import { LibraryAdd } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import SituationImageDialog from "./situation-image-dialog";

export default function CustomerSituationForm() {
  const {situations, formNewSituation} = useAppSelector((state: RootState) => state.customer)
  const {customerId} = useParams()
  const dispatch = useAppDispatch()

  const changeInput = ({name, val} : {name?: string, val: string}) => {
    dispatch(updateInputSituationFormAct({key: name!, value: val}))
  }
  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault()
    if(customerId !== undefined && formNewSituation.situation !== ""){
      dispatch(setShowDialogImageSituationAct(true))
    }
  }
  return(
    <>
      <SituationImageDialog/>
      <Paper sx={{padding: 2, marginTo: 3}} elevation={4}>
        
        <Grid container component={"form"} justifyContent={"center"} alignItems={"center"} spacing={2} onSubmit={handleSubmit}>
          <Grid item xs={5}>
            <AppSelector options={situations} name="situation" label="Situacion" propOptionName="title" value={formNewSituation.situation} onChange={changeInput} required={true}/>
          </Grid>
          <Grid item xs={6}>
            <AppTextField value={formNewSituation.note} name="note" label="Nota" onChange={changeInput}/>
          </Grid>
          <Grid item xs={1}>
            <Button type="submit" variant="contained"> <LibraryAdd/> </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}