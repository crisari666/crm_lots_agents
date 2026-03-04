import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addSettingThunk, displayDialogSettingAct, updateSettingFormInputAct, updateSettingThunk } from "../slice/settings.slice";
import AppTextField from "../../../app/components/app-textfield";
import AppSelector from "../../../app/components/app-select";
import { OmegaSoftConstants } from "../../../app/khas-web-constants";
export default function SettingFormDialog() {
  const dispatch = useAppDispatch()
  const { showDialog, settingForm, settingForEdit } = useAppSelector((state) => state.settings) 

  const { title, type, value } = settingForm

  const closeDialog = () => {
    dispatch(displayDialogSettingAct(false))
  }

  const updateInputForm = (key: string, value: any) => {
    dispatch(updateSettingFormInputAct({key, value}))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(settingForEdit !== "") {
      dispatch(updateSettingThunk({setting: settingForm, settingId: settingForEdit}))
    } else {
      dispatch(addSettingThunk(settingForm))
    }
  }
  return (
    <>
      <Dialog open={showDialog}>
        <IconButton onClick={closeDialog} className="closeDialog"> <Close /></IconButton>
        <DialogTitle> Formularion variable de configuracion</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppTextField value={title} name="title" label="Title" onChange={(e) => updateInputForm(e.name, e.val)} />
              </Grid>
              <Grid item xs={12}>
                <AppSelector label="Type" name="type" value={type} options={OmegaSoftConstants.typeSettingsOptions} onChange={(e) => updateInputForm(e.name, e.val)} />
              </Grid>
              <Grid item xs={12}>
                <AppTextField label="Value" name="value" value={value} onChange={(e) => updateInputForm(e.name, e.val)} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" type="submit" color="success"> AGREGAR </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}