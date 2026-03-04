import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";

export default function DialogRaffleError() {
  const { error } = useAppSelector((state: RootState) => state.raffle)
  return (
    <Dialog open={error != ""}>
        <DialogTitle> Error </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {error}
          </Typography>
        </DialogContent>
    </Dialog>

  )
}