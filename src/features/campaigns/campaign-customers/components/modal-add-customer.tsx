import { Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Switch } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { Close } from "@mui/icons-material"
import { showModalAddCustomersAct } from "../redux/campaign-customers-slice"
import { useState } from "react"
import FormSingleLead from "./form-single-lead"

export default function ModalAddCustomers() {
  const dispatch = useAppDispatch()
  const [single, setSingle] = useState<boolean>(false)
  const { showModalAddCustomers } = useAppSelector((state) => state.campaignCustomers) 
  return (
    <>
      <Dialog  open={showModalAddCustomers}>
        <IconButton onClick={() => dispatch(showModalAddCustomersAct(false))}  className="closeDialog"> <Close/></IconButton>
        <DialogTitle> Asignar leads </DialogTitle>
        <DialogContent>
          <FormControlLabel 
            control={<Switch checked={single} onChange={(d, c) => setSingle(c)}/>}
            label={!single ? "Agregar uno" : "Agregar multiples"}
          />
          <FormSingleLead/>
        </DialogContent>
      </Dialog>
    </>
  )
}