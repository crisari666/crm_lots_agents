import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { Close, UploadFile } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Image, ImageUploader } from "@martinmaffei95/image-uploader";
import { setDialogUploadUserDocAction, uploadUserDocThunk } from "../handle-user.slice";
import { useParams } from "react-router-dom";


export default function DialogUploadUserDocument(){
  
  const dispatch = useAppDispatch()
  const { dialogUploadUserDoc } = useAppSelector((state: RootState) => state.handleUser)
  const [values, setValues] = useState<{ [name: string]: Image[] }>();
  const {userId} = useParams()
  const setFieldValue = (name: string, value: Image[]) => {
    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const uploadFiles = () => {
    dispatch(uploadUserDocThunk({userId: userId!, documentType: dialogUploadUserDoc!.documentType, file: values!["raffleImgs"]}))
    setValues(undefined)
  }

  const closeDialog = () => {
    dispatch(setDialogUploadUserDocAction(undefined))
  }

  useEffect(() => {
    console.log(values);
  }, [values])
  return(
    <Dialog open={dialogUploadUserDoc !== undefined}>
      <DialogTitle >Agregar imagenes</DialogTitle>
      <IconButton size="small" onClick={closeDialog} sx={{position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500]}}> <Close/> </IconButton>
      {dialogUploadUserDoc !== undefined &&  <DialogContent sx={{minWidth: "600px"}}>
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
      </DialogContent>}
    </Dialog>
  )
}