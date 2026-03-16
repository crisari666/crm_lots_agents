import { Stack } from "@mui/material"
import OnboardinControlsCP from "../components/onboardin-controls-cp"
import UsersOnboardingStatusListCP from "../components/users-onboarding-status-list.cp"

export default function UsersOnboardingStatusPage() {
  return (
    <Stack spacing={2}>
      <OnboardinControlsCP />
      <UsersOnboardingStatusListCP />
    </Stack>
  )
}

