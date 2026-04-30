import * as React from "react"
import { Alert, Box, Button, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import ReferralFollowUpMainSectionCp from "../components/referral-follow-up-main-section.cp"
import ReferralFollowUpAddDialogCp from "../components/referral-follow-up-add-dialog.cp"
import {
  clearReferralFollowUpErrorAct,
  fetchEligibleReferralUsersThunk,
  fetchReferralSituationsThunk,
  selectReferralFollowUpState,
} from "../slice/referral-follow-up.slice"
import { referralFollowUpStrings as s } from "../../../i18n/locales/referral-follow-up.strings"

function buildDefaultDateRange(): { readonly start: Date; readonly end: Date } {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 30)
  return { start, end }
}

export default function ReferralFollowUpPage() {
  const dispatch = useAppDispatch()
  const { error } = useAppSelector((state: RootState) =>
    selectReferralFollowUpState(state),
  )
  const defaultRange = React.useMemo(() => buildDefaultDateRange(), [])
  const [dateStart, setDateStart] = React.useState<Date>(defaultRange.start)
  const [dateEnd, setDateEnd] = React.useState<Date>(defaultRange.end)
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)

  const reloadList = React.useCallback(() => {
    void dispatch(
      fetchReferralSituationsThunk({ dateFrom: dateStart, dateTo: dateEnd }),
    )
  }, [dispatch, dateStart, dateEnd])

  React.useEffect(() => {
    void dispatch(fetchEligibleReferralUsersThunk())
  }, [dispatch])

  React.useEffect(() => {
    reloadList()
  }, [reloadList])

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5">{s.pageTitle}</Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          {s.addButton}
        </Button>
      </Box>
      {error != null && error !== "" ? (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearReferralFollowUpErrorAct())}
        >
          {s.loadError} {error}
        </Alert>
      ) : null}
      <ReferralFollowUpMainSectionCp
        dateStart={dateStart}
        dateEnd={dateEnd}
        onRangeChange={({ dateStart: ds, dateEnd: de }) => {
          setDateStart(ds)
          setDateEnd(de)
        }}
      />
      <ReferralFollowUpAddDialogCp
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={() => {
          reloadList()
        }}
      />
    </Box>
  )
}
