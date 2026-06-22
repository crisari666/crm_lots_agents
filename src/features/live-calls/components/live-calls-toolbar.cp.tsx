import { IconButton, Stack, Tooltip, Typography } from "@mui/material"
import { Refresh as RefreshIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { fetchActiveLiveCallsThunk } from "../redux/live-calls.slice"

export default function LiveCallsToolbarCP() {
  const dispatch = useAppDispatch()
  const count = useAppSelector((s) => s.liveCalls.items.length)
  const loading = useAppSelector((s) => s.liveCalls.loading)

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {count} llamada{count === 1 ? "" : "s"} activa{count === 1 ? "" : "s"}
      </Typography>
      <Tooltip title="Actualizar">
        <span>
          <IconButton
            size="small"
            disabled={loading}
            onClick={() => void dispatch(fetchActiveLiveCallsThunk())}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  )
}
