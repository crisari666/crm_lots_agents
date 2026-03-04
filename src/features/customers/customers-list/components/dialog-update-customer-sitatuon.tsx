import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { Check, Close, QuestionMark } from "@mui/icons-material";
import AppSelector from "../../../../app/components/app-select";
import { useEffect } from "react";
import { getAllSituationsThunk } from "../../../customer-situations/client-situations/client-situations-slice";
import { changeCustomerSituationAct, changeDateCustomerSituationAct, checkCodeThunk, setDialogUpdateCustomerSituationAct, updateCustomerCodeInputAct, updateCustomerSituationThunk } from "../customers.slice";
import AppTextField from "../../../../app/components/app-textfield";
import { getStepsThunk } from "../../../steps/steps.slice";

export default function DialogUpdateCustomerSituation() {
  const {dialogUpdateCustomerSituation} = useAppSelector((state: RootState) => state.customers)
  const {situations, situationsGot,} = useAppSelector((state: RootState) => state.situations)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(!situationsGot) dispatch(getAllSituationsThunk())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getStepsThunk())
  }, [])

  const saveCustomerSituation = () => {
    if(dialogUpdateCustomerSituation === undefined) return
    if(dialogUpdateCustomerSituation.date === "") return
    dispatch(updateCustomerSituationThunk({customerId: dialogUpdateCustomerSituation!._id, situationId: dialogUpdateCustomerSituation!.newSitutation, code: dialogUpdateCustomerSituation!.code, date: dialogUpdateCustomerSituation!.date}))
  }

  const checkFormatCode = (code?: string): boolean => {
    const regex = /^[A-Za-z]{3}\d{10}$/;
    return regex.test(code ?? dialogUpdateCustomerSituation!.code)
  }

  const changeCodeInput = (code: string) => {
    dispatch(updateCustomerCodeInputAct(code))
    if(code.length === 13 && checkFormatCode(code)){
      dispatch(checkCodeThunk(code))
    }
  }

  //const change
  
  return(
    <>
      <Dialog open={dialogUpdateCustomerSituation !== undefined}>
        <IconButton 
          onClick={() => dispatch(setDialogUpdateCustomerSituationAct(undefined))}
          className="closeDialog"> <Close/> </IconButton>
        <DialogTitle sx={{marginRight: 4}}>Actualizar situacion de  {dialogUpdateCustomerSituation?.name}</DialogTitle>

        {dialogUpdateCustomerSituation !== undefined && <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppSelector propOptionName="title" options={situations.filter((v) => !v.callNote)} label="Situacion" name="situation"  onChange={(data) => dispatch(changeCustomerSituationAct(data.val))} value={dialogUpdateCustomerSituation?.newSitutation}/>
            </Grid>
            <Grid item xs={12}>
              <AppTextField  label="Date Situaation" type="date" name="date-situation"  onChange={(data) => dispatch(changeDateCustomerSituationAct(data.val))} value={dialogUpdateCustomerSituation?.date}/>
            </Grid>
            <Grid item xs={12}>
              <AppTextField label="Codigo" name="code"  
                inputProps={{maxLength: 13}}
                onChange={(data) => changeCodeInput(data.val)} 
                endComponent={
                  <>
                    {dialogUpdateCustomerSituation?.statusCode === "unknown" && <QuestionMark color="disabled" />}
                    {dialogUpdateCustomerSituation?.statusCode === "valid" && <Check color="success" />}
                    {dialogUpdateCustomerSituation?.statusCode === "invalid" && <Close color="error"/>}
                    {dialogUpdateCustomerSituation?.statusCode === "checking" && <CircularProgress size={18} color="warning"/>}
                  </>
                }
                value={dialogUpdateCustomerSituation?.code} error="Formato invalido" 
                hasError={!checkFormatCode()}/>
            </Grid>
          </Grid>
        </DialogContent>}
        <DialogActions sx={{paddingRight: 3, paddingBottom: 3}}>
          <Button variant="contained" 
            disabled={
              !((dialogUpdateCustomerSituation?.statusCode === "valid" && dialogUpdateCustomerSituation?.code.length === 13) ||
              (dialogUpdateCustomerSituation?.currentCode.length === 13) || (dialogUpdateCustomerSituation?.statusCode === "unknown"))
            }  
              onClick={saveCustomerSituation}> ACTUALIZAR </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}