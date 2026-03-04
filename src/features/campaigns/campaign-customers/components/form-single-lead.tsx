import { Alert, Button, Grid  } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useState } from "react";
import AppTextField from "../../../../app/components/app-textfield";
import { assignNewLeadThunk, checkCustomerExistThunk } from "../redux/campaign-customers-slice";
import { ReasonToNotAssignEnum } from "../redux/campaign-customers-state";
import { dateUTCToFriendly } from "../../../../utils/date.utils";
import { Close } from "@mui/icons-material";
export default function FormSingleLead() {
  const dispatch = useAppDispatch()
  const [name, setName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [textArea, setTextArea] = useState<string>("")
  const { usersCampaignData, customerResume,  allowToASign, reasonNotAssign } = useAppSelector((state) => state.campaignCustomers) 

  const setDataAtInputs = (value: string) => {
    if(!value && value.trim()) return
    const data = value.split("\t")
    
    setName(data[0])
    setPhone(data[1])
    setEmail(data[2])
    setDescription(data[3])
    dispatch(checkCustomerExistThunk(data[1]))
    setTextArea(value)
  }

  const asignLeadData = (e: any) => {
    e.preventDefault()
    const data = [...usersCampaignData].sort((a, b) => a.customers.length - b.customers.length)
    const first = data[0]

    dispatch(
      assignNewLeadThunk({
        customerData: {
          address: "",
          email,
          lastName: "",
          name,
          office: first.user.office._id,
          phone,
          userAssigned: first.user._id,
          customerId: customerResume.customer && customerResume.customer.length > 0 ? customerResume.customer[0]?._id : undefined,
          description
        }
      })
    )
  }

  return (
    <>

      <Grid container spacing={1} sx={{marginBottom: 2}} component={'form'} onSubmit={asignLeadData}>
        <Grid item xs={12}>
          <AppTextField autofocus={true} value={textArea}  onChange={(e) => setDataAtInputs(e.val)}/>
        </Grid>
        <Grid item xs={12}>
          <AppTextField startCompontent={<>Nombre</>} value={name} disabled readonly/>
        </Grid>
        <Grid item xs={12}>
          <AppTextField startCompontent={<>Telefono</>} value={phone} disabled readonly/>
        </Grid>
        <Grid item xs={12}>
          <AppTextField startCompontent={<>Correo</>} value={email} disabled readonly/>
        </Grid>
        <Grid item xs={12}>
          <AppTextField startCompontent={<>Descripción</>} value={description} onChange={(e) => setDescription(e.val)}/>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" disabled={!allowToASign} onClick={asignLeadData} variant="outlined"> Asignar </Button>  
        </Grid>
      </Grid>
      {!allowToASign && <>
        {reasonNotAssign === ReasonToNotAssignEnum.recentlyAssigned && <>
          <Alert icon={<Close/>} variant="outlined" color="error"> Se asigno hace menos de 3 dias, {dateUTCToFriendly(customerResume.customer[0].dateAssigned)} || {customerResume.customer[0].userAssigned[0].email}</Alert>
        </>}
        {reasonNotAssign === ReasonToNotAssignEnum.hasPayments && <Grid item xs={12}> Este cliente tiene pagos, validar en customer center </Grid>}
      </>}
    </>
  )
}