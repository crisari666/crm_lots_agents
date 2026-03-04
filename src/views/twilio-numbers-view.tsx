import { useNavigate } from "react-router-dom";
import { CheckUserAllowedComponent } from "../app/components/check-user-allowed-component";
import RelUserToTwilioNumberDialog from "../features/twilio-numbers/components/rel-user-to-number-dialog";
import TwilioListFilter from "../features/twilio-numbers/components/twilio-list-filter";
import TwilioNumberFormDialog from "../features/twilio-numbers/components/twilio-number-form-dialog";
import TwilioNumbersList from "../features/twilio-numbers/components/twilio-numbers-list";
import TwilioNumbersOpts from "../features/twilio-numbers/components/twilio-numbers-opts";

export default function TwilioNumbersView() {
  const navigate  = useNavigate()
  const notAllowed = (allowed: boolean) => {
    if(!allowed){
      navigate("/dashboard/")
    }
  }
  return (
    <>
      <CheckUserAllowedComponent checkIfAdmin={true} onCheckPermission={notAllowed}>
        <TwilioNumbersOpts/>
        <TwilioListFilter/>
        <TwilioNumbersList/>
        <TwilioNumberFormDialog/>
        <RelUserToTwilioNumberDialog/>
      </CheckUserAllowedComponent>
    </>
  )
}