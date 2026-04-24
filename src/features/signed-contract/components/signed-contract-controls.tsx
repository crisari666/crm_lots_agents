import FormControlLabel from "@mui/material/FormControlLabel"
import Stack from "@mui/material/Stack"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { Paper, Switch, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import type { SignedContractSignStatusFilter } from "../types/signed-contract.types"
import {
  setGroupRepeatedByEmailAct,
  setSignStatusFilterAct,
} from "../slice/signed-contract.slice"
import FilterByDate from "./filter-by-date"

export default function SignedContractControls() {
  const dispatch = useAppDispatch()
  const groupRepeatedByEmail = useAppSelector(
    (state: RootState) => state.signedContract.groupRepeatedByEmail,
  )
  const signStatusFilter = useAppSelector(
    (state: RootState) => state.signedContract.signStatusFilter,
  )
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Filtros
        </Typography>
        <FilterByDate />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
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
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="body2" color="text.secondary" component="span">
              Contratos:
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              value={signStatusFilter}
              onChange={(_e, value: SignedContractSignStatusFilter | null) => {
                if (value != null) {
                  dispatch(setSignStatusFilterAct(value))
                }
              }}
              aria-label="Filtrar por estado de firma"
            >
              <ToggleButton value="all">Todos</ToggleButton>
              <ToggleButton value="signed">Firmados</ToggleButton>
              <ToggleButton value="unsigned">Sin firmar</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}
