import { Button, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { Close } from "@mui/icons-material";
import { addCustomerThunk, setShowCustomerAct, updateInputNewCustomerAct } from "../customers.slice";
import AppTextField from "../../../../app/components/app-textfield";
import NewCustomerOfficeSelector from "./new-customer-office-selector";
import NewCustomerUserSelector from "./new-customer-user-selector";

export default function CreateCustomerDialog() {
  const { showFormCustomer, newCustomerForm } = useAppSelector((state: RootState) => state.customers)
  const dispatch = useAppDispatch()
  const submitForm = (e: any) => {
    e.preventDefault()
    dispatch(addCustomerThunk({customerForm: newCustomerForm}))
  }
  const changeInput = ({name, val} : {name?: string, val: string}) => {
    dispatch(updateInputNewCustomerAct({key: name!.toString(), value: val}))
  }
  return (
    <Dialog open={showFormCustomer}>
      <IconButton sx={{position: "absolute", top: 10, right: 10}} onClick={() => dispatch(setShowCustomerAct(false))}> <Close/> </IconButton>
      <DialogTitle> Add Number </DialogTitle>
      <DialogContent sx={{minWidth: "600px"}}>
          <form onSubmit={submitForm}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppTextField required label="Phone" value={newCustomerForm.phone} name="phone" onChange={changeInput}/>
              </Grid>
              <Grid item xs={12}>
                <AppTextField required label="Name" value={newCustomerForm.name} name="name" onChange={changeInput}/>
              </Grid>
              <Grid item xs={12}>
                <AppTextField  label="Last Name" value={newCustomerForm.lastName} name="lastName" onChange={changeInput}/>
              </Grid>
              <Grid item xs={12}>
                <AppTextField  label="Email" value={newCustomerForm.email} name="email" onChange={changeInput}/>
              </Grid>
              <Divider className="divider"/>
              <Grid item xs={12}>
                <NewCustomerOfficeSelector/>
              </Grid>
              <Grid item xs={12}>
                <NewCustomerUserSelector/>
              </Grid>
              <Divider className="divider"/>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth color="primary" type="submit"> SAVE </Button>
              </Grid>
            </Grid>

          </form>
      </DialogContent>
    </Dialog>
  )
}