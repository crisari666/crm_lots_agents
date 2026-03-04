import { Image, ImageUploader } from "@martinmaffei95/image-uploader";
import { Close, UploadFile } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, ImageList, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { PrizeInterface } from "../../../app/models/prize-inteface";
import ImgItemHandler from "../../../app/components/img-item-handler";
import DialgoSureDeleteImg from "./dialog-sure-delete-image";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { removePrizeImgThunk, uploadPrizeImgsThunk } from "../handle-raffle.slice";
import { RootState } from "../../../app/store";

export default function DialogHandlePrizeImgs({show, onClose = () => {}, onConfirm = () => {}, prize} : {show: boolean, onClose?: () => void, onConfirm?: () => void, prize?: PrizeInterface }) {
  const dispatch = useAppDispatch()
  const {prizeForImgs} = useAppSelector((state: RootState ) => state.raffle)
  const [imgs, setImages] = useState<{ [name: string]: Image[] }>();
  const [imgToDelete, setImgToDelete] = useState<string>("");
  const setFieldValue = (name: string, value: Image[]) => {
    setImages((state) => ({
      ...state,
      [name]: value,
    }));
  };
  
  useEffect(() => {
    setImgToDelete("")
    setImages({"prizeImgs": []})
  },[prizeForImgs])
  const uploadPrizeImg = ()=> {
    dispatch(uploadPrizeImgsThunk({files: imgs!["prizeImgs"], prizeId: prize!._id!}))
    setImages({"prizeImgs": []})
  }
  const urlApi = import.meta.env.VITE_API_URL_UPLOADS
  return(
    <Dialog open={show}>
      <DialogTitle>Imagenes de premio </DialogTitle>
      <IconButton color="error" sx={{position: "absolute", top: 10, right: 8}} onClick={onClose}> <Close /> </IconButton>
      {prize !== undefined && <DialogContent>
        <DialgoSureDeleteImg show={imgToDelete !== ""} onCancel={() => setImgToDelete("")} onConfirm={() => dispatch(removePrizeImgThunk({img: imgToDelete, prizeId: prize!._id!}))}/>
        <Typography variant="h6">Imagenes</Typography>
        <ImageList rowHeight={164} cols={3} variant="masonry">
            {prize.images.map((el, i) => {              
              return <ImgItemHandler key={el}
                onClickDelete={() => setImgToDelete(el)}
                src={`${urlApi}uploads/prizes/${el}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`} 
                srcSet={`${urlApi}uploads/prizes/${el}?w=164&h=164&fit=crop&auto=format`}
              />
            })}
          </ImageList>
        <Divider />
        <Typography variant="h6">Agregar Imagenes</Typography>
        <ImageUploader 
          config={{
            colorScheme: "purple",

            inputConfig: {
              multiple: true,
              fieldName: "prizeImgs",
              setFieldValue,
            }
          }}
        />
      </DialogContent>}
        {imgs !== undefined && imgs!["prizeImgs"].length > 0 && <DialogActions> 
          <Button 
            onClick={uploadPrizeImg}
            variant="contained" sx={{marginRight: 3, marginBottom: 3}} color="success"
          >SUBIR <UploadFile/></Button> 
        </DialogActions>}
    </Dialog>
  )
}