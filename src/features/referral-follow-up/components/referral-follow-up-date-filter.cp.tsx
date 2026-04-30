import * as React from "react"
import { Box, Typography } from "@mui/material"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { referralFollowUpStrings as s } from "../../../i18n/locales/referral-follow-up.strings"

type ReferralFollowUpDateFilterCpProps = {
  readonly dateStart: Date
  readonly dateEnd: Date
  readonly onRangeChange: (p: {
    readonly dateStart: Date
    readonly dateEnd: Date
  }) => void
}

export default function ReferralFollowUpDateFilterCp({
  dateStart,
  dateEnd,
  onRangeChange,
}: ReferralFollowUpDateFilterCpProps) {
  const id = React.useId()
  return (
    <Box sx={{ maxWidth: 360 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {s.dateFilterLabel}
      </Typography>
      <AppDateRangeSelector
        id={id}
        dateStart={dateStart}
        dateEnd={dateEnd}
        onChange={onRangeChange}
      />
    </Box>
  )
}
