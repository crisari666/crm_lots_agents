import EditIcon from "@mui/icons-material/Edit"
import {
  Alert,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from "@mui/material"
import { alpha } from "@mui/material/styles"

type TrainingTrakingMainSectionCPProps = {
  trainingName: string
  date: string
  time: string
  location: string
  googleMeetUrl?: string
  error: string | null
  addUserEmail: string
  isAddingUserToTraining: boolean
  confirmed: number
  declined: number
  pending: number
  onEditTraining: () => void
  onChangeAddUserEmail: (value: string) => void
  onAddUserByEmail: () => void
}

export default function TrainingTrakingMainSectionCP({
  trainingName,
  date,
  time,
  location,
  googleMeetUrl,
  error,
  addUserEmail,
  isAddingUserToTraining,
  confirmed,
  declined,
  pending,
  onEditTraining,
  onChangeAddUserEmail,
  onAddUserByEmail
}: TrainingTrakingMainSectionCPProps) {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="h6" gutterBottom>
          {trainingName}
        </Typography>
        <Tooltip title="Editar capacitación">
          <IconButton size="small" onClick={onEditTraining}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {date} · {time} · {location}
      </Typography>
      {googleMeetUrl ? (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Meet:{" "}
          <a href={googleMeetUrl} target="_blank" rel="noopener noreferrer">
            {googleMeetUrl}
          </a>
        </Typography>
      ) : null}

      {error != null ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Agregar usuario por email</Typography>
        <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap" }}>
          <TextField
            label="Email del usuario"
            type="email"
            size="small"
            value={addUserEmail}
            onChange={(e) => onChangeAddUserEmail(e.target.value)}
            fullWidth
            sx={{ minWidth: 260, flex: 1 }}
          />
          <Button
            variant="outlined"
            onClick={onAddUserByEmail}
            disabled={isAddingUserToTraining || addUserEmail.trim().length === 0}
          >
            Agregar
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mt: 2
        }}
      >
        <Box
          sx={{
            borderRadius: 2,
            p: 1.5,
            textAlign: "center",
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.08)
          }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: 700,
              color: "success.main",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.2
            }}
          >
            {confirmed}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Confirmados
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: 2,
            p: 1.5,
            textAlign: "center",
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08)
          }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: 700,
              color: "error.main",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.2
            }}
          >
            {declined}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            No asisten
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: 2,
            p: 1.5,
            textAlign: "center",
            bgcolor: "action.hover"
          }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontWeight: 700,
              color: "text.secondary",
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.2
            }}
          >
            {pending}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Pendientes
          </Typography>
        </Box>
      </Box>
    </>
  )
}
