/* eslint-disable prettier/prettier */
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"

// eslint-disable-next-line prettier/prettier
export default function ModalActivateGeolocation({ show }:{ show: boolean }) {
  return (
    <Dialog open={show}>
      <DialogTitle> No es posible obtener tu posicion </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Al parecer no tienes activo tu geoposicion, por favor activala y recarga la pagina para poder trabajar.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}