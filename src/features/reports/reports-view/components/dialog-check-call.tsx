import { Close, Save } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, ImageList, Switch } from "@mui/material";
import ImgItemHandler from "../../../../app/components/img-item-handler";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { auditCallThunk, setDialogCheckCallAct, updateCheckCallInputAct } from "../reports.slice";

export default function DialogCheckCall() {
  const urlApi = import.meta.env.VITE_API_URL_UPLOADS
  const dispatch = useAppDispatch()
  const {  dialogValidateCall } = useAppSelector((state) => state.reports)

  const onClose = () => dispatch(setDialogCheckCallAct(undefined))

  const validateCall = () => {
    if(dialogValidateCall !== undefined){
      dispatch(auditCallThunk({callId: dialogValidateCall!.callId, checked: dialogValidateCall!.check}))
    }
  }
  return (
    <Dialog open={dialogValidateCall !== undefined} onClose={onClose}>
      <IconButton className="closeDialog" onClick={onClose}> <Close/> </IconButton>
      {dialogValidateCall !== undefined && <>
        <DialogTitle>Validar llamada</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={8}>
              <FormControlLabel label="Validar imagen" control={<Switch checked={dialogValidateCall!.check} onChange={(e, c) => dispatch(updateCheckCallInputAct(c))}/>}/>
            </Grid>
            <Grid item xs={4}>
              <Button variant="outlined" fullWidth onClick={validateCall}> <Save/> </Button>
            </Grid>
          </Grid>
          <Box>
          </Box>
          <ImageList rowHeight={800} cols={1} variant="masonry" >
            <ImgItemHandler
              showButtons={false}
              src={`${urlApi}${dialogValidateCall!.image}?w=600&h=600&fit=crop&auto=format&dpr=2 2x`} 
              srcSet={`${urlApi}${dialogValidateCall!.image}?w=600&h=600&fit=crop&auto=format`}
            />
          </ImageList>
        </DialogContent>
      </> 
      }
    </Dialog>
  )
}