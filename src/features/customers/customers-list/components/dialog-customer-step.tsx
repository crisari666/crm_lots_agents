import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { changeSelectStepCustomerAct, setCustomerStepThunk, setDialogCustomerStepAct } from "../customers.slice";
import { Close } from "@mui/icons-material";
import AppSelector from "../../../../app/components/app-select";
import { useEffect } from "react";
import { getStepsThunk } from "../../../steps/steps.slice";

export default function DialogCustomerStep() {
  const dispatch = useAppDispatch();
  const { dialogCustomerStep } = useAppSelector((state: RootState) => state.customers);
  const { steps } = useAppSelector((state: RootState) => state.steps);
  const closeDialog = () => dispatch(setDialogCustomerStepAct(undefined))
  useEffect(() => {
    dispatch(getStepsThunk())
  }, [])
  return (
    <>
      <Dialog open={dialogCustomerStep !== undefined}>
        <IconButton className="closeDialog" onClick={closeDialog}> <Close/> </IconButton>
        {dialogCustomerStep !== undefined && <>
          <DialogTitle sx={{marginRight: 4}}> Definir paso cliente <strong>{dialogCustomerStep.name}</strong></DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <AppSelector options={steps} value={dialogCustomerStep.stepId} propOptionName="title" onChange={(val) => dispatch(changeSelectStepCustomerAct(val.val))}/>
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button size="small" color="error" variant="outlined"> CANCELAR</Button>
            <Button size="small" color="success" variant="outlined" onClick={() => dispatch(setCustomerStepThunk({customerId: dialogCustomerStep.customerId, stepId:dialogCustomerStep.stepId}))}> ACTUALIZAR</Button>
          </DialogActions>
        </>}
      </Dialog>
    </>
  )
}