import { Dialog, DialogContent, DialogTitle, IconButton, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { dateUTCToFriendly } from "../../../../utils/date.utils";
import { CustomerCallActionsEnum } from "../../../../app/models/customer-call-actions.enum";
import { Close, PhoneDisabledOutlined, PhoneEnabled, Visibility, WifiCalling3 } from "@mui/icons-material";
import { clearDialogCallActionsAct } from "../../customers-list/customers.slice";
import { setImagePreviewerAct } from "../../../image-preview/image-preview.slice";

export default function DialogCustomerCallActions() {
  const dispatch = useAppDispatch()
  const {customerCallActions} = useAppSelector ((state) => state.customers)

  const getCustomerCallActionDescription = (status: CustomerCallActionsEnum) => {
    switch(status) {
      case 0: return "Undefined"
      case 1: return "Push call button"
      case 2: return "Not answered"
      case 3: return "Answered"
      default: return "Undefined"
    }
  }
  
  const GetIconForStatus = (status: CustomerCallActionsEnum) => {
    switch(status) {
      case 0: return "Undefined"
      case 1: return <WifiCalling3 color="info" />
      case 2: return <PhoneDisabledOutlined color="error" />
      case 3: return <PhoneEnabled color="success"/>
      default: return "Undefined"
    }
  }
  return (
    <>
      <Dialog open={customerCallActions.length > 0}>
        <IconButton className="closeDialog" onClick={() => dispatch(clearDialogCallActionsAct())}> <Close/> </IconButton>
        <DialogTitle> Log acciones llamar cliente </DialogTitle>
        <DialogContent sx={{textAlign: "center", minWidth: "500px"}}>
          <Stepper orientation="vertical" sx={{margin: "0 auto"}}>
            {customerCallActions.map((callAction, index) => (
              <Step key={index} >
                <StepLabel icon={GetIconForStatus(callAction.status)}> 
                  {getCustomerCallActionDescription(callAction.status)} 
                  {(callAction.status === 2 || callAction.status === 3) && 
                    <IconButton size="small" onClick={() => dispatch(setImagePreviewerAct(`uploads/${callAction.status === 3 ? "answer" : "dont-answer"}/${callAction.image}`))}> <Visibility fontSize="small"/> </IconButton> 
                  }
                  <Typography> {dateUTCToFriendly(callAction.date)} </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
      </Dialog>
    </>
  )
}