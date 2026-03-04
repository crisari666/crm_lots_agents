import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from "react";
import { getSettingsThunk, setSettingForEditAct } from "../slice/settings.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { Edit } from "@mui/icons-material";
export default function SettingsList() {
  const dispatch = useAppDispatch()
  const { settings, loading } = useAppSelector((state) => state.settings)

  useEffect(() => {
    dispatch(getSettingsThunk())
  }, [])
  return (
    <>
      <LoadingIndicator open={loading}/>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>name</TableCell>
              <TableCell>type</TableCell>
              <TableCell>value</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {settings.map((setting) => (
              <TableRow key={setting._id}>
                <TableCell>{setting.title}</TableCell>
                <TableCell>{setting.type}</TableCell>
                <TableCell>{setting.value.toString()}</TableCell>
                <TableCell> <IconButton size="small" onClick={() => {
                  dispatch(setSettingForEditAct(setting._id))
                }}><Edit/></IconButton> </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>
    </>
  )
}