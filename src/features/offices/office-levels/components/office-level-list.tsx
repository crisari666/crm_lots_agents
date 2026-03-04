import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { useEffect } from "react"
import { getOfficeLevelsThunk, setOfficeLevelToEditAct, updateOfficeLevelInputAct } from "../slice/office-level.slice"
import { Edit } from "@mui/icons-material"

export default function OfficeLevelsList() {
  const dispatch = useAppDispatch()
  const { officeLevels } = useAppSelector((state) => state.officesLevel) 

  useEffect(() => {
    dispatch(getOfficeLevelsThunk())
  }, [])

  return (
    <>
      <Paper sx={{padding: 2}} elevation={5}>
        <h1>OfficeLevelsList</h1>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Titulo</TableCell>
                <TableCell>N Clientes</TableCell>
                <TableCell>Base de datos</TableCell>
                <TableCell> <Edit/> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {officeLevels.map((e, i) => 
                <TableRow key={`officeLevel${e._id}`}>
                  <TableCell>{i}</TableCell>
                  <TableCell>{e.title.toString()}</TableCell>
                  <TableCell>{e.nCustomers}</TableCell>
                  <TableCell>{e.nCustomersDatabase}</TableCell>
                  <TableCell> <IconButton 
                    onClick={() => {
                      dispatch(setOfficeLevelToEditAct(e._id))
                      dispatch(updateOfficeLevelInputAct({key: 'title', value: e.title}))
                      dispatch(updateOfficeLevelInputAct({key: 'nCustomers', value: e.nCustomers}))
                      dispatch(updateOfficeLevelInputAct({key: 'nCustomersDatabase', value: e.nCustomersDatabase ?? 0}))
                    }}
                    size="small" color="primary"> <Edit/> </IconButton> </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}