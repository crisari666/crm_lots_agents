import { Button, Grid, IconButton, Paper } from "@mui/material";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppTextField from "../../../app/components/app-textfield";
import { Add, Edit } from "@mui/icons-material";
import { changeTitleTemplateFormAct, setTypePercentageToPickAct, showDialogPickPercentageAct } from "../slice/pay-route-template.slice";
import { TypePercentageEnum } from "../../user-percentage/slice/users-percentage.state";
import PaymentRouteDialogPickPercentage from "./pay-route-dialog-pick-percentage";

export default function PaymentRouteTemplateForm() {
  const dispatch = useAppDispatch()  
  const  { loading, paymentRouteTemplateForm } = useAppSelector((state) => state.paymentRouteTemplate) 
  const { title } = paymentRouteTemplateForm

  const showDialogPickPercentage = (type: TypePercentageEnum) => {    
    dispatch(showDialogPickPercentageAct(true))
    dispatch(setTypePercentageToPickAct(type))
  }
  return (
    <> 
      <PaymentRouteDialogPickPercentage/>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 0.5, marginBottom: 2}}>
        <Grid container spacing={2} >
        <Grid item xs={12}>
            <AppTextField name="title" value={title} label="Titulo" onChange={({val}) => dispatch(changeTitleTemplateFormAct(val))}/>
          </Grid>
          <Grid item xs={4} md={2}>
            <AppTextField 
              value={paymentRouteTemplateForm.collector.label}
              label="Collector"
              readonly={true}
              endComponent={<IconButton size="small" color="primary" 
                onClick={() => showDialogPickPercentage(TypePercentageEnum.collector)}> 
              <Edit fontSize="small"/> </IconButton>}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <AppTextField 
              value={paymentRouteTemplateForm.worker.label}
              label="Worker"
              readonly={true}
              endComponent={<IconButton size="small" color="primary"
                onClick={() => showDialogPickPercentage(TypePercentageEnum.worker)}
              > <Edit fontSize="small"/> </IconButton>}
              
              />
          </Grid>
          <Grid item xs={4} md={2}>
            <AppTextField 
              value={paymentRouteTemplateForm.leadWorker.label}
              label="Worker lead"
              readonly={true}
              endComponent={<IconButton size="small" color="primary" onClick={() => showDialogPickPercentage(TypePercentageEnum.leadWorker)} > <Edit fontSize="small"/> </IconButton>}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <AppTextField 
              value={paymentRouteTemplateForm.officeLead.label}
              label="Office lead"
              readonly={true}
              endComponent={<IconButton size="small" color="primary" onClick={() => showDialogPickPercentage(TypePercentageEnum.officeLead)}> <Edit fontSize="small"/> </IconButton>}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <Button variant="outlined" onClick={() => showDialogPickPercentage(TypePercentageEnum.subLead)} endIcon={<Add fontSize="small"/>} fullWidth color="primary"> Subleads</Button>
          </Grid>
          <Grid item xs={4} md={2}>
            <Button variant="outlined" onClick={() => showDialogPickPercentage(TypePercentageEnum.partner)} endIcon={<Add fontSize="small"/>} fullWidth color="primary"> Partners</Button>
          </Grid>
          <Grid item xs={6}>

          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      </Paper>
    </>
  )
}