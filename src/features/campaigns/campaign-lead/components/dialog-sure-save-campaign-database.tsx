import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { addUsersToCampaignDatabaeThunk, showAlertSureSaveCampaignAct, showAlertSureSaveCampaignDatabaseAct } from "../campaign-lead.slice";
import { Close } from "@mui/icons-material";

export default function DialogSureSaveCampaignDatabase() {
  const dispatch = useAppDispatch()
  const {showAlertSureSaveCampaignDatabase, userChoseDatabase} = useAppSelector((state: RootState) => state.officeCampaign)
  const closeDialog = () => dispatch(showAlertSureSaveCampaignAct(false));
  return (
    <Dialog open={showAlertSureSaveCampaignDatabase} onClose={closeDialog}>
      <IconButton onClick={closeDialog} className="closeDialog"> <Close/> </IconButton>
      <DialogTitle> Confirmar base de datos</DialogTitle>
      <DialogContent> Estas seguro de guardar la campaña de base de datos con la configuracion actual? ya no podras modificar los usuarios en la campaña base de datos de esta semana. </DialogContent>
      <DialogActions sx={{paddingRight: 2, paddingBottom: 2}}>
          <Button variant="contained" color="error" onClick={() => dispatch(showAlertSureSaveCampaignDatabaseAct(false))}> Cancelar </Button>
          <Button variant="contained" color="success" onClick={() => dispatch(addUsersToCampaignDatabaeThunk(userChoseDatabase))}> Guardar </Button>
      </DialogActions>
    </Dialog>
  )

}