import { Button, Grid, Paper } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppAutoComplete, { AppAutocompleteOption } from "../../../app/components/app-autocomplete";
import { useEffect } from "react";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { changeFilterAlertedPaymetnsAct, getAlertedPaysThunks } from "../../reports/reports-view/reports.slice";

export default function AlertedPaymentsFilter() {
  const dispatch = useAppDispatch();
  const { offices, gotOffices } = useAppSelector((state) => state.offices);
  const { loading } = useAppSelector((state) => state.reports);

  useEffect(() => {
    if (!gotOffices) dispatch(getOfficesThunk());
  }, []);

  const changeInput = (val: { name: string; val: any }) => {
    dispatch(changeFilterAlertedPaymetnsAct({ name: val.name, val: val.val._id }));
  };

  const handleRefetchAlerts = () => {
    dispatch(getAlertedPaysThunks());
  };

  const buildOffices = (): AppAutocompleteOption[] =>
    offices.map((office) => ({ _id: office._id!, name: office.name! }));

  return (
    <>
      <Paper sx={{ padding: 2, marginBottom: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <AppAutoComplete
              multiple={false}
              name="office"
              label="Oficina"
              options={buildOffices()}
              onChange={(v) => changeInput(v)}
            />
          </Grid>
          <Grid item xs={12} md="auto">
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefetchAlerts}
              disabled={loading}
            >
              Actualizar alertas
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}