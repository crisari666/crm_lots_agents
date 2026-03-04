import { Box, Button, Card, Divider, ImageList } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { AddAPhoto } from "@mui/icons-material";
import { useAppDispatch } from "../../../app/hooks";
import { removeRaffleImgThunk, showDialogAddImageAct } from "../handle-raffle.slice";
import DialogAddRaffleImg from "./dialog-add-image-raffle";
import ImgItemHandler from "../../../app/components/img-item-handler";
import { useState } from "react";
import DialgoSureDeleteImg from "./dialog-sure-delete-image";

export default function RaffleImagesHandler (){
  const dispatch = useAppDispatch()
  const [imgToDelete, setImgToDelete] = useState<string>("")

  const { currentRaffle } = useSelector((state: RootState) => state.raffle)
  const urlApi = import.meta.env.VITE_API_URL_UPLOADS
  
  const deleteImg = () => {
    if(imgToDelete !== "") {
      dispatch(removeRaffleImgThunk({raffleId: currentRaffle?._id!, img: imgToDelete}))
      setImgToDelete("")
    }
  }

  return(
    <>
      {currentRaffle !== undefined && <Card sx={{padding: "5px"}}>
        <DialogAddRaffleImg />
        <DialgoSureDeleteImg show={imgToDelete !== ""} onCancel={() => setImgToDelete("")} onConfirm={deleteImg}/>
        <Box padding={1}>
          <Divider sx={{marginBlock: "10px"}} />
          <Button variant="contained" onClick={() => dispatch(showDialogAddImageAct(true))}>AGREGAR IMAGENES  <AddAPhoto/> </Button>
          <Divider sx={{marginBlock: "10px"}} />
          <ImageList rowHeight={164} cols={3} variant="masonry">
            {currentRaffle.images.map((el, i) => {              
              return <ImgItemHandler key={el}
                onClickDelete={() => setImgToDelete(el)}

                src={`${urlApi}uploads/raffles/${el}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`} 
                srcSet={`${urlApi}uploads/raffles/${el}?w=164&h=164&fit=crop&auto=format`}
              />
            })}
            {/* {currentRaffle.images.map((img, index) => {
              return (<ImageListItem>)
            })} */}
          </ImageList>
        </Box>
      </Card>
      }
    </>
  )
}