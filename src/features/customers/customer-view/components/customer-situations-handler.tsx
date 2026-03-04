import { Divider, Paper } from "@mui/material";
import CustomerSituationForm from "./customer-situation-form";
import CustomerLogsHistory from "./customer-logs-history";
import TabHandler from "../../../../app/components/tab-handler";
import CustomerPaymentsHandler from "./customer-payments-handler";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getCollectorsForUserThunk, getCustomerLogsThunk, getCustomerPaymentsThunk, setImagePreviewAct, zoomImageCustomerAct } from "../customer-view.slice";
import CustomerFeePaymentDialog from "./customer-fee-payment-dialog";
import CustomerFeePaymentHistory from "./customer-fee-history-dialog";
import ImagePreviewDialog from "../../../../app/components/image-preview-dialog";
import ImageShowerCP from "../../../../app/components/image-shower.cp";
import { getStepsThunk } from "../../../steps/steps.slice";
export default function CustomerSituationsHandler() {
  const { customerLogs, imagePreview, imageSituationZoom } = useAppSelector((state: RootState) => state.customer)
  const { currentUser } = useAppSelector((state: RootState) => state.login)
  const dispatch = useAppDispatch()
  const {customerId} = useParams()
  useEffect(() => {
    if(customerId !== undefined) {
      dispatch(getCustomerLogsThunk({customerId}))
      dispatch(getCustomerPaymentsThunk({customerId}))
      dispatch(getCollectorsForUserThunk(currentUser?._id!))
      dispatch(getStepsThunk())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <>
      <CustomerSituationForm/>
      <ImageShowerCP imgUrl={imageSituationZoom ? `uploads/situations/${imageSituationZoom}` : undefined} onClose={() => dispatch(zoomImageCustomerAct(undefined))}/>
      <CustomerFeePaymentDialog />
      <CustomerFeePaymentHistory />
      <ImagePreviewDialog image={imagePreview} onClose={() => dispatch(setImagePreviewAct(""))}/>
      <Divider className="divider" />
      <Paper elevation={4}>
        <TabHandler tabNames={["Historial", "Pagos"]} tabComponents={[
          <CustomerLogsHistory customerLogs={customerLogs}/>,
          <CustomerPaymentsHandler />
        ]}/> 
      </Paper>
    </>
  )
}