/* eslint-disable react-hooks/exhaustive-deps */
import { Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { CheckUserAllowedComponent } from "../../app/components/check-user-allowed-component"
import UsersOnboardingStatusPage from "./pages/users-onboarding-status-page"

export default function UsersOnboardingStatusView() {
  const navigate = useNavigate()
  const notAllowed = (allowed: boolean) => {
    if (!allowed) {
      navigate("/dashboard")
    }
  }

  return (
    <CheckUserAllowedComponent checkIfAdmin={false} onCheckPermission={notAllowed}>
      <UsersOnboardingStatusPage />
      <Divider sx={{ marginBlock: 2 }} />
    </CheckUserAllowedComponent>
  )
}

