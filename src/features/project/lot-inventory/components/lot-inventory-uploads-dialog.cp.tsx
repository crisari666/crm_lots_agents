import React from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import LotInventoryExcelImportCP from "./lot-inventory-excel-import.cp"
import LotInventoryMapUploadCP from "./lot-inventory-map-upload.cp"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
  showMapUpload: boolean
}

export default function LotInventoryUploadsDialogCP({
  open,
  onClose,
  projectId,
  showMapUpload
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        {s.uploadsDialogTitle}
        <IconButton
          aria-label={s.uploadsDialogClose}
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <LotInventoryExcelImportCP />
          {showMapUpload ? (
            <LotInventoryMapUploadCP projectId={projectId} />
          ) : null}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
