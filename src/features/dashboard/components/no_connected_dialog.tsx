import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function NotConnectedDialog() {
  return (
    <Dialog
      open={true}
    >
      <DialogTitle>Not Connected</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You are not connected to the server, please check your internet connection.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}