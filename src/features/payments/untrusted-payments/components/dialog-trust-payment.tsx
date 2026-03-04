import { Dialog, DialogTitle } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";

export default function DialogTrusPayment() {
  const dispatch = useAppDispatch()
  const {payForTrust} = useAppSelector((state: RootState ) => state.untrusted)
  return (
    <>
      <Dialog open={payForTrust !== undefined}>
        <DialogTitle></DialogTitle>
      </Dialog>
    </>
  )
}