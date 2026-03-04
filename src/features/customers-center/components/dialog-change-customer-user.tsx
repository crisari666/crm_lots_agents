import { Close } from "@mui/icons-material";
import { Dialog, IconButton, DialogTitle, DialogContent, Grid, DialogActions, Button, Typography } from "@mui/material";
import AppSelector from "../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeInputOfficeCustomerAct, changeInputUserCustomerAct, setDialogChangeCustomerUserAct, setUsetToCustomerThunk } from "../customer-center.slice";
import { OfficeInterface } from "../../../app/models/office.inteface";

export default function DialogChangeCustomerUser() {
  const dispatch = useAppDispatch() 
  const {offices} = useAppSelector(state => state.offices)
  const {usersOriginal} = useAppSelector(state => state.users)
  const { dialogChangeCustomerUser } = useAppSelector(state => state.customerCenter)

  const closeDialog = () => dispatch(setDialogChangeCustomerUserAct(undefined))

  const changeInputOffice = (data : {name: string, val: string}) => {
    dispatch(changeInputOfficeCustomerAct(data.val.trim()));
  }
  
  const changeInputUser = (data : {name: string, val: string}) => {
    dispatch(changeInputUserCustomerAct(data.val.trim()));
  }

  const setUser = () => {
    if(dialogChangeCustomerUser !== undefined && dialogChangeCustomerUser.officeId !== "" && dialogChangeCustomerUser.newUserId !== "") {
      dispatch(setUsetToCustomerThunk({customerId: dialogChangeCustomerUser.customerId, userId: dialogChangeCustomerUser.newUserId, officeId: dialogChangeCustomerUser.officeId}))
    }
  }
  return (
    <>
      <Dialog open={dialogChangeCustomerUser !== undefined}>
        <IconButton className="closeDialog" onClick={closeDialog}> <Close/> </IconButton>
        {dialogChangeCustomerUser !== undefined && <>
          <DialogTitle sx={{marginRight: 4}}> Cambiar usuario cliente <strong>{dialogChangeCustomerUser.customerName}</strong></DialogTitle>
          <DialogContent>
            <Typography variant="h6">Asignacion actual: {dialogChangeCustomerUser.currentUserName}</Typography>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <AppSelector options={offices} value={dialogChangeCustomerUser.officeId} propOptionName="name" name="office" onChange={changeInputOffice}/>
              </Grid>
              <Grid item xs={12}>
              <AppSelector options={usersOriginal.filter((u) => u.office !== null && (u.office as OfficeInterface)._id!  === dialogChangeCustomerUser.officeId)} value={dialogChangeCustomerUser.newUserId} propOptionName="lastName" name="office" onChange={changeInputUser}/>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button size="small" color="error" variant="outlined" onClick={closeDialog}> CANCELAR</Button>
            <Button size="small" color="success" variant="outlined" onClick={setUser}> ACTUALIZAR</Button>
          </DialogActions>
        </>}
      </Dialog>
    </>
  )
}