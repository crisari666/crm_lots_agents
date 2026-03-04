import { Button, Divider, Paper, Typography } from "@mui/material";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import SituationsTableList from "./components/situations-table-list";
import { showAddFormAct } from "./client-situations-slice";
import { Add } from "@mui/icons-material";
import AddSituationDialog from "./components/add-situation-dialog";

export default function ClientSituationsView() {
  const {loading, showAddForm} = useAppSelector((state: RootState) => state.situations)
  const dispatch = useAppDispatch()

  return (
    <>
      <LoadingIndicator open={loading} />
      <AddSituationDialog />
      <Paper sx={{padding: 2}}>
        <Typography variant="h6">Crear / Actualizar sitauciones de clientes</Typography>
        <Divider className="divider"/>
        <Button variant="contained" onClick={() => dispatch(showAddFormAct(true))}> AGREGAR SITUACION <Add/> </Button>
        <Divider className="divider"/>
        <SituationsTableList/>
      </Paper>

    </>
  );
}