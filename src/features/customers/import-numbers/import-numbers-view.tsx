import { useEffect } from "react";
import PreviewData from "./components/preview-data";
import StepperUploadData from "./stepper-upload-data";
import { useAppDispatch } from "../../../app/hooks";
import { getAssignersThunk } from "./import-numbers.slice";
import UsersAvailableForCampaigns from "./components/users-available-for-campaign";
import PreviewDataControls from "./components/preview-data-controls";
import CustomerResumeDialog from "../customer-view/components/customer-resume-dialog";

export default function ImportNumbersView() {
  const dispatch = useAppDispatch()
  useEffect(() =>{
    dispatch(getAssignersThunk())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[])
  return (
    <>
      <CustomerResumeDialog />
      <StepperUploadData/>
      <PreviewDataControls/>
      <PreviewData/>
      <UsersAvailableForCampaigns />
    </>
  )
}