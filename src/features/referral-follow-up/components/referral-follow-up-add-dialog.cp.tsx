import * as React from "react"
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  createReferralSituationThunk,
  selectReferralFollowUpState,
} from "../slice/referral-follow-up.slice"
import type { ReferralEligibleUser } from "../types/referral-follow-up.types"
import {
  REFERRAL_SITUATION_EVENT_VALUES,
  type ReferralSituationEventValue,
} from "../types/referral-follow-up.types"
import {
  referralFollowUpStrings as s,
  referralSituationEventLabels,
} from "../../../i18n/locales/referral-follow-up.strings"

type ReferralFollowUpAddDialogCpProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly onCreated: () => void
}

export default function ReferralFollowUpAddDialogCp({
  open,
  onClose,
  onCreated,
}: ReferralFollowUpAddDialogCpProps) {
  const dispatch = useAppDispatch()
  const { eligibleUsers, isSubmitting, isLoadingEligible } = useAppSelector(
    (state: RootState) => selectReferralFollowUpState(state),
  )
  const [eventValue, setEventValue] =
    React.useState<ReferralSituationEventValue | null>(null)
  const [userValue, setUserValue] = React.useState<ReferralEligibleUser | null>(
    null,
  )
  const [description, setDescription] = React.useState<string>("")

  const eventOptions = React.useMemo(
    () =>
      REFERRAL_SITUATION_EVENT_VALUES.map((value) => ({
        value,
        label: referralSituationEventLabels[value] ?? value,
      })),
    [],
  )

  const handleClose = (): void => {
    setEventValue(null)
    setUserValue(null)
    setDescription("")
    onClose()
  }

  const handleSubmit = async (): Promise<void> => {
    if (eventValue == null || userValue == null) {
      return
    }
    const trimmed = description.trim()
    if (trimmed.length === 0) {
      return
    }
    try {
      await dispatch(
        createReferralSituationThunk({
          userId: userValue._id,
          event: eventValue,
          description: trimmed,
        }),
      ).unwrap()
      handleClose()
      onCreated()
    } catch {
      /* error stays in slice */
    }
  }

  const canSubmit =
    eventValue != null &&
    userValue != null &&
    description.trim().length > 0 &&
    !isSubmitting

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{s.dialogTitle}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <Autocomplete
          options={eventOptions}
          getOptionLabel={(o) => o.label}
          isOptionEqualToValue={(a, b) => a.value === b.value}
          value={eventOptions.find((o) => o.value === eventValue) ?? null}
          onChange={(_, v) => {
            setEventValue(v?.value ?? null)
          }}
          renderInput={(params) => (
            <TextField {...params} label={s.eventLabel} margin="normal" />
          )}
        />
        <TextField
          label={s.descriptionLabel}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
        <Autocomplete
          options={eligibleUsers}
          loading={isLoadingEligible}
          getOptionLabel={(u) =>
            `${u.name} ${u.lastName}`.trim() + (u.email ? ` (${u.email})` : "")
          }
          isOptionEqualToValue={(a, b) => a._id === b._id}
          value={userValue}
          onChange={(_, v) => setUserValue(v)}
          renderInput={(params) => (
            <TextField {...params} label={s.userLabel} margin="normal" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{s.cancel}</Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={!canSubmit}
        >
          {isSubmitting ? s.saving : s.save}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
