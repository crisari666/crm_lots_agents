import FormControlLabel from "@mui/material/FormControlLabel"
import { Paper, Stack, Switch, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  setGroupRepeatedByEmailAct,
  setOnlySignedFilterAct,
} from "../slice/signed-contract.slice"
import FilterByDate from "./filter-by-date"

export default function SignedContractControls() {
  const dispatch = useAppDispatch()
  const groupRepeatedByEmail = useAppSelector(
    (state: RootState) => state.signedContract.groupRepeatedByEmail,
  )
  const onlySigned = useAppSelector(
    (state: RootState) => state.signedContract.onlySigned,
  )
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Filtros
        </Typography>
        <FilterByDate />
        <FormControlLabel
          control={
            <Switch
              checked={groupRepeatedByEmail}
              onChange={(_, checked) =>
                dispatch(setGroupRepeatedByEmailAct(checked))
              }
              color="primary"
            />
          }
          label="Agrupar repetidos (mismo email)"
        />
        <FormControlLabel
          control={
            <Switch
              checked={onlySigned}
              onChange={(_, checked) => dispatch(setOnlySignedFilterAct(checked))}
              color="primary"
            />
          }
          label="Mostrar solo firmados"
        />
      </Stack>
    </Paper>
  )
}
