import { Stack } from "@mui/material"
import Button from "@mui/material/Button"
import AppTextField from "../../../app/components/app-textfield"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  fetchSignedContractHistoryThunk,
  setSentFromFilterAct,
  setSentToFilterAct,
} from "../slice/signed-contract.slice"

export default function FilterByDate() {
  const dispatch = useAppDispatch()
  const { sentFrom, sentTo, isLoading } = useAppSelector(
    (state: RootState) => state.signedContract
  )
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
      <AppTextField
        label="Enviado desde"
        type="date"
        value={sentFrom}
        onChange={({ val }) => dispatch(setSentFromFilterAct(val))}
      />
      <AppTextField
        label="Enviado hasta"
        type="date"
        value={sentTo}
        onChange={({ val }) => dispatch(setSentToFilterAct(val))}
      />
      <Button
        variant="contained"
        disabled={isLoading}
        onClick={() => {
          void dispatch(
            fetchSignedContractHistoryThunk({
              sentFrom: sentFrom.trim() !== "" ? sentFrom : undefined,
              sentTo: sentTo.trim() !== "" ? sentTo : undefined,
            })
          )
        }}
      >
        {isLoading ? "Cargando…" : "Filtrar"}
      </Button>
    </Stack>
  )
}
