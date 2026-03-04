import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { showResumeDialogAct } from "../../business-logic/download-payment-history.slice";
import { numberToCurrency } from "../../../../utils/numbers.utils";
import { themeCondense } from "../../../../app/themes/theme-condense";
import { useCallback, useEffect, useState } from "react";
import AppSelector from "../../../../app/components/app-select";
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice";
export default function UserResumeDownloadedPaysDialog() {
  const dispatch = useAppDispatch()
  const [office, setOffice] = useState('')
  const { showResumeDialog, usersResume } = useAppSelector((state) => state.downloadPaysHistory) 
  const { gotOffices, offices } = useAppSelector((state) => state.offices) 

  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [])
  

  const closeDialog = () => dispatch(showResumeDialogAct(false))

  const filteredUsers = useCallback(() => {
    if(office === '') return usersResume
    const filter = Object.keys(usersResume).reduce((acc: any, userId) => {
      const u = usersResume[userId]
      if(u.office === office) {
        acc[userId] = usersResume[userId]
      }
      return acc
    }, {})

    return filter
  }, [office, usersResume])

  const officeName = offices.find((o) => o._id === office)?.name ?? ''

  const handleCopyForSheet = useCallback(async () => {
    const filtered = filteredUsers()
    const userIds = Object.keys(filtered)
    const totalSum = userIds.reduce((acc, id) => acc + filtered[id].total, 0)
    const lines = [
      `${officeName}\tNombre\tTotal`,
      ...userIds.map((userId) => `\t${filtered[userId].email}\t${numberToCurrency(filtered[userId].total)}`),
      `\t\t${numberToCurrency(totalSum)}`
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
  }, [officeName, filteredUsers])

  return (
    <>
      <Dialog open={showResumeDialog}>
        <IconButton onClick={closeDialog} className="closeDialog"> <Close /></IconButton>
        <DialogTitle> Resumen de usuarios </DialogTitle>
        <DialogContent sx={{minWidth: 500}}>
          <AppSelector value={office} options={offices.map((el, i) => ({_id: el._id!, name: el.name!}))} label="Sede" onChange={({name, val}) => setOffice(val)}/>
          <ThemeProvider theme={themeCondense}>
            <Tooltip title="Click to copy table (office, names, totals) for spreadsheet">
              <Table
                onClick={handleCopyForSheet}
                sx={{ cursor: 'pointer', '& tbody tr:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(filteredUsers()).map((userId) =>
                    <TableRow key={userId}>
                      <TableCell>{usersResume[userId].email}</TableCell>
                      <TableCell align="right">{numberToCurrency(usersResume[userId].total)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Tooltip>
          </ThemeProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}