import { Image, ImageUploader } from "@martinmaffei95/image-uploader";
import { Close } from "@mui/icons-material";
import { Dialog, IconButton, DialogTitle, DialogContent, Grid, DialogActions, Button } from "@mui/material";
import { addCustomerLogThunk, setShowDialogImageSituationAct } from "../customer-view.slice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SituationImageDialog() {
  const { showDialogImageSituation, formNewSituation } = useAppSelector((state: RootState) => state.customer)
  const dispatch = useAppDispatch() 
  const {customerId} = useParams()

  const [images, setImage] = useState<{ [name: string]: Image[] }>();
  const setFieldImages = (name: string, value: Image[]) => {
    setImage((state) => ({
      ...state,
      [name]: value,
    }));
  };
  useEffect(()=> {
    //console.log({images});
  }, [images])

  const logCustomerSituation = () => {
    if(customerId !== undefined && images !== undefined){
      dispatch(addCustomerLogThunk({customerId, customerLogForm: formNewSituation, image: images!["image"]}))
    }
  }

  return (
    <>
      <Dialog open={showDialogImageSituation}>
        <IconButton className="closeDialog" onClick={() => dispatch(setShowDialogImageSituationAct(false))}> <Close/> </IconButton>
        {showDialogImageSituation === true && <>
          <DialogTitle>Anexar imagen de actualizacion de situacion</DialogTitle>
          <DialogContent>
              <Grid container>
                <Grid item xs={12}>
                  <ImageUploader 
        
                    config={{
                      colorScheme: "base",

                      inputConfig: {
                        multiple: false,
                        fieldName: "image",
                        setFieldValue: setFieldImages,
                      }
                    }}
                  />
                </Grid>
              </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              sx={{marginRight: 2, marginBottom: 2}} 
              variant="contained" 
              disabled={!(images !== undefined && images!["image"].length > 0)} 
              onClick={logCustomerSituation}
              > 
              AGREGAR SITUACION
            </Button>
          </DialogActions>
        </>
        }
      </Dialog>
    </>
  )
}