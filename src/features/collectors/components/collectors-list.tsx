import { Chip, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Edit, ListAlt, ListAltRounded } from "@mui/icons-material";
import { useEffect } from "react";
import { collectorByIdThunk, displayCollectorOfficesDialogAct, fetchCollectorsThunk, setCollectorToEditAct, toggleEnableCollectorThunk, updateCollectorOfficesDialogAct } from "../slice/collectors.slice";
import { resolveColorColletor, resolveTotalPaid } from "../../../utils/collector.utils";


export default function CollectorsList() {
  const dispatch = useAppDispatch()
  const { collectors, showOnlyEnabled } = useAppSelector((state) => state.collectors)


  useEffect(() => {
    dispatch(fetchCollectorsThunk())
  }, [])



  const editCollector = (collectorId: string) => {
    dispatch(setCollectorToEditAct(collectorId))
    dispatch(collectorByIdThunk(collectorId))
  }

  const displayCollectorOfficeDialog = ({ collectorId, offices }: { offices: string[], collectorId: string }) => {
    dispatch(displayCollectorOfficesDialogAct(true))
    dispatch(updateCollectorOfficesDialogAct({ offices, collectorId }))
  }

  const handleToggleEnable = (collectorId: string, currentEnableStatus: boolean) => {
    dispatch(toggleEnableCollectorThunk({ collectorId, enable: !currentEnableStatus }))
  }

  const filteredCollectors = showOnlyEnabled
    ? collectors.filter(collector => collector.enable)
    : collectors


  return (
    <Paper sx={{ padding: 2, marginBottom: 1 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Semanal</TableCell>
              <TableCell>Mensual</TableCell>
              <TableCell>Anual</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell> <Edit /> </TableCell>
              <TableCell> <ListAlt /> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCollectors.map((el, i) => {
              const week = resolveTotalPaid(el.week)
              const month = resolveTotalPaid(el.month)
              const year = resolveTotalPaid(el.year)

              const percentageWeek = (week / el.limitWeek) * 100
              const percentageMonth = (month / el.limitMonth) * 100
              const percentageYear = (year / el.limitYear) * 100

              return (
                <TableRow key={i}>
                  <TableCell>{el.title}</TableCell>
                  <TableCell>{el.user?.email}</TableCell>
                  <TableCell>{el.location} 999</TableCell>
                  <TableCell> <Chip size="small" label={`${week} / ${el.limitWeek}`} color={resolveColorColletor({ percentage: percentageWeek })} />  </TableCell>
                  <TableCell> <Chip size="small" label={`${month} / ${el.limitMonth}`} color={resolveColorColletor({ percentage: percentageMonth })} />  </TableCell>
                  <TableCell> <Chip size="small" label={`${year} / ${el.limitYear}`} color={resolveColorColletor({ percentage: percentageYear })} />  </TableCell>
                  <TableCell>
                    <Switch
                      checked={el.enable}
                      onChange={() => handleToggleEnable(el._id, el.enable)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell> <IconButton onClick={() => editCollector(el._id)} ><Edit /></IconButton> </TableCell>
                  <TableCell> <IconButton onClick={() => displayCollectorOfficeDialog({ offices: el.offices as string[], collectorId: el._id })}> <ListAltRounded /> </IconButton> </TableCell>
                </TableRow>
              )
            }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}