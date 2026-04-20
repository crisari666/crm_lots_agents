import { Alert, Box, Typography } from "@mui/material"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import DialogStepCp from "./dialog-step.cp"
import ListStepCp from "./list-step.cp"
import StepsV2ControlsCp from "./steps-v2-controls.cp"
import {
  createCustomerStepV2,
  listCustomerStepsV2,
  type CreateCustomerStepV2Body,
  type CustomerStepV2,
  updateCustomerStepV2,
} from "../services/customer-steps-v2.service"

function readAxiosMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined
    if (Array.isArray(data?.message)) {
      return data.message.join(", ")
    }
    if (typeof data?.message === "string") {
      return data.message
    }
  }
  return fallback
}

export default function StepsV2ContentCp() {
  const [items, setItems] = useState<CustomerStepV2[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStep, setSelectedStep] = useState<CustomerStepV2 | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const loadSteps = useCallback(async (): Promise<void> => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const data = await listCustomerStepsV2()
      setItems(data)
    } catch (error: unknown) {
      setErrorMessage(readAxiosMessage(error, "Could not load steps."))
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void loadSteps()
  }, [loadSteps])
  const openCreateDialog = (): void => {
    setSelectedStep(null)
    setDialogOpen(true)
  }
  const openUpdateDialog = (step: CustomerStepV2): void => {
    setSelectedStep(step)
    setDialogOpen(true)
  }
  const closeDialog = (): void => {
    if (saving) {
      return
    }
    setDialogOpen(false)
    setSelectedStep(null)
  }
  const submitDialog = async (payload: CreateCustomerStepV2Body): Promise<void> => {
    setSaving(true)
    setErrorMessage(null)
    try {
      if (selectedStep === null) {
        await createCustomerStepV2(payload)
      } else {
        await updateCustomerStepV2(selectedStep.id, payload)
      }
      setDialogOpen(false)
      setSelectedStep(null)
      await loadSteps()
    } catch (error: unknown) {
      setErrorMessage(readAxiosMessage(error, "Could not save step."))
    } finally {
      setSaving(false)
    }
  }
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Customer Steps V2
      </Typography>
      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}
      <StepsV2ControlsCp onAddStep={openCreateDialog} />
      <ListStepCp items={items} loading={loading} onSelectStep={openUpdateDialog} />
      <DialogStepCp
        open={dialogOpen}
        selectedStep={selectedStep}
        saving={saving}
        onClose={closeDialog}
        onSubmit={submitDialog}
      />
    </Box>
  )
}
