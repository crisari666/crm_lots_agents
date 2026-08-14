import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  fetchLotInventoryHubThunk,
  fetchProjectLotsThunk,
  generateProjectLotsThunk
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
  defaults?: {
    nLots?: number
    nCommercialSpaces?: number
    baseLotArea?: number
    baseCommercialArea?: number
    defaultLotPrice?: number
    defaultCommercialPrice?: number
  }
}

export default function LotInventoryGenerateDialogCP({
  open,
  onClose,
  projectId,
  defaults
}: Props) {
  const dispatch = useAppDispatch()
  const actionLoading = useAppSelector(
    (state: RootState) => state.lotInventory.actionLoading
  )
  const [nLots, setNLots] = useState(String(defaults?.nLots ?? 0))
  const [nCommercial, setNCommercial] = useState(
    String(defaults?.nCommercialSpaces ?? 0)
  )
  const [baseLotArea, setBaseLotArea] = useState(
    String(defaults?.baseLotArea ?? 0)
  )
  const [baseCommercialArea, setBaseCommercialArea] = useState(
    String(defaults?.baseCommercialArea ?? 0)
  )
  const [defaultLotPrice, setDefaultLotPrice] = useState(
    String(defaults?.defaultLotPrice ?? 0)
  )
  const [defaultCommercialPrice, setDefaultCommercialPrice] = useState(
    String(defaults?.defaultCommercialPrice ?? 0)
  )

  const submit = async () => {
    await dispatch(
      generateProjectLotsThunk({
        projectId,
        data: {
          nLots: Number(nLots) || 0,
          nCommercialSpaces: Number(nCommercial) || 0,
          baseLotArea: Number(baseLotArea) || 0,
          baseCommercialArea: Number(baseCommercialArea) || 0,
          defaultLotPrice: Number(defaultLotPrice) || 0,
          defaultCommercialPrice: Number(defaultCommercialPrice) || 0
        }
      })
    )
    void dispatch(fetchProjectLotsThunk({ projectId }))
    void dispatch(fetchLotInventoryHubThunk())
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{s.generateTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label={s.generateNLots}
            type="number"
            value={nLots}
            onChange={(e) => setNLots(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.generateNCommercial}
            type="number"
            value={nCommercial}
            onChange={(e) => setNCommercial(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.generateBaseLotArea}
            type="number"
            value={baseLotArea}
            onChange={(e) => setBaseLotArea(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.generateBaseCommercialArea}
            type="number"
            value={baseCommercialArea}
            onChange={(e) => setBaseCommercialArea(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.generateDefaultLotPrice}
            type="number"
            value={defaultLotPrice}
            onChange={(e) => setDefaultLotPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.generateDefaultCommercialPrice}
            type="number"
            value={defaultCommercialPrice}
            onChange={(e) => setDefaultCommercialPrice(e.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={actionLoading}
          onClick={() => void submit()}
        >
          {s.generateConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
