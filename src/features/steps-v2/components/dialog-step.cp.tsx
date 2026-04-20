import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Switch, TextField, FormControlLabel } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import type { CreateCustomerStepV2Body, CustomerStepV2 } from "../services/customer-steps-v2.service"

export type DialogStepCpProps = {
  open: boolean
  selectedStep: CustomerStepV2 | null
  saving: boolean
  onClose: () => void
  onSubmit: (payload: CreateCustomerStepV2Body) => Promise<void>
}

export default function DialogStepCp({
  open,
  selectedStep,
  saving,
  onClose,
  onSubmit,
}: DialogStepCpProps) {
  const isEditMode = selectedStep !== null
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [order, setOrder] = useState("0")
  const [color, setColor] = useState("")
  const [isActive, setIsActive] = useState(true)
  useEffect(() => {
    setName(selectedStep?.name ?? "")
    setDescription(selectedStep?.description ?? "")
    setOrder(String(selectedStep?.order ?? 0))
    setColor(selectedStep?.color ?? "")
    setIsActive(selectedStep?.isActive ?? true)
  }, [selectedStep, open])
  const hasValidName = useMemo(() => name.trim().length > 0, [name])
  const handleSubmit = async (): Promise<void> => {
    const parsedOrder = Number(order)
    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      order: Number.isFinite(parsedOrder) ? parsedOrder : 0,
      color: color.trim() || undefined,
      isActive,
    })
  }
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Update Step" : "Add Step"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            multiline
            minRows={2}
          />
          <TextField
            label="Order"
            type="number"
            value={order}
            onChange={(event) => setOrder(event.target.value)}
          />
          <TextField
            label="Color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            placeholder="#2563eb"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(_, checked) => setIsActive(checked)}
              />
            }
            label="Active"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !hasValidName}
        >
          {isEditMode ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
