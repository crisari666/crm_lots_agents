import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputLabel,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  addCapitalThunk,
  showModalContributeCapitalAction,
  updateInputContributeCapitalFormAction,
} from "../capital-contribute.slice"
import InputApp from "../../../app/components/input-app"

export default function AddCapitalModal() {
  const dispatch = useAppDispatch()

  const { showModalForm, contributeCapitalForm } = useAppSelector(
    (state: RootState) => state.capitalContribute,
  )

  const { name, value } = contributeCapitalForm

  const closeModal = () => dispatch(showModalContributeCapitalAction(false))

  const changeInput = (val: any, name: string) => {
    dispatch(updateInputContributeCapitalFormAction({ key: name, value: val }))
  }

  const addCapital = () => {
    if (value > 0) {
      dispatch(addCapitalThunk({ value: value, name }))
    }
  }

  return (
    <Dialog open={showModalForm} onClose={closeModal}>
      <DialogTitle> AGREGAR APORTE A CAPITAL </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputApp
              name={"name"}
              value={name}
              onChange={changeInput}
              placeholder="Description"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Valor</InputLabel>
              <Input
                name={"value"}
                type="number"
                slotProps={{
                  input: { min: 0, style: { textAlign: "center" } },
                }}
                value={value.toString()}
                onChange={(e) => changeInput(e.target.value, "value")}
                placeholder="Valor"
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={addCapital}>
          AGREGAR
        </Button>
      </DialogActions>
    </Dialog>
  )
}
