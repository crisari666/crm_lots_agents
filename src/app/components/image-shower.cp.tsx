import { Close } from "@mui/icons-material";
import { IconButton, Modal } from "@mui/material";

const urlApi = import.meta.env.VITE_API_URL_UPLOADS
export default function ImageShowerCP({imgUrl= undefined, onClose = () => {}} : {imgUrl?: string, onClose?: () => void}) {
  return (
    <Modal open={imgUrl !== undefined} sx={{display: 'flex', justifyContent: "center", alignItems: "center"}} >
      <>
        <IconButton className="closeDialog" onClick={onClose}> <Close/> </IconButton>
        <img src={`${urlApi}${imgUrl}`} alt="Imagen" style={{maxWidth: "100%", maxHeight:  "100%"}}/>
      </>
    </Modal>
  )
}