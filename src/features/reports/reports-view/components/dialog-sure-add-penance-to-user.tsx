import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";
import { useAppDispatch } from "../../../../app/hooks";
import { addPenanceThunk, resetPenanceAppliedAction } from "../../../../features/penance/slice/penances.slice";
import { useEffect } from "react";

export type PenanceToUser = {
  _id: string
  name: string
  customer: string
}
export default function SureAddPenanceToUserDialog({userToPenance, setUserToPenance} : {userToPenance: PenanceToUser | null, 
  setUserToPenance: (user: PenanceToUser | null) => void}) {
  const dispatch = useAppDispatch()
  const {penanceApplied} = useAppSelector((state) => state.penance) 

  useEffect(() => {
    if(penanceApplied) {
      setUserToPenance(null)
      dispatch(resetPenanceAppliedAction())
    }
  }, [penanceApplied])

  return (
    <>
      <Dialog open={Boolean(userToPenance)}>
        <IconButton className="closeDialog" onClick={() => setUserToPenance(null)}> <Close /></IconButton>
        <DialogTitle>¿Está seguro de agregar la multa a este usuario?</DialogTitle>
        <DialogContent>
          <Typography>Usuario: {userToPenance?.name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(addPenanceThunk({user: userToPenance?._id!, customer: userToPenance?.customer!}))} color="primary" variant="contained">Penalizar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}