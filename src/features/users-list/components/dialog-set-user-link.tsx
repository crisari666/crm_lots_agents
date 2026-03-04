import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Close } from "@mui/icons-material";
import { setDialogSetUserLinkAct, setUserLinkThunk } from "../slice/user-list.slice";
import AppTextField from "../../../app/components/app-textfield";

export default function DialogSetUserLink () {
  const {dialogSetUserLink} = useAppSelector((state) => state.users) 
  const dispatch = useAppDispatch()
  const closeModal = () => dispatch(setDialogSetUserLinkAct(undefined))
  return (
    <>
      <Dialog open={dialogSetUserLink !== undefined}>
        <IconButton className="closeDialog" onClick={closeModal}> <Close/> </IconButton>
        {dialogSetUserLink !== undefined &&  <>
          <DialogTitle>Editar Link de {dialogSetUserLink!.name}</DialogTitle>
          <DialogContent sx={{minWidth: "500px"}}>
            <AppTextField 
              label="link" name="link" value={dialogSetUserLink.link}
              onChange={(e) => dispatch(setDialogSetUserLinkAct({...dialogSetUserLink, link: e.val}))}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="error" onClick={closeModal}> CANCELR </Button>
            <Button variant="outlined" color="success" onClick={() => dispatch(setUserLinkThunk({link: dialogSetUserLink.link, userId: dialogSetUserLink.userId}))}> GUARDAR </Button>
          </DialogActions>
        </>}
      </Dialog>
    </>
  )
}