import { Edit, ListAlt, Visibility } from "@mui/icons-material"
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Switch } from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { enableOfficeThunk, getOfficesThunk, usersForOfficeThunk, updateOfficeRentThunk } from "../offices-list.slice"
import { OfficeInterface } from "../../../../app/models/office.inteface"
import { RootState } from "../../../../app/store"
import { useNavigate } from "react-router-dom"
import { convertNumberToTime } from "../../../../utils/date.utils"
import EditableRentTd from "./editable-rent-td"

export default function OfficesTableList() {
  const dispatch = useAppDispatch()
  const offices = useAppSelector((state: RootState) => state.offices.offices)
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(getOfficesThunk())
  } ,[dispatch])

  const handleRentChange = (rent: number, officeId: string) => {
    dispatch(updateOfficeRentThunk({ officeId, rent }))
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Apertura</TableCell>
            <TableCell align="right">Rent</TableCell>
            {/* <TableCell>User</TableCell> */}
            <TableCell>Enable</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Users </TableCell>
            <TableCell> <Visibility/> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offices.map((el: OfficeInterface, i) => {
            return (
              <TableRow key={`officeList${el._id}`}>
                <TableCell>{el.name}</TableCell>
                <TableCell>{convertNumberToTime(el.timeOpen!)}</TableCell>
                <EditableRentTd 
                  value={el.rent || 0} 
                  officeId={el._id!} 
                  onRentChange={handleRentChange}
                />
                {/* <TableCell>{el.user !== null && (el.user as UserInterface).name}</TableCell> */}
                <TableCell>
                  <Switch size="small" checked={el.enable} onChange={(e, checked) => dispatch(enableOfficeThunk({enable: checked, officeId: el._id!}))} /> 
                </TableCell>
                <TableCell>
                  <Button variant="contained" size="small"
                    onClick={() => navigate("/dashboard/handle-office/" + el._id)}
                  > <Edit fontSize="small"/> </Button>
                </TableCell>
                <TableCell>
                  <Button size="small" variant="contained" color="secondary" onClick={() => dispatch(usersForOfficeThunk({officeId: el._id!}))}> <ListAlt fontSize="small"/> </Button>
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/office-dashboard/${el._id}`)}>
                    <Visibility fontSize="small"/>
                  </Button>
                </TableCell>
              </TableRow>

            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}