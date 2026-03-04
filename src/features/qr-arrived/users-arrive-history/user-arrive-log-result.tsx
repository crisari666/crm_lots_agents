import { AccessTime, Circle, History } from "@mui/icons-material";
import { Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardHeader, Avatar, Chip } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import UserInterface from "../../../app/models/user-interface";
import { convertNumberToTime, dateUTCToFriendly } from "../../../utils/date.utils";
import moment from "moment";
import { id } from "date-fns/locale";

export default function UserArriveLogResult() {
  const { usersForOffice } = useAppSelector(state => state.offices)
  const { usersArriveLogs, office } = useAppSelector(state => state.qrArrive)


  const resolverUserLogArrive = (user: UserInterface) => {
    const userId = user._id!
    const userLog = usersArriveLogs[userId]
    if(userLog) {
      return dateUTCToFriendly(userLog.date)
    }
    return ''
  }

  const getUserArriveDifferenceTime = (user: UserInterface) => {
    const userId = user._id!
    const userLog = usersArriveLogs[userId]
    if(userLog?.date && office?.timeOpen) {
      const userArriveTime = moment(userLog.date).utc().add(5, 'hours')
      const officeOpenTime = moment().startOf('day').add(office.timeOpen/100, 'hours')      
      const diffInMs = userArriveTime.diff(officeOpenTime, 'minutes')      
      if(diffInMs < 0) {
          /* 
          Amarillo 1 o dos dias sin asistir
Rojo 3 dias sin asistir
Gris llega tarde
          */
        const toDays = Math.abs(Math.floor(diffInMs / (24 * 60)))
        if(toDays === 0) {
          if(diffInMs < -60) {
            return <Chip size="small" variant="outlined" label={`${toDays} dias sin asistir`} color="success" />
          } else {
            return <Chip size="small" variant="outlined" label={`${Math.abs(diffInMs)} min`} color="warning" />
          }
        } else if(toDays <=2) {
          return <Chip size="small" variant="outlined" label={`${toDays} dias sin asistir`} color="warning" />
        } else {
          return <Chip size="small" variant="outlined" label={`${toDays} dias sin asistir`} color="error" />
        } 
      } else {
        return <Chip size="small" variant="outlined" label={`${diffInMs} min`} color="default" />
      }      
    }
    return <Chip size="small" variant="outlined" label="Sin registro" color="error" />
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar> 
            <AccessTime />
          </Avatar>
        }
        title={convertNumberToTime(office?.timeOpen)}       
      />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow> 
                <TableCell> <Circle/> </TableCell>
                <TableCell> Usuario </TableCell>
                <TableCell> Hora llegada </TableCell>
                <TableCell> <History/> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersForOffice?.map(user => (
                <TableRow key={user._id}>
                  <TableCell> <Circle/> </TableCell>
                  <TableCell> {user.name} </TableCell>
                  <TableCell> {getUserArriveDifferenceTime(user)} </TableCell>
                  <TableCell> {resolverUserLogArrive(user)} </TableCell>
                  {/* <TableCell> <History/> </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}