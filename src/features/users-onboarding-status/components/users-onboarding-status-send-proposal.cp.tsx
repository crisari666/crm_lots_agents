import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material"
import type { SelectChangeEvent } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import {
  fetchTrainingsThunk,
  selectTrainingTrakingList,
  selectTrainingTrakingState
} from "../../training-traking/slice/training-traking.slice"
import { sendProposalTemplateReq } from "../services/ws-cloud-ms.service"
import { phoneToWhatsAppTo } from "../utils/onboarding-phone.utils"
import { dateToInputDate } from "../../../utils/date.utils"
import type { OnboardingDialogActionProps } from "./users-onboarding-status-actions.types"

type Props = OnboardingDialogActionProps & {
  open: boolean
  firstName: string
}

export default function UsersOnboardingStatusSendProposalCP({
  open,
  user,
  firstName,
  loadingKey,
  setLoadingKey,
  resetFeedback,
  setFeedback
}: Props) {
  const dispatch = useAppDispatch()
  const trainings = useAppSelector(selectTrainingTrakingList)
  const { isLoadingList: isLoadingTrainings } = useAppSelector(selectTrainingTrakingState)
  const [selectedTrainingDate, setSelectedTrainingDate] = useState("")

  useEffect(() => {
    if (open && trainings.length === 0 && !isLoadingTrainings) {
      dispatch(fetchTrainingsThunk())
    }
  }, [dispatch, open, trainings.length, isLoadingTrainings])

  useEffect(() => {
    if (!open) {
      setSelectedTrainingDate("")
    }
  }, [open])

  const trainingDateOptions = useMemo(
    () =>
      trainings
        .map((training) => training.date)
        .filter((value, index, arr) => arr.indexOf(value) === index)
        .sort((a, b) => a.localeCompare(b)),
    [trainings]
  )

  const onChangeTrainingDate = (event: SelectChangeEvent) => {
    setSelectedTrainingDate(event.target.value)
  }

  const onSendProposal = async () => {
    if (!user) return
    if (!selectedTrainingDate) {
      setFeedback({ type: "error", text: s.missingTrainingDate })
      return
    }
    const to = phoneToWhatsAppTo(user.phone)
    if (!to) {
      setFeedback({ type: "error", text: s.missingPhone })
      return
    }
    resetFeedback()
    setLoadingKey("proposal")
    try {
      await sendProposalTemplateReq({
        to,
        code: user._id,
        name: firstName,
        date: selectedTrainingDate
      })
      setFeedback({ type: "success", text: s.success })
    } catch {
      setFeedback({ type: "error", text: s.errorGeneric })
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <FormControl size="small" fullWidth>
          <InputLabel id="proposal-training-date-label">{s.trainingDateLabel}</InputLabel>
          <Select
            labelId="proposal-training-date-label"
            value={selectedTrainingDate}
            label={s.trainingDateLabel}
            onChange={onChangeTrainingDate}
            disabled={loadingKey !== null || isLoadingTrainings}
          >
            <MenuItem value="">
              {isLoadingTrainings ? s.trainingDateLoading : s.trainingDatePlaceholder}
            </MenuItem>
            {trainingDateOptions.map((date) => (
              <MenuItem key={date} value={date}>
                {dateToInputDate(date)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          disabled={
            loadingKey !== null ||
            !user ||
            !selectedTrainingDate ||
            isLoadingTrainings ||
            trainingDateOptions.length === 0
          }
          onClick={onSendProposal}
        >
          {loadingKey === "proposal" ? s.sending : s.triggerProposal}
        </Button>
      </Stack>
      {!isLoadingTrainings && trainingDateOptions.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          {s.noTrainingDates}
        </Typography>
      ) : null}
    </>
  )
}
