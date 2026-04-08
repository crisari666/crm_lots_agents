import { Stack } from "@mui/material"
import { useState } from "react"
import OnboardinControlsCP from "../components/onboardin-controls-cp"
import UsersOnboardingStatusListCP from "../components/users-onboarding-status-list.cp"
import UsersOnboardingWhatsappChatDialogCP from "../components/users-onboarding-whatsapp-chat-dialog.cp"
import type { OnboardingUserType } from "../types/onboarding-state.types"
import { UsersOnboardingStatusControlsProvider } from "../contexts/users-onboarding-status-controls.context"

export default function UsersOnboardingStatusPage() {
  const [whatsappChatOpen, setWhatsappChatOpen] = useState(false)
  const [whatsappChatUser, setWhatsappChatUser] = useState<OnboardingUserType | null>(null)

  return (
    <UsersOnboardingStatusControlsProvider>
      <Stack spacing={2}>
        <OnboardinControlsCP />
        <UsersOnboardingStatusListCP
          onOpenWhatsappChat={(u) => {
            setWhatsappChatUser(u)
            setWhatsappChatOpen(true)
          }}
        />
        <UsersOnboardingWhatsappChatDialogCP
          open={whatsappChatOpen}
          onClose={() => {
            setWhatsappChatOpen(false)
            setWhatsappChatUser(null)
          }}
          user={whatsappChatUser}
        />
      </Stack>
    </UsersOnboardingStatusControlsProvider>
  )
}

