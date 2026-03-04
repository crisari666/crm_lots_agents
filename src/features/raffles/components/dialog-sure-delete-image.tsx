import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

export default function DialgoSureDeleteImg({show, onConfirm= () => {}, onCancel = () =>{}} : {show: boolean, onConfirm?: () => void, onCancel?: () => void}) {

  return (
    <Dialog open={show}>
        <DialogTitle>Confirmar</DialogTitle>
        <DialogContent>
          <DialogContentText>Esta seguro que deseas eliminar esta imagen?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onCancel}> CANCELAR </Button>
          <Button variant="contained" color="error" onClick={onConfirm}> ELIMINAR </Button>
        </DialogActions>
    </Dialog>
  )
}