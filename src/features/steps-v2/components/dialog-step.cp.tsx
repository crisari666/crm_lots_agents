import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import type { CreateCustomerStepV2Body, CustomerStepV2 } from "../services/customer-steps-v2.service"

export type DialogStepCpProps = {
  open: boolean
  selectedStep: CustomerStepV2 | null
  saving: boolean
  onClose: () => void
  onSubmit: (payload: CreateCustomerStepV2Body) => Promise<void>
}

const colorPresets = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#dc2626",
  "#9333ea",
  "#0ea5e9",
] as const

function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

function normalizeHexColor(value: string): string {
  const trimmed = value.trim()
  if (trimmed === "") {
    return ""
  }
  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`
  return prefixed.slice(0, 7)
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
  const normalizedColor = useMemo(() => normalizeHexColor(color), [color])
  const colorValueForPicker = useMemo(
    () => (isValidHexColor(normalizedColor) ? normalizedColor : "#2563eb"),
    [normalizedColor]
  )
  const handleSubmit = async (): Promise<void> => {
    const parsedOrder = Number(order)
    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      order: Number.isFinite(parsedOrder) ? parsedOrder : 0,
      color: isValidHexColor(normalizedColor) ? normalizedColor : undefined,
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
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Step color
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Open color picker">
                <TextField
                  type="color"
                  value={colorValueForPicker}
                  onChange={(event) => setColor(event.target.value)}
                  sx={{ width: 72 }}
                  inputProps={{ "aria-label": "Pick color" }}
                />
              </Tooltip>
              <TextField
                label="Hex"
                value={color}
                onChange={(event) => setColor(normalizeHexColor(event.target.value))}
                placeholder="#2563eb"
                error={normalizedColor !== "" && !isValidHexColor(normalizedColor)}
                helperText={
                  normalizedColor !== "" && !isValidHexColor(normalizedColor)
                    ? "Use 6-digit hex (#RRGGBB)"
                    : " "
                }
                fullWidth
              />
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: colorValueForPicker,
                }}
              />
            </Stack>
            <Stack direction="row" spacing={0.5}>
              {colorPresets.map((presetColor) => (
                <Tooltip key={presetColor} title={presetColor}>
                  <IconButton
                    size="small"
                    onClick={() => setColor(presetColor)}
                    sx={{
                      width: 28,
                      height: 28,
                      border: "1px solid",
                      borderColor:
                        normalizeHexColor(color).toLowerCase() ===
                        presetColor.toLowerCase()
                          ? "primary.main"
                          : "divider",
                      bgcolor: presetColor,
                      borderRadius: 1,
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Stack>
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
