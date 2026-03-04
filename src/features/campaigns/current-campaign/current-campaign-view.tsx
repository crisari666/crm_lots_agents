import { useNavigate } from "react-router-dom";
import { CheckUserAllowedComponent } from "../../../app/components/check-user-allowed-component";
import CurrentCampaignWrapper from "./components/current-campaign-wrapper";

export default function CurrentCampaignView(){
  const navigate = useNavigate()
    const notAllowed = (allowed: boolean) => {
      if(!allowed) navigate("/dashboard")
    }
    return (
      <CheckUserAllowedComponent checkIfAdmin={true} onCheckPermission={notAllowed}>
        <CurrentCampaignWrapper />
      </CheckUserAllowedComponent>
    );
} 