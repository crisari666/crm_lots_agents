import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { Close, UploadFile } from "@mui/icons-material";
import { showDialogAddImageAct, uploadRaffleImgsThunk } from "../handle-raffle.slice";
import { useEffect, useState } from "react";
import { Image, ImageUploader } from "@martinmaffei95/image-uploader";


export default function DialogAddRaffleImg(){
  const { showDialogAddImage, currentRaffle } = useAppSelector((state: RootState) => state.raffle)
  const dispatch = useAppDispatch()
  const [values, setValues] = useState<{ [name: string]: Image[] }>();
  const setFieldValue = (name: string, value: Image[]) => {
    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const uploadFiles = () => {
    dispatch(uploadRaffleImgsThunk({raffleId: currentRaffle?._id as string, files: values!["raffleImgs"]}))
    setValues(undefined)
  }

  useEffect(() => {
    console.log(values);
  }, [values])
  return(
    <Dialog open={showDialogAddImage}>
      <DialogTitle >Agregar imagenes</DialogTitle>
      <IconButton size="small" onClick={() => dispatch(showDialogAddImageAct(false))} sx={{position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500]}}> <Close/> </IconButton>
      <DialogContent sx={{minWidth: "600px"}}>
        <ImageUploader 
          config={{
            colorScheme: "purple",

            inputConfig: {
              multiple: true,
              fieldName: "raffleImgs",
              setFieldValue,
            }
          }}
        />
        <DialogActions>
          {values !== undefined && values!["raffleImgs"].length > 0 &&<Button variant="contained" color="success" onClick={uploadFiles}> SUBIR <UploadFile/> </Button>}
      </DialogActions>
      </DialogContent>
    </Dialog>
  )
}