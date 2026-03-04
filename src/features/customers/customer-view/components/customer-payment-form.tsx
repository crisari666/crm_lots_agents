import { Button, Checkbox, FormControlLabel, Grid } from "@mui/material";
import AppTextField from "../../../../app/components/app-textfield";
import AppSelector from "../../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { useEffect } from "react";
import { Save } from "@mui/icons-material";
import { addCustomerPaymentThunk, updateFormPaymentAct } from "../customer-view.slice";
import { useParams } from "react-router-dom";

export default function CustomerPaymentForm() {
  const { customerPaymentForm} = useAppSelector((state: RootState ) => state.customer)
  const { currentUser} = useAppSelector((state: RootState ) => state.login)
  const { steps } = useAppSelector((state: RootState ) => state.steps)
  const dispatch = useAppDispatch()
  const {customerId} = useParams()
  useEffect(() => {

  }, [])

  const changeInput = ({name, val} : {name?: string, val: any}) => {
    dispatch(updateFormPaymentAct({key: name!, value: val}))
  }
  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(customerPaymentForm.value > 0) {
      dispatch(addCustomerPaymentThunk({form: customerPaymentForm, customerId: customerId!}))
    } else {
      alert("El valor debe ser mayor a 0")
    }
  }
  return (
    <form onSubmit={submitForm}>
      <Grid container spacing={2}>
        {currentUser?.level === 0 &&  <Grid item xs={12}>
          <FormControlLabel control={<Checkbox name="paymentAlerted" checked={customerPaymentForm.paymentAlerted} onChange={(e, checked)=> changeInput({name: 'paymentAlerted', val: checked})} />} label="Proyeccion irregular" />
        </Grid>}
        <Grid item xs={3}>
          <AppTextField label="Fecha Estimada" name="date" type="date" onChange={changeInput} required={true} value={customerPaymentForm.date}/>
        </Grid>
        <Grid item xs={4}>
          <AppTextField label="Valor" name="value" type="number" inputProps={{min: 0}} onChange={changeInput} required={true} value={customerPaymentForm.value}/>
        </Grid>
        <Grid item xs={3}>
          <AppSelector required options={steps.map((el) => ({_id: el._id, name: el.title}))} label="Paso" name="step" value={customerPaymentForm.step} onChange={changeInput}/>
        </Grid>
        <Grid item xs={2}>
          <Button color="primary" type="submit" fullWidth variant="contained"> <Save/> </Button>
        </Grid>
      </Grid>
    </form>
  )
}