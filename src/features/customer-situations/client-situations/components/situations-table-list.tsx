import { Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getAllSituationsThunk, setIfSituationIsCallNoteThunk, setTituationForEditAct } from "../client-situations-slice";
import { RootState } from "../../../../app/store";
import { Edit } from "@mui/icons-material";
import parse from 'html-react-parser'

export default function SituationsTableList() {
  const dispatch = useAppDispatch()
  const { situations } = useAppSelector((state: RootState) => state.situations)
  useEffect(() => {
    dispatch(getAllSituationsThunk())
  }, [])
  return (
    <>
      <TableContainer>
        <Table padding="checkbox">
          <TableHead>
            <TableRow>
              <TableCell align="center">Call Note</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Titulo</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Texto</TableCell>
              <TableCell>Text</TableCell>
              <TableCell> <Edit/> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {situations.map((el, i) => {
              return(
              <TableRow key={el._id}>
                <TableCell align="center"> <Checkbox checked={el.callNote} onChange={(e, checked) => dispatch(setIfSituationIsCallNoteThunk({isCallNote: checked, situationId: el._id}))} /> </TableCell>
                <TableCell>{el.order}</TableCell>
                <TableCell>{el.title}</TableCell>
                <TableCell>{el.titleEn}</TableCell>
                <TableCell>{parse(el.description)}</TableCell>
                <TableCell>{parse(el.descriptionEn)}</TableCell>
                <TableCell> <IconButton onClick={() => dispatch(setTituationForEditAct(el))}> <Edit/> </IconButton> </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>

      </TableContainer>
    </>
  )
}