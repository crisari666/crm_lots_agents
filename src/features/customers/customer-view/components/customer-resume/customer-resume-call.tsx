import { AddIcCall, PhoneDisabledOutlined, PhoneEnabled, PhoneForwarded, PhoneMissed, Visibility, WifiCalling3 } from "@mui/icons-material"
import { ButtonGroup, Button, IconButton, Step, StepLabel, Stepper, Typography, Grid } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { getCallsResume } from "../../../../../utils/customer.utils"
import { useEffect } from "react"
import { getSingleCustomerCallActionsThunk } from "../../customer-view.slice"
import { dateUTCToFriendly } from "../../../../../utils/date.utils"
import { setImagePreviewerAct } from "../../../../image-preview/image-preview.slice"
import { CustomerCallActionsEnum } from "../../../../../app/models/customer-call-actions.enum"

export default function CustomerResumeCalls() {
  const { customerResume, customerCallActions } = useAppSelector((state) => state.customer)
  const dispatch = useAppDispatch()
  const resumeCalls = () => getCallsResume((customerResume as any).customer[0])

  useEffect(() => {
    if(customerResume !== undefined){
      dispatch(getSingleCustomerCallActionsThunk({customerId: customerResume?.customer[0]._id!}))
    }
  }, [])

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
    console.log({customerResume});
  return (
    <>
      {customerResume !== undefined && <>
        <Grid container>
          <Grid item xs={6}>
            <ButtonGroup>
              <Button color="secondary"> <AddIcCall/> {resumeCalls().push} </Button>
              <Button color="success"> <PhoneForwarded/> {resumeCalls().answer} </Button>
              <Button color="error"> <PhoneMissed/> {resumeCalls().unanswer} </Button> 
            </ButtonGroup>
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
        </Grid>
      </>}
    </>
  )
}