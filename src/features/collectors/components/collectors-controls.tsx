import { Button, Checkbox, FormControlLabel, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Add } from "@mui/icons-material";
import { showCollecotrFormAct, toggleShowOnlyEnabledAct } from "../slice/collectors.slice";
export default function CollectorsControls() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.login)
  const { showOnlyEnabled } = useAppSelector((state) => state.collectors)

  const showCollectorForm = () => dispatch(showCollecotrFormAct(true))

  const handleToggleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleShowOnlyEnabledAct(event.target.checked))
  }

  return (
    <>
      <Paper sx={{ padding: 1, marginBottom: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
        {(currentUser?.level === 0 || currentUser?.level === 1) &&
          <Button onClick={showCollectorForm} variant="outlined" endIcon={<Add />}>Add Collector</Button>
        }
        <FormControlLabel
          control={
            <Checkbox
              checked={showOnlyEnabled}
              onChange={handleToggleFilter}
              color="primary"
            />
          }
          label="Show only enabled collectors"
        />
      </Paper>
    </>
  )
}