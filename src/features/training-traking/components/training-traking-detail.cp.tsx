import {
  Card,
  CardContent,
  CircularProgress,
  Typography
} from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  acceptAttendeeThunk,
  addUserToTrainingByEmailThunk,
  declineAttendeeThunk,
  fetchTrainingDetailThunk,
  removeAttendeeThunk,
  selectTrainingTrakingDetail,
  selectTrainingTrakingState
} from "../slice/training-traking.slice"
import type { TrainingAttendeeType } from "../types/training-traking.types"
import { toggleCheckInThunk } from "../slice/training-traking.slice"
import TrainingTrakingCreateDialogCP from "./training-traking-create-dialog.cp"
import TrainingTrakingAttendeesSectionCP from "./training-traking-attendees-section.cp"
import TrainingTrakingMainSectionCP from "./training-traking-main-section.cp"

export default function TrainingTrakingDetailCP() {
  const dispatch = useAppDispatch()
  const detail = useAppSelector(selectTrainingTrakingDetail)
  const {
    selectedId,
    isLoadingDetail,
    isAddingUserToTraining,
    isUpdatingAttendeeStatus,
    isTogglingCheckIn,
    error
  } = useAppSelector(selectTrainingTrakingState)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [addUserEmail, setAddUserEmail] = useState("")

  useEffect(() => {
    if (selectedId) {
      dispatch(fetchTrainingDetailThunk(selectedId))
    }
  }, [dispatch, selectedId])

  if (!selectedId) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Selecciona una capacitación para ver el detalle.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  if (isLoadingDetail || !detail) {
    return (
      <Card>
        <CardContent sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  const confirmed = detail.attendees.filter((a) => a.status === "confirmed").length
  const declined = detail.attendees.filter((a) => a.status === "declined").length
  const pending = detail.attendees.filter((a) => a.status === "pending").length

  const handleToggleCheckIn = (attendee: TrainingAttendeeType) => {
    if (attendee.status !== "confirmed") return
    dispatch(
      toggleCheckInThunk({
        trainingId: detail.id,
        attendeeId: attendee.id
      })
    )
  }

  const handleAddUserByEmail = async () => {
    if (detail == null) return
    const email = addUserEmail.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return
    await dispatch(addUserToTrainingByEmailThunk({ trainingId: detail.id, email }))
    setAddUserEmail("")
  }

  const handleAcceptAttendee = (attendee: TrainingAttendeeType) => {
    dispatch(
      acceptAttendeeThunk({
        trainingId: detail.id,
        attendeeId: attendee.id
      })
    )
  }

  const handleDeclineAttendee = (attendee: TrainingAttendeeType) => {
    const reason = window.prompt("Motivo de rechazo", attendee.declineReason ?? "")
    if (reason == null) return
    const finalReason = reason.trim() || "No puede asistir"
    dispatch(
      declineAttendeeThunk({
        trainingId: detail.id,
        attendeeId: attendee.id,
        reason: finalReason
      })
    )
  }

  const handleRemoveAttendee = (attendee: TrainingAttendeeType) => {
    dispatch(
      removeAttendeeThunk({
        trainingId: detail.id,
        attendeeId: attendee.id
      })
    )
  }

  const escapeCsvValue = (value: string) => `"${value.replace(/"/g, `""`)}"`

  const handleDownloadAttendeesCsv = () => {
    const header = ["name", "phone", "email", "status"]
    const rows = detail.attendees.map((attendee) => [
      attendee.name ?? "",
      attendee.phoneNumber ?? "",
      attendee.email ?? "",
      attendee.status ?? ""
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((value) => escapeCsvValue(String(value))).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const safeTrainingName = detail.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
    link.href = url
    link.download = `${safeTrainingName || "training"}-attendees.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardContent>
        <TrainingTrakingMainSectionCP
          trainingName={detail.name}
          date={detail.date}
          time={detail.time}
          location={detail.location}
          error={error}
          addUserEmail={addUserEmail}
          isAddingUserToTraining={isAddingUserToTraining}
          confirmed={confirmed}
          declined={declined}
          pending={pending}
          onEditTraining={() => setIsEditOpen(true)}
          onChangeAddUserEmail={setAddUserEmail}
          onAddUserByEmail={handleAddUserByEmail}
        />

        <TrainingTrakingAttendeesSectionCP
          attendees={detail.attendees}
          isTogglingCheckIn={isTogglingCheckIn}
          isUpdatingAttendeeStatus={isUpdatingAttendeeStatus}
          onToggleCheckIn={handleToggleCheckIn}
          onAcceptAttendee={handleAcceptAttendee}
          onDeclineAttendee={handleDeclineAttendee}
          onRemoveAttendee={handleRemoveAttendee}
          onDownloadCsv={handleDownloadAttendeesCsv}
        />
      </CardContent>
      <TrainingTrakingCreateDialogCP
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        trainingToEdit={detail}
      />
    </Card>
  )
}

