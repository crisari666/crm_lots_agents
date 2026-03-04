  import { Badge, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { Close } from "@mui/icons-material";
import AppTextField from "../../../../app/components/app-textfield";
import { Image, ImageUploader } from "@martinmaffei95/image-uploader";
import { useState } from "react";
import { closeAddFeeDialogAct, pickCollectorAddFeeAct, updateFeePaymentThunk, updateInputAddFeeAct } from "../customer-view.slice";
import AppSelector from "../../../../app/components/app-select";
import { resolveColorColletor, resolveTotalPaid } from "../../../../utils/collector.utils";

export default function CustomerFeePaymentDialog() {
  const dispatch = useAppDispatch()
  const {dialogAddFee, customerData, collectors} = useAppSelector((state) => state.customer)
  const [images, setImage] = useState<{ [name: string]: Image[] }>();
  const setFieldImages = (name: string, value: Image[]) => {
    setImage((state) => ({
      ...state,
      [name]: value,
    }));
  };
  const changeInputValue = ({val} : {val: string}) => {
    dispatch(updateInputAddFeeAct(Number(val)))
  }

  const addFeePayment = () => {
    console.log({images, dialogAddFee});
    if(dialogAddFee!.value > 0 && images!["feeImage"].length > 0) {
      dispatch(updateFeePaymentThunk({customerId: customerData!._id, image: images!["feeImage"], paymentRequestId: dialogAddFee!.paymentRequest, value: dialogAddFee!.value, collector: dialogAddFee!.collector}))
    }
  }

  const collectorOptions = collectors.map((el) => {
    const week = resolveTotalPaid(el.week)
    const month = resolveTotalPaid(el.month)

    const percentageWeek = (week / el.limitWeek) * 100
    const percentageMonth = (month / el.limitMonth) * 100
    return ({
      _id: el._id, 
      name: el.title,
      CustomChildren: <>{`${el.title} `} 
        <Chip size="small" color={resolveColorColletor({percentage: percentageWeek})} label={`Semana`}/>
        <Chip size="small" color={resolveColorColletor({percentage: percentageMonth})} label={`Mes`}/>
      </>
    })
  }
  )
  
  return (
    <Dialog open={dialogAddFee !== undefined}>
      <IconButton className="closeDialog" onClick={() => dispatch(closeAddFeeDialogAct())}> <Close/> </IconButton>
      {dialogAddFee !== undefined && <>
        <DialogTitle>Agregar pago de {customerData!.name}</DialogTitle>
        <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppTextField name="value" label="Valor" type="number" inputProps={{min: 0}} onChange={changeInputValue}/>
              </Grid>
              <Grid item xs={12}>
                <AppSelector label="Cobrador" value={dialogAddFee!.collector} options={collectorOptions} onChange={({val}) => dispatch(pickCollectorAddFeeAct(val))}/>
              </Grid>
              <Grid item xs={12}>
              <ImageUploader 
                config={{
                  colorScheme: "base",
                  inputConfig: {
                    multiple: false,
                    fieldName: "feeImage",
                    setFieldValue: setFieldImages,
                  }
                }}
              />

              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button sx={{marginRight: 2, marginBottom: 2}} variant="contained" disabled={!(images !== undefined && images!["feeImage"].length > 0 && dialogAddFee.value > 0 && dialogAddFee!.collector)} onClick={addFeePayment}> 
            AGREGAR PAGO 
          </Button>
        </DialogActions>
      </>

      }
    </Dialog>
  )
}