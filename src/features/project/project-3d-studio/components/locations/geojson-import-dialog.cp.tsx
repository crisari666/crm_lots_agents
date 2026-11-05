import React, { useRef, useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material"
import { useAppDispatch } from "../../../../../app/hooks"
import { importLocationsGeoJsonThunk } from "../../slice/project-3d-studio.slice"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
}

export default function GeoJsonImportDialogCP({
  open,
  onClose,
  projectId
}: Props) {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const onImport = async () => {
    if (!file) return
    setLoading(true)
    try {
      await dispatch(
        importLocationsGeoJsonThunk({ projectId, file })
      ).unwrap()
      setFile(null)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{s.importGeoJson}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          FeatureCollection GeoJSON (Point / LineString / Polygon).
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept=".geojson,.json,application/geo+json,application/json"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {file.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{s.cancel}</Button>
        <Button
          variant="contained"
          disabled={!file || loading}
          onClick={() => void onImport()}
        >
          {s.importGeoJson}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
