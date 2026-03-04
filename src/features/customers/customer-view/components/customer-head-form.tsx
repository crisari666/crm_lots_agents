import { Button, Divider, Grid, Paper } from "@mui/material";
import AppTextField from "../../../../app/components/app-textfield";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import AppSelector from "../../../../app/components/app-select";
import { CalendarToday, FileUpload } from "@mui/icons-material";
import { openModalPayDocsAct, updateCustomerDataAct, updateCustomerThunk } from "../customer-view.slice";
import { useParams } from "react-router-dom";
import CustomerPayDocsModal from "./customer-pay-docs-modal";

export default function CustomerHeadForm() {
  const dispatch = useAppDispatch() 
  const customerData = useAppSelector((state: RootState) => state.customer.customerData!)
  const {currentUser} = useAppSelector((state: RootState) => state.login!)
  const {customerId} = useParams()
  const { settings } = useAppSelector((state: RootState) => state.settings)
  const allowUpdateCustomerName = settings.find((setting) => setting.title === 'allow_users_update_customer_name')?.value?.toString() === 'true'

  const updateInput = (data: {name: string, val: any}) => {
    dispatch(updateCustomerDataAct(data))
  }

  const saveCustomer = () => {  
    if(customerId !== undefined){ 
      dispatch(updateCustomerThunk({customerData, customerId}))
    }
  }

  return (
    <>
      { customerData!== undefined && <>
        <CustomerPayDocsModal/>
        <Paper sx={{marginTop: 2, padding: 2}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2 && !allowUpdateCustomerName} label="Nombre" name="name" value={customerData.name} onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2 && !allowUpdateCustomerName} label="Apellid" name="lastName" value={customerData.lastName} onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2} label="Correo" name="email" value={customerData.email} onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2} label="Telefono" name="phone" value={customerData.phone}  onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2} label="Documento" name="document" value={customerData.document} onChange={updateInput}/>
            </Grid>
            <Divider className="divider" />
          </Grid>
        </Paper>
        <Divider className="divider"/>
        <Paper sx={{marginTop: 2, padding: 2}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AppSelector  readonly={currentUser?.level! > 2} label="Pais Nacimiento" name="countryBirth" value={customerData.countryBirth?? ""} onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2} label="Codigo" name="codeId" value={customerData.codeId ?? ""} onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppSelector  readonly={currentUser?.level! > 2} label="Sexo" name="sex" value={customerData.sex ?? 0} onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2} type="date" label="Fecha Expiracion" name="cardExpiries" value={customerData.cardExpiries ?? ""} endComponent={<CalendarToday/>} onChange={updateInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField  readonly={currentUser?.level! > 2} type="date" label="Fecha residencia" name="residentSince" value={customerData.residentSince ?? ""} endComponent={<CalendarToday/>} onChange={updateInput}/>
            </Grid>
            {currentUser!.level! < 2 && <Grid item xs={12} md={6}>
              <Button variant="contained" fullWidth onClick={saveCustomer}> Actualizar </Button>
            </Grid>}
          </Grid>
          {currentUser?.level === 0 && <Grid container spacing={2} marginTop={3}>
            <Grid item xs={12}>
              <Button onClick={() => dispatch(openModalPayDocsAct(true))} endIcon={<FileUpload/>} variant="outlined">Acuerdos de Pago</Button>
            </Grid>
          </Grid>}
        </Paper>
      </>}
    </>
  )
}