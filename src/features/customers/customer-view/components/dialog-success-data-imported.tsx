import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { closeDialogSuccessDataImportedAct } from "../../import-numbers/import-numbers.slice"
import { Check, Close } from "@mui/icons-material"

export default function DialogSuccessDataImported() {
  const dispatch = useAppDispatch()
  const {successDataImported} = useAppSelector((state: RootState) => state.importNumbers)
  
  const closeDialog = () => dispatch(closeDialogSuccessDataImportedAct())
  return(
    <>
      <Dialog open={successDataImported} onClose={closeDialog}>
        <IconButton className="closeDialog" onClick={closeDialog}> <Close/> </IconButton>
        <DialogTitle>Operacion exitosa <Check color="success"/></DialogTitle>
        <DialogContent>
          Se han sincronizado los datos correctamente
        </DialogContent>
      </Dialog>
    </>
  )
}