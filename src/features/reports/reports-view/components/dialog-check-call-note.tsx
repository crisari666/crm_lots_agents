import { Close, Save } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, ImageList, Switch } from "@mui/material";
import ImgItemHandler from "../../../../app/components/img-item-handler";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { auditLogSituationThunk, setDialogValidateCallNoteAct, updateCheckCallNoteInputAct } from "../reports.slice";

export default function DialogCheckCallNote() {
  const urlApi = import.meta.env.VITE_API_URL_UPLOADS
  const dispatch = useAppDispatch()
  const {  dialogValidateCallNote } = useAppSelector((state) => state.reports)

  const onClose = () => dispatch(setDialogValidateCallNoteAct(undefined))

  const validateCallNote = () => {
    if(dialogValidateCallNote !== undefined){
      dispatch(auditLogSituationThunk({situationLogId: dialogValidateCallNote!.situationLogId, checked: dialogValidateCallNote!.check}))
    }
  }
  return (
    <Dialog open={dialogValidateCallNote !== undefined} onClose={onClose}>
      <IconButton className="closeDialog" onClick={onClose}> <Close/> </IconButton>
      {dialogValidateCallNote !== undefined && <>
        <DialogTitle>Validar Nota de llamadas</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={8}>
              <FormControlLabel label="Validar imagen" control={<Switch checked={dialogValidateCallNote!.check} onChange={(e, c) => dispatch(updateCheckCallNoteInputAct(c))}/>}/>
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined" fullWidth onClick={validateCallNote}> <Save/> </Button>
            </Grid>
          </Grid>
          <Box>
          </Box>
          <ImageList rowHeight={800} cols={1} variant="masonry" >
            <ImgItemHandler
              showButtons={false}
              src={`${urlApi}${dialogValidateCallNote!.image}?w=600&h=600&fit=crop&auto=format&dpr=2 2x`} 
              srcSet={`${urlApi}${dialogValidateCallNote!.image}?w=600&h=600&fit=crop&auto=format`}
            />
          </ImageList>
        </DialogContent>
      </> 
      }
    </Dialog>
  )
}