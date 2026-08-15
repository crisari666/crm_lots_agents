import React, { useRef, useState } from "react"
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Typography
} from "@mui/material"
import {
  UploadFile as UploadIcon,
  DeleteOutline as DeleteIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  clearMapUploadResultAct,
  deleteLotsMapThunk,
  fetchLotsMapThunk,
  fetchProjectLotsThunk,
  uploadLotsMapKmlThunk
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"

type Props = {
  projectId: string
}

export default function LotInventoryMapUploadCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const { actionLoading, mapUploadResult, mapPaint } = useAppSelector(
    (state: RootState) => state.lotInventory
  )
  const [fileName, setFileName] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [swapStages, setSwapStages] = useState(false)

  const onFile = (file: File | null) => {
    if (!file) return
    setPendingFile(file)
    setFileName(file.name)
    dispatch(clearMapUploadResultAct())
  }

  const runUpload = async () => {
    if (!pendingFile) return
    await dispatch(
      uploadLotsMapKmlThunk({
        projectId,
        file: pendingFile,
        swapStages
      })
    )
    void dispatch(fetchLotsMapThunk(projectId))
    void dispatch(fetchProjectLotsThunk({ projectId }))
  }

  const runDelete = async () => {
    await dispatch(deleteLotsMapThunk(projectId))
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {s.mapUploadTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {s.mapUploadHint}
      </Typography>
      <Box
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          onFile(e.dataTransfer.files?.[0] ?? null)
        }}
        onClick={() => inputRef.current?.click()}
        sx={{
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          textAlign: "center",
          cursor: "pointer",
          mb: 1.5,
          transition: "border-color 200ms",
          "&:hover": { borderColor: "primary.main" }
        }}
      >
        <UploadIcon color="action" />
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {fileName ?? s.mapUploadDrop}
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept=".kml,application/vnd.google-earth.kml+xml,application/xml,text/xml"
          hidden
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={swapStages}
            onChange={(e) => setSwapStages(e.target.checked)}
          />
        }
        label={s.mapSwapStages}
        sx={{ mb: 1 }}
      />
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          disabled={!pendingFile || actionLoading}
          onClick={() => void runUpload()}
        >
          {s.mapUploadButton}
        </Button>
        {(mapPaint || mapUploadResult) && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={actionLoading}
            onClick={() => void runDelete()}
          >
            {s.mapClear}
          </Button>
        )}
      </Stack>
      {mapUploadResult && (
        <Alert
          severity="success"
          sx={{ mt: 1.5 }}
          onClose={() => dispatch(clearMapUploadResultAct())}
        >
          {s.mapUploadResult
            .replace("{features}", String(mapUploadResult.featureCount))
            .replace("{created}", String(mapUploadResult.createdLots))}
          {mapUploadResult.stages
            .map((st) => ` ${st.stageName}: ${st.count}`)
            .join(" ·")}
        </Alert>
      )}
    </Box>
  )
}
