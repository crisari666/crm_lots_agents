import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, ImageList } from "@mui/material";
import ImgItemHandler from "./img-item-handler";

export default function ImagePreviewDialog({image, onClose =() =>{}} : {image: string, onClose?: () => void}) {
  const urlApi = import.meta.env.VITE_API_URL_UPLOADS
  return (
    <Dialog open={image !== ""} onClose={onClose}>
      <IconButton className="closeDialog" onClick={onClose}> <Close/> </IconButton>
      <DialogTitle>Visor de Image</DialogTitle>
      <DialogContent>
        <ImageList rowHeight={800} cols={1} variant="masonry" >
          <ImgItemHandler
            showButtons={false}
            src={`${urlApi}uploads/fee-payments/${image}?w=600&h=600&fit=crop&auto=format&dpr=2 2x`} 
            srcSet={`${urlApi}uploads/fee-payments/${image}?w=600&h=600&fit=crop&auto=format`}
          />
        </ImageList>
      </DialogContent>
    </Dialog>
  )
}