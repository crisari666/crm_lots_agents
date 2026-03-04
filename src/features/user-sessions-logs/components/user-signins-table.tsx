import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { dateUTCToFriendly } from "../../../utils/date.utils";

export default function UserSignInsTable() {
  const { logs } = useAppSelector((state) => state.userSessionLogs)
  return(
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Lat</TableCell>
              <TableCell>Lng</TableCell>
              <TableCell>IP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((el, i) => {
              return (
                <TableRow>
                  <TableCell>{dateUTCToFriendly(el.date)}</TableCell>
                  <TableCell>{el.lat}</TableCell>
                  <TableCell>{el.lng}</TableCell>
                  <TableCell>{el.ip}</TableCell>
                  
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}