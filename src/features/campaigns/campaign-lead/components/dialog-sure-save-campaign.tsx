import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { addUsersToCampaignThunk, showAlertSureSaveCampaignAct } from "../campaign-lead.slice";
import { Close } from "@mui/icons-material";

export default function DialogSureSaveCampaign() {
  const dispatch = useAppDispatch()
  const {showAlertSureSaveCampaign, usersChose} = useAppSelector((state: RootState) => state.officeCampaign)
  const closeDialog = () => dispatch(showAlertSureSaveCampaignAct(false));
  return (
    <Dialog open={showAlertSureSaveCampaign} onClose={closeDialog}>
      <IconButton onClick={closeDialog} className="closeDialog"> <Close/> </IconButton>
      <DialogTitle> Confirmar </DialogTitle>
      <DialogContent> Estas seguro de guardar la campaña con la configuracion actual? no podras modificar los usuarios en la campaña. </DialogContent>
      <DialogActions sx={{paddingRight: 2, paddingBottom: 2}}>
          <Button variant="contained" color="error" onClick={() => dispatch(showAlertSureSaveCampaignAct(false))}> Cancelar </Button>
          <Button variant="contained" color="success" onClick={() => dispatch(addUsersToCampaignThunk({users: usersChose}))}> Guardar </Button>
      </DialogActions>
    </Dialog>
  )

}