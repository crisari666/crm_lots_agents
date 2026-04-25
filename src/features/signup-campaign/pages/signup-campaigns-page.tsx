import AddIcon from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../../app/hooks"
import CreateSignupCampaignDialog from "../components/create-signup-campaign-dialog.cp"
import SignupCampaignRegistrations from "../components/signup-campaign-registrations.cp"
import SignupCampaignsList from "../components/signup-campaigns-list.cp"
import { fetchSignupCampaignsThunk } from "../slice/signup-campaign.slice"

export default function SignupCampaignsPage() {
  const dispatch = useAppDispatch()
  const [createOpen, setCreateOpen] = useState(false)
  useEffect(() => {
    void dispatch(fetchSignupCampaignsThunk())
  }, [dispatch])
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Stack spacing={0.25}>
          <Typography variant="h5" component="h1">
            Campañas de registro de agentes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Crea enlaces públicos de registro y revisa el estado de firma de
            cada nuevo agente.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Crear campaña
        </Button>
      </Stack>
      <SignupCampaignsList />
      <CreateSignupCampaignDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <SignupCampaignRegistrations />
    </Stack>
  )
}
