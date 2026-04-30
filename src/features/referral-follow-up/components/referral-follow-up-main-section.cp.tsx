import * as React from "react"
import { Box, Typography } from "@mui/material"
import ReferralFollowUpDateFilterCp from "./referral-follow-up-date-filter.cp"
import ReferralFollowUpListCp from "./referral-follow-up-list.cp"
import { referralFollowUpStrings as s } from "../../../i18n/locales/referral-follow-up.strings"

type ReferralFollowUpMainSectionCpProps = {
  readonly dateStart: Date
  readonly dateEnd: Date
  readonly onRangeChange: (p: {
    readonly dateStart: Date
    readonly dateEnd: Date
  }) => void
}

export default function ReferralFollowUpMainSectionCp({
  dateStart,
  dateEnd,
  onRangeChange,
}: ReferralFollowUpMainSectionCpProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <ReferralFollowUpDateFilterCp
        dateStart={dateStart}
        dateEnd={dateEnd}
        onRangeChange={onRangeChange}
      />
      <Typography variant="subtitle1">{s.listTitle}</Typography>
      <ReferralFollowUpListCp />
    </Box>
  )
}
