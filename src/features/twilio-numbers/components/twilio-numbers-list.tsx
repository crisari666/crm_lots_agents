import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { useEffect, useMemo } from "react";
import { changeUserToRelToNumberAct, displayRelUserToNumberFormAct, getEnableUsersThunk, getTwilioNumbersThunk, openTwilioFormForEditAct } from "../slice/twilio-numbers.slice"
import { Edit, Person } from "@mui/icons-material"
import { TwilioNumberType } from "../../../app/models/twilio-number.type";

function filterTwilioNumbers(
  list: TwilioNumberType[],
  filters: { officeId: string; search: string }
): TwilioNumberType[] {
  const { officeId, search } = filters
  if (!officeId && !search.trim()) return list
  const q = search.trim().toLowerCase()
  return list.filter((row) => {
    if (officeId && row.user?.office !== officeId) return false
    if (!q) return true
    const userName = (row.user?.name ?? "").toLowerCase()
    const userEmail = (row.user?.email ?? "").toLowerCase()
    const number = (row.number ?? "").toLowerCase()
    const pnid = (row.PNID ?? "").toLowerCase()
    const friendlyNumber = (row.friendlyNumber ?? "").toLowerCase()
    return (
      userName.includes(q) ||
      userEmail.includes(q) ||
      number.includes(q) ||
      pnid.includes(q) ||
      friendlyNumber.includes(q)
    )
  })
}

export default function TwilioNumbersList() {
  const dispatch = useAppDispatch()
  const { twilioNumbers, loading, twilioListFilter } = useAppSelector((state) => state.twilioNumbers)

  const filteredList = useMemo(
    () => filterTwilioNumbers(twilioNumbers, twilioListFilter),
    [twilioNumbers, twilioListFilter]
  )

  useEffect(() => {
    dispatch(getTwilioNumbersThunk())
    dispatch(getEnableUsersThunk())
  }, [])

  const displayRelUserToNumberForm = () => dispatch(displayRelUserToNumberFormAct(true))

  return (
    <Paper sx={{ padding: 1, marginBottom: 0.5 }}>
      <LoadingIndicator open={loading}/>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell> PNID </TableCell>
              <TableCell> Number </TableCell>
              <TableCell> Number friendly </TableCell>
              <TableCell> User </TableCell>
              <TableCell> Options </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.map((twilioNumber) => (
              <TableRow key={`tw_${twilioNumber._id}`}>
                <TableCell> {twilioNumber.PNID} </TableCell>
                <TableCell> {twilioNumber.number} </TableCell>
                <TableCell> {twilioNumber.friendlyNumber} </TableCell>
                <TableCell> {twilioNumber.user?.email}  
                  <IconButton 
                    size="small"
                    onClick={() => {
                      dispatch(displayRelUserToNumberForm())
                      dispatch(changeUserToRelToNumberAct({
                        userId: twilioNumber.user?._id,
                        twilioNumber: twilioNumber.number
                      }))
                    }}
                    color="secondary"
                    > <Person fontSize="small"/> </IconButton> 
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => dispatch(openTwilioFormForEditAct({
                      PNID: twilioNumber.PNID,
                      number: twilioNumber.number,
                      friendlyNumber: twilioNumber.friendlyNumber
                    }))}
                    color="primary"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}