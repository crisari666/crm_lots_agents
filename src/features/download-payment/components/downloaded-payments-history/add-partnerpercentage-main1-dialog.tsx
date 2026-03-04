import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import AppAutoComplete, { AppAutocompleteOption } from "../../../../app/components/app-autocomplete";
import { useEffect, useState } from "react";
import { addPartnerAct, showModalAddPatrnerPercentageAct } from "../../business-logic/download-payment-history.slice";
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice";
export default function DialogPartnersMain1() {
  const dispatch = useAppDispatch()
  const [partner, setPartner] = useState<AppAutocompleteOption>()
  const { usersOriginal, gotUsers } = useAppSelector((state) => state.users) 
  const { showModalAddPartner } = useAppSelector((state) => state.downloadPaysHistory) 

  const options: AppAutocompleteOption[] = usersOriginal.map((u) => ({name: u.email, _id: u._id})) as AppAutocompleteOption[]

  const closeDialog = () => dispatch(showModalAddPatrnerPercentageAct(false))

  const addUserToPartners = () => {
    if(partner !== undefined) {
      dispatch(addPartnerAct(partner!))
      closeDialog()
    }
  }

  useEffect(() => {
    if(!gotUsers) {
      dispatch(fetchUsersThunk({enable: true}))
    }
  }, [])
  return (
    <>


      <Dialog open={showModalAddPartner}>
        <IconButton onCanPlayThrough={closeDialog} className="closeDialog"> <Close /></IconButton>
        <DialogTitle> Seleccionar usuario para porcentaje de socio </DialogTitle>
        <DialogContent sx={{minWidth: 500}}>
            <AppAutoComplete 
              name='partner'
              value={partner}
              options={options} 
              label="Usuario" onChange={(d) => setPartner(d.val)}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={addUserToPartners}>ACEPTAR</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}