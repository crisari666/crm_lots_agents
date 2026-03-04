import { Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { Close } from "@mui/icons-material"
import { clearUsersForOfficeAct } from "../offices-list.slice"

export default function UsersForOfficeDialog() {
  const dispatch = useAppDispatch()
  const usersForOffice = useAppSelector((state: RootState) => state.offices.usersForOffice)
  return (
    <Dialog open={usersForOffice !== undefined}>
      <IconButton sx={{position: "absolute", top: 10, right: 10}} onClick={() => dispatch(clearUsersForOfficeAct())}> <Close/> </IconButton>
      <DialogTitle>Usuarios de Sede</DialogTitle>
      <DialogContent sx={{minWidth: "600px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Name </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersForOffice?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.name}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}