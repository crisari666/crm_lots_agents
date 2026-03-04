import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { clearModalChangeOfficeStateAct, getLeadsForOfficeThunk, setLeadForUserAct, updateInputNewOfficeAct, updateUserOfficeThunk } from "../slice/user-list.slice";
import { Close } from "@mui/icons-material";
import AppSelector from "../../../app/components/app-select";

export default function ModalUpdateOffice() {
  const dispatch = useAppDispatch()
  const {modalChangeofficeState, leadsForOfficeChose} = useAppSelector((state) => state.users)
  const {offices} = useAppSelector((state) => state.offices)  
  
  const changeInputOffice = ({name, val} : {name: string, val: string}) => {
    dispatch(updateInputNewOfficeAct(val))
    dispatch(getLeadsForOfficeThunk({officeId: val}))
  }

  const changeLeadForUser = ({name, val} : {name: string, val: string}) => { 
    dispatch(setLeadForUserAct(val))
  }
  return (
    <Dialog open={modalChangeofficeState !== undefined} >
      
      {modalChangeofficeState !== undefined && <>
        <IconButton className="closeDialog" onClick={() => dispatch(clearModalChangeOfficeStateAct())}> <Close/> </IconButton>
        <DialogTitle>Actualizar oficina de {modalChangeofficeState!.userName}</DialogTitle>
        <DialogContent sx={{minWidth: "600px"}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppSelector options={offices} value={modalChangeofficeState.newOffice} label="Nueva oficina" onChange={changeInputOffice} />
            </Grid>
            <Grid item xs={12}>
              <AppSelector label="Lead" value={modalChangeofficeState.lead} options={leadsForOfficeChose} onChange={changeLeadForUser} />
            </Grid>
            <Grid item xs={12}>
              <Button 
                color="success" 
                variant='contained' 
                fullWidth 
                //disabled={modalChangeofficeState.office === modalChangeofficeState.newOffice} 
                onClick={() => dispatch(updateUserOfficeThunk({officeId: modalChangeofficeState!.newOffice, userId: modalChangeofficeState.userId, lead: modalChangeofficeState.lead }))}
              > 
                Guardar 
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </>}
      
      
    </Dialog>
  )
}