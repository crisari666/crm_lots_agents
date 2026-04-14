import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import type { OnboardingStateType } from "../types/onboarding-state.types"
import UsersOnboardingStatusPieChartCP from "./users-onboarding-status-pie-chart.cp"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"

type UsersOnboardingStatusChartDialogCPProps = {
  open: boolean
  onClose: () => void
  items: OnboardingStateType[]
}

export default function UsersOnboardingStatusChartDialogCP({
  open,
  onClose,
  items
}: UsersOnboardingStatusChartDialogCPProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{s.statusChartDialogTitle}</DialogTitle>
      <DialogContent>
        <UsersOnboardingStatusPieChartCP items={items} />
      </DialogContent>
    </Dialog>
  )
}
